# Story 4.4: Contact opt-in (tÃ©l XOR email)

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want laisser volontairement mon tÃ©lÃ©phone ou mon email aprÃ¨s le merci chef,
so that Moeris peut me prÃ©venir des soirÃ©es â€” sans spam ni obligation.

## Acceptance Criteria

1. **Given** je viens de voir Merci chef  
   **When** lâ€™Ã©cran Contact sâ€™affiche  
   **Then** un sÃ©lecteur **TÃ©lÃ©phone / Email** prÃ©cÃ¨de **un seul** champ actif (jamais les deux champs simultanÃ©s) â€” composant `selecteur-contact` (C1)

2. **Given** lâ€™Ã©cran Contact  
   **When** je choisis de partir  
   **Then** je peux **skip** sans friction ; aucun contact nâ€™est requis pour avoir vu le merci ni pour avoir notÃ©

3. **Given** je soumets un contact valide (tÃ©l **ou** email selon sÃ©lecteur)  
   **When** lâ€™opt-in est enregistrÃ©  
   **Then** le **Guest** est **upsertÃ©** en Neon via `domain/guest` (clÃ© normalisÃ©e : tÃ©l **E.164** ou email **lower**) avec finalitÃ© **soirÃ©es Moeris**  
   **And** une sync **one-way async best-effort** Neon â†’ **Google Sheet** est dÃ©clenchÃ©e **sans bloquer** lâ€™UX (Ã©chec loggÃ©, succÃ¨s client quand mÃªme)

4. **Given** lâ€™Ã©cran Contact  
   **When** je regarde les champs  
   **Then** **WhatsApp nâ€™est pas** un champ de saisie V1  
   **And** le copy rappelle lâ€™**anti-spam** / soirÃ©es Moeris (peut mentionner garder les goÃ»ts : Â« garde mon goÃ»t pour la prochaine fois Â»)

5. **Given** privacy NFR6 (soft, documentÃ©)  
   **When** lâ€™opt-in est stockÃ©  
   **Then** conservation cible **24 mois** aprÃ¨s derniÃ¨re interaction ; effacement = **process manuel documentÃ©** (â‰¤15 j ouvrÃ©s Neon + Sheet) â€” **pas** de self-service effacement in-app V1  
   **And** pas de PII contact en clair dans les logs appli (ids `guestId` / `sessionId` seulement)

## Tasks / Subtasks

