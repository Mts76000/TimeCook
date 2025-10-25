const DEFAULT_PORT = process.env.PORT || 4000;
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/timecook";
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

module.exports = {
  port: DEFAULT_PORT,
  mongoUri,
  jwtSecret,
};
