const router = require("express").Router();
const dayjs = require("dayjs");
const auth = require("../middleware/auth");
const TimeEntry = require("../models/TimeEntry");
const User = require("../models/User");
const { summarize } = require("../utils/summary");

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isValidDate(d) {
  return typeof d === "string" && DATE_REGEX.test(d) && dayjs(d).isValid();
}

function isValidTime(t) {
  return typeof t === "string" && TIME_REGEX.test(t);
}

function clampNumber(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return undefined;
  return Math.max(min, Math.min(max, num));
}

router.use(auth);

// Create an entry
router.post("/", async (req, res) => {
  try {
    const {
      date,
      service,
      startTime,
      endTime,
      isSchoolDay = false,
      breakMinutes,
      schoolHours,
    } = req.body || {};

    if (!isValidDate(date))
      return res.status(400).json({ error: "date required (YYYY-MM-DD)" });

    const payload = {
      userId: req.user.id,
      date,
      isSchoolDay: Boolean(isSchoolDay),
    };

    if (payload.isSchoolDay) {
      const v = clampNumber(schoolHours, 0, 24);
      payload.schoolHours = v !== undefined ? v : 7;
    } else {
      if (!isValidTime(startTime) || !isValidTime(endTime))
        return res.status(400).json({ error: "startTime and endTime required (HH:MM)" });

      const validService = ["morning", "evening", "full"].includes(service) ? service : "full";
      const v = clampNumber(breakMinutes, 0, 300);

      payload.service = validService;
      payload.startTime = startTime;
      payload.endTime = endTime;
      payload.breakMinutes = v !== undefined ? v : 45;
    }

    const doc = new TimeEntry(payload);
    await doc.save();
    res.status(201).json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// List entries for a period
router.get("/", async (req, res) => {
  try {
    const { start, end } = req.query;
    const q = { userId: req.user.id };
    if (start || end) {
      const s = start && isValidDate(start) ? start : "1900-01-01";
      const e = end && isValidDate(end) ? end : "2999-12-31";
      q.date = { $gte: s, $lte: e };
    }
    const items = await TimeEntry.find(q).sort({ date: 1, createdAt: 1 });
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Summary for week or month
router.get("/summary", async (req, res) => {
  try {
    const { range = "week", start } = req.query;
    if (!["week", "month"].includes(range))
      return res.status(400).json({ error: "range must be week or month" });

    const ref = start && isValidDate(start) ? dayjs(start) : dayjs();
    let periodStart, periodEnd;
    if (range === "month") {
      periodStart = ref.startOf("month").format("YYYY-MM-DD");
      periodEnd = ref.endOf("month").format("YYYY-MM-DD");
    } else {
      periodStart = ref.startOf("week").add(1, "day").format("YYYY-MM-DD"); // Monday start (ISO-like)
      periodEnd = ref.endOf("week").add(1, "day").format("YYYY-MM-DD");
    }

    const user = await User.findById(req.user.id);

    const items = await TimeEntry.find({
      userId: req.user.id,
      date: { $gte: periodStart, $lte: periodEnd },
    }).sort({ date: 1 });

    const sum = summarize(items, {
      weeklyTargetHours: user?.weeklyTargetHours || 35,
      monthlyTargetHours: user?.monthlyTargetHours || 152,
      breakMinutes: user?.defaultBreakMinutes || 45,
      range,
    });
    res.json({ range, start: periodStart, end: periodEnd, ...sum });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  try {
    const doc = await TimeEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Update an entry
router.put("/:id", async (req, res) => {
  try {
    const {
      date,
      service,
      startTime,
      endTime,
      isSchoolDay = false,
      breakMinutes,
      schoolHours,
    } = req.body || {};

    const doc = await TimeEntry.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!doc) return res.status(404).json({ error: "Not found" });

    if (date && isValidDate(date)) doc.date = date;
    doc.isSchoolDay = Boolean(isSchoolDay);

    if (doc.isSchoolDay) {
      const v = clampNumber(schoolHours, 0, 24);
      doc.schoolHours = v !== undefined ? v : 7;
      doc.service = undefined;
      doc.startTime = undefined;
      doc.endTime = undefined;
      doc.breakMinutes = undefined;
    } else {
      if (startTime && !isValidTime(startTime))
        return res.status(400).json({ error: "startTime must be HH:MM" });
      if (endTime && !isValidTime(endTime))
        return res.status(400).json({ error: "endTime must be HH:MM" });

      const validService = ["morning", "evening", "full"].includes(service) ? service : doc.service;
      const v = clampNumber(breakMinutes, 0, 300);

      doc.service = service ? validService : doc.service;
      doc.startTime = startTime || doc.startTime;
      doc.endTime = endTime || doc.endTime;
      doc.breakMinutes = v !== undefined ? v : doc.breakMinutes;
      doc.schoolHours = undefined;
    }

    await doc.save();
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
