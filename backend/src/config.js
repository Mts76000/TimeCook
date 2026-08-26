const DEFAULT_PORT = process.env.PORT || 4000;
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/timecook";
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
const resendApiKey = process.env.RESEND_API_KEY || "";
const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";
const appUrl = process.env.APP_URL || "http://localhost:5174";
const adminEmail = process.env.ADMIN_EMAIL || "";

module.exports = {
  port: DEFAULT_PORT,
  mongoUri,
  jwtSecret,
  resendApiKey,
  fromEmail,
  appUrl,
  adminEmail,
};
