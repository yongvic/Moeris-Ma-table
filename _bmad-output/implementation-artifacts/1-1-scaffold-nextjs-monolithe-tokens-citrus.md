---
baseline_commit: NO_VCS
---

# Story 1.1: Scaffold Next.js monolithe + tokens Citrus

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Ã©quipe Moeris,
I want une application web Ma table initialisÃ©e (Next.js App Router monolithe, shells Client/BO, design tokens Citrus),
so that on peut dÃ©ployer et construire le fil sÃ©jour sur une base conforme Ã  lâ€™architecture et Ã  lâ€™identitÃ© visuelle.

## Acceptance Criteria

1. **Given** un repo greenfield  
   **When** on initialise via `create-next-app` (Next.js **16.2.x**, React 19, TypeScript, Tailwind 4) selon la spine  
   **Then** la structure `app/(client)`, `app/(bo)`, `domain/`, `infra/` existe

2. **And** les tokens Citrus (couleurs, typo Fredoka/Nunito Sans, spacing, rounded, focus-ring) sont disponibles en CSS/Tailwind

3. **And** une route client minimale et une route BO minimale rÃ©pondent sans erreur

4. **And** le texte sur accent utilise `ink-primary` (jamais blanc) â€” dÃ©montrÃ© sur un bouton/Ã©chantillon CTA primaire

## Tasks / Subtasks

