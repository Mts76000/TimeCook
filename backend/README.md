# TimeCook API (Express + JWT + MongoDB)

Simple API d'authentification et de suivi d'heures pour alternance/restauration.

## Endpoints

- POST /auth/register { email, password, name? }
- POST /auth/login { email, password }
- GET /auth/me (Bearer token)
- POST /entries { date: YYYY-MM-DD, isSchoolDay: bool, service: 'morning'|'evening'|'full', startTime: 'HH:mm', endTime: 'HH:mm', notes? }
- GET /entries?start=YYYY-MM-DD&end=YYYY-MM-DD
- GET /entries/summary?range=week|month&start=YYYY-MM-DD
- GET /export?start=YYYY-MM-DD&end=YYYY-MM-DD -> CSV

Règles:

- 45 minutes de pause déduites par service saisi (si pas jour de cours)
- Jour de cours compte 7h dans le total hebdo (35h)

## Configuration

Copiez `.env.example` en `.env` et remplissez:

```
PORT=4000
MONGODB_URI=...
JWT_SECRET=...
```

## Lancer en local

```
npm install
npm run dev
```

## Déploiement (Coolify)

- Image Node 20+
- Commande: `npm ci && npm run start`
- Variables d'env comme dans `.env`
- Expose le port `PORT`
