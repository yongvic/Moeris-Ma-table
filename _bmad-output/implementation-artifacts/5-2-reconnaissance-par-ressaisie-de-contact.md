# Story 5.2: Reconnaissance par ressaisie de contact

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a cliente de retour sans cookie,
I want ressaisir mon tÃ©lÃ©phone ou email pour retrouver ma MÃ©moire,
so that je ne dÃ©pende pas uniquement de lâ€™appareil.

## Acceptance Criteria

1. **Given** jâ€™ai dÃ©jÃ  laissÃ© un contact opt-in auparavant (Guest existant)  
   **When** je ressaisis le **mÃªme** tÃ©l ou email (normalisÃ© **E.164** / **email lower**)  
   **Then** la **MÃ©moire** du Guest est dÃ©bloquÃ©e sur lâ€™Accueil (mÃªme `bloc-memoire` que 5.1)

2. **Given** un contact **inconnu** ou une faute de frappe  
   **When** je valide la ressaisie  
   **Then** un message **clair non culpabilisant** sâ€™affiche  
   **And** le parcours **anonyme** reste **immÃ©diatement** disponible (pas de blocage, pas de retry obligatoire)

3. **Given** le flux de ressaisie  
   **When** lâ€™UI est prÃ©sentÃ©e  
   **Then** **aucun mot de passe** nâ€™est demandÃ©  
   **And** le sÃ©lecteur suit le pattern XOR tÃ©l/email (rÃ©utiliser `selecteur-contact` ou variante Â« Me reconnaÃ®tre Â»)

4. **Given** une ressaisie rÃ©ussie  
   **When** le Guest est liÃ© Ã  la Session / device  
   **Then** upsert/liaison passe par **`domain/guest`** (AD-19)  
   **And** lookup = **Neon only** (pas Google Sheet) (AD-8)  
   **And** optionnel : (re)poser soft cookie device pour visites suivantes (5.1)

## Tasks / Subtasks

- [ ] T1. Action `recognizeByContact` (AC: #1, #2, #4)
  - [ ] Server Action `domain/guest` : normalize â†’ find Guest â†’ link Session + soft device
  - [ ] Unknown : `{ ok: false, code: 'GUEST_NOT_FOUND', message }` FR non blÃ¢mant
  - [ ] Pas dâ€™Auth.js ; pas de password hash

- [ ] T2. UI ressaisie Accueil / entrÃ©e MÃ©moire (AC: #2, #3)
  - [ ] EntrÃ©e discrÃ¨te si pas de soft recognition (Â« DÃ©jÃ  venuÂ·e ? Â» / Â« Retrouver ma mÃ©moire Â»)
  - [ ] XOR tÃ©l|email ; un champ ; validation locale lÃ©gÃ¨re
  - [ ] SuccÃ¨s â†’ afficher `bloc-memoire` (prefs via mÃªme API 5.1)
  - [ ] Ã‰chec â†’ message doux + CTA anonyme (Â« Continuer sans mÃ©moire Â»)
  - [ ] Ã‰tat UX-DR10 Â« contact inconnu 2áµ‰ visite Â» couvert

- [ ] T3. Normalisation alignÃ©e 4.4 (AC: #1)
  - [ ] **MÃªme** helpers E.164 / email lower que opt-in â€” Ã©viter faux nÃ©gatifs
  - [ ] Tests croisÃ©s : opt-in puis ressaisie mÃªme valeur â†’ hit

- [ ] T4. Garde-fous
  - [ ] Rate-limit soft optionnel (anti-Ã©numÃ©ration basique) sans friction UX forte
  - [ ] Pas de PII dans logs
  - [ ] Pas de crÃ©ation Guest Â« fantÃ´me Â» sur unknown (unknown = no insert)

## Dev Notes

### Contexte epic

ComplÃ©ment de **5.1** (soft). PRD FR-17. Cas limite EXPERIENCE Flow 2 : unknown â†’ message clair + anonyme.

### Architecture

| AD | Implication 5.2 |
| --- | --- |
| **AD-8** | Lookup Neon only |
| **AD-15** | Canal unique XOR |
| **AD-19** | Liaison via `domain/guest` uniquement |
| **AD-5** | DÃ©bloque MÃ©moire, pas reprise dâ€™Ã©tape R2 |
| **AD-6** | Pas de login client |

### Copy Ã©chec (guide)

- OK : Â« On ne retrouve pas ce contact â€” tu peux continuer sans mÃ©moire. Â»
- Interdit : Â« Identifiants incorrects Â», Â« Unauthorized Â», blÃ¢me faute de frappe

### DÃ©pendances

- **4.4** Guest crÃ©Ã© Ã  lâ€™opt-in (chemin contact) â€” **requis** pour hit positif
- **5.1** `bloc-memoire` + Preference read (rÃ©utiliser)
- Soft cookie **non requis** pour cette story (câ€™est le fallback sans cookie)
- Fixtures Guest pour tests

### Hors scope

- Reset password / OTP / magic link
- CrÃ©ation de compte
- Self-service erasure (NFR6 manuel)
- RÃ©apply goÃ»ts (5.3)

### Testing

- E2E lÃ©ger : opt-in â†’ clear cookies â†’ ressaisie mÃªme tÃ©l â†’ MÃ©moire
- Unknown email â†’ message + Accueil anonyme utilisable
- Normalisation : `Email@X.com` = `email@x.com`
- RÃ©gression : soft 5.1 toujours prioritaire si cookie prÃ©sent (pas forcer ressaisie)

### NFR6 soft

- Mettre Ã  jour `lastInteractionAt` sur reconnaissance rÃ©ussie (horloge conservation 24 mois)

### Project Structure Notes

```text
app/(client)/â€¦                 # entrÃ©e ressaisie Accueil
domain/guest/recognizeByContact.ts
domain/guest/normalizeContact.ts  # partagÃ© 4.4
components/â€¦/selecteur-contact.tsx  # rÃ©emploi
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 5.2]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` â€” AD-8, AD-19]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` â€” FR-17]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” Flow 2 cas limite]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” UX-DR10 contact inconnu]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
