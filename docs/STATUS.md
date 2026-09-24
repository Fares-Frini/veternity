# Veternity — État d'avancement

> **Ce fichier est le point d'entrée du projet.** Il est écrit pour être lu sans aucun historique de conversation — nouvelle session Claude, autre machine, autre personne. Ne rien supposer de connu qui ne soit pas ici ou dans les documents qu'il référence.

---

## Comment reprendre le travail (à chaque session)

1. **Lire ce fichier en entier**, en particulier « Où en est le projet » et « Prochaine étape ».
2. Lire la phase en cours dans [`PLAN-BACKEND.md`](PLAN-BACKEND.md) (le sommaire renvoie directement à la bonne section).
3. Si le travail touche la base de données : lire [`database/SCHEMA.md`](database/SCHEMA.md) **avant** d'écrire le moindre modèle Prisma, migration ou service. C'est la référence ; un écart entre le code et ce document est un bug.
4. Vérifier `git log --oneline -10` et `git status` dans **les deux dépôts** (`vet/` et `vet/veternity-api/` — ce sont deux dépôts Git séparés, voir « Disposition sur le disque » ci-dessous) pour confirmer que l'état réel correspond à ce que ce fichier décrit — s'il y a un écart, corriger ce fichier en premier.
5. Reprendre à la section « Prochaine étape ».

**Avant de terminer une session** (quel que soit ce qui a été fait) : mettre à jour « Où en est le projet », déplacer ce qui est terminé dans le « Journal », et réécrire « Prochaine étape » avec ce qui reste. Un travail non noté ici est un travail que la prochaine session refera ou oubliera — c'est la seule règle qui compte dans ce document.

---

## Disposition sur le disque

```
vet/                    ← dépôt Git n°1 (remote GitHub : Fares-Frini/veternity)
├── .gitignore          ← exclut /veternity-api/ (sans quoi ce serait un sous-module cassé)
├── docs/                ← CE dossier — suivi par le dépôt vet/, partagé par les deux projets
│   ├── STATUS.md        ← vous êtes ici
│   ├── PLAN-BACKEND.md
│   └── database/SCHEMA.md
├── veternity/            ← frontend Next.js — fait partie du dépôt vet/ (pas de .git propre)
└── veternity-api/        ← API NestJS — dépôt Git n°2, INDÉPENDANT, pas encore de remote
```

`veternity/`, `veternity-api/` et `docs/` sont co-localisés dans `vet/` pour le confort de l'éditeur, mais restent
deux dépôts Git distincts plus un dossier partagé — pas un monorepo (décision actée, voir plus bas). Ne jamais
`git add` quoi que ce soit sous `veternity-api/` depuis `vet/` : c'est exactement le piège qu'était le sous-module
`animated-login`, déjà nettoyé une fois.

---

## Où en est le projet

| | |
|---|---|
| Phase en cours | **Phase 0 — Fondations, terminée et vérifiée.** Prochaine session : Phase 1 (authentification) |
| Dépôt frontend (`vet/`, avec `veternity/` dedans) | Branche `main`, à jour, dernier commit `12aadfe` |
| Dépôt API (`vet/veternity-api/`) | Branche `main`, 1 commit (`60a8847`), **pas de remote** — le push est géré par l'utilisateur |
| Infrastructure Docker | En place et testée : Postgres 16, Redis 7, Mailpit (`docker compose up -d` dans `veternity-api/`) |
| Base de données | Migration initiale appliquée (`clinics`, `users`), seedée (1 clinique + 1 admin sans mot de passe) |

### Phase 0 — checklist « Terminé quand » (`PLAN-BACKEND.md`)

