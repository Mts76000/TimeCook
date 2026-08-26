const router = require("express").Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const TimeEntry = require("../models/TimeEntry");
const auth = require("../middleware/auth");
const { sendTransactional, notifyAdminNewUser } = require("../emails");
const { jwtSecret, appUrl } = require("../config");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return typeof email === "string" && email.length <= 254 && EMAIL_REGEX.test(email);
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6 && password.length <= 128;
}

function sanitizeName(name) {
  if (!name) return "";
  return String(name).trim().slice(0, 100);
}

function signToken(user) {
  return jwt.sign({ email: user.email, name: user.name || "" }, jwtSecret, {
    subject: String(user._id),
    expiresIn: "30d",
  });
}

function signResetToken(email) {
  return jwt.sign({ email, type: "reset" }, jwtSecret, { expiresIn: "1h" });
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const cleanEmail = String(email).toLowerCase().trim();
    if (!isValidEmail(cleanEmail))
      return res.status(400).json({ error: "Invalid email" });
    if (!isValidPassword(password))
      return res.status(400).json({ error: "Password must be between 6 and 128 characters" });

    const existing = await User.findOne({ email: cleanEmail });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const user = new User({ email: cleanEmail, name: sanitizeName(name) });
    await user.setPassword(password);
    await user.save();

    // Notify admin of new signup (fire-and-forget, do not block response)
    notifyAdminNewUser(user).catch((err) => console.error("[auth] Admin notify failed:", err));

    const token = signToken(user);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const cleanEmail = String(email).toLowerCase().trim();
    if (!isValidEmail(cleanEmail))
      return res.status(400).json({ error: "Invalid email" });

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: user.toJSON() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({ user: user.toJSON() });
});

function clampNumber(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return undefined;
  return Math.max(min, Math.min(max, num));
}

router.patch("/me", auth, async (req, res) => {
  try {
    const { weeklyTargetHours, monthlyTargetHours, defaultBreakMinutes, name } = req.body || {};
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Not found" });

    if (name !== undefined) user.name = sanitizeName(name);
    if (weeklyTargetHours !== undefined) {
      const v = clampNumber(weeklyTargetHours, 1, 168);
      if (v !== undefined) user.weeklyTargetHours = v;
    }
    if (monthlyTargetHours !== undefined) {
      const v = clampNumber(monthlyTargetHours, 1, 744);
      if (v !== undefined) user.monthlyTargetHours = v;
    }
    if (defaultBreakMinutes !== undefined) {
      const v = clampNumber(defaultBreakMinutes, 0, 300);
      if (v !== undefined) user.defaultBreakMinutes = v;
    }
    await user.save();
    res.json({ user: user.toJSON() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/me/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "Current and new password required" });

    if (!isValidPassword(newPassword))
      return res.status(400).json({ error: "New password must be between 6 and 128 characters" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Not found" });

    const ok = await user.validatePassword(currentPassword);
    if (!ok) return res.status(401).json({ error: "Current password is incorrect" });

    await user.setPassword(newPassword);
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    await TimeEntry.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    res.json({ deleted: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email required" });

    const cleanEmail = String(email).toLowerCase().trim();
    if (!isValidEmail(cleanEmail))
      return res.status(400).json({ error: "Invalid email" });

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // Répondre OK pour ne pas révéler l'existence du compte
      return res.json({ ok: true });
    }

    const resetToken = signResetToken(user.email);
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

    console.log("[DEV] Reset link:", resetLink);

    try {
      await sendTransactional({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe TimeCook",
        title: "Réinitialisation de mot de passe",
        preheader: "Cliquez pour créer un nouveau mot de passe.",
        greeting: "Bonjour,",
        intro: "Vous avez demandé à réinitialiser le mot de passe de votre compte TimeCook. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.",
        ctaLabel: "Réinitialiser mon mot de passe",
        ctaUrl: resetLink,
        footer: "Ce lien est valable pendant 1 heure. Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet email. Votre mot de passe ne sera pas modifié.",
      });
    } catch (err) {
      console.error("Resend error:", err);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/share", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.sharedWith.push({ token });
    await user.save();

    res.json({ url: `${appUrl}/share/${token}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/share/:token", async (req, res) => {
  try {
    const user = await User.findOne({ "sharedWith.token": req.params.token });
    if (!user) return res.status(404).json({ error: "Invalid share link" });

    const share = user.sharedWith.find((s) => s.token === req.params.token);
    const entries = await TimeEntry.find({ userId: user._id }).sort({ date: 1 });

    res.json({
      user: { name: user.name || "Utilisateur TimeCook" },
      createdAt: share.createdAt,
      weeklyTargetHours: user.weeklyTargetHours,
      monthlyTargetHours: user.monthlyTargetHours,
      entries: entries,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword)
      return res.status(400).json({ error: "Token and new password required" });

    if (!isValidPassword(newPassword))
      return res.status(400).json({ error: "Password must be between 6 and 128 characters" });

    let payload;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (payload.type !== "reset" || !payload.email)
      return res.status(400).json({ error: "Invalid token" });

    const user = await User.findOne({ email: payload.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.setPassword(newPassword);
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
