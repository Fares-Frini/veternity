# Veternity — État d'avancement

> **Ce fichier est le point d'entrée du projet.** Il est écrit pour être lu sans aucun historique de conversation — nouvelle session Claude, autre machine, autre personne. Ne rien supposer de connu qui ne soit pas ici ou dans les documents qu'il référence.

---

## Comment reprendre le travail (à chaque session)

1. **Lire ce fichier en entier**, en particulier « Où en est le projet » et « Prochaine étape ».
2. Lire la phase en cours dans [`PLAN-BACKEND.md`](PLAN-BACKEND.md) (le sommaire renvoie directement à la bonne section).
3. Si le travail touche la base de données : lire [`database/SCHEMA.md`](database/SCHEMA.md) **avant** d'écrire le moindre modèle Prisma, migration ou service. C'est la référence ; un écart entre le code et ce document est un bug.
4. Vérifier `git log --oneline -10` et `git status` dans le(s) dépôt(s) concernés pour confirmer que l'état réel correspond à ce que ce fichier décrit — s'il y a un écart, corriger ce fichier en premier.
5. Reprendre à la section « Prochaine étape ».

**Avant de terminer une session** (quel que soit ce qui a été fait) : mettre à jour « Où en est le projet », déplacer ce qui est terminé dans le « Journal », et réécrire « Prochaine étape » avec ce qui reste. Un travail non noté ici est un travail que la prochaine session refera ou oubliera — c'est la seule règle qui compte dans ce document.

---

## Où en est le projet

| | |
|---|---|
| Phase en cours | **Phase 0 — Fondations** (voir `PLAN-BACKEND.md`) |
| Dépôt frontend | `veternity/` (ce dépôt Git, racine `vet/`), branche `main`, à jour |
| Dépôt API | **Pas encore créé** (`veternity-api`, séparé — pas de monorepo, décision actée) |
| Infrastructure Docker | Pas encore créée |
| Base de données | N'existe pas encore |
| Planification | Terminée : `PLAN-BACKEND.md` (phases 0 à 8) et `database/SCHEMA.md` (modèle complet) écrits et validés dans leurs grandes lignes |

---

## Prochaine étape

**Phase 0, étape 2 : créer le dépôt `veternity-api`.**

