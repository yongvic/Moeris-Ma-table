---
baseline_commit: NO_VCS
---

# Story 1.1: Scaffold Next.js monolithe + tokens Citrus

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a équipe Moeris,
I want une application web Ma table initialisée (Next.js App Router monolithe, shells Client/BO, design tokens Citrus),
so that on peut déployer et construire le fil séjour sur une base conforme à l’architecture et à l’identité visuelle.

## Acceptance Criteria

1. **Given** un repo greenfield  
   **When** on initialise via `create-next-app` (Next.js **16.2.x**, React 19, TypeScript, Tailwind 4) selon la spine  
   **Then** la structure `app/(client)`, `app/(bo)`, `domain/`, `infra/` existe

2. **And** les tokens Citrus (couleurs, typo Fredoka/Nunito Sans, spacing, rounded, focus-ring) sont disponibles en CSS/Tailwind

3. **And** une route client minimale et une route BO minimale répondent sans erreur

4. **And** le texte sur accent utilise `ink-primary` (jamais blanc) — démontré sur un bouton/échantillon CTA primaire

## Tasks / Subtasks

- [x] T1. Initialiser Next.js au pin spine (AC: #1)
  - [x] Exécuter `create-next-app@16.2.11` (App Router, TypeScript, Tailwind, ESLint, alias `@/*`, **pas** de `src/`)
  - [x] Préserver les dossiers existants `_bmad/`, `_bmad-output/`, `.agents/`, `docs/`
  - [x] Vérifier `next@16.2.11`, React 19.x, TypeScript 5.x, Tailwind 4.x dans `package.json`
  - [x] Runtime Node (pas Edge) pour le futur Prisma — ne pas forcer `runtime = 'edge'`

- [x] T2. Poser la structure monolithe (AC: #1)
  - [x] Créer `app/(client)/` + page minimale FR
  - [x] Créer `app/(bo)/` + page minimale FR
  - [x] Créer stubs `domain/` et `infra/` (README ou `.gitkeep`)
  - [x] Réserver `app/api/auth/[...nextauth]/` (placeholder commenté ou stub — **ne pas** brancher Auth.js)
  - [x] Optionnel : stub `prisma/` vide — **aucune** migration / modèle métier

- [x] T3. Brancher les tokens Citrus (AC: #2, #4)
  - [x] Définir toutes les CSS variables listées dans Dev Notes (colors, typo scale, spacing, rounded, elevation.soft, focus-ring)
  - [x] Charger Fredoka + Nunito Sans avec `font-display: swap` + fallback système
  - [x] Mapper les tokens dans Tailwind 4 (`@theme` / theme CSS)
  - [x] Light mode only — aucun token dark
  - [x] Démo visuelle : bouton primaire `accent` + texte `ink-primary` (jamais blanc)

- [x] T4. Shells minimaux + smoke (AC: #3, #4)
  - [x] Route client (ex. `/(client)` ou `/(client)/page`) répond 200
  - [x] Route BO (ex. `/(bo)` ou `/(bo)/page`) répond 200
  - [x] Layout root applique `surface-base` + polices
  - [x] Focus-ring global utilisable (outline 2px + offset 2px sur interactifs de démo)
  - [x] `npm run build` (ou équivalent) OK

- [x] T5. Garde-fous anti-scope
  - [x] Aucun Prisma/Neon/Auth Credentials/Pusher/Blob/Sheets
  - [x] Aucun composant UX métier (`card-accueil`, menu, commande, etc.)
  - [x] `(client)` n’importe jamais `(bo)`

## Dev Notes

### Contexte epic

Epic 1 = Fondation & entrée à table. Story 1.1 = **socle technique uniquement**. Stories 1.2+ ajoutent Session/QR, Accueil, reprise, barre progression, print.

### Stack pins (obligatoire)

| Package | Version |
| --- | --- |
| Next.js (`create-next-app`) | **16.2.11** |
| React | **19.x** (bundle Next 16) |
| TypeScript | **5.x** (ne pas forcer TS 7) |
| Tailwind CSS | **4.x** |
| Hosting cible | Vercel |

**Ne pas installer en 1.1** (stories ultérieures) : Prisma 7.9.0, Neon adapter, `next-auth@5.0.0-beta.32`, Blob, Pusher, Sheets.

### Commande CNA recommandée

Repo déjà non vide (`_bmad*`, `docs`, `.agents`). Si `create-next-app .` refuse le dossier :

1. Scaffold dans un sous-dossier temporaire (`ma-table-tmp`), **ou**
2. `npx create-next-app@16.2.11 ma-table --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack --yes --disable-git` puis **remonter** `app/`, `package.json`, configs à la racine du workspace `Moeris`, en **préservant** `_bmad*` / `.agents` / `docs`.

Flags clés : App Router, **pas** `--src-dir`, TypeScript, Tailwind, alias `@/*`.

Réf. CLI : [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) (docs Next 16.2.11).

### Structure cible (Structural Seed)

```text
Moeris/   # racine workspace (= app monolithe)
  app/
    (client)/          # parcours QR — page stub OK
    (bo)/              # shell salle — page stub OK
    api/auth/[...nextauth]/  # réservé Auth.js — stub only
    layout.tsx
    globals.css
  domain/              # vide / README — use-cases futurs
  infra/               # vide / README — prisma, blob, etc. plus tard
  prisma/              # optionnel vide — PAS de schema métier
  package.json
```

### Architecture — règles à respecter dès 1.1

- **AD-1** : un seul app Next.js ; Client + BO = route groups, pas deux déploiements
- **AD-2** : `app/(client)|app/(bo)` → `domain/` → `infra/` ; `(client)` n’importe jamais `(bo)`
- **AD-4** : mutations métier futures = Server Actions dans `domain/` ; `/api` réservé Auth.js (+ webhooks)
- **AD-6** : réserver le chemin Auth ; **ne pas** brancher Credentials / comptes staff
- **AD-17** : shells responsive-ready (pas de layout mobile-only figé) ; BO = un shell (zones Menu|Commandes|Service peuvent être absentes en 1.1)

Conventions : code/fichiers/enums **EN** ; copy UI **FR** ; erreurs Server Actions futures `{ ok:false, code, message }`.

### Tokens Citrus — map obligatoire

**Colors**

| Token | Hex |
| --- | --- |
| `surface-base` | `#FFFEF8` |
| `surface-raised` | `#F5E9B8` |
| `ink-primary` | `#1A1A00` |
| `ink-secondary` | `#6B6B3A` |
| `accent` | `#E8C200` |
| `accent-soft` | `#FFF3A8` |
| `border` | `#E8E0B8` |
| `pattern-a` | `#FFE500` |
| `pattern-b` | `#FF8A00` |
| `focus-ring` | `#1A1A00` |

**Typo** — Fredoka : display 28/34 w600, title 22/28 w600, subtitle 17/24 w500. Nunito Sans : body 16/24 w400, body-sm 14/20 w400, meta 12/16 w600 + letter-spacing 0.02em, button-label 16/20 w700.

**Spacing** — 1→4px … 7→48px ; gutter 16 ; margin-mobile 20 ; section-gap 32 ; **tap-target-min 44**.

**Rounded** — sm 8, md 16 (DEFAULT), lg 24, full 9999.

**Elevation soft** — `0 2px 12px rgba(26, 26, 0, 0.10)` (usage futur : `card-menu-item` / `button-secondary` seulement).

**Focus** — `outline: 2px solid var(--color-focus-ring); outline-offset: 2px`.

**Règle dure a11y** : texte sur `accent` = `ink-primary`, **jamais blanc** (~10:1). Light mode only V1.

### Hors scope strict (ne pas faire)

- Neon / Prisma models / Session cookie / QR `tableId`
- Auth.js Credentials, upload Blob, Pusher, Sheets
- Composants UX-DR4/DR5, Accueil réel, barre progression, Carte print
- CI/CD pipeline, PWA, dark mode, shadcn (non demandé)
- Installer Prisma/Auth « pour plus tard » dans `package.json` sans besoin AC

### Testing

- Smoke manuel : `next dev` → ouvrir route client + route BO → 200, tokens visibles, CTA accent/ink-primary
- `next build` sans erreur
- Pas d’exigence e2e/unit en 1.1

### NFR soft à garder en tête (pas bloquant AC)

- Premier écran utile &lt; ~3 s (NFR1) — polices `swap`, pages légères
- `prefers-reduced-motion` pourra être formalisé en 1.3 ; si trivial, un `@media (prefers-reduced-motion: reduce)` global est bienvenu

### Project Structure Notes

- Greenfield : **aucun** `package.json` / `app/` aujourd’hui — tout est NEW
- Conflit possible CNA vs dossier non vide → stratégie merge documentée ci-dessus
- Ne pas déplacer `_bmad-output` sous `app/`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.1]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` — AD-1, AD-2, Stack, Structural Seed]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` — Colors, Typography, Spacing, Elevation, a11y accent]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — Foundation multi-support]
- [Source: `_bmad-output/specs/spec-moeris/SPEC.md` — Constraints plateforme + Citrus]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-07-24.md` — soft NFR1 / motion]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- Scaffold via `create-next-app@16.2.11` dans `ma-table-tmp/` puis remontée à la racine (dossier non vide).
- Smoke HTTP : `GET /` → 200, `GET /bo` → 200 ; CTA `bg-accent` + `text-ink-primary` présent sur les deux shells.
- `npm run build` OK (Next.js 16.2.11 / Turbopack) ; `npm run lint` OK après ignore `.agents`/`_bmad*`.

### Completion Notes List

- Monolithe Next.js initialisé : `next@16.2.11`, React 19.2.4, TypeScript 5.x, Tailwind 4.x ; pas de `src/`.
- Route groups : client `/` (`app/(client)/page.tsx`), BO `/bo` (`app/(bo)/bo/page.tsx`) — copy FR, CTA Citrus a11y.
- Tokens Citrus en CSS variables + `@theme inline` ; Fredoka + Nunito Sans (`display: swap`) ; light mode only ; focus-ring global ; `prefers-reduced-motion` soft.
- Stubs `domain/`, `infra/`, `prisma/` (README) ; Auth.js réservé via stub 501 sur `/api/auth/[...nextauth]` sans `next-auth` installé.
- Hors scope respecté : aucune dépendance Prisma/Neon/Auth/Pusher/Blob/Sheets.

### File List

- package.json
- package-lock.json
- tsconfig.json
- next.config.ts
- next-env.d.ts
- postcss.config.mjs
- eslint.config.mjs
- .gitignore
- README.md
- AGENTS.md
- CLAUDE.md
- app/layout.tsx
- app/globals.css
- app/favicon.ico
- app/(client)/page.tsx
- app/(bo)/bo/page.tsx
- app/api/auth/[...nextauth]/route.ts
- domain/README.md
- infra/README.md
- prisma/README.md
- public/ (assets CNA)

### Change Log

- 2026-07-24 — Story 1.1 implémentée : scaffold Next.js monolithe + tokens Citrus + shells Client/BO → status `review`
