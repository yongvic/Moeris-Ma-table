# Story 5.1: Reconnaissance soft + bloc MÃ©moire

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a cliente de retour,
I want Ãªtre reconnue sans mot de passe si mon appareil le permet,
so that je retrouve un accueil Â« Bon retour Â» avec mes prÃ©fÃ©rÃ©s.

## Acceptance Criteria

1. **Given** un Guest dÃ©jÃ  identifiÃ© liÃ© Ã  un cookie/appareil soft  
   **When** je scanne Ma table pour une **nouvelle soirÃ©e** (nouvelle Session)  
   **Then** lâ€™Accueil propose la **MÃ©moire** sans login (bloc Â« Bon retour Â» + illustration dÃ©diÃ©e `illustration-panel` moment bon retour)

2. **Given** la MÃ©moire affichÃ©e  
   **When** les PrÃ©fÃ©rÃ©s sont listÃ©s  
   **Then** les PrÃ©fÃ©rÃ©s courts **top 3â€“5** sâ€™affichent en chips (`bloc-memoire`)  
   **And** **pas** de journal table/heure/compagnie

3. **Given** le bloc MÃ©moire  
   **When** je choisis dâ€™ignorer  
   **Then** je peux rester en parcours **anonyme** immÃ©diatement (CTA discret Â« Continuer sans ma mÃ©moire Â» / Ã©quivalent)

4. **Given** un Guest avec historique (avis/commandes passÃ©s)  
   **When** les PrÃ©fÃ©rÃ©s sont calculÃ©s/stockÃ©s  
   **Then** au plus **5** `Preference` sont exposÃ©es (**plafond AD-20** ; ranking simple V1 acceptable)

5. **Given** AD-5  
   **When** soft recognition sâ€™applique  
   **Then** câ€™est **distinct** de la **reprise R2** (mÃªme soirÃ©e Â« Tu en Ã©tais Ã â€¦ Â») : nouvelle Session = MÃ©moire Guest, **pas** restauration dâ€™Ã©tape dâ€™une ancienne soirÃ©e

## Tasks / Subtasks

- [ ] T1. Soft device link + rÃ©solution Guest (AC: #1, #5)
  - [ ] Cookie/token device soft (httpOnly, distinct du cookie Session sÃ©jour) posÃ© Ã  lâ€™opt-in 4.4 ou Ã  la liaison Guest
  - [ ] Au scan nouvelle Session : si soft token â†’ resolve Guest via `domain/guest` ; **ne pas** confondre avec reprise Ã©tape R2 (`banniere-reprise`)
  - [ ] Pas de mot de passe ; client jamais Auth.js

- [ ] T2. Preference store + ranking (AC: #2, #4)
  - [ ] ModÃ¨le `Preference` liÃ© Guest (max 5 exposÃ©s)
  - [ ] Ranking V1 simple documentÃ© â€” ex. frÃ©quence `MenuItem` dans OrderLines passÃ©es du Guest, tie-break rÃ©cence ; **cap 5**
  - [ ] Job/lazy compute Ã  la reconnaissance ou post-order (idempotent) ; Neon only (AD-8)

- [ ] T3. UI `bloc-memoire` sur Accueil (AC: #1, #2, #3)
  - [ ] Ton Â« Bon retour Â» ; illustration dÃ©diÃ©e `alt=""` 
  - [ ] Chips PrÃ©fÃ©rÃ©s 3â€“5 ; section-gap vs reste Accueil
  - [ ] Ignorer â†’ hide mÃ©moire pour la session / parcours anonyme
  - [ ] CTA principal Accueil reste Â« Voir le menu Â» si anonyme ; avec mÃ©moire, MÃ©moire = bloc dÃ©diÃ© **sans** transformer Accueil en dashboard 4 tuiles

- [ ] T4. Garde-fous
  - [ ] Pas de login client
  - [ ] Pas de lecture Sheet pour prefs
  - [ ] Ne pas muter Orders passÃ©es
  - [ ] RÃ©apply goÃ»ts = Story **5.3** (peut afficher teaser CTA dÃ©sactivÃ©/stub si 5.3 pas prÃªt â€” prÃ©fÃ©rer lien prÃªt si mÃªme sprint)

## Dev Notes

### Contexte epic

Epic 5 = UJ-2 MÃ©moire. Soft auto **et** ressaisie (5.2) sont complÃ©mentaires. Soft cookie **peut** Ãªtre posÃ© dÃ¨s 4.4.

### Architecture

| AD | Implication 5.1 |
| --- | --- |
| **AD-5** | Session sÃ©jour â‰  MÃ©moire 2áµ‰ visite ; cookie opaque session vs soft device â†’ Guest |
| **AD-8** | Prefs / reconnaissance = **Neon only** |
| **AD-19** | Toute liaison Guest via `domain/guest` |
| **AD-20** | Top **3â€“5** Preference ; pas journal tracking |
| **AD-6** | Client anonyme â€” jamais credentials |

### Ranking V1 (figer en code + commentaire)

1. Compter occurrences MenuItem dans Orders historiques liÃ©es Guest (via sessions passÃ©es liÃ©es).
2. Trier desc frÃ©quence, puis `updatedAt` desc.
3. Truncate Ã  5 ; UI affiche 3â€“5 selon dispo.

Si &lt;3 prefs : afficher ce qui existe (1â€“2 OK) ; si 0 : soft recognition sans chips (message doux) ou ne pas forcer le bloc.

### DÃ©pendances

- **4.4** Guest + soft cookie (chemin contact)
- Soft cookie peut exister sans 5.2
- **Epic 3** Orders/goÃ»ts pour alimenter prefs
- **1.3** Accueil host du `bloc-memoire`
- **Distinct** 1.4 reprise R2
- **Fixtures** Guest+Preference recommandÃ©es pour dev isolÃ©

### Hors scope

- Ressaisie contact UI (5.2)
- RÃ©apply 1-tap goÃ»ts (5.3) â€” sauf stub CTA
- Avantages / fidÃ©litÃ© / allergies
- Lien magique / PWA

### Testing

- Manuel : Guest+soft cookie â†’ nouvelle Session â†’ Bon retour + â‰¤5 chips ; ignorer â†’ anonyme
- Manuel : sans soft â†’ Accueil classique (pas de faux Bon retour)
- Unit : ranking cap 5 ; jamais &gt;5 exposÃ©s
- RÃ©gression : reprise R2 mÃªme soirÃ©e inchangÃ©e

### NFR soft

- NFR1 : Accueil lÃ©ger (&lt;~3s)
- NFR6 : lastInteractionAt Guest mis Ã  jour Ã  la reconnaissance soft (conservation 24 mois)

### Project Structure Notes

```text
app/(client)/â€¦/accueil          # bloc-memoire conditionnel
domain/guest/resolveSoft.ts
domain/guest/preferences.ts
components/â€¦/bloc-memoire.tsx
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 5.1]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` â€” AD-5, AD-20]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` â€” FR-16, FR-18]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” bloc-memoire, Flow 2]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` â€” illustration-panel Bon retour]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
