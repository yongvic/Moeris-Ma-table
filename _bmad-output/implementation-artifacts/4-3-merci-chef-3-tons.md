# Story 4.3: Merci chef â€” 3 tons

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want une clÃ´ture chaleureuse calÃ©e sur ma note,
so that je me sens accueilli avant quâ€™on me demande un contact.

## Acceptance Criteria

1. **Given** un Avis vient dâ€™Ãªtre envoyÃ© (Review avec `stars`)  
   **When** lâ€™Ã©cran Merci chef sâ€™affiche  
   **Then** le message/ton correspond Ã  **lâ€™une des â‰¥3 variantes** selon la note : **super** / **correct** / **mitigÃ©**

2. **Given** nâ€™importe lequel des 3 tons  
   **When** le client lit le message  
   **Then** **aucun ton ne blÃ¢me** le client ; pas de jargon UI froid (**Login / Submit / Dashboard** interdits)

3. **Given** lâ€™Ã©cran Merci chef  
   **When** le visuel se charge  
   **Then** lâ€™**illustration 2D** Merci chef (`illustration-panel` / slot dÃ©diÃ©, `alt=""` dÃ©coratif) est prÃ©sente  
   **And** le composant `card-merci-chef` porte illustration + message ; accent de clÃ´ture via `{colors.accent}`

4. **Given** lâ€™Ã©cran Merci chef  
   **When** je le parcours  
   **Then** **aucune demande de contact** (pas de `selecteur-contact`, pas de champs tÃ©l/email) nâ€™apparaÃ®t sur cet Ã©cran  
   **And** une transition douce vers Contact (4.4) est possible **aprÃ¨s** lâ€™Ã©motion (CTA Â« Continuer Â» / pastille Â« Ensuite Â» â€” **sans** formulaire Contact inline)

5. **Given** mapping note â†’ ton (V1 figÃ© ci-dessous)  
   **When** `stars` âˆˆ {1..5}  
   **Then** : `stars â‰¥ 4` â†’ **super** ; `stars === 3` â†’ **correct** ; `stars â‰¤ 2` â†’ **mitigÃ©**

## Tasks / Subtasks

- [ ] T1. SÃ©lection de ton + copy FR (AC: #1, #2, #5)
  - [ ] Helper pur `toneFromStars(stars)` â†’ `'super' | 'correct' | 'mitige'`
  - [ ] 3 scripts FR (titre + sous-texte) â€” placeholders chaleureux OK si micro-copy finale non figÃ©e ; **structure** obligatoire
  - [ ] Exemple ton super (mockup) : Â« Merci du fond du cÅ“ur ! Â» â€” ne pas blÃ¢mer en mitigÃ© (Â« Merci dâ€™avoir partagÃ© Â» / encouragement, jamais Â« Tu as mal notÃ© Â»)

- [ ] T2. Surface `card-merci-chef` + illustration (AC: #3)
  - [ ] Route `app/(client)/finish/thanks` (ou Ã©quivalent) aprÃ¨s `submitReview`
  - [ ] `illustration-panel` moment Â« merci chef Â» â€” personnage 2D plat ; pas de 3D
  - [ ] Rappel optionnel des Ã©toiles (`role="img"` aria-label Â« Note : N sur 5 Â»)
  - [ ] Phone : stack vertical ; tablette/desktop : split possible (mockup `merci-chef.html`)
  - [ ] `prefers-reduced-motion` : pas dâ€™animation obligatoire

- [ ] T3. Isolation Contact (AC: #4)
  - [ ] Aucun champ contact sur cette route
  - [ ] CTA secondaire/primary Â« Continuer Â» â†’ route Contact (4.4) ; pastille Â« Ensuite Â» informative OK **sans** formulaire
  - [ ] Barre progression reste **Fin**

- [ ] T4. Garde-fous
  - [ ] Pas dâ€™upsert Guest / Sheets
  - [ ] Pas de mutation Review ici (lecture seule)
  - [ ] Pas de Login

## Dev Notes

### Contexte epic

**Climax Ã©motionnel** UJ-1 / FR-14 : lâ€™avis est dÃ©jÃ  stockÃ© ; le contact **attend**. Spine : Â« 3 tons merci chef / copy chaleur = UX, pas invariant infra Â» â€” mais **AC produit** exige â‰¥3 tons.

### Architecture

| AD | Implication 4.3 |
| --- | --- |
| **AD-13** | On nâ€™arrive ici quâ€™aprÃ¨s gate + avis |
| Capability map | Avis + merci chef + Terminer â†’ `domain/review` (lecture Review) |
| Deferred spine | Copy exacte des 3 tons peut Ã©voluer ; **mapping + 3 variantes** non nÃ©gociables |

### UX rÃ©fÃ©rences

- Mockup canonique : `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/mockups/merci-chef.html` (ton super, 5/5)
- EXPERIENCE : Contact **jamais** avant lâ€™Ã©motion Merci chef
- DESIGN : `card-merci-chef`, `illustration-panel` (4 moments dont Merci chef)

### Copy guide (V1 â€” ajustable sans changer AC)

| Ton | Stars | Intention |
| --- | --- | --- |
| super | 4â€“5 | Gratitude haute Ã©nergie |
| correct | 3 | Chaleur calme, reconnaissance |
| mitigÃ© | 1â€“2 | Empathie, invitation douce â€” **zÃ©ro culpabilisation** |

### DÃ©pendances

- **4.2** Review.stars disponible
- **Suite :** 4.4 Contact aprÃ¨s CTA Continuer
- Illustration asset : placeholder SVG/CSS OK si asset final absent (mockup CSS chef acceptable en V1)

### Hors scope

- Formulaire Contact / Guest / Sheets
- Soft recognition MÃ©moire
- Animation 3D chef
- Envoi email/SMS de remerciement

### Testing

- Unit : `toneFromStars(5|4)=super`, `(3)=correct`, `(2|1)=mitige`
- Manuel : 3 parcours notes â†’ 3 messages distincts ; aucun champ contact ; illustration visible
- a11y : illustration `aria-hidden` / `alt=""` ; sens portÃ© par le texte
- Contraste : `ink-primary` sur `surface-base` / `accent-soft`

### Project Structure Notes

```text
app/(client)/finish/thanks/
domain/review/toneFromStars.ts
components/â€¦/card-merci-chef.tsx
public/â€¦ ou inline illustration-panel
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 4.3]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` â€” FR-14]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” Merci chef, Voice]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` â€” card-merci-chef, illustration-panel]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/mockups/merci-chef.html`]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` â€” Deferred tons]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
