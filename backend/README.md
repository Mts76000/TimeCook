# TimeCook API

API Express pour TimeCook : authentification, suivi d’heures, objectifs et export CSV.

## Lancer en local

```bash
cp .env.example .env
# Remplissez MONGODB_URI, JWT_SECRET, RESEND_API_KEY, FROM_EMAIL et APP_URL
npm install
npm run dev
```

Le serveur écoute sur `http://localhost:4000` (par défaut).

## Données de démo

Créer un compte et des entrées fictives pour les démonstrations :

```bash
npm run seed-demo
```

- Email : `demo@timecook.app`
- Mot de passe : `demo1234`

## Endpoints principaux

- `POST /auth/register` — créer un compte
- `POST /auth/login` — se connecter
- `GET /auth/me` — profil connecté
- `PATCH /auth/me` — mettre à jour les objectifs
- `PATCH /auth/me/password` — changer le mot de passe
- `DELETE /auth/me` — supprimer le compte
- `POST /auth/forgot-password` — demande de réinitialisation
- `POST /auth/reset-password` — réinitialiser le mot de passe
- `POST /entries` — ajouter une entrée
- `GET /entries` — liste des entrées
- `GET /entries/summary` — résumé semaine/mois
- `GET /export` — export CSV
- `GET /settings` / `PATCH /settings` — paramètres utilisateur

## Configuration

Voir `.env.example` pour les variables d’environnement requises.