Ce que ça veut dire concrètement (voir `PLAN-BACKEND.md` §3.2 pour l'arborescence cible) :

1. Créer le dépôt `veternity-api` (nouveau dossier + `git init`, ou nouveau dépôt GitHub — à confirmer avec l'utilisateur si un dépôt distant est voulu dès maintenant).
2. `nest new` (ou squelette manuel) avec la structure de `src/` décrite en §3.2 : `config/`, `common/`, `infrastructure/`, `modules/`.
3. Déplacer `docs/PLAN-BACKEND.md`, `docs/database/SCHEMA.md` et ce fichier `docs/STATUS.md` dans ce nouveau dépôt (l'API est propriétaire de la documentation technique, cf. §2.1 du plan). **Ne pas les dupliquer** : une seule copie doit faire foi. Laisser éventuellement un pointeur dans `veternity/README.md` vers le nouveau dépôt.
4. `docker-compose.yml` (Postgres 16, Redis 7, Mailpit) + `docker-compose.test.yml`.
5. `.env.example` avec les variables listées en §4.3 du plan.
6. Schéma Prisma initial traduit de `database/SCHEMA.md` section 3 (tables `clinics`, `users` au minimum, extensions `citext`/`pg_trgm`/`btree_gist`), première migration.
7. Bootstrap Nest minimal : validation d'environnement au démarrage, Pino, helmet, `/health`.

**Ne pas commencer l'implémentation de l'authentification (Phase 1) avant que la checklist « Terminé quand » de la Phase 0 soit cochée** (`PLAN-BACKEND.md`, fin de la section Phase 0).

---

## Décisions actées (ne plus rediscuter)

| # | Décision | Où c'est écrit |
|---|---|---|
| 1 | **Pas de monorepo.** Deux dépôts séparés : `veternity` (front, existant) et `veternity-api` (API, à créer). Contrat entre les deux via OpenAPI généré par l'API → types générés côté front (`openapi-typescript`) | `PLAN-BACKEND.md` §2.1, §3.1 |
| 2 | Sessions serveur dans Redis, pas de JWT (révocation immédiate) | `PLAN-BACKEND.md` §2.2 |
| 3 | Même origine via les rewrites Next vers l'API (pas de CORS ouvert) | `PLAN-BACKEND.md` §2.3 |
| 4 | Autorisation vérifiée côté API (guards), `proxy.ts` = vérification optimiste uniquement | `PLAN-BACKEND.md` §2.4 |
| 5 | Pas de table « ventes » séparée : toute vente est une facture (`invoices`, origine `CONSULTATION` ou `COUNTER`) | `database/SCHEMA.md` §2 |
| 6 | Mails via Mailpit en dev (capturés sur `localhost:8025`), relais SMTP transactionnel en prod | `PLAN-BACKEND.md` §2.6, §4.1 |
| 7 | Fichiers reçus par Multer, jamais servis directement (téléchargement contrôlé par permission), stockage interchangeable via `StorageAdapter` | `PLAN-BACKEND.md` §6.1 |
| 8 | Le sous-module `animated-login/` (vide sur disque) a été retiré du dépôt au commit `27ce222` | `git log` |

## Décisions encore ouvertes

Reprises de `PLAN-BACKEND.md` §18 — celles qui restent, avec la recommandation par défaut appliquée dans les diagrammes tant qu'elles ne sont pas tranchées autrement.

| # | Question | Recommandation appliquée par défaut |
|---|---|---|
| 1 | Une seule clinique, ou plusieurs (SaaS) ? | `clinic_id` sur toutes les tables métier (coût faible maintenant, cher à ajouter après) |
| 2 | Connexion par e-mail ou nom d'utilisateur ? | **E-mail** (nécessaire pour la vérification et la réinitialisation par mail) |
| 3 | Code de vérification à chaque connexion, ou seulement sur un nouvel appareil ? | Nouvel appareil, avec un appareil de confiance valable 30 jours ; réglable par clinique |
| 4 | Emplacement/nom exact du dépôt `veternity-api` (organisation GitHub, visibilité) ? | À confirmer avant l'étape 2 ci-dessus si un dépôt distant est voulu tout de suite |
| 5 | Rôles : Admin / Vétérinaire / Assistant·e / Accueil conviennent-ils tels quels ? | Matrice de permissions en l'état dans `PLAN-BACKEND.md` §1.4 |
| 6 | Moteur OCR réel (local ou service tiers) ? | Stub d'abord (Phase 6), décision reportée — dépend de l'acceptation d'envoyer des factures à un tiers |
| 7 | Mentions légales exactes des factures (ICE, IF, RC, TVA) ? | À valider avec un comptable avant la Phase 4 |
| 8 | Hébergement cible en production ? | Détermine le choix du stockage de fichiers (disque vs S3/MinIO) et du relais SMTP — Phase 8 |

Si une réponse arrive dans une session future, la noter ici comme actée **et** mettre à jour les diagrammes/plan concernés dans le même geste.

---

## Journal (plus récent en premier)

### 2026-09-24 — Checkpoint avant le backend
- Commit `27ce222` : tout le travail frontend en attente (refonte du parcours de consultation en mise en page à trois colonnes, module Inventaire complet — stock/lots/FEFO, ventes-achats, fournisseurs, OCR simulé des factures fournisseurs —, documents imprimables facture/ordonnance, dialog de détail sur la liste des consultations). Retrait du sous-module `animated-login` (vide sur disque).
- Rédaction de `docs/PLAN-BACKEND.md` : plan complet par phases (0 à 8), conventions, checklist sécurité, stratégie de tests.
- Rédaction de `docs/database/SCHEMA.md` : 35 tables, 9 diagrammes Mermaid (vérifiés au rendu), 22 règles d'intégrité (R1–R22) avec leur application en base/service/test, cycles de vie des statuts, correspondance avec les données de démo du frontend.
- Décision actée : pas de monorepo, deux dépôts séparés.
- Création de ce fichier `docs/STATUS.md`.

---

## Où sont les choses

| Quoi | Où |
|---|---|
| Plan détaillé par phase, conventions, sécurité, tests | [`PLAN-BACKEND.md`](PLAN-BACKEND.md) |
| Modèle de données de référence (diagrammes, règles, statuts) | [`database/SCHEMA.md`](database/SCHEMA.md) |
| Frontend actuel | `veternity/` — Next.js 16, données de démo en mémoire dans `app/**/_components/*-data.ts` (deviendront le seed Prisma, cf. `SCHEMA.md` §15) |
| Décisions d'architecture détaillées (une par sujet, à créer au fil de l'eau) | `docs/adr/` — dossier prévu, pas encore peuplé ; démarre avec la création de `veternity-api` |
