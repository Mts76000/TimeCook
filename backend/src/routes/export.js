const router = require("express").Router();
const auth = require("../middleware/auth");
const TimeEntry = require("../models/TimeEntry");
const User = require("../models/User");
const { minutesToHm, netServiceMinutes } = require("../utils/summary");

router.use(auth);

// CSV export for a period
router.get("/", async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end)
      return res
        .status(400)
        .json({ error: "start and end (YYYY-MM-DD) required" });

    const user = await User.findById(req.user.id);
    const defaultBreakMinutes = user?.defaultBreakMinutes || 45;

    const items = await TimeEntry.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const header = ["Date", "Type", "Début", "Fin", "Net (min)", "Net (hh:mm)"];
    const rows = [header];

    let totalMin = 0;

    for (const e of items) {
      if (e.isSchoolDay) {
        const hrs = e.schoolHours || 7;
        const mins = hrs * 60;
        totalMin += mins;
        rows.push([
          e.date,
          `Cours (${hrs}h)`,
          "",
          "",
          String(mins),
          minutesToHm(mins),
        ]);
      } else {
        const usedBreak =
          typeof e.breakMinutes === "number"
            ? e.breakMinutes
            : defaultBreakMinutes;
        const mins = netServiceMinutes(e.startTime, e.endTime, usedBreak);
        totalMin += mins;
        rows.push([
          e.date,
          e.service || "Service",
          e.startTime || "",
          e.endTime || "",
          String(mins),
          minutesToHm(mins),
        ]);
      }
    }

    rows.push([]);
    rows.push(["Total", "", "", "", String(totalMin), minutesToHm(totalMin)]);

    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=export_${start}_${end}.csv`
    );
    res.send("\uFEFF" + csv); // BOM for Excel
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
