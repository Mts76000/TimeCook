require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { mongoUri, port } = require("./config");

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, veuillez réessayer plus tard." },
});
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Trop de tentatives, veuillez réessayer plus tard." },
});
app.use("/auth", authLimiter);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Health
app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/entries", require("./routes/entries"));
app.use("/export", require("./routes/export"));
app.use("/settings", require("./routes/settings"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

async function start() {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
    app.listen(port, () => console.log(`API listening on :${port}`));
  } catch (err) {
    console.error("Startup error", err);
    process.exit(1);
  }
}

start();
