# Story 4.1: Gate Â« Terminer mon expÃ©rience Â»

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want pouvoir terminer mon expÃ©rience seulement aprÃ¨s quâ€™une commande a Ã©tÃ© reÃ§ue,
so that je ne suis pas poussÃ© Ã  noter dÃ¨s le scan.

## Acceptance Criteria

1. **Given** une Session sans Order en statut `received` ou au-delÃ   
   **When** je navigue le fil client (Accueil, Menu, Service, barre bas / nav)  
   **Then** le CTA Â« Terminer mon expÃ©rience Â» est **absent** ou **non mis en avant** (pas le chemin principal â€” pas de `button-primary` Terminer avant gate)

2. **Given** au moins une Order de la session en statut `received`, `preparing` ou `served`  
   **When** je consulte la nav / surfaces client  
   **Then** le CTA Â« Terminer mon expÃ©rience Â» est **disponible** et visible (emplacement : barre bas mobile / rail desktop, cohÃ©rent UX-DR6)

3. **Given** le gate ouvert (AC #2)  
   **When** je dÃ©clenche Â« Terminer mon expÃ©rience Â»  
   **Then** le flux **Avis** sâ€™ouvre en premier (pas Contact, pas Merci chef)

4. **Given** le gate  
   **When** lâ€™Ã©valuation du statut Order est faite  
   **Then** la rÃ¨gle suit **AD-13** / **AD-12** : gate = au moins une Order de la Session avec statut â‰¥ `received` (jamais avant `placeOrder`)

## Tasks / Subtasks

- [ ] T1. Helper domain gate (AC: #1, #2, #4)
  - [ ] Ajouter `domain/review` (ou `domain/session`) : `canFinishExperience(sessionId)` â†’ true si âˆƒ Order liÃ©e avec `status âˆˆ {received, preparing, served}`
  - [ ] Source de vÃ©ritÃ© = Neon via Prisma ; pas de gate cÃ´tÃ© cookie seul
  - [ ] Shape erreur Server Action : `{ ok: false, code, message }` si lecture Ã©choue

- [ ] T2. Brancher le CTA sur les shells client (AC: #1, #2)
  - [ ] Surface CTA dans barre Menu|Service (mobile) + Ã©quivalent desktop (mÃªmes destinations)
  - [ ] Avant gate : ne pas afficher comme CTA principal ; secondaire discret OK **ou** masquÃ© (prÃ©fÃ©rer masquÃ© si doute)
  - [ ] AprÃ¨s gate : CTA visible ; un seul `button-primary` par Ã©cran si Terminer est lâ€™action principale de la surface concernÃ©e
  - [ ] Copy FR exacte : Â« Terminer mon expÃ©rience Â» ; tutoiement doux ; jamais Login/Submit/Dashboard

- [ ] T3. Navigation vers Avis (AC: #3)
  - [ ] Route client dÃ©diÃ©e (ex. `app/(client)/finish/review` ou Ã©quivalent) â€” **ouvrir Avis**, pas Contact
  - [ ] Si gate false : refus soft (redirect Accueil/Menu) â€” pas dâ€™erreur brutale
  - [ ] Ne pas crÃ©er de Review ici (crÃ©ation = Story 4.2)

- [ ] T4. Garde-fous anti-scope
  - [ ] Pas dâ€™Ã©cran Avis/Merci/Contact complets (stubs navigation OK)
  - [ ] Pas de sync Sheets, pas dâ€™upsert Guest
  - [ ] `(client)` nâ€™importe jamais `(bo)`

## Dev Notes

### Contexte epic

Epic 4 = ClÃ´turer le sÃ©jour : **Avis â†’ Merci chef â†’ Contact**. Story 4.1 = **uniquement la porte dâ€™entrÃ©e** (visibilitÃ© + navigation). DÃ©pend dâ€™**Epic 3** (`placeOrder` + Order `received`).

### Architecture â€” ADs obligatoires

| AD | Implication 4.1 |
| --- | --- |
| **AD-13** | Terminer (et donc avisâ†’merciâ†’contact) **uniquement** si Session a â‰¥1 Order â‰¥ `received` |
| **AD-12** | Statuts Order : `received` â†’ `preparing` â†’ `served` ; gate UX = â‰¥ `received` |
| **AD-4** | Mutations mÃ©tier via Server Actions `domain/` ; lecture gate aussi via domain |
| **AD-2** | `app/(client)` â†’ `domain/` â†’ `infra/` ; jamais import BO |
| **AD-5** | Session cookie opaque ; vÃ©ritÃ© Order/Session en Neon â€” ne pas stocker le flag gate dans le cookie |

### DÃ©pendances

- **Bloquante :** Epic 3 Story 3.1 (`placeOrder` INSERT Order `received`) + modÃ¨le Order/Session
- **SÃ©quentielle Epic 4 :** 4.1 â†’ 4.2 â†’ 4.3 â†’ 4.4
- **UX :** barre progression (1.5) â€” pendant Fin (4.2+) Ã©tape Fin active ; **4.1 ne force pas encore Fin** tant que lâ€™avis nâ€™est pas ouvert (ouvrir Avis = entrÃ©e Fin)

### UX / composants

- Navigation fil lÃ©ger : Terminer **aprÃ¨s commande reÃ§ue** seulement ([EXPERIENCE] State Patterns)
- Composant CTA : `button-primary` quand Terminer est lâ€™action principale de lâ€™Ã©cran/nav concernÃ©e
- Anti-dashboard : pas de hub 4 tuiles Ã©gales avec Terminer toujours prÃ©sent

### Hors scope strict

- Ã‰cran Avis (`avis-stars`), Merci chef, Contact
- Persistance Review / Guest / Preference
- BO, Pusher, Sheets
- Soft recognition / MÃ©moire (Epic 5)

### Testing

- Unit : `canFinishExperience` â€” 0 Order â†’ false ; Order `received` â†’ true ; `preparing`/`served` â†’ true
- Manuel : session sans commande â†’ pas de CTA principal Terminer ; aprÃ¨s `placeOrder` â†’ CTA visible â†’ ouvre Avis
- RÃ©gression : Accueil CTA principal reste Â« Voir le menu Â» avant gate

### Project Structure Notes

```text
app/(client)/â€¦          # nav + CTA Terminer
domain/review/          # ou session â€” canFinishExperience
domain/order/           # lecture statuts (rÃ©utiliser Epic 3)
infra/prisma/           # Order.status
```

Greenfield progressif : si Order nâ€™existe pas encore en code, **bloquer** lâ€™implÃ©mentation jusquâ€™Ã  Epic 3 â€” ne pas inventer un flag local Â« fake received Â».

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 4.1]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` â€” AD-12, AD-13, Capability map Avis]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` â€” FR-12]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” Terminer / State Patterns]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` â€” button-primary]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
