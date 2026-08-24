# TimeCook

Suivi d’heures pour alternants en restauration.

## Stack

- **Frontend :** Vue 3 + Vite + Tailwind CSS
- **Backend :** Node.js + Express + MongoDB + JWT

## Fonctionnalités

- Saisie rapide des heures de service (matin / soir) et des jours de cours
- Objectifs hebdomadaires et mensuels personnalisables
- Résumé visuel avec graphique, reste / excès et barre de progression
- Partage en lecture seule avec lien public
- Réinitialisation de mot de passe par email (Resend)
- Export CSV des entrées
- PWA : manifest, service worker et icônes
- SEO : balises meta, robots.txt, sitemap.xml

## Lancer en local

### 1. Base de données

Assurez-vous d’avoir MongoDB disponible (local ou cloud).

### 2. Backend

```bash
cd backend
cp .env.example .env
# Remplissez MONGODB_URI, JWT_SECRET, RESEND_API_KEY, FROM_EMAIL et APP_URL
npm install
npm run dev
```

Le backend démarre sur `http://localhost:4000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173` (Vite changera de port si besoin).

## Données de démo

Créer un compte démo avec des entrées générées aléatoirement :

```bash
cd backend
npm run seed-demo
```

- Email : `demo@timecook.app`
- Mot de passe : `demo1234`

## Build

```bash
cd frontend
npm run build
```

Le build statique est généré dans le dossier `frontend/dist/`.

## Tests

Aucune suite de tests n’est configurée pour le moment.

## Variables d’environnement importantes

Copiez `.env.example` en `.env` dans `backend/` et renseignez au minimum :

- `MONGODB_URI`
- `JWT_SECRET`
- `RESEND_API_KEY` (pour l’envoi des emails de réinitialisation de mot de passe)
- `FROM_EMAIL`
- `APP_URL` (URL du frontend utilisée dans les liens de partage/réinitialisation)
