const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const utc = require("dayjs/plugin/utc");

dayjs.extend(duration);
dayjs.extend(utc);

// Parse HH:mm to minutes
function hmToMinutes(hm) {
  if (!hm) return 0;
  const [h, m] = hm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesToHm(mins) {
  const sign = mins < 0 ? "-" : "";
  const m = Math.abs(mins);
  const h = Math.floor(m / 60);
  const mm = (m % 60).toString().padStart(2, "0");
  return `${sign}${h}:${mm}`;
}

// Computes net minutes for one service with custom break time
function netServiceMinutes(startTime, endTime, breakMinutes = 45) {
  const start = hmToMinutes(startTime);
  const end = hmToMinutes(endTime);
  let total = end - start;
  // Handle shift crossing midnight (end after 00:00 of next day)
  if (total < 0) total += 24 * 60;
  return Math.max(0, total - breakMinutes);
}

// Summarize entries list
function summarize(entries, options = {}) {
  const weeklyTargetHours = options.weeklyTargetHours || 35;
  const defaultBreakMinutes = options.breakMinutes || 45;
  const range = options.range || "week"; // 'week' or 'month'

  const byDate = {};
  let totalMinutes = 0;

  for (const e of entries) {
    if (e.isSchoolDay) {
      // Custom schoolHours if set, else 7h default
      const hrs = e.schoolHours || 7;
      const mins = hrs * 60;
      totalMinutes += mins;
      byDate[e.date] = byDate[e.date] || {
        date: e.date,
        services: [],
        isSchoolDay: true,
        minutes: 0,
      };
      byDate[e.date].minutes += mins;
      byDate[e.date].schoolHours = hrs;
      continue;
    }
    const usedBreak =
      typeof e.breakMinutes === "number" ? e.breakMinutes : defaultBreakMinutes;
    const mins = netServiceMinutes(e.startTime, e.endTime, usedBreak);
    totalMinutes += mins;
    byDate[e.date] = byDate[e.date] || {
      date: e.date,
      services: [],
      minutes: 0,
    };
    byDate[e.date].services.push({
      service: e.service,
      startTime: e.startTime,
      endTime: e.endTime,
      netMinutes: mins,
      breakMinutesUsed: usedBreak,
    });
    byDate[e.date].minutes += mins;
  }

  const totalHours = totalMinutes / 60;

  // Calculate target hours based on range
  let targetHours = weeklyTargetHours;
  if (range === "month") {
    // Monthly target: exactly 152h (35h * 4.343 ≈ 152)
    targetHours = 152;
  }

  const overtimeHours = Math.max(0, totalHours - targetHours);

  return {
    totalMinutes,
    totalHours: Number(totalHours.toFixed(2)),
    targetHours: Number(targetHours.toFixed(2)),
    overtimeHours: Number(overtimeHours.toFixed(2)),
    byDate: Object.values(byDate).sort((a, b) => (a.date < b.date ? -1 : 1)),
  };
}

module.exports = {
  hmToMinutes,
  minutesToHm,
  netServiceMinutes,
  summarize,
};
