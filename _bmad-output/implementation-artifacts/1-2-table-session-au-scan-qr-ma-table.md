---
baseline_commit: NO_VCS
---

# Story 1.2: Table + Session au scan QR Ma table

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client Ã  table,
I want quâ€™un scan du QR Ma table ouvre ou reprenne une Session liÃ©e Ã  ma Table,
so that je dÃ©marre le sÃ©jour digital sans compte ni choix de table in-app.

## Acceptance Criteria

1. **Given** une Table connue avec `tableId` stable et une URL QR portant ce `tableId`  
   **When** jâ€™ouvre le QR Ma table sans session active  
   **Then** une Session anonyme est crÃ©Ã©e (vÃ©ritÃ© Neon), un cookie httpOnly opaque est posÃ©, et jâ€™arrive sur lâ€™Accueil

2. **And** au plus une Session `active` existe pour cette table dans le TTL (~6 h)

3. **Given** une Session active non expirÃ©e pour cette table  
   **When** je rescane le mÃªme QR  
   **Then** la Session existante est reprise (pas de nouvelle session concurrente)

4. **And** le QR Wiâ€‘Fi reste hors produit logiciel (pas de captive portal Ma table)

## Tasks / Subtasks

- [x] T1. Brancher Prisma 7.9 + Neon (Node) (AC: #1)
  - [x] Installer pins : `prisma@7.9.0`, `@prisma/client@7.9.0`, `@prisma/adapter-neon@7.9.0`, `@neondatabase/serverless@1.1.0`
  - [x] CrÃ©er `prisma/schema.prisma` avec modÃ¨les **Table** et **Session** uniquement (pas Menu/Order/Guest)
  - [x] Configurer `infra/prisma/` (client singleton Node + adapter Neon)
  - [x] Env : `DATABASE_URL` (pooled) + `DIRECT_URL` (migrations) â€” AD-11
  - [x] Migration initiale + seed minimal (ex. tables `T1`â€¦`T5` ou `table-1`â€¦ avec `tableId` stables)
  - [x] Runtime **Node** uniquement â€” pas `runtime = 'edge'` sur les routes session

- [x] T2. Domaine Session â€” ouvrir / reprendre (AC: #1, #2, #3)
  - [x] `domain/session/` : use-case + Server Action(s) (ex. `openOrResumeSession({ tableId })`)
  - [x] Si cookie opaque valide + Session `active` + `expiresAt` > now â†’ reprendre
  - [x] Sinon si Session `active` non expirÃ©e pour ce `tableId` â†’ lier cookie Ã  cette Session (rescan mÃªme table)
  - [x] Sinon crÃ©er Session anonyme (`status: active`, `step: welcome` / Accueil, `expiresAt = now + 6h`)
  - [x] Garantir **au plus une** Session `active` / `tableId` dans le TTL (contrainte app + index / transaction ; fermer ou expirer les concurrentes)
  - [x] Erreurs Server Action : `{ ok: false, code, message }` (FR) ; succÃ¨s `{ ok: true, ... }`

- [x] T3. Cookie httpOnly opaque (AC: #1, #3)
  - [x] Cookie client sÃ©jour : nom dÃ©diÃ© (ex. `mt_session`) â€” **prÃ©fixe distinct** de tout futur Auth.js staff
  - [x] Valeur = id opaque (UUID/cuid) ; **pas** de panier / Ã©tape / PII dans le cookie (AD-5)
  - [x] Flags : `httpOnly`, `secure` (prod), `sameSite: 'lax'`, path `/`, `maxAge` â‰ˆ 6 h alignÃ© TTL
  - [x] Stocker en Neon le lien opaque â†’ `Session.id` (hash ou id opaque en colonne dÃ©diÃ©e)

- [x] T4. Route QR + redirection Accueil (AC: #1, #3, #4)
  - [x] Route client du type `app/(client)/t/[tableId]/page.tsx` (ou Ã©quivalent documentÃ©) â€” URL QR = `https://<host>/t/<tableId>`
  - [x] Au GET : rÃ©soudre table â†’ open/resume â†’ redirect Accueil (`/(client)/` ou `/(client)/accueil`)
  - [x] Table inconnue â†’ erreur UX claire FR (pas de stack trace) ; shape erreur domain cohÃ©rente
  - [x] **Aucun** choix de table in-app ; **aucun** login client
  - [x] Documenter explicitement : QR Wiâ€‘Fi = hors produit (AC #4) â€” pas de route captive / WIFI: gÃ©nÃ©rÃ©e par lâ€™app ici

- [x] T5. Accueil stub + smoke (AC: #1)
  - [x] Page Accueil minimale FR aprÃ¨s session (peut Ãªtre remplacÃ©e/enrichie en 1.3)
  - [x] VÃ©rifier cookie posÃ© + row Session Neon + rescan ne crÃ©e pas de 2áµ‰ Session active

- [x] T6. Garde-fous anti-scope
  - [x] Pas Auth.js Credentials, Pusher, Blob, Sheets, Order, Menu, Guest, MÃ©moire 2áµ‰ visite
  - [x] Pas UI Accueil complÃ¨te / banniÃ¨re reprise / barre progression (stories 1.3â€“1.5)
  - [x] Pas gÃ©nÃ©ration Carte print (1.6)

## Dev Notes

### Contexte epic

Epic 1 = Fondation & entrÃ©e Ã  table. **1.2 = premiÃ¨re story data** : Table + Session + cookie + entrÃ©e QR. DÃ©bloque 1.3 (Accueil), 1.4 (reprise R2), 1.5 (Ã©tape session pour la barre).

### DÃ©pendance story prÃ©cÃ©dente

- **1.1** doit Ãªtre en place : Next **16.2.11**, React 19, TS, Tailwind 4, `app/(client)`, `app/(bo)`, `domain/`, `infra/`, tokens Citrus.
- Si 1.1 non implÃ©mentÃ©e : bloquer et terminer le scaffold avant Prisma/session.

### Architecture â€” ADs obligatoires

| AD | RÃ¨gle pour 1.2 |
| --- | --- |
| **AD-1** | Un seul monolithe Next ; route dans `app/(client)` |
| **AD-2** | `app/(client)` â†’ `domain/session` â†’ `infra/prisma` ; jamais importer `(bo)` |
| **AD-4** | Mutation open/resume = Server Action dans `domain/` ; pas de REST mÃ©tier `/api/session` |
| **AD-5** | Cookie httpOnly id opaque ; vÃ©ritÃ© Session en Neon ; **reprise R2 â‰  mÃ©moire 2áµ‰ visite** (Guest/prefs = epic 5 â€” ne pas les implÃ©menter) |
| **AD-9** | URL encode `tableId` stable ; â‰¤1 Session `active` / table / TTL ; Order plus tard portera `tableId`+`sessionId` ; Wiâ€‘Fi hors produit |
| **AD-11** | Neon unique V1 ; Prisma 7.9 + adapter Neon ; Node ; `DATABASE_URL` + `DIRECT_URL` |
| **AD-18** | Champ panier sur Session OK (JSON vide) â€” **pas** de lignes Order |

### Stack pins (ajouter en 1.2)

| Package | Version |
| --- | --- |
| Next.js (dÃ©jÃ  1.1) | **16.2.11** |
| Prisma / `@prisma/client` | **7.9.0** |
| `@prisma/adapter-neon` | **7.9.0** |
| `@neondatabase/serverless` | **1.1.0** |

### ModÃ¨le donnÃ©es minimal (suggestion)

```prisma
// EN identifiers ; enums code EN
model Table {
  id        String    @id // = tableId QR (stable, ex. "t-12")
  label     String?   // affichage interne optionnel
  sessions  Session[]
  createdAt DateTime  @default(now())
}

model Session {
  id           String   @id @default(cuid())
  tableId      String
  table        Table    @relation(fields: [tableId], references: [id])
  opaqueKey    String   @unique // id opaque cookie (ou hash)
  status       SessionStatus @default(ACTIVE)
  step         SessionStep   @default(WELCOME) // pour 1.4/1.5
  cartJson     Json     @default("{}") // AD-18 â€” vide en 1.2
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([tableId, status])
}

enum SessionStatus { ACTIVE CLOSED EXPIRED }
enum SessionStep { WELCOME MENU ORDER END } // Accueil|Menu|Commande|Fin
```

TTL : `expiresAt = createdAt + 6 hours` (constante unique ex. `SESSION_TTL_MS = 6 * 60 * 60 * 1000`). Ã€ lâ€™expiration : marquer `EXPIRED` / ne plus reprendre (comportement finement UI en 1.4).

### Fichiers Ã  crÃ©er / modifier

| Path | Action |
| --- | --- |
| `prisma/schema.prisma` | NEW â€” Table + Session |
| `prisma/migrations/*` | NEW |
| `prisma/seed.ts` (ou script) | NEW â€” tables demo |
| `infra/prisma/client.ts` | NEW â€” PrismaClient + Neon adapter |
| `infra/prisma/env.ts` | NEW optionnel â€” validation env |
| `domain/session/open-or-resume.ts` | NEW â€” use-case |
| `domain/session/actions.ts` | NEW â€” `"use server"` |
| `domain/session/cookie.ts` | NEW â€” read/write cookie opaque |
| `domain/session/types.ts` | NEW â€” Result `{ ok }` |
| `app/(client)/t/[tableId]/page.tsx` | NEW â€” entry QR |
| `app/(client)/page.tsx` ou `accueil/page.tsx` | UPDATE/NEW â€” cible redirect |
| `.env.example` | UPDATE â€” `DATABASE_URL`, `DIRECT_URL` |
| `package.json` | UPDATE â€” deps Prisma/Neon + scripts migrate/seed |

### Conventions

- Code / fichiers / enums : **EN**
- Copy UI : **FR**
- Server Actions errors : `{ ok: false, code: string, message: string }`
- IDs : cuid/uuid ; `tableId` = id stable URL
- Dates : ISO UTC en base

### Hors scope strict

- UI Accueil Â« maison Â» complÃ¨te, `card-accueil`, illustration (â†’ **1.3**)
- BanniÃ¨re Â« Tu en Ã©tais Ã â€¦ Â» + restore deep step UI (â†’ **1.4** ; poser `step` en base OK)
- `barre-progression-sejour` (â†’ **1.5**)
- Assets print Carte table (â†’ **1.6**)
- Auth BO, Menu, Order, ServiceRequest, Guest, Pusher, Blob, Sheets
- Captive portal / gÃ©nÃ©ration QR Wiâ€‘Fi dans le runtime app

### Testing

- Unit/domain : open sans cookie â†’ create ; rescan mÃªme table â†’ same `sessionId` ; 2áµ‰ create bloquÃ©e si active
- Cookie : httpOnly prÃ©sent aprÃ¨s open ; valeur â‰  payload mÃ©tier
- TTL : session avec `expiresAt` passÃ© â†’ nouvelle Session (peut Ãªtre couvert aussi en 1.4)
- Manuel : seed table â†’ ouvrir `/t/<id>` â†’ Accueil + row Neon ; rescan â†’ mÃªme session
- `npx prisma migrate` + `next build` OK (Node)

### Project Structure Notes

- Aligner sur Structural Seed spine : `domain/` + `infra/` + `prisma/`
- Ne pas placer de logique Prisma dans les composants client
- PrÃ©voir que 1.4 lira cookie + `step` ; 1.5 lira `step` pour la barre â€” **ne pas hardcoder** lâ€™Ã©tape uniquement en UI locale

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 1.2, FR2/FR3, AD rÃ©sumÃ©]
- [Source: `architecture/.../ARCHITECTURE-SPINE.md` â€” AD-5, AD-9, AD-11, AD-1/2/4, Stack, ERD]
- [Source: `ux-designs/.../EXPERIENCE.md` â€” Foundation session, Flow 1 entrÃ©e QR, State Patterns session]
- [Source: `implementation-artifacts/1-1-scaffold-nextjs-monolithe-tokens-citrus.md` â€” prÃ©requis scaffold]
- [Source: `implementation-readiness-report-2026-07-24.md` â€” timing DB Table/Session en 1.2]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- Pins : prisma/client/adapter-neon 7.9.0, @neondatabase/serverless 1.1.0, ws (Node WebSocket).
- `prisma migrate deploy` OK sur Neon ; seed `t-1`â€¦`t-5`.
- Smoke : `/t/t-1` â†’ cookie `mt_session` httpOnly â†’ `/accueil` ; rescan mÃªme opaque ; 1 seule Session ACTIVE.
- Cookie `Secure` uniquement si `VERCEL=1` ou `COOKIE_SECURE=true` (HTTP local sinon).
- Tests domaine 5/5 ; `npm run build` OK.

### Completion Notes List

- Table + Session Prisma/Neon branchÃ©s (AD-11) ; open/resume transactionnel (AD-5/9).
- EntrÃ©e QR `GET /t/[tableId]` (Route Handler Node) + Accueil stub `/accueil`.
- QR Wiâ€‘Fi hors produit documentÃ© dans le route handler.
- Hors scope respectÃ© (pas Auth/Menu/Order/Guest/Pusher/Blob).

### Change Log

- 2026-07-24 â€” Story 1.2 implÃ©mentÃ©e + Neon migrate/seed/smoke â†’ status `review`

### File List

- package.json
- package-lock.json
- .env.example
- prisma.config.ts
- prisma/schema.prisma
- prisma/seed.ts
- prisma/README.md
- prisma/migrations/migration_lock.toml
- prisma/migrations/20260724120000_init_table_session/migration.sql
- infra/prisma/client.ts
- infra/prisma/env.ts
- infra/prisma/README.md
- infra/README.md
- domain/README.md
- domain/session/constants.ts
- domain/session/types.ts
- domain/session/cookie.ts
- domain/session/open-or-resume.ts
- domain/session/open-or-resume.test.ts
- domain/session/actions.ts
- domain/session/get-current.ts
- app/(client)/page.tsx
- app/(client)/accueil/page.tsx
- app/(client)/t/[tableId]/route.ts
- scripts/check-sessions.ts
- _bmad-output/implementation-artifacts/1-2-table-session-au-scan-qr-ma-table.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
