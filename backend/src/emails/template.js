// Reusable HTML email template for TimeCook
// Built with tables for maximum email client compatibility.

function escapeHtml(text) {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Build a transactional email with a reusable layout.
 *
 * @param {Object} opts
 * @param {string} opts.title - Email subject line (also used as title)
 * @param {string} opts.preheader - Short preview text
 * @param {string} opts.greeting - e.g. "Bonjour,"
 * @param {string} opts.intro - Intro paragraph
 * @param {Array<{label:string, value:string}>} opts.facts - Key/value rows
 * @param {string} [opts.ctaLabel] - Optional CTA button label
 * @param {string} [opts.ctaUrl] - Optional CTA button URL
 * @param {string} [opts.footer] - Optional footer note
 * @param {string} [opts.projectName] - Project name
 * @param {string} [opts.projectUrl] - Project homepage
 * @param {string} [opts.projectEmail] - Contact email
 */
function buildEmail(opts = {}) {
  const {
    title,
    preheader = "",
    greeting = "Bonjour,",
    intro = "",
    facts = [],
    ctaLabel = "",
    ctaUrl = "",
    footer = "",
    projectName = "TimeCook",
    projectUrl = "https://timecook.app",
    projectEmail = "contact@mathis-lamotte.fr",
  } = opts;

  const brandColor = "#F97316";
  const brandDark = "#EA580C";
  const ink = "#1C1917";
  const inkLight = "#5C5752";
  const inkMuted = "#8C8580";
  const cream = "#FAF9F7";
  const paper = "#FFFFFF";
  const border = "#E2E0DC";

  const factsRows = facts
    .map(
      (f) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid ${border};width:40%;font-size:14px;color:${inkMuted};vertical-align:top;">
            ${escapeHtml(f.label)}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid ${border};font-size:14px;color:${ink};font-weight:600;vertical-align:top;word-break:break-word;">
            ${escapeHtml(f.value)}
          </td>
        </tr>
      `
    )
    .join("");

  const ctaBlock = ctaUrl
    ? `
        <p style="margin:24px 0 0;text-align:center;">
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background-color:${brandColor};color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;">
            ${escapeHtml(ctaLabel || "Ouvrir")}
          </a>
        </p>
      `
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${cream}; }
    @media only screen and (max-width: 600px) {
      .wrapper { width: 100% !important; }
      .content { padding: 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${cream};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${cream};padding:40px 0;">
    <tr>
      <td align="center" valign="top">
        <table role="presentation" class="wrapper" width="520" cellpadding="0" cellspacing="0" border="0" style="background-color:${paper};border:1px solid ${border};border-radius:16px;overflow:hidden;max-width:90%;width:520px;">
          <tr>
            <td class="content" style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid ${border};">
              <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:${ink};letter-spacing:-0.5px;">
                ${escapeHtml(projectName)}
              </h1>
              <p style="margin:0;font-size:14px;color:${inkMuted};">Suivi d’heures pour alternants en restauration</p>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding:32px 40px;">
              <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:${ink};">${escapeHtml(title)}</h2>
              <p style="margin:0 0 16px;font-size:16px;color:${inkLight};">${escapeHtml(greeting)}</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${inkLight};">${escapeHtml(intro)}</p>

              ${facts.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">${factsRows}</table>` : ""}

              ${ctaBlock}

              ${footer ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:${inkMuted};">${escapeHtml(footer)}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td class="content" style="padding:24px 40px;background-color:${cream};border-top:1px solid ${border};">
              <p style="margin:0;font-size:13px;color:${inkMuted};text-align:center;">
                © ${escapeHtml(new Date().getFullYear())} ${escapeHtml(projectName)} — <a href="mailto:${escapeHtml(projectEmail)}" style="color:${brandColor};text-decoration:none;">${escapeHtml(projectEmail)}</a>
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:${inkMuted};text-align:center;">
                <a href="${escapeHtml(projectUrl)}" style="color:${inkMuted};text-decoration:underline;">${escapeHtml(projectUrl)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { buildEmail, escapeHtml };
