const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

function clampNumber(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return undefined;
  return Math.max(min, Math.min(max, num));
}

// GET /settings - Obtenir les paramètres utilisateur
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json({
      weeklyTargetHours: user.weeklyTargetHours,
      monthlyTargetHours: user.monthlyTargetHours,
      defaultBreakMinutes: user.defaultBreakMinutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PATCH /settings - Mettre à jour les objectifs
router.patch("/", auth, async (req, res) => {
  try {
    const { weeklyTargetHours, monthlyTargetHours, defaultBreakMinutes } = req.body;

    const update = {};
    if (weeklyTargetHours !== undefined) {
      const v = clampNumber(weeklyTargetHours, 1, 168);
      if (v !== undefined) update.weeklyTargetHours = v;
    }
    if (monthlyTargetHours !== undefined) {
      const v = clampNumber(monthlyTargetHours, 1, 744);
      if (v !== undefined) update.monthlyTargetHours = v;
    }
    if (defaultBreakMinutes !== undefined) {
      const v = clampNumber(defaultBreakMinutes, 0, 300);
      if (v !== undefined) update.defaultBreakMinutes = v;
    }

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });

    res.json({
      weeklyTargetHours: user.weeklyTargetHours,
      monthlyTargetHours: user.monthlyTargetHours,
      defaultBreakMinutes: user.defaultBreakMinutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