- [x] T1. Initialiser Next.js au pin spine (AC: #1)
  - [x] ExÃ©cuter `create-next-app@16.2.11` (App Router, TypeScript, Tailwind, ESLint, alias `@/*`, **pas** de `src/`)
  - [x] PrÃ©server les dossiers existants `_bmad/`, `_bmad-output/`, `.agents/`, `docs/`
  - [x] VÃ©rifier `next@16.2.11`, React 19.x, TypeScript 5.x, Tailwind 4.x dans `package.json`
  - [x] Runtime Node (pas Edge) pour le futur Prisma â€” ne pas forcer `runtime = 'edge'`

- [x] T2. Poser la structure monolithe (AC: #1)
  - [x] CrÃ©er `app/(client)/` + page minimale FR
  - [x] CrÃ©er `app/(bo)/` + page minimale FR
  - [x] CrÃ©er stubs `domain/` et `infra/` (README ou `.gitkeep`)
  - [x] RÃ©server `app/api/auth/[...nextauth]/` (placeholder commentÃ© ou stub â€” **ne pas** brancher Auth.js)
  - [x] Optionnel : stub `prisma/` vide â€” **aucune** migration / modÃ¨le mÃ©tier

- [x] T3. Brancher les tokens Citrus (AC: #2, #4)
  - [x] DÃ©finir toutes les CSS variables listÃ©es dans Dev Notes (colors, typo scale, spacing, rounded, elevation.soft, focus-ring)
  - [x] Charger Fredoka + Nunito Sans avec `font-display: swap` + fallback systÃ¨me
  - [x] Mapper les tokens dans Tailwind 4 (`@theme` / theme CSS)
  - [x] Light mode only â€” aucun token dark
  - [x] DÃ©mo visuelle : bouton primaire `accent` + texte `ink-primary` (jamais blanc)

- [x] T4. Shells minimaux + smoke (AC: #3, #4)
  - [x] Route client (ex. `/(client)` ou `/(client)/page`) rÃ©pond 200
  - [x] Route BO (ex. `/(bo)` ou `/(bo)/page`) rÃ©pond 200
  - [x] Layout root applique `surface-base` + polices
  - [x] Focus-ring global utilisable (outline 2px + offset 2px sur interactifs de dÃ©mo)
  - [x] `npm run build` (ou Ã©quivalent) OK

- [x] T5. Garde-fous anti-scope
  - [x] Aucun Prisma/Neon/Auth Credentials/Pusher/Blob/Sheets
  - [x] Aucun composant UX mÃ©tier (`card-accueil`, menu, commande, etc.)
  - [x] `(client)` nâ€™importe jamais `(bo)`

## Dev Notes

### Contexte epic

Epic 1 = Fondation & entrÃ©e Ã  table. Story 1.1 = **socle technique uniquement**. Stories 1.2+ ajoutent Session/QR, Accueil, reprise, barre progression, print.

### Stack pins (obligatoire)

| Package | Version |
| --- | --- |
| Next.js (`create-next-app`) | **16.2.11** |
| React | **19.x** (bundle Next 16) |
| TypeScript | **5.x** (ne pas forcer TS 7) |
| Tailwind CSS | **4.x** |
| Hosting cible | Vercel |

**Ne pas installer en 1.1** (stories ultÃ©rieures) : Prisma 7.9.0, Neon adapter, `next-auth@5.0.0-beta.32`, Blob, Pusher, Sheets.

### Commande CNA recommandÃ©e

Repo dÃ©jÃ  non vide (`_bmad*`, `docs`, `.agents`). Si `create-next-app .` refuse le dossier :

1. Scaffold dans un sous-dossier temporaire (`ma-table-tmp`), **ou**
2. `npx create-next-app@16.2.11 ma-table --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --turbopack --yes --disable-git` puis **remonter** `app/`, `package.json`, configs Ã  la racine du workspace `Moeris`, en **prÃ©servant** `_bmad*` / `.agents` / `docs`.

Flags clÃ©s : App Router, **pas** `--src-dir`, TypeScript, Tailwind, alias `@/*`.

RÃ©f. CLI : [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) (docs Next 16.2.11).

### Structure cible (Structural Seed)

```text
Moeris/   # racine workspace (= app monolithe)
  app/
    (client)/          # parcours QR â€” page stub OK
    (bo)/              # shell salle â€” page stub OK
    api/auth/[...nextauth]/  # rÃ©servÃ© Auth.js â€” stub only
    layout.tsx
    globals.css
  domain/              # vide / README â€” use-cases futurs
  infra/               # vide / README â€” prisma, blob, etc. plus tard
  prisma/              # optionnel vide â€” PAS de schema mÃ©tier
  package.json
```

### Architecture â€” rÃ¨gles Ã  respecter dÃ¨s 1.1

- **AD-1** : un seul app Next.js ; Client + BO = route groups, pas deux dÃ©ploiements
- **AD-2** : `app/(client)|app/(bo)` â†’ `domain/` â†’ `infra/` ; `(client)` nâ€™importe jamais `(bo)`
- **AD-4** : mutations mÃ©tier futures = Server Actions dans `domain/` ; `/api` rÃ©servÃ© Auth.js (+ webhooks)
- **AD-6** : rÃ©server le chemin Auth ; **ne pas** brancher Credentials / comptes staff
- **AD-17** : shells responsive-ready (pas de layout mobile-only figÃ©) ; BO = un shell (zones Menu|Commandes|Service peuvent Ãªtre absentes en 1.1)

Conventions : code/fichiers/enums **EN** ; copy UI **FR** ; erreurs Server Actions futures `{ ok:false, code, message }`.

### Tokens Citrus â€” map obligatoire

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

**Typo** â€” Fredoka : display 28/34 w600, title 22/28 w600, subtitle 17/24 w500. Nunito Sans : body 16/24 w400, body-sm 14/20 w400, meta 12/16 w600 + letter-spacing 0.02em, button-label 16/20 w700.

**Spacing** â€” 1â†’4px â€¦ 7â†’48px ; gutter 16 ; margin-mobile 20 ; section-gap 32 ; **tap-target-min 44**.

**Rounded** â€” sm 8, md 16 (DEFAULT), lg 24, full 9999.

**Elevation soft** â€” `0 2px 12px rgba(26, 26, 0, 0.10)` (usage futur : `card-menu-item` / `button-secondary` seulement).

**Focus** â€” `outline: 2px solid var(--color-focus-ring); outline-offset: 2px`.

**RÃ¨gle dure a11y** : texte sur `accent` = `ink-primary`, **jamais blanc** (~10:1). Light mode only V1.

### Hors scope strict (ne pas faire)

- Neon / Prisma models / Session cookie / QR `tableId`
- Auth.js Credentials, upload Blob, Pusher, Sheets
- Composants UX-DR4/DR5, Accueil rÃ©el, barre progression, Carte print
- CI/CD pipeline, PWA, dark mode, shadcn (non demandÃ©)
- Installer Prisma/Auth Â« pour plus tard Â» dans `package.json` sans besoin AC

### Testing

- Smoke manuel : `next dev` â†’ ouvrir route client + route BO â†’ 200, tokens visibles, CTA accent/ink-primary
- `next build` sans erreur
- Pas dâ€™exigence e2e/unit en 1.1

### NFR soft Ã  garder en tÃªte (pas bloquant AC)

- Premier Ã©cran utile &lt; ~3 s (NFR1) â€” polices `swap`, pages lÃ©gÃ¨res
- `prefers-reduced-motion` pourra Ãªtre formalisÃ© en 1.3 ; si trivial, un `@media (prefers-reduced-motion: reduce)` global est bienvenu

### Project Structure Notes

- Greenfield : **aucun** `package.json` / `app/` aujourdâ€™hui â€” tout est NEW
- Conflit possible CNA vs dossier non vide â†’ stratÃ©gie merge documentÃ©e ci-dessus
- Ne pas dÃ©placer `_bmad-output` sous `app/`

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 1.1]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` â€” AD-1, AD-2, Stack, Structural Seed]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` â€” Colors, Typography, Spacing, Elevation, a11y accent]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” Foundation multi-support]
- [Source: `_bmad-output/specs/spec-moeris/SPEC.md` â€” Constraints plateforme + Citrus]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-07-24.md` â€” soft NFR1 / motion]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- Scaffold via `create-next-app@16.2.11` dans `ma-table-tmp/` puis remontÃ©e Ã  la racine (dossier non vide).
- Smoke HTTP : `GET /` â†’ 200, `GET /bo` â†’ 200 ; CTA `bg-accent` + `text-ink-primary` prÃ©sent sur les deux shells.
- `npm run build` OK (Next.js 16.2.11 / Turbopack) ; `npm run lint` OK aprÃ¨s ignore `.agents`/`_bmad*`.

### Completion Notes List

- Monolithe Next.js initialisÃ© : `next@16.2.11`, React 19.2.4, TypeScript 5.x, Tailwind 4.x ; pas de `src/`.
- Route groups : client `/` (`app/(client)/page.tsx`), BO `/bo` (`app/(bo)/bo/page.tsx`) â€” copy FR, CTA Citrus a11y.
- Tokens Citrus en CSS variables + `@theme inline` ; Fredoka + Nunito Sans (`display: swap`) ; light mode only ; focus-ring global ; `prefers-reduced-motion` soft.
- Stubs `domain/`, `infra/`, `prisma/` (README) ; Auth.js rÃ©servÃ© via stub 501 sur `/api/auth/[...nextauth]` sans `next-auth` installÃ©.
- Hors scope respectÃ© : aucune dÃ©pendance Prisma/Neon/Auth/Pusher/Blob/Sheets.

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

- 2026-07-24 â€” Story 1.1 implÃ©mentÃ©e : scaffold Next.js monolithe + tokens Citrus + shells Client/BO â†’ status `review`
