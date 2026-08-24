require("dotenv").config();
const dayjs = require("dayjs");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const { mongoUri } = require("./config");
const User = require("./models/User");
const TimeEntry = require("./models/TimeEntry");

const DEMO_EMAIL = "demo@timecook.app";
const DEMO_PASSWORD = "demo1234";

function randomTime(minHour, maxHour) {
  const h = faker.number.int({ min: minHour, max: maxHour });
  const m = faker.helpers.arrayElement([0, 15, 30, 45]);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function hmToMinutes(hm) {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToHm(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

async function seed() {
  await mongoose.connect(mongoUri);

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    user = new User({ email: DEMO_EMAIL, name: "Compte démo" });
    await user.setPassword(DEMO_PASSWORD);
    await user.save();
    console.log("Compte démo créé");
  } else {
    console.log("Compte démo existant mis à jour");
  }

  // Nettoyer les anciennes entrées démo
  await TimeEntry.deleteMany({ userId: user._id });

  const entries = [];
  const today = dayjs();

  for (let i = 0; i < 21; i++) {
    const date = today.subtract(i, "day").format("YYYY-MM-DD");
    const type = faker.helpers.weightedArrayElement([
      { weight: 5, value: "morning" },
      { weight: 5, value: "evening" },
      { weight: 2, value: "both" },
      { weight: 2, value: "school" },
      { weight: 3, value: "off" },
    ]);

    if (type === "off") continue;

    if (type === "school") {
      entries.push({
        userId: user._id,
        date,
        isSchoolDay: true,
        schoolHours: 7,
      });
      continue;
    }

    if (type === "morning" || type === "both") {
      const start = randomTime(8, 11);
      const end = randomTime(13, 16);
      const breakMinutes = faker.helpers.arrayElement([30, 45, 60]);
      entries.push({
        userId: user._id,
        date,
        service: "morning",
        startTime: start,
        endTime: end,
        breakMinutes,
      });
    }

    if (type === "evening" || type === "both") {
      let start = randomTime(17, 19);
      let end = randomTime(21, 23);
      if (hmToMinutes(end) < hmToMinutes(start)) {
        end = minutesToHm(hmToMinutes(end) + 24 * 60);
      }
      const breakMinutes = faker.helpers.arrayElement([30, 45, 60]);
      entries.push({
        userId: user._id,
        date,
        service: "evening",
        startTime: start,
        endTime: end,
        breakMinutes,
      });
    }
  }

  await TimeEntry.insertMany(entries);
  console.log(`${entries.length} entrées créées`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
