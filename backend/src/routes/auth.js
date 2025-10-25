const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { jwtSecret } = require("../config");

function signToken(user) {
  return jwt.sign({ email: user.email, name: user.name || "" }, jwtSecret, {
    subject: String(user._id),
    expiresIn: "30d",
  });
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
    const { weeklyTargetHours, defaultBreakMinutes } = req.body || {};
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    if (weeklyTargetHours !== undefined)
      user.weeklyTargetHours = weeklyTargetHours;
    if (defaultBreakMinutes !== undefined)
      user.defaultBreakMinutes = defaultBreakMinutes;
    await user.save();
    res.json({ user: user.toJSON() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
