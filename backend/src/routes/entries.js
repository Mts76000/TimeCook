const router = require("express").Router();
const dayjs = require("dayjs");
const auth = require("../middleware/auth");
const TimeEntry = require("../models/TimeEntry");
const User = require("../models/User");
const { summarize } = require("../utils/summary");

router.use(auth);

// Create or update an entry
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
    if (!date)
      return res.status(400).json({ error: "date required (YYYY-MM-DD)" });
    if (!isSchoolDay && (!startTime || !endTime)) {
      return res
        .status(400)
        .json({ error: "startTime and endTime required for a service" });
    }

    const doc = new TimeEntry({
      userId: req.user.id,
      date,
      service: isSchoolDay ? undefined : service || "full",
      startTime: isSchoolDay ? undefined : startTime,
      endTime: isSchoolDay ? undefined : endTime,
      isSchoolDay,
      breakMinutes: isSchoolDay ? undefined : breakMinutes,
      schoolHours: isSchoolDay ? schoolHours : undefined,
    });
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
      const s = start || "1900-01-01";
      const e = end || "2999-12-31";
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
    const ref = start ? dayjs(start) : dayjs();
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

    if (date) doc.date = date;
    doc.isSchoolDay = isSchoolDay;

    if (isSchoolDay) {
      doc.schoolHours = schoolHours;
      doc.service = undefined;
      doc.startTime = undefined;
      doc.endTime = undefined;
      doc.breakMinutes = undefined;
    } else {
      doc.service = service || doc.service;
      doc.startTime = startTime || doc.startTime;
      doc.endTime = endTime || doc.endTime;
      doc.breakMinutes =
        breakMinutes !== undefined ? breakMinutes : doc.breakMinutes;
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
