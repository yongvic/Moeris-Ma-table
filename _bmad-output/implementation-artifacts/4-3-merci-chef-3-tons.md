# Story 4.3: Merci chef — 3 tons

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want une clôture chaleureuse calée sur ma note,
so that je me sens accueilli avant qu’on me demande un contact.

## Acceptance Criteria

1. **Given** un Avis vient d’être envoyé (Review avec `stars`)  
   **When** l’écran Merci chef s’affiche  
   **Then** le message/ton correspond à **l’une des ≥3 variantes** selon la note : **super** / **correct** / **mitigé**

2. **Given** n’importe lequel des 3 tons  
   **When** le client lit le message  
   **Then** **aucun ton ne blâme** le client ; pas de jargon UI froid (**Login / Submit / Dashboard** interdits)

3. **Given** l’écran Merci chef  
   **When** le visuel se charge  
   **Then** l’**illustration 2D** Merci chef (`illustration-panel` / slot dédié, `alt=""` décoratif) est présente  
   **And** le composant `card-merci-chef` porte illustration + message ; accent de clôture via `{colors.accent}`

4. **Given** l’écran Merci chef  
   **When** je le parcours  
   **Then** **aucune demande de contact** (pas de `selecteur-contact`, pas de champs tél/email) n’apparaît sur cet écran  
   **And** une transition douce vers Contact (4.4) est possible **après** l’émotion (CTA « Continuer » / pastille « Ensuite » — **sans** formulaire Contact inline)

5. **Given** mapping note → ton (V1 figé ci-dessous)  
   **When** `stars` ∈ {1..5}  
   **Then** : `stars ≥ 4` → **super** ; `stars === 3` → **correct** ; `stars ≤ 2` → **mitigé**

## Tasks / Subtasks

- [ ] T1. Sélection de ton + copy FR (AC: #1, #2, #5)
  - [ ] Helper pur `toneFromStars(stars)` → `'super' | 'correct' | 'mitige'`
  - [ ] 3 scripts FR (titre + sous-texte) — placeholders chaleureux OK si micro-copy finale non figée ; **structure** obligatoire
  - [ ] Exemple ton super (mockup) : « Merci du fond du cœur ! » — ne pas blâmer en mitigé (« Merci d’avoir partagé » / encouragement, jamais « Tu as mal noté »)

- [ ] T2. Surface `card-merci-chef` + illustration (AC: #3)
  - [ ] Route `app/(client)/finish/thanks` (ou équivalent) après `submitReview`
  - [ ] `illustration-panel` moment « merci chef » — personnage 2D plat ; pas de 3D
  - [ ] Rappel optionnel des étoiles (`role="img"` aria-label « Note : N sur 5 »)
  - [ ] Phone : stack vertical ; tablette/desktop : split possible (mockup `merci-chef.html`)
  - [ ] `prefers-reduced-motion` : pas d’animation obligatoire

- [ ] T3. Isolation Contact (AC: #4)
  - [ ] Aucun champ contact sur cette route
  - [ ] CTA secondaire/primary « Continuer » → route Contact (4.4) ; pastille « Ensuite » informative OK **sans** formulaire
  - [ ] Barre progression reste **Fin**

- [ ] T4. Garde-fous
  - [ ] Pas d’upsert Guest / Sheets
  - [ ] Pas de mutation Review ici (lecture seule)
  - [ ] Pas de Login

## Dev Notes

### Contexte epic

**Climax émotionnel** UJ-1 / FR-14 : l’avis est déjà stocké ; le contact **attend**. Spine : « 3 tons merci chef / copy chaleur = UX, pas invariant infra » — mais **AC produit** exige ≥3 tons.

### Architecture

| AD | Implication 4.3 |
| --- | --- |
| **AD-13** | On n’arrive ici qu’après gate + avis |
| Capability map | Avis + merci chef + Terminer → `domain/review` (lecture Review) |
| Deferred spine | Copy exacte des 3 tons peut évoluer ; **mapping + 3 variantes** non négociables |

### UX références

- Mockup canonique : `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/mockups/merci-chef.html` (ton super, 5/5)
- EXPERIENCE : Contact **jamais** avant l’émotion Merci chef
- DESIGN : `card-merci-chef`, `illustration-panel` (4 moments dont Merci chef)

### Copy guide (V1 — ajustable sans changer AC)

| Ton | Stars | Intention |
| --- | --- | --- |
| super | 4–5 | Gratitude haute énergie |
| correct | 3 | Chaleur calme, reconnaissance |
| mitigé | 1–2 | Empathie, invitation douce — **zéro culpabilisation** |

### Dépendances

- **4.2** Review.stars disponible
- **Suite :** 4.4 Contact après CTA Continuer
- Illustration asset : placeholder SVG/CSS OK si asset final absent (mockup CSS chef acceptable en V1)

### Hors scope

- Formulaire Contact / Guest / Sheets
- Soft recognition Mémoire
- Animation 3D chef
- Envoi email/SMS de remerciement

### Testing

- Unit : `toneFromStars(5|4)=super`, `(3)=correct`, `(2|1)=mitige`
- Manuel : 3 parcours notes → 3 messages distincts ; aucun champ contact ; illustration visible
- a11y : illustration `aria-hidden` / `alt=""` ; sens porté par le texte
- Contraste : `ink-primary` sur `surface-base` / `accent-soft`

### Project Structure Notes

```text
app/(client)/finish/thanks/
domain/review/toneFromStars.ts
components/…/card-merci-chef.tsx
public/… ou inline illustration-panel
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 4.3]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` — FR-14]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — Merci chef, Voice]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` — card-merci-chef, illustration-panel]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/mockups/merci-chef.html`]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` — Deferred tons]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
