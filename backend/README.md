# TimeCook API

API Express pour TimeCook : authentification, suivi d’heures, objectifs, partage et export CSV.

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

### Authentification

- `POST /auth/register` — créer un compte
- `POST /auth/login` — se connecter
- `GET /auth/me` — profil connecté
- `PATCH /auth/me` — mettre à jour le nom, les objectifs et la pause par défaut
- `PATCH /auth/me/password` — changer le mot de passe
- `DELETE /auth/me` — supprimer le compte
- `POST /auth/forgot-password` — demande de réinitialisation
- `POST /auth/reset-password` — réinitialiser le mot de passe

### Partage

- `POST /auth/share` — générer un lien de partage public
- `GET /auth/share/:token` — consulter les données partagées en lecture seule

### Entrées

- `POST /entries` — ajouter une entrée
- `GET /entries` — liste des entrées
- `GET /entries/summary` — résumé semaine/mois
- `DELETE /entries/:id` — supprimer une entrée
- `PUT /entries/:id` — modifier une entrée
- `GET /export` — export CSV

### Paramètres

- `GET /settings` / `PATCH /settings` — paramètres utilisateur (objectifs, pause par défaut)

## Configuration

Voir `.env.example` pour les variables d’environnement requises.
