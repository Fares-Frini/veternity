# Veternity — Plan d'intégration backend

> **Avant de lire ce document : voir [`STATUS.md`](STATUS.md)** pour savoir où en est le projet et quelle est la prochaine étape concrète. Ce fichier-ci est le plan complet et stable ; `STATUS.md` est l'état, mis à jour à chaque session.
> Organisation : **deux dépôts séparés** (frontend `veternity`, API `veternity-api`), pas de monorepo.
> Modèle de données de référence : [`database/SCHEMA.md`](database/SCHEMA.md).
> Stack cible : Next.js 16 (existant) · NestJS · PostgreSQL · Prisma · Redis · Multer · serveur mail · Docker.

Ce document décrit l'ordre des travaux, l'organisation du code et les règles de sécurité à tenir. Chaque phase se termine par une liste « Terminé quand » : une phase n'est pas close tant que ces critères ne sont pas vérifiés.

---

## Sommaire

1. [Point de départ](#1-point-de-départ)
2. [Décisions d'architecture](#2-décisions-darchitecture)
3. [Organisation des dépôts et des dossiers](#3-organisation-des-dépôts-et-des-dossiers)
4. [Environnement Docker](#4-environnement-docker)
5. [Conventions transverses](#5-conventions-transverses)
6. [Phase 0 — Fondations](#phase-0--fondations)
7. [Phase 1 — Authentification, accès et utilisateurs](#phase-1--authentification-accès-et-utilisateurs)
8. [Phase 2 — Référentiels : clinique, actes, clients, animaux](#phase-2--référentiels--clinique-actes-clients-animaux)
9. [Phase 3 — Rendez-vous](#phase-3--rendez-vous)
10. [Phase 4 — Consultations, ordonnances, facturation](#phase-4--consultations-ordonnances-facturation)
11. [Phase 5 — Inventaire : stock, ventes, achats, fournisseurs](#phase-5--inventaire--stock-ventes-achats-fournisseurs)
12. [Phase 6 — Documents, Multer et factures fournisseurs (OCR)](#phase-6--documents-multer-et-factures-fournisseurs-ocr)
13. [Phase 7 — Tableau de bord, alertes et tâches planifiées](#phase-7--tableau-de-bord-alertes-et-tâches-planifiées)
14. [Phase 8 — Durcissement et mise en production](#phase-8--durcissement-et-mise-en-production)
15. [Modèle de données](#15-modèle-de-données)
16. [Checklist sécurité](#16-checklist-sécurité)
17. [Stratégie de tests](#17-stratégie-de-tests)
18. [Décisions à valider avant de commencer](#18-décisions-à-valider-avant-de-commencer)

---

## 1. Point de départ

| Élément | État actuel |
|---|---|
| Frontend | `veternity/` — Next.js 16, React 19, Tailwind 4, shadcn/ui, HugeIcons |
| Données | Tableaux en mémoire dans les `_components/*-data.ts` (clients, animaux, rendez-vous, consultations, ordonnances, factures, stock, ventes, achats, fournisseurs, factures OCR) |
| Connexion | `app/login/page.tsx` avec `mockLogin` (identifiant + mot de passe, 6 caractères min.) ; aucune protection des routes |
| Déconnexion / réglages | Boutons « Sign out » et « Settings » présents dans la navigation, non branchés |
| Logique métier côté client | Stock FEFO, rapprochement du stock d'une consultation, numérotation des factures, intégration OCR — **tout cela devra passer côté serveur** |
| Git | Branche `main`, beaucoup de travail non commité |
| Divers | Un dossier `animated-login/` (projet Vite séparé) à la racine |

**Première action :** commiter le travail frontend en cours sur `main` (ou une branche), pour repartir d'un état propre avant de brancher l'API.

---

## 2. Décisions d'architecture

Chaque choix est motivé ; ceux qui demandent ton arbitrage sont repris en [section 18](#18-décisions-à-valider-avant-de-commencer).

### 2.1 Deux dépôts indépendants

| Dépôt | Contenu | Déploiement |
|---|---|---|
| `veternity` (existant) | Frontend Next.js | Image `web` |
| `veternity-api` (nouveau) | API NestJS, schéma Prisma, `docker-compose.yml` de l'infrastructure, documentation de la base | Image `api` + migrations |

Chaque dépôt a son `package.json`, sa CI et son cycle de version. `veternity`, `veternity-api` et `docs/` sont
co-localisés dans le même dossier `vet/` sur le disque (confort de l'IDE, un seul endroit à ouvrir), mais restent
distincts : `vet/` est le dépôt Git qui suit `veternity/` et `docs/` directement, `veternity-api/` a son propre
`.git` indépendant et est exclu par `vet/.gitignore` (sans quoi il apparaîtrait comme un sous-module cassé — le
piège qu'était `animated-login`, retiré). `docs/` n'est pas dupliqué dans `veternity-api/` : **l'API est
propriétaire du contenu** de `docs/database/SCHEMA.md` (toute évolution du schéma y commence), mais le dossier
physique reste au même endroit, référencé par les deux dépôts avec un chemin relatif (`../docs/...` depuis
`veternity-api/`, `../docs/...` depuis `veternity/`).

**Contrat entre les deux :** l'API décrit ses entrées et sorties avec Zod (`nestjs-zod`), ce qui produit un document **OpenAPI**. Le frontend en **génère ses types** avec `openapi-typescript` (script `pnpm api:types`, fichier généré `lib/api/schema.d.ts`, commité). Un champ renommé côté API fait échouer le typecheck du frontend à la régénération, avant d'arriver en production.

- L'API versionne `openapi.json` à chaque changement de contrat (vérifié en CI : le fichier doit être à jour).
- Un changement incompatible passe par une nouvelle version de route (`/api/v2/...`) ou par un déploiement coordonné des deux dépôts.

### 2.2 Sessions serveur dans Redis (plutôt que JWT)

- Cookie `__Host-vt_sid` : identifiant de session opaque (256 bits aléatoires), `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`.
- Données de session dans Redis (TTL glissant), miroir dans la table `Session` de Postgres pour l'historique et la liste « appareils connectés ».

**Pourquoi pas JWT :** dans une clinique, il faut pouvoir couper un accès **immédiatement** (poste volé, départ d'un employé, changement de rôle). Avec des sessions serveur, la révocation est instantanée. On évite aussi la rotation des refresh tokens et la détection de réutilisation, et le token ne transporte aucune donnée.

### 2.3 Même origine via le proxy Next

Le navigateur n'appelle que `https://app.…/api/v1/*`. Next réécrit ces appels vers le service Nest (`rewrites` dans `next.config.ts`).

- Le cookie reste « first-party » ; pas de CORS ouvert en production.
- En développement, `localhost:3000/api/*` est réécrit vers `localhost:4000/*`.

### 2.4 Autorisation : dans l'API, jamais seulement dans le front

- `proxy.ts` (nouveau nom de `middleware.ts` depuis Next 16) ne fait que des **vérifications optimistes** : présence du cookie, sinon redirection vers `/login`. La documentation Next le dit explicitement : ce n'est pas une solution d'autorisation.
- Chaque endpoint Nest est protégé par des guards (session + permission). Masquer un bouton côté front relève du confort, pas de la sécurité.

### 2.5 Multi-clinique dès le départ (recommandé)

Toutes les tables métier portent un `clinicId`, et chaque requête est filtrée par la clinique de la session. Coût quasi nul aujourd'hui, très élevé à ajouter plus tard. *(À confirmer, voir §18.)*

### 2.6 Autres choix

| Sujet | Choix | Raison |
|---|---|---|
| Validation | Zod (`nestjs-zod`) dans l'API → OpenAPI → types générés dans le front | Un seul contrat, sans dépôt partagé |
| Montants | `Decimal(12,2)` en base, jamais de `float` | Pas d'erreurs d'arrondi sur les factures |
| Identifiants | UUID en interne ; numéros lisibles (`F-1043`, `BC-2026-131`) générés en transaction | Pas d'IDs devinables dans les URL ; numérotation continue |
| Dates | `timestamptz`, stockées en UTC, affichées en `fr-FR` / `Africa/Casablanca` | |
| Tâches asynchrones | BullMQ sur Redis (mails, OCR, PDF, alertes) | Une requête HTTP n'attend jamais un SMTP ou un OCR |
| Mails | Mailpit en dev ; relais SMTP en prod ; gabarits React Email | Mails testables localement ; gabarits dans le même langage que le front |
| Fichiers | Multer → validation → adaptateur de stockage (disque en dev, S3/MinIO possible ensuite) | Multer ne fait que recevoir ; le stockage reste interchangeable |
| Données côté front | TanStack Query | Cache, invalidations, états de chargement et d'erreur standard |
| Logs | Pino (JSON), masquage des secrets | Logs exploitables, sans fuite de mots de passe ni de tokens |

---

## 3. Organisation des dépôts et des dossiers

### 3.1 Trois dossiers, deux dépôts Git, un seul emplacement disque

```
vet/                             # dossier parent, pas un dépôt commun aux trois
├── .gitignore                   # exclut /veternity-api/ du dépôt racine
├── docs/                        # PARTAGÉ — un seul exemplaire, suivi par le dépôt racine (vet/)
│   ├── STATUS.md                # point d'entrée — voir ce fichier en premier
│   ├── PLAN-BACKEND.md
│   ├── database/SCHEMA.md       # référence du modèle de données
│   └── adr/                     # décisions d'architecture (1 fichier par décision)
├── veternity/                   # dépôt frontend — fait partie du dépôt racine vet/
│   ├── app/  components/  lib/  public/
│   ├── proxy.ts
│   ├── .env.example             # NEXT_PUBLIC_*, API_INTERNAL_URL
│   └── .github/workflows/ci.yml
└── veternity-api/                # dépôt API — .git INDÉPENDANT, ignoré par le dépôt racine
    ├── src/  prisma/  test/     # détaillés en 3.2
    ├── docker/
    │   └── Dockerfile
    ├── docker-compose.yml       # infra de dev : postgres, redis, mailpit
    ├── docker-compose.test.yml  # base jetable pour les tests e2e
    ├── openapi.json             # contrat publié, régénéré par script
    ├── .env.example
    └── .github/workflows/ci.yml
```

Deux dépôts Git au total (`git init` a été fait séparément dans `vet/` et dans `vet/veternity-api/`), pas trois —
`docs/` n'est pas un dépôt, juste un dossier partagé suivi par celui de `vet/`.

### 3.2 API — `veternity-api`

Organisation **par domaine métier** (un module Nest par domaine), avec l'infrastructure isolée dans son propre dossier.

```
veternity-api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/                   # seed.ts + fixtures reprises des données de démo actuelles
├── src/
│   ├── main.ts                 # bootstrap : helmet, pipes, filtres, arrêt propre
│   ├── app.module.ts
│   ├── config/
│   │   ├── env.schema.ts       # validation Zod des variables d'environnement (démarrage refusé si invalides)
│   │   └── config.module.ts
│   ├── common/
│   │   ├── decorators/         # @CurrentUser, @CurrentClinic, @RequirePermissions, @Public
│   │   ├── guards/             # SessionGuard, PermissionsGuard, CsrfGuard
│   │   ├── filters/            # erreurs au format RFC 9457 (problem+json)
│   │   ├── interceptors/       # request-id, audit, sérialisation
│   │   ├── pipes/              # ZodValidationPipe
│   │   └── utils/              # pagination, money, dates
│   ├── infrastructure/
│   │   ├── prisma/             # PrismaService + extension de filtrage par clinique
│   │   ├── redis/              # client, helpers de rate limiting
│   │   ├── queue/              # BullMQ : définitions de files, processors
│   │   ├── mail/               # MailService, transport nodemailer, gabarits React Email
│   │   ├── storage/            # StorageAdapter (LocalDisk, S3 plus tard)
│   │   └── health/             # /health : db, redis, disque
│   └── modules/
│       ├── auth/               # login, vérification e-mail, mot de passe, sessions
│       ├── users/              # équipe, invitations, rôles
│       ├── clinics/            # paramètres de la clinique
│       ├── audit/              # journal d'audit (lecture)
│       ├── clients/
│       ├── animals/
│       ├── appointments/
│       ├── catalog/            # catalogue des actes et tarifs
│       ├── consultations/      # consultations, constantes, actes réalisés
│       ├── prescriptions/
│       ├── billing/            # factures clients, paiements, avoirs
│       ├── inventory/          # produits, lots, mouvements, ajustements
│       ├── sales/              # ventes au comptoir
│       ├── purchasing/         # fournisseurs, commandes, réceptions
│       ├── supplier-invoices/  # import, OCR, vérification, intégration
│       ├── documents/          # upload, téléchargement sécurisé
│       └── dashboard/          # agrégats, bilans
└── test/
    ├── e2e/                    # un fichier par module (supertest)
    └── utils/                  # factories, helpers d'authentification
```

Structure type d'un module :

```
modules/inventory/
├── inventory.module.ts
├── inventory.controller.ts     # HTTP uniquement : validation, permissions, appel du service
├── inventory.service.ts        # règles métier, transactions
├── inventory.repository.ts     # requêtes Prisma complexes (verrous, agrégats)
├── dto/                        # schémas Zod (createZodDto) : validation + OpenAPI
└── inventory.service.spec.ts
```

**Règle :** un contrôleur ne contient aucune logique métier ; un service n'accède jamais à `req`/`res`.

### 3.3 Frontend — `veternity`

Les routes et composants actuels restent en place. On ajoute :

```
veternity/
├── proxy.ts                    # redirection vers /login si pas de cookie (vérification optimiste)
├── app/
│   ├── (auth)/                 # pages publiques, sans la navigation de l'app
│   │   ├── login/
│   │   ├── login/verification/         # saisie du code reçu par e-mail
│   │   ├── mot-de-passe-oublie/
│   │   ├── reinitialiser-mot-de-passe/ # ?token=
│   │   └── invitation/                 # ?token= : activation du compte
│   ├── (dashboard)/…           # existant, protégé
│   │   └── settings/
│   │       ├── securite/       # changer de mot de passe, appareils connectés
│   │       └── equipe/         # admin : inviter, rôles, désactiver
│   └── consultations/nouvelle/…   # existant
├── lib/
│   ├── api/
│   │   ├── schema.d.ts         # généré depuis l'OpenAPI de l'API (ne pas modifier à la main)
│   │   ├── client.ts           # fetch typé (openapi-fetch) : credentials, en-tête CSRF, 401/403
│   │   ├── query-client.ts
│   │   └── <domaine>.ts        # hooks TanStack Query par domaine (useClients, useStock…)
│   └── auth/
│       ├── session.ts          # getSession() côté serveur (appel /auth/me avec le cookie)
│       └── permissions.ts      # can(user, "inventory:write") pour l'affichage
└── components/auth/            # <RequirePermission>, formulaires d'authentification
```

**Migration des données de démo :** chaque fichier `_components/*-data.ts` est remplacé par un module `lib/api/<domaine>.ts`, un domaine à la fois ; l'interface ne change pas. Les données de démo actuelles deviennent le **seed** Prisma, pour qu'une base de dev ressemble à l'application d'aujourd'hui. Le store `inventory-store.ts` est remplacé par les invalidations de TanStack Query.

---

## 4. Environnement Docker

### 4.1 Développement

Seule l'**infrastructure** tourne dans Docker ; `web` et `api` tournent sur la machine (`pnpm dev`) pour garder un rechargement rapide.

| Service | Image | Ports | Rôle |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | 5432 | Base principale, volume nommé, healthcheck `pg_isready` |
| `redis` | `redis:7-alpine` | 6379 | Sessions, rate limiting, files BullMQ, cache ; `requirepass` + AOF |
| `mailpit` | `axllent/mailpit` | 1025 (SMTP), 8025 (interface web) | **Serveur mail de dev** : capture tous les mails, consultables sur http://localhost:8025 |
| `clamav` *(Phase 6)* | `clamav/clamav` | 3310 | Analyse antivirus des fichiers importés |

`docker-compose.test.yml` : Postgres sur `tmpfs` et Redis sur une base dédiée, recréés à chaque exécution des tests e2e.

### 4.2 Production (Phase 8)

- `Dockerfile.api` et `Dockerfile.web` multi-étapes, utilisateur non-root, image finale sans outils de build.
- `prisma migrate deploy` lancé comme tâche séparée avant le démarrage de l'API, jamais `migrate dev` en production.
- Volume dédié pour les fichiers (ou bucket S3/MinIO), sauvegardé.
- Mail : relais SMTP transactionnel (Brevo, Mailjet, Amazon SES…) avec SPF, DKIM et DMARC configurés sur le domaine.

### 4.3 Variables d'environnement (`.env.example`)

```
# Général
NODE_ENV=development
APP_URL=http://localhost:3000          # utilisé dans les liens des mails
API_PORT=4000

# Base de données
DATABASE_URL=postgresql://veternity:veternity@localhost:5432/veternity

# Redis
REDIS_URL=redis://:devpassword@localhost:6379

# Sessions
SESSION_SECRET=                         # 64 caractères aléatoires min. (signature des cookies)
SESSION_IDLE_MINUTES=480                # 8 h d'inactivité
SESSION_ABSOLUTE_HOURS=12

# Mail
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM="Veternity <no-reply@veternity.ma>"

# Fichiers
STORAGE_DRIVER=local
STORAGE_LOCAL_PATH=./data/uploads
UPLOAD_MAX_MB=10
```

L'API valide ces variables au démarrage (schéma Zod) et **refuse de démarrer** si l'une manque ou est invalide. Aucun secret n'est commité ; `.env` est dans `.gitignore`.

---

## 5. Conventions transverses

### 5.1 API REST

- Préfixe versionné : `/api/v1`.
- Ressources au pluriel, en anglais dans le code (`/clients`, `/animals`, `/stock/products`) ; libellés en français dans l'interface uniquement.
- Liste : `GET /resource?page=1&pageSize=20&sort=-date&q=...` → `{ items, total, page, pageSize }`.
- Erreurs au format RFC 9457 : `{ type, title, status, detail, errors? }`, avec des messages en français affichables tels quels.
- Documentation OpenAPI générée par `@nestjs/swagger`, exposée sur `/api/docs` **en développement uniquement**.
- Opérations sensibles (création de facture, de vente) : en-tête `Idempotency-Key` pour qu'un double clic ne crée jamais deux factures.

### 5.2 Règles métier qui passent côté serveur

| Règle (aujourd'hui côté client) | Côté serveur |
|---|---|
| Sortie de stock FEFO (le lot qui périme le plus tôt sort en premier) | Transaction : sélection des lots `FOR UPDATE`, décrément conditionnel (`quantity >= n`), écriture du mouvement |
| Stock jamais négatif | Contrainte `CHECK (quantity >= 0)` en base, en plus du contrôle applicatif |
| Rapprochement du stock d'une consultation modifiée | Même calcul par écart, dans la transaction de sauvegarde de la consultation |
| Numéros de facture continus | Table de compteurs par clinique et par année, verrouillée dans la transaction |
| Facture validée | **Immuable** ; une correction se fait par avoir |
| Intégration d'une facture OCR | Une seule transaction : lots, mouvements, achat, statut de la facture |

### 5.3 Git et qualité

- Une branche par phase ou par fonctionnalité dans chaque dépôt, avec des commits au format Conventional Commits (`feat(auth): …`).
- `main` protégée dans les deux dépôts :
  - **API** : lint, typecheck, tests unitaires et e2e, build, migrations Prisma à jour, `openapi.json` à jour ;
  - **frontend** : lint, typecheck (avec les types générés), build, tests Playwright.
- Un changement de contrat : PR API d'abord (nouveau `openapi.json`), puis PR frontend (`pnpm api:types`).
- Hooks `lint-staged` : ESLint et Prettier sur les fichiers modifiés.
- Chaque décision structurante fait l'objet d'un court ADR dans `docs/adr/`.

---

## Phase 0 — Fondations

**Objectif :** un squelette qui démarre, testé et outillé, avant la première ligne de métier.

### Étapes

1. **Commit du frontend actuel** sur `main` du dépôt `veternity`.
2. **Création du dépôt `veternity-api`** (`nest new`, pnpm), déplacement de `docs/` dans ce dépôt. Décider du sort de `animated-login/` (§18).
3. **Docker** : `docker-compose.yml` (postgres, redis, mailpit) et `docker-compose.test.yml`.
4. **Squelette Nest** (`veternity-api`) :
   - validation de l'environnement au démarrage ;
   - logs Pino avec `request-id` et masquage des champs sensibles (`password`, `token`, `code`, `cookie`, `authorization`) ;
   - `helmet`, `compression`, limite de taille des requêtes JSON (1 Mo) ;
   - filtre d'erreurs global (problem+json), sans pile d'appels hors développement ;
   - `@nestjs/throttler` adossé à Redis (limite globale par défaut) ;
   - `/health` via `@nestjs/terminus` (Postgres, Redis) ;
   - arrêt propre (fermeture des connexions Prisma, Redis et BullMQ).
5. **Prisma** : schéma initial **traduit de `database/SCHEMA.md`** (tables `clinics` et `users` au minimum, extensions `citext`, `pg_trgm`, `btree_gist`), première migration, `PrismaService`, script de seed.
6. **Infrastructure mail** : `MailModule` (nodemailer vers Mailpit), file BullMQ `mail` avec 5 tentatives et backoff exponentiel, gabarit de base React Email aux couleurs de Veternity.
7. **Contrat** : génération de `openapi.json` par l'API ; dans le frontend, script `pnpm api:types` (openapi-typescript) et client `lib/api/client.ts` (openapi-fetch).
8. **Rewrites Next** `/api/v1/*` → API.
9. **CI GitHub Actions, un workflow par dépôt** (§5.3). Côté API : services Postgres et Redis pour les tests e2e, et `prisma migrate diff` pour détecter un schéma non migré.

### Terminé quand

- [ ] `docker compose up -d` suivi de `pnpm dev` démarre web (3000) et api (4000).
- [ ] `GET /api/v1/health` renvoie `ok` avec Postgres et Redis joignables.
- [ ] Un mail de test envoyé par l'API apparaît dans Mailpit (http://localhost:8025).
- [ ] L'API refuse de démarrer si `DATABASE_URL` est absente.
- [ ] La CI passe sur une pull request.

---

## Phase 1 — Authentification, accès et utilisateurs

**Priorité absolue.** Aucun domaine métier n'est branché tant que cette phase n'est pas terminée : toutes les routes suivantes en dépendent.

### 1.1 Principes

- **Pas d'inscription publique.** Le premier compte administrateur est créé par le seed (ou par une commande CLI) ; tous les autres comptes arrivent **par invitation**. Un logiciel de clinique n'a pas vocation à être ouvert à n'importe qui.
- **Identifiant = adresse e-mail** (le mail est indispensable pour la vérification et la réinitialisation). Aujourd'hui l'écran demande un « nom d'utilisateur » : à changer (§18).
- **Mots de passe** hachés en **Argon2id** (19 Mio de mémoire, 2 itérations, parallélisme 1 — recommandations OWASP) ; 12 caractères minimum, sans règles de composition imposées, et refus des mots de passe trop courants (liste locale). L'écran actuel accepte 6 caractères : à corriger.
- **Messages neutres** : « E-mail ou mot de passe incorrect », jamais « utilisateur inconnu ». « Mot de passe oublié » répond toujours la même chose, que le compte existe ou non. Temps de réponse identique dans les deux cas (hachage factice si l'utilisateur n'existe pas).

### 1.2 Parcours

**a) Invitation et activation du compte**
1. L'administrateur invite `prenom@clinique.ma` en choisissant un rôle.
2. Mail « Rejoignez la clinique X sur Veternity » avec un lien `/invitation?token=…`, valable 72 h, à usage unique.
3. La personne choisit son mot de passe ; le compte est activé et l'e-mail considéré comme vérifié.

**b) Connexion avec vérification par e-mail**
1. `POST /auth/login` avec e-mail et mot de passe.
2. Si l'appareil est **reconnu** (cookie d'appareil de confiance valide) : session créée, accès direct.
3. Sinon : réponse `verification_required` ; un **code à 6 chiffres** est envoyé par mail (valable 10 min, 5 essais maximum, stocké haché dans Redis).
4. `POST /auth/login/verify` avec le code et l'option « Faire confiance à cet appareil pendant 30 jours ».
5. Mail d'alerte « Nouvelle connexion à votre compte » avec l'appareil, l'heure et l'IP approximative, et un lien pour sécuriser le compte si ce n'est pas vous.

> Réglage par clinique : vérification **à chaque connexion** ou **seulement sur un nouvel appareil** (recommandé pour des postes partagés utilisés toute la journée). Voir §18.

**c) Mot de passe oublié**
1. `POST /auth/password/forgot` → toujours `202 Accepted`.
2. Si le compte existe : mail avec un lien `/reinitialiser-mot-de-passe?token=…` (token aléatoire de 32 octets ; seul son hash SHA-256 est stocké ; valable 30 min ; usage unique ; une nouvelle demande invalide la précédente).
3. `POST /auth/password/reset` : nouveau mot de passe, **toutes les sessions sont révoquées**, les appareils de confiance oubliés, puis mail de confirmation « Votre mot de passe a été modifié ».

**d) Changement de mot de passe (connecté)**
Mot de passe actuel exigé ; les autres sessions sont révoquées ; mail de confirmation.

**e) Déconnexion**
Suppression de la session dans Redis et en base, et du cookie. Le bouton « Sign out » de la navigation est branché.

**f) Appareils connectés**
Page `/settings/securite` : liste des sessions actives (appareil, dernière activité), bouton « Déconnecter » par session et « Déconnecter tous les autres appareils ».

### 1.3 Protection contre les abus

| Menace | Contre-mesure |
|---|---|
| Force brute sur un compte | Compteur Redis par e-mail : après 5 échecs, blocage de 15 min, puis durée croissante ; mail au titulaire au premier blocage |
| Force brute distribuée | Limite par IP sur `/auth/*` (ex. 20 requêtes/min) via le throttler Redis |
| Devinette du code e-mail | 5 essais par code, puis le code est invalidé ; 3 renvois maximum par 15 min |
| Énumération des comptes | Réponses et temps de réponse identiques |
| CSRF | `SameSite=Lax`, vérification de l'en-tête `Origin` et jeton CSRF (double soumission) exigé sur toutes les requêtes qui modifient des données |
| Vol de session | Nouvel identifiant de session à chaque connexion (pas de fixation) ; expiration après 8 h d'inactivité et au plus tard 12 h après la connexion |
| XSS menant au vol du cookie | Cookie `HttpOnly` + Content-Security-Policy avec nonce côté Next |

### 1.4 Rôles et permissions

Contrôle d'accès par **permissions** : les rôles ne sont que des ensembles de permissions, et le code vérifie toujours une permission, jamais un nom de rôle.

| Permission | Admin | Vétérinaire | Assistant(e) | Accueil |
|---|:-:|:-:|:-:|:-:|
| `dashboard:view` | ✓ | ✓ | ✓ | ✓ |
| `clients:read` / `clients:write` | ✓/✓ | ✓/✓ | ✓/✓ | ✓/✓ |
| `animals:read` / `animals:write` | ✓/✓ | ✓/✓ | ✓/✓ | ✓/✓ |
| `appointments:read` / `appointments:write` | ✓/✓ | ✓/✓ | ✓/✓ | ✓/✓ |
| `consultations:read` | ✓ | ✓ | ✓ | — |
| `consultations:write` (diagnostic, actes) | ✓ | ✓ | — | — |
| `prescriptions:write` | ✓ | ✓ | — | — |
| `billing:read` / `billing:write` | ✓/✓ | ✓/✓ | ✓/✓ | ✓/✓ |
| `billing:discount` (remise, prix modifié) | ✓ | ✓ | — | — |
| `inventory:read` | ✓ | ✓ | ✓ | ✓ |
| `inventory:adjust` (ajustements manuels) | ✓ | ✓ | ✓ | — |
| `sales:write` (vente au comptoir) | ✓ | ✓ | ✓ | ✓ |
| `purchasing:write` (commandes, fournisseurs) | ✓ | ✓ | ✓ | — |
| `supplier-invoices:integrate` | ✓ | ✓ | ✓ | — |
| `users:manage`, `clinic:settings` | ✓ | — | — | — |
| `audit:read` | ✓ | — | — | — |

Côté API : `@RequirePermissions('inventory:adjust')` sur chaque route, vérifié par `PermissionsGuard`. Côté front : `can()` masque ce qui n'est pas autorisé et `proxy.ts` redirige les pages interdites (confort uniquement).

### 1.5 Journal d'audit

Table `AuditLog`, en ajout seul : connexions réussies et échouées, réinitialisations de mot de passe, invitations, changements de rôle, révocations, puis (phases suivantes) validations de factures, ajustements de stock, suppressions. Chaque ligne enregistre qui, quoi, sur quel objet, quand, l'IP et le user-agent, sans données sensibles. Consultable par l'administrateur.

### 1.6 Endpoints

```
POST   /api/v1/auth/login                    { email, password }
POST   /api/v1/auth/login/verify             { challengeId, code, trustDevice }
POST   /api/v1/auth/login/resend             { challengeId }
POST   /api/v1/auth/logout
GET    /api/v1/auth/me                       → utilisateur, clinique, permissions
GET    /api/v1/auth/csrf                     → jeton CSRF
POST   /api/v1/auth/password/forgot          { email }             → 202 dans tous les cas
POST   /api/v1/auth/password/reset           { token, password }
POST   /api/v1/auth/password/change          { currentPassword, password }
GET    /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/:id
DELETE /api/v1/auth/sessions                 (toutes sauf la session courante)
POST   /api/v1/auth/invitations/accept       { token, password }

GET    /api/v1/users                          users:manage
POST   /api/v1/users/invitations              users:manage   { email, role }
PATCH  /api/v1/users/:id                      users:manage   { role?, disabled? }
POST   /api/v1/users/:id/revoke-sessions      users:manage
```

### 1.7 Mails de la phase

| Gabarit | Déclencheur |
|---|---|
| `invitation` | Invitation d'un membre de l'équipe |
| `login-code` | Code de vérification à la connexion |
| `new-device-login` | Connexion depuis un nouvel appareil |
| `password-reset` | Mot de passe oublié |
| `password-changed` | Réinitialisation ou changement de mot de passe |
| `account-locked` | Blocage après trop d'échecs |

En français, en HTML avec une version texte, sans image distante obligatoire. Les liens sont construits à partir de `APP_URL`, jamais à partir de l'en-tête `Host` de la requête (prévention de l'empoisonnement des liens de réinitialisation).

### 1.8 Frontend

- `app/login` : champ e-mail, appel réel à l'API, messages neutres, état de chargement, lien « Mot de passe oublié ».
- Nouvelles pages : vérification du code (6 cases, collage du code accepté, renvoi avec compte à rebours), mot de passe oublié, réinitialisation (règles affichées pendant la saisie), acceptation d'invitation.
- `proxy.ts` : redirection vers `/login?next=…` sans cookie ; redirection d'un utilisateur déjà connecté hors des pages d'authentification. `next` n'accepte que des chemins internes (pas de redirection ouverte).
- Contexte de session (`/auth/me`) disponible dans toute l'application : nom et rôle réels dans l'en-tête à la place de « Dr. Kadiri ».
- Sur un 401 : retour à `/login` en conservant la page demandée ; sur un 403 : message « Accès non autorisé ».
- En-têtes de sécurité Next : CSP avec nonce, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors 'none'`.
- Pages `/settings/securite` et `/settings/equipe`.

### 1.9 Tests de la phase

- Unitaires : hachage et vérification, génération et expiration des tokens, calcul des blocages.
- E2E : chaque parcours de §1.2 (dont la lecture du mail dans Mailpit via son API), les tentatives de réutilisation d'un token, un token expiré, un code faux six fois, un accès sans permission (403), un accès sans session (401), une requête sans jeton CSRF (403).

### Terminé quand

- [ ] Toute l'application est inaccessible sans session, pages comme API.
- [ ] Les six parcours de §1.2 fonctionnent, et chaque mail arrive dans Mailpit.
- [ ] Un token de réinitialisation ne sert qu'une fois et expire au bout de 30 min.
- [ ] Après une réinitialisation, les autres sessions sont bien déconnectées.
- [ ] Une permission retirée prend effet sans reconnexion.
- [ ] Aucun mot de passe, token ou code n'apparaît dans les logs (vérifié par un test).
- [ ] Les tests e2e d'authentification passent en CI.

---

## Phase 2 — Référentiels : clinique, actes, clients, animaux

1. **Clinique** : nom, adresse, ICE/IF, logo (via Documents en Phase 6), fuseau horaire, réglage de la vérification par e-mail. Remplace le « Veternity » en dur dans les documents imprimés.
2. **Catalogue des actes** : aujourd'hui en dur dans `catalog.ts` (Consultation 200 DH, Vaccination 80 DH…). Il devient une table éditable par l'administrateur (prix, catégorie de produit liée, actif ou non). Une facture **fige** le prix au moment de l'acte, pour qu'un changement de tarif ne modifie pas les factures passées.
3. **Clients** : CRUD, recherche, pagination serveur, unicité e-mail et téléphone par clinique.
4. **Animaux** : individuels et troupeaux, lien avec le client, historique du poids.
5. **Front** : `clients` et `animaux` branchés sur l'API ; dialogs d'ajout et de modification connectés ; états de chargement, liste vide et erreur.

**Terminé quand :** les pages Clients et Animaux fonctionnent sur la base, avec pagination et recherche côté serveur, et le seed reproduit les données de démo actuelles.

---

## Phase 3 — Rendez-vous

- Modèle `Appointment` : vétérinaire, animal, motif, créneau, statut.
- Pas de chevauchement pour un même vétérinaire (contrainte d'exclusion Postgres sur la plage horaire, pas seulement une vérification applicative).
- Déplacement par glisser-déposer du calendrier via `PATCH`.
- *(Option)* Rappel de rendez-vous par mail la veille (file BullMQ différée).

**Terminé quand :** le calendrier et l'agenda lisent et écrivent en base, et deux rendez-vous qui se chevauchent pour le même vétérinaire sont refusés.

---

## Phase 4 — Consultations, ordonnances, facturation

C'est le parcours le plus sensible : il touche au dossier médical, au stock et à l'argent.

1. **Consultation** : brouillon, puis enregistrée, puis terminée ; constantes, motif, diagnostic, actes réalisés avec leur produit et leur quantité.
2. **Sortie de stock** : l'enregistrement de la consultation applique l'écart de consommation (§5.2) dans **la même transaction** ; une erreur annule tout.
3. **Ordonnance** : lignes (médicament, posologie, durée, quantité délivrée) ; les médicaments délivrés sortent du stock et sont facturés.
4. **Facture** :
   - lignes générées à partir des actes et des produits ; prix modifiables avec la permission `billing:discount`, l'écart avec le tarif étant tracé dans l'audit ;
   - numéro continu attribué **à la validation** (§5.2), puis facture immuable ;
   - paiements : mode, montant, date, avec gestion des paiements partiels ;
   - avoir pour corriger une facture validée.
5. **Vente produits** : une facture validée alimente les ventes de l'inventaire (comme le fait déjà le front).
6. **Impression** : l'impression navigateur actuelle est conservée ; génération PDF côté serveur (file BullMQ) pour **envoyer la facture ou l'ordonnance par mail** au client.
7. **Front** : le brouillon du parcours `consultations/nouvelle` est sauvegardé côté serveur, donc il n'est plus perdu au rechargement.

**Terminé quand :**
- [ ] Un parcours complet consultation → ordonnance → facture fonctionne sur la base.
- [ ] Revenir modifier une consultation ne décompte jamais le stock deux fois (test e2e).
- [ ] Deux validations simultanées ne produisent ni doublon ni trou dans la numérotation (test de concurrence).
- [ ] Une facture validée ne peut plus être modifiée par l'API.

---

## Phase 5 — Inventaire : stock, ventes, achats, fournisseurs

1. **Produits et lots** : catalogue, seuils, emplacements, lots avec date de péremption. La quantité d'un produit est la somme de ses lots, mise à jour dans la transaction.
2. **Mouvements** : journal en ajout seul (consultation, vente, achat, facture fournisseur, ajustement, péremption) ; c'est la source de vérité de l'historique.
3. **Ajustements** : permission `inventory:adjust`, motif obligatoire, audit.
4. **Ventes au comptoir** : transaction vente + sorties FEFO + paiement ; refus si le stock est insuffisant (sans aucune écriture partielle).
5. **Fournisseurs et commandes** : bon de commande, réception partielle ou totale, suggestion de réapprovisionnement (hors produits déjà en commande, comme dans le front actuel).
6. **Filtres et tris** du tableau de stock exécutés côté serveur, avec indicateurs (valeur, ruptures, péremptions) calculés en SQL.

**Terminé quand :** les 4 onglets de l'inventaire fonctionnent sur la base, 50 ventes simultanées sur le même produit ne rendent jamais le stock négatif (test de charge ciblé), et chaque changement de quantité a son mouvement.

---

## Phase 6 — Documents, Multer et factures fournisseurs (OCR)

### 6.1 Chaîne d'upload

```
Requête multipart
  → Multer (memoryStorage ; limites : 10 Mo par fichier, 10 fichiers, champs connus uniquement)
  → vérification du type réel par les « magic bytes » (bibliothèque file-type), pas seulement du mimetype annoncé
      liste blanche : application/pdf, image/jpeg, image/png, image/heic
  → analyse antivirus ClamAV (fichier refusé si infecté)
  → images : ré-encodage avec sharp (supprime les métadonnées EXIF, dont la géolocalisation) + vignette
  → SHA-256 (détection des doublons)
  → StorageAdapter.put(clinicId/année/mois/uuid.ext)   ← nom aléatoire, jamais le nom d'origine
  → ligne Document (nom d'origine, type, taille, hash, auteur, objet lié)
```

- Stockage **hors du dossier public**. Aucune URL directe : téléchargement via `GET /documents/:id/content` avec contrôle de permission et de clinique, en-têtes `Content-Disposition` et `X-Content-Type-Options: nosniff`.
- `StorageAdapter` : implémentation disque en dev ; S3/MinIO ajoutable sans toucher au métier.
- Usages : factures fournisseurs, photos d'animaux, pièces jointes de consultation (radios, analyses), logo de la clinique.

### 6.2 Factures fournisseurs et OCR

- L'upload crée une `SupplierInvoice` au statut « Analyse » et pousse une tâche dans la file BullMQ `ocr`.
- Interface `OcrProvider` : un **stub** reproduit d'abord la simulation actuelle ; un vrai moteur (Tesseract local, ou un service comme Google Document AI, AWS Textract, Mindee) se branche ensuite sans changer le reste. Le choix dépend de la sensibilité des données (§18).
- Rapprochement des lignes lues avec le catalogue : similarité de texte + historique des rapprochements déjà validés par la clinique (on apprend des corrections).
- Le front suit l'avancement par interrogation de l'API toutes les 2 s (des SSE sont possibles plus tard).
- « Intégrer au stock » : une transaction (§5.2) ; une facture déjà intégrée ne peut pas l'être une seconde fois.

**Terminé quand :** un PDF ou une photo importé depuis le front est stocké, analysé (stub), vérifié puis intégré ; un exécutable renommé en `.pdf` est refusé ; un utilisateur d'une autre clinique ne peut pas télécharger le document (test e2e).

---

## Phase 7 — Tableau de bord, alertes et tâches planifiées

- Agrégats du tableau de bord et des bilans (finances, stock, rendez-vous) en SQL, mis en cache dans Redis (TTL court, invalidé à l'écriture).
- Tâches planifiées BullMQ (répétables) :
  - chaque nuit : détection des stocks bas et des péremptions à 60 jours, puis alertes du tableau de bord et récapitulatif par mail à l'administrateur ;
  - chaque nuit : purge des tokens et sessions expirés ;
  - la veille : rappels de rendez-vous (si activés).
- Les alertes du tableau de bord (aujourd'hui `alerts-data.ts`) viennent de la base.

---

## Phase 8 — Durcissement et mise en production

- **Sauvegardes** Postgres : `pg_dump` quotidien chiffré, rétention de 30 jours, **test de restauration** documenté et effectué. Sauvegarde du stockage des fichiers.
- **Supervision** : logs centralisés, suivi des erreurs (Sentry), alerte si `/health` échoue.
- **Sécurité** : scan OWASP ZAP (baseline) sur l'environnement de préproduction, `pnpm audit` en CI, Dependabot/Renovate.
- **Performance** : index vérifiés avec `EXPLAIN` sur les listes principales ; pagination partout.
- **Déploiement** : images multi-étapes, migrations en tâche séparée, secrets hors du dépôt, HTTPS obligatoire (HSTS).
- **Données personnelles** : les données des clients (propriétaires) sont des données personnelles au sens de la loi 09-08 ; les obligations (déclaration à la CNDP, durées de conservation, droits d'accès) sont **à valider avec un juriste**. Côté technique : minimisation, journal d'accès, export et suppression possibles.

---

## 15. Modèle de données

Le modèle complet est dans **[`database/SCHEMA.md`](database/SCHEMA.md)**, qui fait référence :

- diagrammes par domaine (accès, référentiels, agenda, médical, facturation, stock et achats, documents et OCR, alertes) ;
- énumérations et cycles de vie des statuts ;
- 22 règles d'intégrité (R1 à R22), chacune avec son application en base, dans le service et son test ;
- service propriétaire de chaque table en écriture ;
- contraintes SQL hors Prisma et index ;
- correspondance avec les données de démo du frontend.

**Règle de travail :** toute évolution du modèle commence par ce document (diagramme + règles), dans la même pull request que la migration Prisma. Un écart entre `schema.prisma` et `SCHEMA.md` bloque la revue.

## 16. Checklist sécurité

Inspirée de l'OWASP ASVS (niveau 2), à cocher avant la mise en production.

**Authentification et sessions**
- [ ] Argon2id, 12 caractères minimum, liste de mots de passe courants refusée
- [ ] Cookie `__Host-`, `HttpOnly`, `Secure`, `SameSite=Lax` ; identifiant régénéré à la connexion
- [ ] Expiration d'inactivité et expiration absolue ; révocation instantanée
- [ ] Tokens (invitation, réinitialisation) aléatoires, hachés en base, à usage unique, courte durée
- [ ] Blocage progressif et limites de débit sur `/auth/*`
- [ ] Réponses neutres (pas d'énumération des comptes)

**Autorisation**
- [ ] Guard de session appliqué globalement (route publique = décorateur `@Public()` explicite)
- [ ] Permission vérifiée sur chaque route qui écrit
- [ ] Filtrage par `clinicId` systématique (extension Prisma) + tests d'accès croisé entre cliniques
- [ ] Aucun identifiant de ressource accepté sans vérifier son appartenance à la clinique

**Entrées et sorties**
- [ ] Validation Zod de tous les corps, paramètres et query strings ; champs inconnus refusés
- [ ] Requêtes Prisma paramétrées ; `$queryRaw` uniquement avec des paramètres liés
- [ ] Uploads : liste blanche par magic bytes, taille limitée, antivirus, noms aléatoires, hors du dossier public
- [ ] Erreurs sans pile d'appels ni détails SQL en production

**Transport et en-têtes**
- [ ] HTTPS + HSTS ; CSP avec nonce ; `X-Content-Type-Options` ; `Referrer-Policy` ; `frame-ancestors 'none'`
- [ ] Pas de CORS ouvert (même origine via le proxy Next)
- [ ] Protection CSRF sur toutes les requêtes qui modifient des données

**Secrets et exploitation**
- [ ] Aucun secret dans le dépôt ; environnement validé au démarrage
- [ ] Redis protégé par mot de passe et non exposé publiquement ; Postgres non exposé
- [ ] Logs sans données sensibles ; journal d'audit des actions critiques
- [ ] Dépendances auditées en CI ; sauvegardes testées

---

## 17. Stratégie de tests

| Niveau | Outil | Cible |
|---|---|---|
| Unitaire (API) | Jest | Services : FEFO, calcul d'écart de stock, numérotation, règles d'authentification |
| Intégration / e2e (API) | Jest + supertest + `docker-compose.test.yml` | Chaque endpoint : cas nominal, validation, 401, 403, accès entre cliniques |
| Concurrence | Scripts ciblés (requêtes parallèles) | Stock jamais négatif, numérotation sans doublon |
| E2E (web) | Playwright | Connexion avec code e-mail (lu via l'API Mailpit), consultation complète, vente, intégration OCR |
| Sécurité | OWASP ZAP baseline, `pnpm audit` | Avant chaque mise en production |

Objectif de couverture : 80 % sur les services métier de l'API (le chiffre global compte moins que la couverture des règles critiques).

---

## 18. Décisions à valider avant de commencer

| # | Question | Recommandation |
|---|---|---|
| 1 | Une seule clinique, ou plusieurs cliniques (SaaS) ? | Prévoir `clinicId` partout dès maintenant, même pour une seule clinique au départ |
| 2 | Identifiant de connexion : e-mail ou nom d'utilisateur (écran actuel) ? | **E-mail** (indispensable pour la vérification et la réinitialisation) |
| 3 | Code e-mail à chaque connexion, ou seulement sur un nouvel appareil ? | Nouvel appareil + appareil de confiance 30 jours, réglable par clinique |
| 4 | Sessions serveur ou JWT ? | **Sessions serveur Redis** (révocation immédiate) |
| 5 | ~~Monorepo ?~~ | **Tranché : deux dépôts séparés** (§2.1) |
| 6 | Que faire du dossier `animated-login/` ? | Le sortir du dépôt ou l'archiver s'il n'est plus utilisé |
| 7 | Hébergement cible (VPS avec Docker, cloud…) ? | Détermine le stockage (disque ou S3/MinIO) et le relais SMTP |
| 8 | Moteur OCR réel (local ou service externe) ? | Stub d'abord ; le choix dépend de l'acceptation d'envoyer des factures à un tiers |
| 9 | Mentions légales des factures (ICE, IF, RC, TVA) ? | À valider avec le comptable avant la Phase 4 |
| 10 | Rôles : les 4 proposés (Admin, Vétérinaire, Assistant·e, Accueil) conviennent-ils ? | Ajuster la matrice §1.4 avant la Phase 1 |

---

## Ordre de travail résumé

| Phase | Contenu | Taille | Dépend de |
|---|---|---|---|
| 0 | Dépôt API, Docker (Postgres, Redis, Mailpit), squelette Nest, Prisma, contrat OpenAPI, CI | M | — |
| **1** | **Authentification, vérification e-mail, mot de passe oublié, invitations, rôles, audit** | **L** | 0 |
| 2 | Clinique, catalogue des actes, clients, animaux | M | 1 |
| 3 | Rendez-vous | S | 2 |
| 4 | Consultations, ordonnances, facturation | L | 2 (et 5.1 pour le stock) |
| 5 | Inventaire, ventes, achats, fournisseurs | L | 2 |
| 6 | Documents (Multer), factures fournisseurs, OCR | M | 5 |
| 7 | Tableau de bord, alertes, tâches planifiées | M | 4, 5 |
| 8 | Durcissement, sauvegardes, déploiement | M | tout |

> Les produits et les lots (5.1) sont nécessaires à la sortie de stock des consultations : en pratique, on fait 5.1 et 5.2 juste avant la Phase 4, puis le reste de la Phase 5.
