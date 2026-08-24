# TimeCook Frontend

Interface utilisateur de TimeCook en Vue 3, Vite et Tailwind CSS.

## Lancer en local

```bash
npm install
npm run dev
```

Par défaut, l’application est disponible sur `http://localhost:5173` (Vite utilisera un autre port si 5173 est occupé).

## Build de production

```bash
npm run build
```

Le build statique est généré dans le dossier `dist/`.

## PWA

Un manifest, des icônes et un service worker basique sont présents dans `public/`.
Le service worker met en cache les ressources statiques pour un fonctionnement offline limité.