- [ ] T1. ModÃ¨le Guest + upsert domain (AC: #3, #5)
  - [ ] Prisma `Guest` : `phoneE164` unique nullable XOR `emailLower` unique nullable ; `purpose` / finalitÃ© soirÃ©es Moeris ; `lastInteractionAt` ; lien optionnel Session
  - [ ] **Uniquement** via `domain/guest` upsert (AD-19) â€” aucun INSERT Guest ad hoc depuis review/UI
  - [ ] Normalisation : lib E.164 (indicatif SN par dÃ©faut raisonnable si national) ; email `trim().toLowerCase()`
  - [ ] Lier Session â†’ Guest aprÃ¨s succÃ¨s ; poser **cookie soft device** (distinct session sÃ©jour) pour Epic 5.1 si possible

- [ ] T2. Server Action contact + Sheets (AC: #3)
  - [ ] `domain/contact` : `submitContactOptIn` â†’ Neon dâ€™abord (AD-8) puis enqueue/fire-and-forget sync Sheet
  - [ ] `infra/sheets` : Google Sheets API **v4** ; one-way ; retry soft optionnel ; **jamais** Sheet comme lookup runtime
  - [ ] UX : rÃ©ponse succÃ¨s dÃ¨s Neon OK mÃªme si Sheet down
  - [ ] Erreurs validation : `{ ok: false, code, message }` FR doux

- [ ] T3. UI `selecteur-contact` (AC: #1, #2, #4)
  - [ ] SÃ©lecteur TÃ©lÃ©phone|Email puis **un** input ; bascule vide le champ inactif
  - [ ] Skip CTA explicite (Â« Plus tard Â» / Â« Non merci Â») â†’ Accueil ou fin douce sans Ã©criture
  - [ ] Fond `surface-raised`, `elevation.soft` OK pour panneau formulaire ; `pattern-background` (pas dâ€™illustration dÃ©diÃ©e Contact)
  - [ ] Copy anti-spam FR ; pas WhatsApp ; pas Login
  - [ ] Tap targets â‰¥44px ; focus-ring

- [ ] T4. Privacy process (AC: #5) â€” livrable doc lÃ©ger
  - [ ] Ajouter note ops courte (ex. `docs/privacy-contact-erasure.md` ou section README ops) : conservation 24 mois ; demande effacement â†’ manuel Neon+Sheet â‰¤15 j ouvrÃ©s ; pas de revente ; revue conseil avant envoi massif
  - [ ] Pas dâ€™UI self-service erasure V1

- [ ] T5. Garde-fous
  - [ ] Pas de tracking table/heure/compagnie
  - [ ] Pas de double-write concurrent Sheet+Neon
  - [ ] Contacts clair **staff-only** (pas exposÃ©s routes client en lecture liste)

## Dev Notes

### Contexte epic

DerniÃ¨re Ã©tape Epic 4. Alimente **Epic 5** (Guest connu + soft cookie). SM-2 = opt-in parmi sessions avec avis.

### Architecture â€” ADs critiques

| AD | RÃ¨gle |
| --- | --- |
| **AD-8** | Neon vÃ©ritÃ© ; Sheet miroir async best-effort ; reconnaissance/prefs = Neon only |
| **AD-15** | TÃ©lÃ©phone **XOR** email ; finalitÃ© soirÃ©es Moeris ; pas tracking intrusif |
| **AD-19** | Upsert Guest **uniquement** `domain/guest` (clÃ© E.164 / email lower) |
| **AD-4** | Mutation = Server Action |
| **AD-5** | Distinguer cookie **session sÃ©jour** vs cookie/token **device soft** pour 2áµ‰ visite |

### Stack pins

- Google Sheets API **v4**
- Prisma 7.9.0 / Neon
- Secrets env Vercel uniquement (service account Sheets, etc.)

### NFR6 â€” Ã  rappeler (pas dâ€™AC runtime self-service)

- Conservation contacts **24 mois** aprÃ¨s derniÃ¨re interaction (opt-in ou reconnaissance)
- Effacement sur demande : **manuel documentÃ©**, â‰¤ **15 jours ouvrÃ©s** (Neon + miroir Sheet)
- Pas de revente ; revue conseil avant envoi massif soirÃ©es Moeris
- ConformitÃ© pratiques V1 : opt-in, finalitÃ©, minimisation, staff-only

### DÃ©pendances

- **4.3** Merci chef avant Contact
- **SÃ©quentiel 4.x** respectÃ©
- **Epic 5** consomme Guest + soft link crÃ©Ã©s ici
- Soft cookie peut Ãªtre posÃ© dÃ¨s opt-in rÃ©ussi (prÃ©pare 5.1)

### Hors scope

- WhatsApp champ / deep link
- Self-service RGPD portal
- Envoi massif soirÃ©es (hors V1 build ; process conseil)
- Hash/chiffrement contact avancÃ© (spine deferred â€” clair staff-only V1)
- MÃ©moire UI Accueil (5.1)

### Testing

- Unit : normalisation email/phone ; XOR refus si les deux fournis
- IntÃ©gration : upsert 2Ã— mÃªme contact â†’ 1 Guest
- Manuel : skip sans Ã©criture ; submit OK si Sheet mock fail ; pas de champ WhatsApp
- SÃ©curitÃ© : grep logs â€” pas de numÃ©ro/email en clair
- Fixtures : Guest pour Epic 5

### Project Structure Notes

```text
app/(client)/finish/contact/
domain/contact/submitContactOptIn.ts
domain/guest/upsertGuest.ts
infra/sheets/syncGuest.ts
prisma/schema.prisma          # Guest
docs/â€¦                        # process effacement NFR6
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 4.4, NFR6 note]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` â€” AD-8, AD-15, AD-19]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` â€” FR-15, Â§11 Privacy]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” selecteur-contact, Contact skip]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-07-24.md` â€” NFR6 soft]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
