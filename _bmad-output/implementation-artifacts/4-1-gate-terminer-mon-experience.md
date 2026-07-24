# Story 4.1: Gate « Terminer mon expérience »

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want pouvoir terminer mon expérience seulement après qu’une commande a été reçue,
so that je ne suis pas poussé à noter dès le scan.

## Acceptance Criteria

1. **Given** une Session sans Order en statut `received` ou au-delà  
   **When** je navigue le fil client (Accueil, Menu, Service, barre bas / nav)  
   **Then** le CTA « Terminer mon expérience » est **absent** ou **non mis en avant** (pas le chemin principal — pas de `button-primary` Terminer avant gate)

2. **Given** au moins une Order de la session en statut `received`, `preparing` ou `served`  
   **When** je consulte la nav / surfaces client  
   **Then** le CTA « Terminer mon expérience » est **disponible** et visible (emplacement : barre bas mobile / rail desktop, cohérent UX-DR6)

3. **Given** le gate ouvert (AC #2)  
   **When** je déclenche « Terminer mon expérience »  
   **Then** le flux **Avis** s’ouvre en premier (pas Contact, pas Merci chef)

4. **Given** le gate  
   **When** l’évaluation du statut Order est faite  
   **Then** la règle suit **AD-13** / **AD-12** : gate = au moins une Order de la Session avec statut ≥ `received` (jamais avant `placeOrder`)

## Tasks / Subtasks

- [ ] T1. Helper domain gate (AC: #1, #2, #4)
  - [ ] Ajouter `domain/review` (ou `domain/session`) : `canFinishExperience(sessionId)` → true si ∃ Order liée avec `status ∈ {received, preparing, served}`
  - [ ] Source de vérité = Neon via Prisma ; pas de gate côté cookie seul
  - [ ] Shape erreur Server Action : `{ ok: false, code, message }` si lecture échoue

- [ ] T2. Brancher le CTA sur les shells client (AC: #1, #2)
  - [ ] Surface CTA dans barre Menu|Service (mobile) + équivalent desktop (mêmes destinations)
  - [ ] Avant gate : ne pas afficher comme CTA principal ; secondaire discret OK **ou** masqué (préférer masqué si doute)
  - [ ] Après gate : CTA visible ; un seul `button-primary` par écran si Terminer est l’action principale de la surface concernée
  - [ ] Copy FR exacte : « Terminer mon expérience » ; tutoiement doux ; jamais Login/Submit/Dashboard

- [ ] T3. Navigation vers Avis (AC: #3)
  - [ ] Route client dédiée (ex. `app/(client)/finish/review` ou équivalent) — **ouvrir Avis**, pas Contact
  - [ ] Si gate false : refus soft (redirect Accueil/Menu) — pas d’erreur brutale
  - [ ] Ne pas créer de Review ici (création = Story 4.2)

- [ ] T4. Garde-fous anti-scope
  - [ ] Pas d’écran Avis/Merci/Contact complets (stubs navigation OK)
  - [ ] Pas de sync Sheets, pas d’upsert Guest
  - [ ] `(client)` n’importe jamais `(bo)`

## Dev Notes

### Contexte epic

Epic 4 = Clôturer le séjour : **Avis → Merci chef → Contact**. Story 4.1 = **uniquement la porte d’entrée** (visibilité + navigation). Dépend d’**Epic 3** (`placeOrder` + Order `received`).

### Architecture — ADs obligatoires

| AD | Implication 4.1 |
| --- | --- |
| **AD-13** | Terminer (et donc avis→merci→contact) **uniquement** si Session a ≥1 Order ≥ `received` |
| **AD-12** | Statuts Order : `received` → `preparing` → `served` ; gate UX = ≥ `received` |
| **AD-4** | Mutations métier via Server Actions `domain/` ; lecture gate aussi via domain |
| **AD-2** | `app/(client)` → `domain/` → `infra/` ; jamais import BO |
| **AD-5** | Session cookie opaque ; vérité Order/Session en Neon — ne pas stocker le flag gate dans le cookie |

### Dépendances

- **Bloquante :** Epic 3 Story 3.1 (`placeOrder` INSERT Order `received`) + modèle Order/Session
- **Séquentielle Epic 4 :** 4.1 → 4.2 → 4.3 → 4.4
- **UX :** barre progression (1.5) — pendant Fin (4.2+) étape Fin active ; **4.1 ne force pas encore Fin** tant que l’avis n’est pas ouvert (ouvrir Avis = entrée Fin)

### UX / composants

- Navigation fil léger : Terminer **après commande reçue** seulement ([EXPERIENCE] State Patterns)
- Composant CTA : `button-primary` quand Terminer est l’action principale de l’écran/nav concernée
- Anti-dashboard : pas de hub 4 tuiles égales avec Terminer toujours présent

### Hors scope strict

- Écran Avis (`avis-stars`), Merci chef, Contact
- Persistance Review / Guest / Preference
- BO, Pusher, Sheets
- Soft recognition / Mémoire (Epic 5)

### Testing

- Unit : `canFinishExperience` — 0 Order → false ; Order `received` → true ; `preparing`/`served` → true
- Manuel : session sans commande → pas de CTA principal Terminer ; après `placeOrder` → CTA visible → ouvre Avis
- Régression : Accueil CTA principal reste « Voir le menu » avant gate

### Project Structure Notes

```text
app/(client)/…          # nav + CTA Terminer
domain/review/          # ou session — canFinishExperience
domain/order/           # lecture statuts (réutiliser Epic 3)
infra/prisma/           # Order.status
```

Greenfield progressif : si Order n’existe pas encore en code, **bloquer** l’implémentation jusqu’à Epic 3 — ne pas inventer un flag local « fake received ».

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 4.1]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` — AD-12, AD-13, Capability map Avis]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` — FR-12]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — Terminer / State Patterns]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` — button-primary]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
