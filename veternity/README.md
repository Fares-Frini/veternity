# Veternity — Frontend

Application de gestion pour clinique vétérinaire : rendez-vous, consultations, ordonnances, facturation, inventaire.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · shadcn/ui · HugeIcons.

## Avant de travailler sur ce dépôt

👉 **[`../docs/STATUS.md`](../docs/STATUS.md)** — état d'avancement du projet et prochaine étape. À lire en premier, à chaque reprise.

Aussi dans `../docs/` :
- [`PLAN-BACKEND.md`](../docs/PLAN-BACKEND.md) — plan complet de l'intégration backend (NestJS, PostgreSQL, Prisma, Redis, Multer, mail), phase par phase.
- [`database/SCHEMA.md`](../docs/database/SCHEMA.md) — modèle de données de référence (diagrammes, règles d'intégrité, cycles de vie). Toute logique métier doit s'y conformer.

> Ces documents déménageront dans le dépôt `veternity-api` dès sa création (voir `PLAN-BACKEND.md` §2.1) ; ce lien sera mis à jour à ce moment-là.

## Démarrer

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## État actuel

Le frontend fonctionne aujourd'hui avec des données de démonstration en mémoire (`app/**/_components/*-data.ts`), sans backend ni authentification réelle — voir `docs/STATUS.md` pour ce qui est en cours.