- [x] `docker compose up -d` puis `pnpm dev` démarrent l'API sur `:4000` — vérifié (le frontend sur `:3000` tourne indépendamment).
- [x] `GET /api/v1/health` renvoie `{"status":"ok","database":"up","redis":"up",...}` — vérifié par `curl`.
- [x] Un mail de test envoyé par l'API apparaît dans Mailpit — vérifié via l'API Mailpit (`GET :8025/api/v1/messages`), HTML et texte brut corrects.
- [x] L'API refuse de démarrer si `DATABASE_URL` est absente — vérifié : message Zod clair, une ligne par variable invalide, code de sortie 1.
- [ ] La CI passe sur une pull request — **pas encore testable**, `veternity-api` n'a pas de remote GitHub. Le fichier `.github/workflows/ci.yml` existe et est prêt ; à vérifier une fois le dépôt poussé.

---

## Prochaine étape

**Phase 1 — Authentification, accès et utilisateurs** (`PLAN-BACKEND.md`, section Phase 1 en entier — c'est la phase la plus dense du plan, à lire avant de commencer).

Dans l'ordre :
1. Étendre `prisma/schema.prisma` : ajouter `Session`, `TrustedDevice`, `AuthToken`, `AuditLog` (diagramme « Accès et sécurité » de `database/SCHEMA.md` §3), nouvelle migration.
2. `AuthModule` : hachage Argon2id (`argon2` à ajouter aux dépendances), sessions dans Redis + miroir Postgres, cookie `__Host-vt_sid`.
3. Les 6 gabarits mail listés dans `PLAN-BACKEND.md` §1.7 (le module mail de la Phase 0 — file BullMQ, rendu React Email — est déjà prêt à les recevoir ; suivre le même schéma que `templates/test-email.tsx`).
4. Endpoints de `PLAN-BACKEND.md` §1.6, guards de session et de permissions, `SessionGuard` global + `@Public()` (déjà posé en Phase 0, utilisé par `/health`).
5. Compléter `prisma/seed/seed.ts` : l'admin créé en Phase 0 n'a pas de mot de passe (`status: INVITED`, `passwordHash: null`) — la Phase 1 doit le rendre réellement utilisable en local.
6. Frontend : pages `/login` (réelle, plus `mockLogin`), vérification par code, mot de passe oublié, réinitialisation, acceptation d'invitation ; `proxy.ts` ; contexte de session.

**Avant de commencer**, si possible, trancher les points encore ouverts ci-dessous (surtout #2 et #3, qui conditionnent directement le parcours de connexion) — sinon la phase se construit sur les recommandations par défaut indiquées.

---

## Décisions actées (ne plus rediscuter)

| # | Décision | Où c'est écrit |
|---|---|---|
| 1 | **Pas de monorepo.** Deux dépôts séparés, co-localisés dans `vet/` sur le disque (voir « Disposition sur le disque ») | `PLAN-BACKEND.md` §2.1, §3.1 |
| 2 | Sessions serveur dans Redis, pas de JWT (révocation immédiate) | `PLAN-BACKEND.md` §2.2 |
| 3 | Même origine via les rewrites Next vers l'API (pas de CORS ouvert) — confirmé en Phase 0 : aucun CORS configuré côté API | `PLAN-BACKEND.md` §2.3, `src/main.ts` |
| 4 | Autorisation vérifiée côté API (guards), `proxy.ts` = vérification optimiste uniquement | `PLAN-BACKEND.md` §2.4 |
| 5 | Pas de table « ventes » séparée : toute vente est une facture (`invoices`, origine `CONSULTATION` ou `COUNTER`) | `database/SCHEMA.md` §2 |
| 6 | Mails via Mailpit en dev (capturés sur `localhost:8025`), relais SMTP transactionnel en prod ; envoi via file BullMQ (5 tentatives, backoff exponentiel), gabarits React Email | `PLAN-BACKEND.md` §2.6, §4.1 — **implémenté et vérifié en Phase 0** |
| 7 | Fichiers reçus par Multer, jamais servis directement, stockage interchangeable via `StorageAdapter` (Phase 6, pas encore implémenté) | `PLAN-BACKEND.md` §6.1 |
| 8 | Le sous-module `animated-login/` (vide sur disque) a été retiré du dépôt `vet/` au commit `27ce222` | `git log` (dépôt `vet/`) |
| 9 | Adresses e-mail : pas de `citext` (Prisma 7 exclurait le champ des types de création/mise à jour du client généré) ; normalisation en minuscule côté service + index unique fonctionnel `lower(email)` en SQL de migration | `database/SCHEMA.md` §1 et §14 ; `prisma/migrations/20260924114120_init/migration.sql` |
| 10 | Prisma 7 : plus de `url` dans `schema.prisma`. `prisma.config.ts` pour le CLI (migrate, seed) ; `PrismaService` construit son propre adaptateur (`@prisma/adapter-pg`) au runtime | `veternity-api/prisma.config.ts`, `src/infrastructure/prisma/prisma.service.ts` |
| 11 | Client Prisma généré vers un chemin fixe du projet (`prisma/generated`, via `output` dans le `generator client`), pas vers le `@prisma/client` du `node_modules` — sous pnpm, ce dernier existe en plusieurs copies physiques distinctes (une par hash de peer-dependencies) et rien ne garantit que le client généré atterrisse dans celle que les imports résolvent réellement | `veternity-api/prisma/schema.prisma` |
| 12 | Scripts autonomes qui démarrent le contexte Nest (`mail:test`, `openapi:generate`) tournent avec `ts-node`, pas `tsx` : `tsx` (esbuild) n'émet pas les métadonnées de décorateurs (`emitDecoratorMetadata`) dont l'injection de dépendances de Nest a besoin — l'app elle-même (compilée par `tsc` via `nest build`) n'est pas concernée. `prisma/seed/seed.ts` (pas de DI Nest) reste sur `tsx` | `veternity-api/package.json` (scripts `mail:test`, `openapi:generate`, `db:seed`) |
| 13 | TypeScript épinglé en `6.0.3` (pas la dernière version 7.x) : `typescript-eslint@8.70.1` ne supporte pas encore TS 7 ([issue amont #10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)) | `veternity-api/package.json` |

## Décisions encore ouvertes

Reprises de `PLAN-BACKEND.md` §18 — celles qui restent, avec la recommandation par défaut appliquée tant qu'elles ne sont pas tranchées autrement.

| # | Question | Recommandation appliquée par défaut |
|---|---|---|
| 1 | Une seule clinique, ou plusieurs (SaaS) ? | `clinic_id` sur toutes les tables métier — déjà dans le schéma Prisma (`clinics`, `users.clinicId`) |
| 2 | Connexion par e-mail ou nom d'utilisateur ? | **E-mail** — déjà le cas dans le modèle `User` (`email` unique, insensible à la casse) |
| 3 | Code de vérification à chaque connexion, ou seulement sur un nouvel appareil ? | Nouvel appareil, avec un appareil de confiance valable 30 jours ; réglable par clinique (`clinics.loginVerification`, déjà dans le schéma, pas encore utilisé) |
| 4 | Remote GitHub pour `veternity-api` (organisation, visibilité) ? | Aucun remote pour l'instant — géré par l'utilisateur (« tu travailles en local, je m'occupe du push et de GitHub ») |
| 5 | Rôles : Admin / Vétérinaire / Assistant·e / Accueil conviennent-ils tels quels ? | Matrice de permissions en l'état dans `PLAN-BACKEND.md` §1.4 ; déjà dans l'enum Prisma `UserRole` |
| 6 | Moteur OCR réel (local ou service tiers) ? | Stub d'abord (Phase 6), décision reportée |
| 7 | Mentions légales exactes des factures (ICE, IF, RC, TVA) ? | À valider avec un comptable avant la Phase 4 ; les colonnes existent déjà sur `Clinic` (`ice`, `taxId`, `tradeRegister`) |
| 8 | Hébergement cible en production ? | Détermine le stockage de fichiers (disque vs S3/MinIO) et le relais SMTP — Phase 8 |

Si une réponse arrive dans une session future, la noter ici comme actée **et** mettre à jour les diagrammes/plan concernés dans le même geste.

---

## Journal (plus récent en premier)

### 2026-09-24 (soir) — Phase 0 implémentée et vérifiée
- Nouveau dépôt `vet/veternity-api/` (NestJS 12, Prisma 7, Redis, BullMQ, Nodemailer/React Email), co-localisé dans `vet/` à la demande explicite de l'utilisateur, avec son propre `.git` — exclu du dépôt `vet/` par `.gitignore`.
- Implémenté : validation d'environnement Zod au démarrage, Pino (request-id, masquage des secrets), helmet/compression, préfixe `/api/v1`, erreurs RFC 9457, limite de débit Redis, Swagger/OpenAPI en dev, arrêt propre. Modèles Prisma `Clinic`/`User`, migration initiale, seed. Module mail complet (file BullMQ, gabarit React Email, worker) au lieu d'un simple stub.
- **Trois problèmes réels rencontrés et corrigés, pas seulement de la configuration :**
  1. Prisma 7 a retiré `url` de `datasource` dans `schema.prisma` (breaking change non documenté dans mes connaissances) → `prisma.config.ts` + adaptateur `@prisma/adapter-pg` au runtime.
  2. Sous pnpm, `@prisma/client` existe en plusieurs copies physiques (hash de peer-deps) ; `prisma generate` avait écrit le client dans une copie différente de celle que les imports résolvaient → `output` fixe (`prisma/generated`) dans le générateur.
  3. `tsx` n'émet pas `emitDecoratorMetadata` → l'injection de dépendances de Nest échouait silencieusement dans les scripts autonomes (`mail:test`) → bascule sur `ts-node`.
- TypeScript 7.0.2 (résolu par défaut par pnpm) incompatible avec `typescript-eslint` actuel → épinglé en `6.0.3`.
- **Vérifié de bout en bout, pas juste "ça compile" :** `/health` répond 200 avec Postgres et Redis up ; un mail envoyé via `pnpm mail:test` est bien arrivé dans Mailpit (contenu HTML + texte confirmé) ; l'API refuse de démarrer sans `DATABASE_URL` avec un message clair ; `pnpm build`, `lint`, `typecheck` passent tous.
- Commit `60a8847` dans `veternity-api/` (branche `main`, pas de remote).

### 2026-09-24 (après-midi) — Checkpoint avant le backend
- Commit `27ce222` (dépôt `vet/`) : tout le travail frontend en attente (refonte du parcours de consultation, module Inventaire complet, documents imprimables, dialog de détail sur la liste des consultations). Retrait du sous-module `animated-login`.
- Rédaction de `docs/PLAN-BACKEND.md` et `docs/database/SCHEMA.md` (35 tables, 9 diagrammes Mermaid vérifiés, 22 règles d'intégrité). Décision actée : pas de monorepo.
- Commit `12aadfe` : création de ce fichier `docs/STATUS.md`.

---

## Où sont les choses

| Quoi | Où |
|---|---|
| Plan détaillé par phase, conventions, sécurité, tests | [`PLAN-BACKEND.md`](PLAN-BACKEND.md) |
| Modèle de données de référence (diagrammes, règles, statuts) | [`database/SCHEMA.md`](database/SCHEMA.md) |
| Frontend | `veternity/` — Next.js 16, données de démo en mémoire dans `app/**/_components/*-data.ts` (deviendront le seed Prisma, cf. `SCHEMA.md` §15) |
| API | `veternity-api/` — voir son propre `README.md` pour les commandes (`pnpm dev`, `pnpm mail:test`, etc.) |
| Décisions d'architecture détaillées (une par sujet, à créer au fil de l'eau) | `docs/adr/` — dossier prévu, pas encore peuplé |
