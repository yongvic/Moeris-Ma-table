---
baseline_commit: NO_VCS
---

# Story 1.2: Table + Session au scan QR Ma table

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client à table,
I want qu’un scan du QR Ma table ouvre ou reprenne une Session liée à ma Table,
so that je démarre le séjour digital sans compte ni choix de table in-app.

## Acceptance Criteria

1. **Given** une Table connue avec `tableId` stable et une URL QR portant ce `tableId`  
   **When** j’ouvre le QR Ma table sans session active  
   **Then** une Session anonyme est créée (vérité Neon), un cookie httpOnly opaque est posé, et j’arrive sur l’Accueil

2. **And** au plus une Session `active` existe pour cette table dans le TTL (~6 h)

3. **Given** une Session active non expirée pour cette table  
   **When** je rescane le même QR  
   **Then** la Session existante est reprise (pas de nouvelle session concurrente)

4. **And** le QR Wi‑Fi reste hors produit logiciel (pas de captive portal Ma table)

## Tasks / Subtasks

- [ ] T1. Brancher Prisma 7.9 + Neon (Node) (AC: #1)
  - [ ] Installer pins : `prisma@7.9.0`, `@prisma/client@7.9.0`, `@prisma/adapter-neon@7.9.0`, `@neondatabase/serverless@1.1.0`
  - [ ] Créer `prisma/schema.prisma` avec modèles **Table** et **Session** uniquement (pas Menu/Order/Guest)
  - [ ] Configurer `infra/prisma/` (client singleton Node + adapter Neon)
  - [ ] Env : `DATABASE_URL` (pooled) + `DIRECT_URL` (migrations) — AD-11
  - [ ] Migration initiale + seed minimal (ex. tables `T1`…`T5` ou `table-1`… avec `tableId` stables)
  - [ ] Runtime **Node** uniquement — pas `runtime = 'edge'` sur les routes session

- [ ] T2. Domaine Session — ouvrir / reprendre (AC: #1, #2, #3)
  - [ ] `domain/session/` : use-case + Server Action(s) (ex. `openOrResumeSession({ tableId })`)
  - [ ] Si cookie opaque valide + Session `active` + `expiresAt` > now → reprendre
  - [ ] Sinon si Session `active` non expirée pour ce `tableId` → lier cookie à cette Session (rescan même table)
  - [ ] Sinon créer Session anonyme (`status: active`, `step: welcome` / Accueil, `expiresAt = now + 6h`)
  - [ ] Garantir **au plus une** Session `active` / `tableId` dans le TTL (contrainte app + index / transaction ; fermer ou expirer les concurrentes)
  - [ ] Erreurs Server Action : `{ ok: false, code, message }` (FR) ; succès `{ ok: true, ... }`

- [ ] T3. Cookie httpOnly opaque (AC: #1, #3)
  - [ ] Cookie client séjour : nom dédié (ex. `mt_session`) — **préfixe distinct** de tout futur Auth.js staff
  - [ ] Valeur = id opaque (UUID/cuid) ; **pas** de panier / étape / PII dans le cookie (AD-5)
  - [ ] Flags : `httpOnly`, `secure` (prod), `sameSite: 'lax'`, path `/`, `maxAge` ≈ 6 h aligné TTL
  - [ ] Stocker en Neon le lien opaque → `Session.id` (hash ou id opaque en colonne dédiée)

- [ ] T4. Route QR + redirection Accueil (AC: #1, #3, #4)
  - [ ] Route client du type `app/(client)/t/[tableId]/page.tsx` (ou équivalent documenté) — URL QR = `https://<host>/t/<tableId>`
  - [ ] Au GET : résoudre table → open/resume → redirect Accueil (`/(client)/` ou `/(client)/accueil`)
  - [ ] Table inconnue → erreur UX claire FR (pas de stack trace) ; shape erreur domain cohérente
  - [ ] **Aucun** choix de table in-app ; **aucun** login client
  - [ ] Documenter explicitement : QR Wi‑Fi = hors produit (AC #4) — pas de route captive / WIFI: générée par l’app ici

- [ ] T5. Accueil stub + smoke (AC: #1)
  - [ ] Page Accueil minimale FR après session (peut être remplacée/enrichie en 1.3)
  - [ ] Vérifier cookie posé + row Session Neon + rescan ne crée pas de 2ᵉ Session active

- [ ] T6. Garde-fous anti-scope
  - [ ] Pas Auth.js Credentials, Pusher, Blob, Sheets, Order, Menu, Guest, Mémoire 2ᵉ visite
  - [ ] Pas UI Accueil complète / bannière reprise / barre progression (stories 1.3–1.5)
  - [ ] Pas génération Carte print (1.6)

## Dev Notes

### Contexte epic

Epic 1 = Fondation & entrée à table. **1.2 = première story data** : Table + Session + cookie + entrée QR. Débloque 1.3 (Accueil), 1.4 (reprise R2), 1.5 (étape session pour la barre).

### Dépendance story précédente

- **1.1** doit être en place : Next **16.2.11**, React 19, TS, Tailwind 4, `app/(client)`, `app/(bo)`, `domain/`, `infra/`, tokens Citrus.
- Si 1.1 non implémentée : bloquer et terminer le scaffold avant Prisma/session.

### Architecture — ADs obligatoires

| AD | Règle pour 1.2 |
| --- | --- |
| **AD-1** | Un seul monolithe Next ; route dans `app/(client)` |
| **AD-2** | `app/(client)` → `domain/session` → `infra/prisma` ; jamais importer `(bo)` |
| **AD-4** | Mutation open/resume = Server Action dans `domain/` ; pas de REST métier `/api/session` |
| **AD-5** | Cookie httpOnly id opaque ; vérité Session en Neon ; **reprise R2 ≠ mémoire 2ᵉ visite** (Guest/prefs = epic 5 — ne pas les implémenter) |
| **AD-9** | URL encode `tableId` stable ; ≤1 Session `active` / table / TTL ; Order plus tard portera `tableId`+`sessionId` ; Wi‑Fi hors produit |
| **AD-11** | Neon unique V1 ; Prisma 7.9 + adapter Neon ; Node ; `DATABASE_URL` + `DIRECT_URL` |
| **AD-18** | Champ panier sur Session OK (JSON vide) — **pas** de lignes Order |

### Stack pins (ajouter en 1.2)

| Package | Version |
| --- | --- |
| Next.js (déjà 1.1) | **16.2.11** |
| Prisma / `@prisma/client` | **7.9.0** |
| `@prisma/adapter-neon` | **7.9.0** |
| `@neondatabase/serverless` | **1.1.0** |

### Modèle données minimal (suggestion)

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
  cartJson     Json     @default("{}") // AD-18 — vide en 1.2
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([tableId, status])
}

enum SessionStatus { ACTIVE CLOSED EXPIRED }
enum SessionStep { WELCOME MENU ORDER END } // Accueil|Menu|Commande|Fin
```

TTL : `expiresAt = createdAt + 6 hours` (constante unique ex. `SESSION_TTL_MS = 6 * 60 * 60 * 1000`). À l’expiration : marquer `EXPIRED` / ne plus reprendre (comportement finement UI en 1.4).

### Fichiers à créer / modifier

| Path | Action |
| --- | --- |
| `prisma/schema.prisma` | NEW — Table + Session |
| `prisma/migrations/*` | NEW |
| `prisma/seed.ts` (ou script) | NEW — tables demo |
| `infra/prisma/client.ts` | NEW — PrismaClient + Neon adapter |
| `infra/prisma/env.ts` | NEW optionnel — validation env |
| `domain/session/open-or-resume.ts` | NEW — use-case |
| `domain/session/actions.ts` | NEW — `"use server"` |
| `domain/session/cookie.ts` | NEW — read/write cookie opaque |
| `domain/session/types.ts` | NEW — Result `{ ok }` |
| `app/(client)/t/[tableId]/page.tsx` | NEW — entry QR |
| `app/(client)/page.tsx` ou `accueil/page.tsx` | UPDATE/NEW — cible redirect |
| `.env.example` | UPDATE — `DATABASE_URL`, `DIRECT_URL` |
| `package.json` | UPDATE — deps Prisma/Neon + scripts migrate/seed |

### Conventions

- Code / fichiers / enums : **EN**
- Copy UI : **FR**
- Server Actions errors : `{ ok: false, code: string, message: string }`
- IDs : cuid/uuid ; `tableId` = id stable URL
- Dates : ISO UTC en base

### Hors scope strict

- UI Accueil « maison » complète, `card-accueil`, illustration (→ **1.3**)
- Bannière « Tu en étais à… » + restore deep step UI (→ **1.4** ; poser `step` en base OK)
- `barre-progression-sejour` (→ **1.5**)
- Assets print Carte table (→ **1.6**)
- Auth BO, Menu, Order, ServiceRequest, Guest, Pusher, Blob, Sheets
- Captive portal / génération QR Wi‑Fi dans le runtime app

### Testing

- Unit/domain : open sans cookie → create ; rescan même table → same `sessionId` ; 2ᵉ create bloquée si active
- Cookie : httpOnly présent après open ; valeur ≠ payload métier
- TTL : session avec `expiresAt` passé → nouvelle Session (peut être couvert aussi en 1.4)
- Manuel : seed table → ouvrir `/t/<id>` → Accueil + row Neon ; rescan → même session
- `npx prisma migrate` + `next build` OK (Node)

### Project Structure Notes

- Aligner sur Structural Seed spine : `domain/` + `infra/` + `prisma/`
- Ne pas placer de logique Prisma dans les composants client
- Prévoir que 1.4 lira cookie + `step` ; 1.5 lira `step` pour la barre — **ne pas hardcoder** l’étape uniquement en UI locale

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 1.2, FR2/FR3, AD résumé]
- [Source: `architecture/.../ARCHITECTURE-SPINE.md` — AD-5, AD-9, AD-11, AD-1/2/4, Stack, ERD]
- [Source: `ux-designs/.../EXPERIENCE.md` — Foundation session, Flow 1 entrée QR, State Patterns session]
- [Source: `implementation-artifacts/1-1-scaffold-nextjs-monolithe-tokens-citrus.md` — prérequis scaffold]
- [Source: `implementation-readiness-report-2026-07-24.md` — timing DB Table/Session en 1.2]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- Pins installés : prisma/client/adapter-neon 7.9.0, @neondatabase/serverless 1.1.0 (+ `ws` requis Node pour adapter Neon).
- `prisma generate` OK ; migration SQL créée (`20260724120000_init_table_session`) + index partiel 1 ACTIVE / table.
- Tests domaine : 5/5 pass (`npm test`).
- `npm run build` OK — routes `/t/[tableId]`, `/accueil`.
- **BLOQUANT** : pas de `DATABASE_URL` / `DIRECT_URL` dans l’environnement → `migrate deploy` + seed + smoke Neon non exécutés.

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### Implementation Plan

- QR GET via Route Handler Node (`app/(client)/t/[tableId]/route.ts`) pour Set-Cookie httpOnly + redirect Accueil (cookies non mutables depuis RSC).
- Use-case `openOrResumeSession` transactionnel ; Server Action conservée pour appels futurs.
- En attente credentials Neon pour finaliser T1 migrate/seed et smoke T5.

### File List
