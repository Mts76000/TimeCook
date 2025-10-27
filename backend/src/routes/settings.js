const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");

// GET /settings - Obtenir les paramètres utilisateur
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    
    res.json({
      weeklyTargetHours: user.weeklyTargetHours,
      monthlyTargetHours: user.monthlyTargetHours,
      defaultBreakMinutes: user.defaultBreakMinutes,
      sharedWithEmails: user.sharedWithEmails || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PATCH /settings - Mettre à jour les objectifs
router.patch("/", authenticateToken, async (req, res) => {
  try {
    const { weeklyTargetHours, monthlyTargetHours, defaultBreakMinutes } = req.body;
    
    const update = {};
    if (weeklyTargetHours !== undefined) update.weeklyTargetHours = weeklyTargetHours;
    if (monthlyTargetHours !== undefined) update.monthlyTargetHours = monthlyTargetHours;
    if (defaultBreakMinutes !== undefined) update.defaultBreakMinutes = defaultBreakMinutes;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      update,
      { new: true }
    );
    
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

// POST /settings/share - Ajouter un email de partage
router.post("/share", authenticateToken, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });
    
    const user = await User.findById(req.user.id);
    if (!user.sharedWithEmails) user.sharedWithEmails = [];
    
    if (!user.sharedWithEmails.includes(email.toLowerCase())) {
      user.sharedWithEmails.push(email.toLowerCase());
      await user.save();
    }
    
    res.json({ sharedWithEmails: user.sharedWithEmails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /settings/share/:email - Retirer un email de partage
router.delete("/share/:email", authenticateToken, async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await User.findById(req.user.id);
    
    user.sharedWithEmails = (user.sharedWithEmails || []).filter(e => e !== email);
    await user.save();
    
    res.json({ sharedWithEmails: user.sharedWithEmails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
