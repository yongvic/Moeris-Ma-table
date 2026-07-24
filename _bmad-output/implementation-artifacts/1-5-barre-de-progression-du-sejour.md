# Story 1.5: Barre de progression du séjour

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want voir où j’en suis dans le séjour (Accueil → Menu → Commande → Fin),
so that je comprends l’avancement sans naviguer comme dans un dashboard.

## Acceptance Criteria

1. **Given** une Session client active  
   **When** je consulte une surface du fil séjour  
   **Then** la barre affiche 4 étapes Accueil | Menu | Commande | Fin et se remplit selon l’étape de session

2. **And** la barre n’est pas cliquable pour sauter des étapes

3. **And** une visite Service n’avance pas la barre principale

4. **And** le nom accessible indique « Étape N sur 4 : … »

5. **And** le segment actif/complété utilise l’accent Citrus

## Tasks / Subtasks

- [ ] T1. Composant `barre-progression-sejour` (AC: #1, #2, #4, #5)
  - [ ] 4 segments : Accueil | Menu | Commande | Fin (labels FR)
  - [ ] Remplissage dérivé de `Session.step` (WELCOME=1 … END=4) — source Neon via domain, pas state UI seul
  - [ ] Segment courant + complétés : `{colors.accent}` ; segments futurs : neutre (border / surface-raised) — **pas** couleur seule pour l’état : combiner forme/remplissage + texte/aria
  - [ ] **Non interactif** pour skip : pas de `href` / `onClick` de navigation sur les segments (role presentation ou progressbar / list non-nav)
  - [ ] `aria` : nom du type « Étape N sur 4 : Menu » (UX-DR15 / FR21)
  - [ ] Texte sur accent = ink-primary si labels sur fond accent

- [ ] T2. Intégration shell client (AC: #1, #3)
  - [ ] Monter la barre dans le layout `(client)` sur surfaces fil séjour (Accueil, Menu stub, Commande stub, Fin stub)
  - [ ] Surface **Service** : barre visible OK mais `step` **inchangé** à l’entrée Service (voie latérale)
  - [ ] Ne pas traiter Service comme 5ᵉ étape
  - [ ] Absente du `(bo)` entièrement

- [ ] T3. Règles d’avancement (AC: #1, #3)
  - [ ] Documenter / implémenter mapping minimal epic 1 :
    - Accueil → step WELCOME
    - Navigation / CTA « Voir le menu » → update step MENU (via Server Action domain)
    - ORDER / END : setters stubs ou no-op jusqu’aux epics 3–4, mais barre doit **afficher** correctement si step forcé en test
  - [ ] Visite Service : **aucun** `updateStep`
  - [ ] Ne pas rendre la barre un hub cliquable multi-parcours

- [ ] T4. États futurs (note d’implémentation, soft)
  - [ ] Prévoir (commentaire / prop) : Contact après Merci chef → barre absente ou figée 100 % (UX-DR15) — pas bloquant si Contact n’existe pas encore
  - [ ] `prefers-reduced-motion` : pas d’anim obligatoire ; si fill animé, respecter reduce

- [ ] T5. Garde-fous
  - [ ] Pas de stepper MUI/dashboard ; pas de deep-link skip
  - [ ] Pas logique Order/Terminer réelle (epics 3–4)

## Dev Notes

### Contexte epic

FR21 (epics) + UX-DR15 — exigence UX actée ; pas encore FR numérotée PRD (readiness soft). Story purement shell client + lecture `Session.step`.

### Dépendance

- **1.2** : Session + `step` en Neon.
- **1.3** : shell Accueil + nav pour contextes d’affichage.
- **1.4** : restore step cohérent — barre doit coller à l’étape reprise.
- Ordre recommandé : après 1.4 ; acceptable après 1.3 si step update minimal existe.

### Architecture

- Lecture session via `domain/session` (AD-2).
- Update step = Server Action domain (AD-4) quand le CTA Menu (et plus tard Commande/Fin) avance le fil.
- AD-5 : step vit en Neon, pas dans le cookie.

### Spec visuelle / a11y

| Règle | Détail |
| --- | --- |
| 4 étapes | Accueil → Menu → Commande → Fin |
| Accent | `{colors.accent}` segments actif/complété |
| Non-cliquable skip | Pas de navigation par segment |
| Service | N’avance pas |
| aria | « Étape N sur 4 : {label} » |
| Placement | Discret — pas un dashboard ; sous header ou au-dessus contenu |

### Fichiers à créer / modifier

| Path | Action |
| --- | --- |
| `components/client/barre-progression-sejour.tsx` | NEW |
| `domain/session/update-step.ts` | NEW/UPDATE — appelé depuis CTA Menu |
| `app/(client)/layout.tsx` | UPDATE — injecter barre + passer step |
| `app/(client)/page.tsx` / menu CTA | UPDATE — `updateStep('MENU')` |
| `app/(client)/service/page.tsx` | VERIFY — pas d’update step |

### Hors scope

- Clic segment pour naviguer
- Avancement auto Order/Fin métier
- BO progress UI
- Mémoire / Contact edge cases complets (documenter seulement)

### Testing

- step WELCOME → 1/4 Accueil rempli ; aria correct
- update MENU → 2/4 ; segments 1–2 accent
- Aller sur Service → step reste MENU
- Cliquer segments → aucun changement de route
- Reprise 1.4 avec step ORDER → barre à 3/4
- Contraste + focus : barre non focusable comme nav ; CTA page restent focusables

### References

- [Source: `epics.md` — Story 1.5, FR21, UX-DR15]
- [Source: `EXPERIENCE.md` — Barre de progression séjour Foundation + Component Patterns]
- [Source: `DESIGN.md` — colors.accent, a11y]
- [Source: `implementation-readiness-report-2026-07-24.md` — note FR21 vs PRD]
- [Source: stories 1.2–1.4]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
