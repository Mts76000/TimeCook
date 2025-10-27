const express = require("express");
const router = express.Router();
const User = require("../models/User");
const TimeEntry = require("../models/TimeEntry");
const { summarize } = require("../utils/summary");

// GET /shared/:userId/summary - Vue partagée en lecture seule (avec token sécurisé)
router.get("/:userId/summary", async (req, res) => {
  try {
    const { token } = req.query;
    console.log(
      "🔍 Shared access request - Token:",
      token ? token.substring(0, 10) + "..." : "none"
    );

    if (!token) return res.status(400).json({ error: "Token requis" });

    const owner = await User.findById(req.params.userId);
    if (!owner) {
      console.log("❌ User not found:", req.params.userId);
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    console.log("👤 Owner found:", owner.email);

    // Vérifier que le token est valide
    if (!owner.sharedWith) owner.sharedWith = [];
    const sharedEntry = owner.sharedWith.find((s) => s.token === token);

    if (!sharedEntry) {
      console.log("❌ Access denied - invalid token");
      return res.status(403).json({ error: "Token invalide ou accès révoqué" });
    }

    console.log("✅ Access granted for:", sharedEntry.email);

    const { range, start } = req.query;
    const entries = await TimeEntry.find({ userId: owner._id }).sort({
      date: 1,
    });
    const summary = summarize(entries, {
      range,
      start,
      weeklyTargetHours: owner.weeklyTargetHours,
      monthlyTargetHours: owner.monthlyTargetHours,
    });

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

// GET /shared/:userId/entries - Obtenir toutes les entrées (lecture seule avec token)
router.get("/:userId/entries", async (req, res) => {
  try {
    const { token, start, end } = req.query;
    if (!token) return res.status(400).json({ error: "Token requis" });

    const owner = await User.findById(req.params.userId);
    if (!owner)
      return res.status(404).json({ error: "Utilisateur non trouvé" });

    if (!owner.sharedWith) owner.sharedWith = [];
    const sharedEntry = owner.sharedWith.find((s) => s.token === token);

    if (!sharedEntry) {
      return res.status(403).json({ error: "Token invalide ou accès révoqué" });
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
