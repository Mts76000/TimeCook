const mongoose = require("mongoose");

// One entry per service (morning/evening) or a school day marker
const TimeEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    service: {
      type: String,
      enum: ["morning", "evening", "full"],
      required: false,
    },
    startTime: { type: String }, // HH:mm
    endTime: { type: String }, // HH:mm
    isSchoolDay: { type: Boolean, default: false },
    breakMinutes: { type: Number }, // optional per-entry break override (minutes)
    schoolHours: { type: Number }, // custom hours for school day (if not set, default 7)
  },
  { timestamps: true }
);

TimeEntrySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("TimeEntry", TimeEntrySchema);
