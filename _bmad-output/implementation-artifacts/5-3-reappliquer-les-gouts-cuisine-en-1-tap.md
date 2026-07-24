# Story 5.3: RÃ©appliquer les GoÃ»ts cuisine en 1 tap

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a cliente reconnue,
I want rÃ©appliquer mes goÃ»ts mÃ©morisÃ©s en un geste,
so that je nâ€™ai pas Ã  les retaper Ã  chaque visite.

## Acceptance Criteria

1. **Given** une MÃ©moire active avec goÃ»ts cuisine mÃ©morisÃ©s  
   **When** je tape lâ€™action Â« rÃ©appliquer mes goÃ»ts Â» (ou Ã©quivalent FR doux)  
   **Then** le **panier / fiche commande en cours** est **prÃ©rempli** avec ces goÃ»ts

2. **Given** lâ€™action rÃ©appliquer  
   **When** elle sâ€™exÃ©cute  
   **Then** **aucune Order passÃ©e nâ€™est mutÃ©e** (goÃ»ts snapshotÃ©s sur Orders restent immuables â€” AD-16 / AD-20)

3. **Given** lâ€™UI MÃ©moire / fiche  
   **When** le geste est proposÃ©  
   **Then** il tient en **un tap** (micro-mission) â€” pas de formulaire multi-Ã©tapes pour rÃ©appliquer

4. **Given** absences  
   **When** pas de goÃ»ts mÃ©morisÃ©s ou MÃ©moire inactive  
   **Then** le CTA rÃ©appliquer est absent ou disabled avec explication douce â€” pas dâ€™erreur brutale

## Tasks / Subtasks

- [ ] T1. Persistance goÃ»ts Guest (AC: #1, #2)
  - [ ] Stocker goÃ»ts mÃ©morisÃ©s cÃ´tÃ© Guest/Preference (ex. JSON goÃ»ts derniers / agrÃ©gÃ©s depuis Order snapshots Ã  lâ€™envoi Epic 3)
  - [ ] Lecture via `domain/guest` ; **Ã©criture panier** via `domain/session` (AD-18 : panier sur Session uniquement)
  - [ ] Server Action `reapplyTastePreferences(sessionId)` : copie goÃ»ts â†’ Session cart / draft fiche â€” **zÃ©ro** `UPDATE Order`

- [ ] T2. UI 1-tap (AC: #3, #4)
  - [ ] CTA dans `bloc-memoire` et/ou `fiche-commande` : Â« Remettre mes goÃ»ts Â» / Â« On te remet le mÃªme ? Â»
  - [ ] Un tap â†’ feedback soft (Â« Câ€™est notÃ© Â») ; chips `chip-gout` reflÃ¨tent lâ€™Ã©tat
  - [ ] Tap target â‰¥44px ; pas de jargon Submit
  - [ ] `prefers-reduced-motion` si micro-anim

- [ ] T3. Invariants anti-rÃ©gression (AC: #2)
  - [ ] Tests : Orders historiques inchangÃ©es (compare before/after ids + taste snapshots)
  - [ ] Panier Session seulement jusquâ€™Ã  prochain `placeOrder` (qui snapshotera Ã  nouveau â€” AD-16)

- [ ] T4. Garde-fous
  - [ ] Pas dâ€™allergies obligatoires
  - [ ] Pas de mutation catalogue Menu
  - [ ] Pas de Sheet
  - [ ] MÃ©moire requise (5.1 ou 5.2) â€” sinon pas de CTA

## Dev Notes

### Contexte epic

FR-19 / AD-20 : rÃ©apply = **1 action domain** qui prÃ©remplit le panier session. Climax Flow 2 EXPERIENCE.

### Architecture

| AD | Implication 5.3 |
| --- | --- |
| **AD-20** | RÃ©apply = 1 action ; prÃ©remplit panier ; **ne mute pas** Orders passÃ©es ; prefs bornÃ©es |
| **AD-18** | Panier (lignes + goÃ»ts en cours) sur **Session** seulement |
| **AD-16** | GoÃ»ts **snapshotÃ©s** sur Order Ã  `placeOrder` â€” immuables ensuite |
| **AD-4** | Server Action domain |
| **AD-12** | Nouvel Order seulement via `placeOrder` ultÃ©rieur â€” rÃ©apply â‰  placeOrder |

### Shape donnÃ©es (indicatif)

```text
Session.cart.tastes  â†â”€â”€ reapply â”€â”€  Guest.rememberedTastes | Preference.tastePayload
Order.tasteSnapshot  (immutable)     # jamais touchÃ© par reapply
```

### DÃ©pendances

- **5.1 / 5.2** MÃ©moire active
- **Epic 3** fiche `chip-gout` + panier Session + snapshot Order
- **4.4** Guest pour avoir une mÃ©moire contact-path (soft-only possible si goÃ»ts liÃ©s device/Guest)

### Hors scope

- Auto-commande / recommander plats automatiquement (PrÃ©fÃ©rÃ©s chips â‰  auto-add panier sauf goÃ»ts)
- Ã‰dition historique commandes
- Allergies comme systÃ¨me
- Notifications WhatsApp goÃ»ts

### Testing

- Unit : `reapplyTastePreferences` Ã©crit Session, `UPDATE` count Orders = 0
- Manuel : MÃ©moire â†’ 1 tap â†’ fiche montre goÃ»ts ; envoyer commande â†’ Order a snapshot ; Orders old intactes
- Cas vide : Guest sans goÃ»ts â†’ pas de CTA ou disabled
- RÃ©gression Epic 3 : placeOrder toujours snapshot depuis panier session

### Project Structure Notes

```text
domain/guest/reapplyTastePreferences.ts
domain/session/updateCartTastes.ts
components/â€¦/bloc-memoire.tsx      # CTA
components/â€¦/fiche-commande.tsx    # reflet chips
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 5.3]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` â€” AD-16, AD-18, AD-20]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` â€” FR-19]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” bloc-memoire, Flow 2 climax]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` â€” chip-gout]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
