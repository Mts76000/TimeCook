const router = require("express").Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");
const User = require("../models/User");
const TimeEntry = require("../models/TimeEntry");
const auth = require("../middleware/auth");
const { jwtSecret, resendApiKey, fromEmail, appUrl } = require("../config");

const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const user = new User({ email, name });
    await user.setPassword(password);
    await user.save();

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
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await user.validatePassword(password || "");
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

router.patch("/me", auth, async (req, res) => {
  try {
    const { weeklyTargetHours, monthlyTargetHours, defaultBreakMinutes, name } = req.body || {};
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    if (name !== undefined) user.name = name;
    if (weeklyTargetHours !== undefined) user.weeklyTargetHours = weeklyTargetHours;
    if (monthlyTargetHours !== undefined) user.monthlyTargetHours = monthlyTargetHours;
    if (defaultBreakMinutes !== undefined) user.defaultBreakMinutes = defaultBreakMinutes;
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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Répondre OK pour ne pas révéler l'existence du compte
      return res.json({ ok: true });
    }

    const resetToken = signResetToken(user.email);
    const resetLink = `${appUrl}/reset-password?token=${resetToken}`;

    console.log("[DEV] Reset link:", resetLink);

    if (resend) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: user.email,
          subject: "Réinitialisation de votre mot de passe TimeCook",
          html: `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Réinitialisation TimeCook</title>
            </head>
            <body style="margin:0;padding:0;background-color:#FAF9F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FAF9F7;padding:40px 0;">
                <tr>
                  <td align="center">
                    <table width="520" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF;border:1px solid #E2E0DC;border-radius:16px;overflow:hidden;max-width:90%;">
                      <tr>
                        <td style="padding:40px 40px 32px;text-align:center;">
                          <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#1C1917;letter-spacing:-0.5px;">TimeCook</h1>
                          <p style="margin:0;font-size:14px;color:#8C8580;">Suivi d’heures pour alternants en restauration</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 40px 32px;">
                          <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#1C1917;">Bonjour,</p>
                          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5C5752;">
                            Vous avez demandé à réinitialiser le mot de passe de votre compte TimeCook. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
                          </p>
                          <p style="margin:0 0 24px;text-align:center;">
                            <a href="${resetLink}" style="display:inline-block;background-color:#F97316;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;">Réinitialiser mon mot de passe</a>
                          </p>
                          <p style="margin:0 0 8px;font-size:13px;color:#8C8580;text-align:center;">
                            Ce lien est valable pendant <strong style="color:#1C1917;">1 heure</strong>.
                          </p>
                          <p style="margin:0;font-size:13px;color:#8C8580;text-align:center;">
                            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
                          </p>
                          <p style="margin:8px 0 0;text-align:center;word-break:break-all;">
                            <a href="${resetLink}" style="font-size:13px;color:#F97316;text-decoration:underline;">${resetLink}</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:24px 40px;background-color:#FAF9F7;border-top:1px solid #E2E0DC;">
                          <p style="margin:0;font-size:13px;color:#8C8580;text-align:center;">
                            Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet email. Votre mot de passe ne sera pas modifié.
                          </p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin-top:24px;font-size:12px;color:#8C8580;">© TimeCook — contact@mathis-lamotte.fr</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });
      } catch (err) {
        console.error("Resend error:", err);
      }
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
