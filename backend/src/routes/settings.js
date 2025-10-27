const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const crypto = require("crypto");

// GET /settings - Obtenir les paramètres utilisateur
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json({
      weeklyTargetHours: user.weeklyTargetHours,
      monthlyTargetHours: user.monthlyTargetHours,
      defaultBreakMinutes: user.defaultBreakMinutes,
      sharedWith: user.sharedWith || [],
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

// POST /settings/share - Ajouter un email à la liste de partage
router.post("/share", auth, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier si l'email existe déjà
    if (!user.sharedWith) user.sharedWith = [];
    const existing = user.sharedWith.find((s) => s.email === normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: "Cet email a déjà accès" });
    }

    // Générer un token sécurisé unique
    const token = crypto.randomBytes(32).toString("hex");

    user.sharedWith.push({
      email: normalizedEmail,
      token: token,
      createdAt: new Date(),
    });

    await user.save();
    res.json({ message: "Email ajouté", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /settings/share/:email - Retirer un email
router.delete("/share/:email", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    if (!user.sharedWith) user.sharedWith = [];

    const normalizedEmail = decodeURIComponent(req.params.email)
      .toLowerCase()
      .trim();
    user.sharedWith = user.sharedWith.filter(
      (s) => s.email !== normalizedEmail
    );

    await user.save();
    res.json({ message: "Email retiré" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
