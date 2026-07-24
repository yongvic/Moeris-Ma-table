---
baseline_commit: NO_VCS
---

# Story 1.4: Reprise de session + bannière soft

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want reprendre mon séjour après refresh, crash ou fermeture d’onglet,
so that je ne recommence pas à zéro la même soirée.

## Acceptance Criteria

1. **Given** une Session active avec une étape en cours  
   **When** je refresh ou rouvre l’app dans le TTL (~6 h)  
   **Then** je suis remis à l’étape en cours

2. **And** une bannière soft « Tu en étais à… » avec CTA continuer s’affiche

3. **Given** le TTL session est expiré  
   **When** je rescane le QR Ma table  
   **Then** une nouvelle Session anonyme est créée (pas de reprise d’un séjour clos)

## Tasks / Subtasks

- [x] T1. Persistance d’étape + restore route (AC: #1)
  - [x] Utiliser `Session.step` (WELCOME | MENU | ORDER | END) comme source de vérité Neon (AD-5)
  - [x] Au chargement shell client : si cookie opaque → Session `ACTIVE` + non expirée → router vers la surface de l’étape (Accueil / stub Menu / stubs futurs)
  - [x] Refresh (F5) sur une surface : rester / revenir à l’étape en cours, **pas** ré-onboarding Accueil forcé si step &gt; WELCOME
  - [x] Helper domain `getActiveSession()` / `resolveResumeTarget(session)` — pas de logique Prisma dans les composants

- [x] T2. Composant `banniere-reprise` (AC: #2)
  - [x] Afficher sur reprise (refresh / reopen / rescan avec session active) : copy « Tu en étais à… » + libellé d’étape FR (Accueil / Menu / Commande / Fin)
  - [x] CTA continuer (tap) → focus / navigation vers l’étape ; bannière dismissible soft (non-bloquante)
  - [x] Tokens DESIGN : fond `accent-soft`, texte `ink-primary`, radius md, typo body-sm
  - [x] Jamais formulaire de relance ; jamais silence total sans feedback (EXPERIENCE R2)
  - [x] Ne pas confondre avec Mémoire 2ᵉ visite (« Bon retour » / `bloc-memoire`) — **hors scope**

- [x] T3. Expiration TTL (AC: #3)
  - [x] Si `expiresAt <= now` : marquer Session `EXPIRED` (ou équivalent), invalider cookie, **créer** nouvelle Session anonyme au rescan
  - [x] Aucune reprise d’étape d’un séjour clos
  - [x] Aligner TTL cookie `maxAge` avec `expiresAt` (~6 h) — constante partagée avec 1.2

- [x] T4. Intégration open/resume 1.2 (AC: #1, #3)
  - [x] Étendre `openOrResumeSession` : branche expired → create ; active → resume + flag `resumed: true` pour UI bannière
  - [x] Erreurs : `{ ok: false, code, message }`
  - [x] Préfixe cookie séjour toujours distinct Auth.js

- [x] T5. Garde-fous
  - [x] Pas Guest / soft device memory / prefs (epic 5)
  - [x] Pas avance réelle Menu/Commande métier — stubs OK ; pouvoir **setter** step en dev/test pour valider restore
  - [x] Barre progression (1.5) peut consommer le même `step` mais n’est pas requise ici

## Dev Notes

### Contexte epic

FR-3 / FR-4 + NFR2 : fiabilité session soirée. Decision UX **R2** = bannière soft, pas ré-onboarding.

### Dépendance

- **1.2** obligatoire (cookie + Neon Session + open/resume).
- **1.3** fortement recommandé (Accueil + stubs Menu/Service pour cibles de restore).
- Si step n’est encore que WELCOME en prod : fournir un moyen de test (seed / action debug / navigation stub qui met à jour `step`).

### Architecture — AD-5 critique

- **Reprise R2** (même soirée) : restaurer étape + bannière « Tu en étais à… ».
- **Mémoire 2ᵉ visite** : distincte (cookie device et/ou ressaisie → Guest) — **ne pas** implémenter ni fusionner les UX.
- Vérité = Neon ; cookie = id opaque seulement.

### Map étape → route (V1 epic 1)

| SessionStep | Label FR bannière | Route cible (stubs OK) |
| --- | --- | --- |
| WELCOME | Accueil | `/(client)/` ou `/accueil` |
| MENU | Menu | `/(client)/menu` |
| ORDER | Commande | stub `/commande` ou rester menu jusqu’à epic 3 |
| END | Fin | stub `/fin` ou Accueil jusqu’à epic 4 |

Service **n’est pas** une étape de cette map (voie latérale — aligné 1.5).

### Fichiers à créer / modifier

| Path | Action |
| --- | --- |
| `domain/session/open-or-resume.ts` | UPDATE — expired vs resume + `resumed` |
| `domain/session/get-active.ts` | NEW |
| `domain/session/update-step.ts` | NEW — pour stubs / futurs epics |
| `components/client/banniere-reprise.tsx` | NEW |
| `app/(client)/layout.tsx` | UPDATE — mount bannière si `resumed` / flag one-shot |
| `app/(client)/**/page.tsx` | UPDATE — guard restore |
| Cookie helpers 1.2 | UPDATE — clear on expire |

### Hors scope

- `bloc-memoire`, reconnaissance soft, Guest upsert
- Avancement step automatique métier (commande placée, etc.) — epic 3/4 ; ici restore + bannière
- `barre-progression-sejour` UI (1.5)
- Print carte (1.6)

### Testing

- Créer session → set step MENU → refresh → land Menu + bannière
- Fermer onglet → rescan QR même table dans TTL → même sessionId + bannière
- Forcer `expiresAt` passé → rescan → nouveau sessionId, pas d’ancienne étape
- Bannière : contraste accent-soft / ink-primary ; CTA cliquable ≥ 44px

### References

- [Source: `epics.md` — Story 1.4, FR3, FR4]
- [Source: `ARCHITECTURE-SPINE.md` — AD-5]
- [Source: `EXPERIENCE.md` — Reprise surface, State Patterns session interrompue/expirée, `banniere-reprise`]
- [Source: `DESIGN.md` — banniere-reprise tokens]
- [Source: stories 1.2, 1.3]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- Tests 7/7 (`openOrResume` + `resolveResumeTarget`) ; `npm run build` OK
- Routes : `/accueil`, `/menu`, `/commande`, `/fin` + QR restore `?reprise=1`

### Completion Notes List

- `getActiveSession` expire + clear cookie si TTL dépassé
- `openOrResumeSession` : expired → EXPIRED + nouvelle session ; active → `resumed: true`
- QR et Accueil restaurent la route d’étape ; bannière soft « Tu en étais à… » via `?reprise=1`
- Stubs Menu/Commande/Fin avancent `Session.step` pour tests de reprise
- Pas de bloc-memoire / Guest

### Change Log

- 2026-07-24 — Story 1.4 reprise + bannière soft → status `review`

### File List

- domain/session/steps.ts
- domain/session/steps.test.ts
- domain/session/update-step.ts
- domain/session/get-current.ts
- domain/session/open-or-resume.ts
- domain/session/open-or-resume.test.ts
- domain/session/cookie.ts
- domain/session/constants.ts
- components/client/banniere-reprise.tsx
- app/(client)/layout.tsx
- app/(client)/accueil/page.tsx
- app/(client)/menu/page.tsx
- app/(client)/commande/page.tsx
- app/(client)/fin/page.tsx
- app/(client)/t/[tableId]/route.ts
- _bmad-output/implementation-artifacts/1-4-reprise-de-session-banniere-soft.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
