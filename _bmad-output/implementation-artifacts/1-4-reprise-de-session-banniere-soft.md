---
baseline_commit: NO_VCS
---

# Story 1.4: Reprise de session + banniÃ¨re soft

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want reprendre mon sÃ©jour aprÃ¨s refresh, crash ou fermeture dâ€™onglet,
so that je ne recommence pas Ã  zÃ©ro la mÃªme soirÃ©e.

## Acceptance Criteria

1. **Given** une Session active avec une Ã©tape en cours  
   **When** je refresh ou rouvre lâ€™app dans le TTL (~6 h)  
   **Then** je suis remis Ã  lâ€™Ã©tape en cours

2. **And** une banniÃ¨re soft Â« Tu en Ã©tais Ã â€¦ Â» avec CTA continuer sâ€™affiche

3. **Given** le TTL session est expirÃ©  
   **When** je rescane le QR Ma table  
   **Then** une nouvelle Session anonyme est crÃ©Ã©e (pas de reprise dâ€™un sÃ©jour clos)

## Tasks / Subtasks

- [x] T1. Persistance dâ€™Ã©tape + restore route (AC: #1)
  - [x] Utiliser `Session.step` (WELCOME | MENU | ORDER | END) comme source de vÃ©ritÃ© Neon (AD-5)
  - [x] Au chargement shell client : si cookie opaque â†’ Session `ACTIVE` + non expirÃ©e â†’ router vers la surface de lâ€™Ã©tape (Accueil / stub Menu / stubs futurs)
  - [x] Refresh (F5) sur une surface : rester / revenir Ã  lâ€™Ã©tape en cours, **pas** rÃ©-onboarding Accueil forcÃ© si step &gt; WELCOME
  - [x] Helper domain `getActiveSession()` / `resolveResumeTarget(session)` â€” pas de logique Prisma dans les composants

- [x] T2. Composant `banniere-reprise` (AC: #2)
  - [x] Afficher sur reprise (refresh / reopen / rescan avec session active) : copy Â« Tu en Ã©tais Ã â€¦ Â» + libellÃ© dâ€™Ã©tape FR (Accueil / Menu / Commande / Fin)
  - [x] CTA continuer (tap) â†’ focus / navigation vers lâ€™Ã©tape ; banniÃ¨re dismissible soft (non-bloquante)
  - [x] Tokens DESIGN : fond `accent-soft`, texte `ink-primary`, radius md, typo body-sm
  - [x] Jamais formulaire de relance ; jamais silence total sans feedback (EXPERIENCE R2)
  - [x] Ne pas confondre avec MÃ©moire 2áµ‰ visite (Â« Bon retour Â» / `bloc-memoire`) â€” **hors scope**

- [x] T3. Expiration TTL (AC: #3)
  - [x] Si `expiresAt <= now` : marquer Session `EXPIRED` (ou Ã©quivalent), invalider cookie, **crÃ©er** nouvelle Session anonyme au rescan
  - [x] Aucune reprise dâ€™Ã©tape dâ€™un sÃ©jour clos
  - [x] Aligner TTL cookie `maxAge` avec `expiresAt` (~6 h) â€” constante partagÃ©e avec 1.2

- [x] T4. IntÃ©gration open/resume 1.2 (AC: #1, #3)
  - [x] Ã‰tendre `openOrResumeSession` : branche expired â†’ create ; active â†’ resume + flag `resumed: true` pour UI banniÃ¨re
  - [x] Erreurs : `{ ok: false, code, message }`
  - [x] PrÃ©fixe cookie sÃ©jour toujours distinct Auth.js

- [x] T5. Garde-fous
  - [x] Pas Guest / soft device memory / prefs (epic 5)
  - [x] Pas avance rÃ©elle Menu/Commande mÃ©tier â€” stubs OK ; pouvoir **setter** step en dev/test pour valider restore
  - [x] Barre progression (1.5) peut consommer le mÃªme `step` mais nâ€™est pas requise ici

## Dev Notes

### Contexte epic

FR-3 / FR-4 + NFR2 : fiabilitÃ© session soirÃ©e. Decision UX **R2** = banniÃ¨re soft, pas rÃ©-onboarding.

### DÃ©pendance

- **1.2** obligatoire (cookie + Neon Session + open/resume).
- **1.3** fortement recommandÃ© (Accueil + stubs Menu/Service pour cibles de restore).
- Si step nâ€™est encore que WELCOME en prod : fournir un moyen de test (seed / action debug / navigation stub qui met Ã  jour `step`).

### Architecture â€” AD-5 critique

- **Reprise R2** (mÃªme soirÃ©e) : restaurer Ã©tape + banniÃ¨re Â« Tu en Ã©tais Ã â€¦ Â».
- **MÃ©moire 2áµ‰ visite** : distincte (cookie device et/ou ressaisie â†’ Guest) â€” **ne pas** implÃ©menter ni fusionner les UX.
- VÃ©ritÃ© = Neon ; cookie = id opaque seulement.

### Map Ã©tape â†’ route (V1 epic 1)

| SessionStep | Label FR banniÃ¨re | Route cible (stubs OK) |
| --- | --- | --- |
| WELCOME | Accueil | `/(client)/` ou `/accueil` |
| MENU | Menu | `/(client)/menu` |
| ORDER | Commande | stub `/commande` ou rester menu jusquâ€™Ã  epic 3 |
| END | Fin | stub `/fin` ou Accueil jusquâ€™Ã  epic 4 |

Service **nâ€™est pas** une Ã©tape de cette map (voie latÃ©rale â€” alignÃ© 1.5).

### Fichiers Ã  crÃ©er / modifier

| Path | Action |
| --- | --- |
| `domain/session/open-or-resume.ts` | UPDATE â€” expired vs resume + `resumed` |
| `domain/session/get-active.ts` | NEW |
| `domain/session/update-step.ts` | NEW â€” pour stubs / futurs epics |
| `components/client/banniere-reprise.tsx` | NEW |
| `app/(client)/layout.tsx` | UPDATE â€” mount banniÃ¨re si `resumed` / flag one-shot |
| `app/(client)/**/page.tsx` | UPDATE â€” guard restore |
| Cookie helpers 1.2 | UPDATE â€” clear on expire |

### Hors scope

- `bloc-memoire`, reconnaissance soft, Guest upsert
- Avancement step automatique mÃ©tier (commande placÃ©e, etc.) â€” epic 3/4 ; ici restore + banniÃ¨re
- `barre-progression-sejour` UI (1.5)
- Print carte (1.6)

### Testing

- CrÃ©er session â†’ set step MENU â†’ refresh â†’ land Menu + banniÃ¨re
- Fermer onglet â†’ rescan QR mÃªme table dans TTL â†’ mÃªme sessionId + banniÃ¨re
- Forcer `expiresAt` passÃ© â†’ rescan â†’ nouveau sessionId, pas dâ€™ancienne Ã©tape
- BanniÃ¨re : contraste accent-soft / ink-primary ; CTA cliquable â‰¥ 44px

### References

- [Source: `epics.md` â€” Story 1.4, FR3, FR4]
- [Source: `ARCHITECTURE-SPINE.md` â€” AD-5]
- [Source: `EXPERIENCE.md` â€” Reprise surface, State Patterns session interrompue/expirÃ©e, `banniere-reprise`]
- [Source: `DESIGN.md` â€” banniere-reprise tokens]
- [Source: stories 1.2, 1.3]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- Tests 7/7 (`openOrResume` + `resolveResumeTarget`) ; `npm run build` OK
- Routes : `/accueil`, `/menu`, `/commande`, `/fin` + QR restore `?reprise=1`

### Completion Notes List

- `getActiveSession` expire + clear cookie si TTL dÃ©passÃ©
- `openOrResumeSession` : expired â†’ EXPIRED + nouvelle session ; active â†’ `resumed: true`
- QR et Accueil restaurent la route dâ€™Ã©tape ; banniÃ¨re soft Â« Tu en Ã©tais Ã â€¦ Â» via `?reprise=1`
- Stubs Menu/Commande/Fin avancent `Session.step` pour tests de reprise
- Pas de bloc-memoire / Guest

### Change Log

- 2026-07-24 â€” Story 1.4 reprise + banniÃ¨re soft â†’ status `review`

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
