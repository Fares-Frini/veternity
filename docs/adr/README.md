# Décisions d'architecture (ADR)

Un fichier par décision structurante, numéroté (`0001-...md`, `0002-...md`), écrit quand la décision est prise — pas rétroactivement pour tout ce qui est déjà dans `PLAN-BACKEND.md`.

Ce dossier est partagé entre les deux dépôts (`veternity` et `veternity-api`, tous deux co-localisés dans `vet/`, voir `../STATUS.md`) : une décision d'architecture concerne rarement un seul des deux.

Utiliser un ADR quand une décision :
- s'écarte de ce que `PLAN-BACKEND.md` ou `database/SCHEMA.md` documentaient jusque-là (comme le remplacement de `citext` par une normalisation en minuscule + index fonctionnel, ou le passage à un adaptateur de connexion Prisma 7 — voir `database/SCHEMA.md` §1 et `PLAN-BACKEND.md` respectivement pour ces deux cas, documentés sur place car mineurs ; un vrai ADR aurait été le bon endroit si ça avait été plus structurant) ;
- a été débattue entre plusieurs options réelles, pas juste appliquée depuis le plan.

Modèle court : Contexte / Décision / Conséquences.
