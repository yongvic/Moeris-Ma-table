# Story 5.3: Réappliquer les Goûts cuisine en 1 tap

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a cliente reconnue,
I want réappliquer mes goûts mémorisés en un geste,
so that je n’ai pas à les retaper à chaque visite.

## Acceptance Criteria

1. **Given** une Mémoire active avec goûts cuisine mémorisés  
   **When** je tape l’action « réappliquer mes goûts » (ou équivalent FR doux)  
   **Then** le **panier / fiche commande en cours** est **prérempli** avec ces goûts

2. **Given** l’action réappliquer  
   **When** elle s’exécute  
   **Then** **aucune Order passée n’est mutée** (goûts snapshotés sur Orders restent immuables — AD-16 / AD-20)

3. **Given** l’UI Mémoire / fiche  
   **When** le geste est proposé  
   **Then** il tient en **un tap** (micro-mission) — pas de formulaire multi-étapes pour réappliquer

4. **Given** absences  
   **When** pas de goûts mémorisés ou Mémoire inactive  
   **Then** le CTA réappliquer est absent ou disabled avec explication douce — pas d’erreur brutale

## Tasks / Subtasks

- [ ] T1. Persistance goûts Guest (AC: #1, #2)
  - [ ] Stocker goûts mémorisés côté Guest/Preference (ex. JSON goûts derniers / agrégés depuis Order snapshots à l’envoi Epic 3)
  - [ ] Lecture via `domain/guest` ; **écriture panier** via `domain/session` (AD-18 : panier sur Session uniquement)
  - [ ] Server Action `reapplyTastePreferences(sessionId)` : copie goûts → Session cart / draft fiche — **zéro** `UPDATE Order`

- [ ] T2. UI 1-tap (AC: #3, #4)
  - [ ] CTA dans `bloc-memoire` et/ou `fiche-commande` : « Remettre mes goûts » / « On te remet le même ? »
  - [ ] Un tap → feedback soft (« C’est noté ») ; chips `chip-gout` reflètent l’état
  - [ ] Tap target ≥44px ; pas de jargon Submit
  - [ ] `prefers-reduced-motion` si micro-anim

- [ ] T3. Invariants anti-régression (AC: #2)
  - [ ] Tests : Orders historiques inchangées (compare before/after ids + taste snapshots)
  - [ ] Panier Session seulement jusqu’à prochain `placeOrder` (qui snapshotera à nouveau — AD-16)

- [ ] T4. Garde-fous
  - [ ] Pas d’allergies obligatoires
  - [ ] Pas de mutation catalogue Menu
  - [ ] Pas de Sheet
  - [ ] Mémoire requise (5.1 ou 5.2) — sinon pas de CTA

## Dev Notes

### Contexte epic

FR-19 / AD-20 : réapply = **1 action domain** qui préremplit le panier session. Climax Flow 2 EXPERIENCE.

### Architecture

| AD | Implication 5.3 |
| --- | --- |
| **AD-20** | Réapply = 1 action ; préremplit panier ; **ne mute pas** Orders passées ; prefs bornées |
| **AD-18** | Panier (lignes + goûts en cours) sur **Session** seulement |
| **AD-16** | Goûts **snapshotés** sur Order à `placeOrder` — immuables ensuite |
| **AD-4** | Server Action domain |
| **AD-12** | Nouvel Order seulement via `placeOrder` ultérieur — réapply ≠ placeOrder |

### Shape données (indicatif)

```text
Session.cart.tastes  ←── reapply ──  Guest.rememberedTastes | Preference.tastePayload
Order.tasteSnapshot  (immutable)     # jamais touché par reapply
```

### Dépendances

- **5.1 / 5.2** Mémoire active
- **Epic 3** fiche `chip-gout` + panier Session + snapshot Order
- **4.4** Guest pour avoir une mémoire contact-path (soft-only possible si goûts liés device/Guest)

### Hors scope

- Auto-commande / recommander plats automatiquement (Préférés chips ≠ auto-add panier sauf goûts)
- Édition historique commandes
- Allergies comme système
- Notifications WhatsApp goûts

### Testing

- Unit : `reapplyTastePreferences` écrit Session, `UPDATE` count Orders = 0
- Manuel : Mémoire → 1 tap → fiche montre goûts ; envoyer commande → Order a snapshot ; Orders old intactes
- Cas vide : Guest sans goûts → pas de CTA ou disabled
- Régression Epic 3 : placeOrder toujours snapshot depuis panier session

### Project Structure Notes

```text
domain/guest/reapplyTastePreferences.ts
domain/session/updateCartTastes.ts
components/…/bloc-memoire.tsx      # CTA
components/…/fiche-commande.tsx    # reflet chips
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 5.3]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` — AD-16, AD-18, AD-20]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` — FR-19]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — bloc-memoire, Flow 2 climax]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` — chip-gout]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
