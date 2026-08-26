const { Resend } = require("resend");
const { buildEmail } = require("./template");
const { resendApiKey, fromEmail, adminEmail } = require("../config");

let resend = null;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
}

/**
 * Send a transactional email using the reusable template.
 *
 * @param {Object} opts
 * @param {string} opts.to - Recipient email
 * @param {string} opts.subject - Email subject
 * @param {string} opts.title - Email title (inside the template)
 * @param {string} opts.preheader - Preview text
 * @param {string} opts.greeting - Greeting line
 * @param {string} opts.intro - Intro paragraph
 * @param {Array<{label:string, value:string}>} opts.facts - Key/value facts
 * @param {string} [opts.ctaLabel] - Optional CTA label
 * @param {string} [opts.ctaUrl] - Optional CTA URL
 * @param {string} [opts.footer] - Optional footer note
 */
async function sendTransactional(opts = {}) {
  if (!resend) {
    console.warn("[email] Resend not configured, skipping email send");
    return { skipped: true };
  }

  const { to, subject, ...templateOpts } = opts;
  if (!to || !subject) {
    throw new Error("to and subject are required");
  }

  const html = buildEmail({
    projectName: "TimeCook",
    projectUrl: process.env.APP_URL || "https://timecook.app",
    projectEmail: fromEmail || "contact@mathis-lamotte.fr",
    ...templateOpts,
    title: templateOpts.title || subject,
  });

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });
    return { ok: true, id: result?.id };
  } catch (err) {
    console.error("[email] Resend send failed:", err);
    throw err;
  }
}

/**
 * Notify admin that a new user signed up.
 *
 * @param {Object} user
 * @param {string} user.email
 * @param {string} [user.name]
 * @param {Date} [signedUpAt]
 */
async function notifyAdminNewUser(user, signedUpAt = new Date()) {
  if (!adminEmail) {
    console.warn("[email] ADMIN_EMAIL not configured, skipping admin notification");
    return { skipped: true };
  }

  const dateStr = signedUpAt.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return sendTransactional({
    to: adminEmail,
    subject: "Nouvelle inscription sur TimeCook",
    title: "Nouvelle inscription",
    preheader: `Un nouvel utilisateur vient de s’inscrire sur TimeCook.`,
    greeting: "Bonjour,",
    intro: "Un nouvel utilisateur vient de créer un compte sur TimeCook.",
    facts: [
      { label: "Email", value: user.email },
      { label: "Nom", value: user.name || "Non renseigné" },
      { label: "Date d’inscription", value: dateStr },
      { label: "Projet", value: "TimeCook" },
    ],
    ctaLabel: "Ouvrir TimeCook",
    ctaUrl: process.env.APP_URL || "https://timecook.app",
    footer: "Tu reçois cet email car tu es administrateur de TimeCook.",
  });
}

module.exports = { sendTransactional, notifyAdminNewUser };
