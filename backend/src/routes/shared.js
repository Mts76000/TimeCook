const express = require("express");
const router = express.Router();
const User = require("../models/User");
const TimeEntry = require("../models/TimeEntry");
const { summarize } = require("../utils/summary");

// GET /shared/:userId/summary - Vue partagée en lecture seule
router.get("/:userId/summary", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email requis" });
    
    const owner = await User.findById(req.params.userId);
    if (!owner) return res.status(404).json({ error: "Utilisateur non trouvé" });
    
    // Vérifier que l'email a accès
    if (!owner.sharedWithEmails || !owner.sharedWithEmails.includes(email.toLowerCase())) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
    
    const { range, start } = req.query;
    const entries = await TimeEntry.find({ userId: owner._id }).sort({ date: 1 });
    const summary = summarize(entries, { range, start, weeklyTargetHours: owner.weeklyTargetHours, monthlyTargetHours: owner.monthlyTargetHours });
    
    res.json({
      ...summary,
      ownerName: owner.name || owner.email,
      isSharedView: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /shared/:userId/entries - Obtenir toutes les entrées (lecture seule)
router.get("/:userId/entries", async (req, res) => {
  try {
    const { email, start, end } = req.query;
    if (!email) return res.status(400).json({ error: "Email requis" });
    
    const owner = await User.findById(req.params.userId);
    if (!owner) return res.status(404).json({ error: "Utilisateur non trouvé" });
    
    if (!owner.sharedWithEmails || !owner.sharedWithEmails.includes(email.toLowerCase())) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
    
    const filter = { userId: owner._id };
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = start;
      if (end) filter.date.$lte = end;
    }
    
    const entries = await TimeEntry.find(filter).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
