const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

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
    const { weeklyTargetHours, monthlyTargetHours, defaultBreakMinutes } =
      req.body;

    const update = {};
    if (weeklyTargetHours !== undefined)
      update.weeklyTargetHours = weeklyTargetHours;
    if (monthlyTargetHours !== undefined)
      update.monthlyTargetHours = monthlyTargetHours;
    if (defaultBreakMinutes !== undefined)
      update.defaultBreakMinutes = defaultBreakMinutes;

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
    });

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
