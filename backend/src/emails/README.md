# Emails transactionnels

Ce dossier contient le template email réutilisable de TimeCook et les helpers d’envoi via Resend.

## Fichiers

- `template.js` — Template HTML statique (tables, compatible clients emails).
- `index.js` — Service d’envoi Resend et helpers (`sendTransactional`, `notifyAdminNewUser`).

## Configuration

Ajoute dans `backend/.env` :

```env
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=contact@mathis-lamotte.fr
ADMIN_EMAIL=contact@mathis-lamotte.fr
APP_URL=https://timecook.app
```

## Ajouter un nouvel email

Utilise `sendTransactional` avec les bonnes options :

```js
const { sendTransactional } = require("./emails");

await sendTransactional({
  to: "destinataire@example.com",
  subject: "Sujet de l’email",
  title: "Titre dans l’email",
  preheader: "Texte d’aperçu",
  greeting: "Bonjour,",
  intro: "Corps du message.",
  facts: [
    { label: "Clé", value: "Valeur" },
  ],
  ctaLabel: "Bouton",
  ctaUrl: "https://timecook.app/lien",
  footer: "Texte de pied de page.",
});
```

### Options du template

| Option | Type | Description |
|--------|------|-------------|
| `to` | string | Destinataire |
| `subject` | string | Sujet de l’email |
| `title` | string | Titre affiché dans le corps |
| `preheader` | string | Texte d’aperçu du client mail |
| `greeting` | string | Salutation |
| `intro` | string | Paragraphe d’introduction |
| `facts` | `{label, value}[]` | Lignes clé/valeur |
| `ctaLabel` | string | Label du bouton (optionnel) |
| `ctaUrl` | string | URL du bouton (optionnel) |
| `footer` | string | Pied de page (optionnel) |

## Notification admin (nouvelle inscription)

La route `POST /auth/register` appelle automatiquement `notifyAdminNewUser` après la création d’un compte. L’email est envoyé à `ADMIN_EMAIL`.
