require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const { mongoUri, port } = require("./config");

const app = express();

app.use(cors());
app.use(express.json());
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
app.use("/shared", require("./routes/shared"));

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
