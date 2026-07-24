# Story 4.4: Contact opt-in (tél XOR email)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want laisser volontairement mon téléphone ou mon email après le merci chef,
so that Moeris peut me prévenir des soirées — sans spam ni obligation.

## Acceptance Criteria

1. **Given** je viens de voir Merci chef  
   **When** l’écran Contact s’affiche  
   **Then** un sélecteur **Téléphone / Email** précède **un seul** champ actif (jamais les deux champs simultanés) — composant `selecteur-contact` (C1)

2. **Given** l’écran Contact  
   **When** je choisis de partir  
   **Then** je peux **skip** sans friction ; aucun contact n’est requis pour avoir vu le merci ni pour avoir noté

3. **Given** je soumets un contact valide (tél **ou** email selon sélecteur)  
   **When** l’opt-in est enregistré  
   **Then** le **Guest** est **upserté** en Neon via `domain/guest` (clé normalisée : tél **E.164** ou email **lower**) avec finalité **soirées Moeris**  
   **And** une sync **one-way async best-effort** Neon → **Google Sheet** est déclenchée **sans bloquer** l’UX (échec loggé, succès client quand même)

4. **Given** l’écran Contact  
   **When** je regarde les champs  
   **Then** **WhatsApp n’est pas** un champ de saisie V1  
   **And** le copy rappelle l’**anti-spam** / soirées Moeris (peut mentionner garder les goûts : « garde mon goût pour la prochaine fois »)

5. **Given** privacy NFR6 (soft, documenté)  
   **When** l’opt-in est stocké  
   **Then** conservation cible **24 mois** après dernière interaction ; effacement = **process manuel documenté** (≤15 j ouvrés Neon + Sheet) — **pas** de self-service effacement in-app V1  
   **And** pas de PII contact en clair dans les logs appli (ids `guestId` / `sessionId` seulement)

## Tasks / Subtasks

- [ ] T1. Modèle Guest + upsert domain (AC: #3, #5)
  - [ ] Prisma `Guest` : `phoneE164` unique nullable XOR `emailLower` unique nullable ; `purpose` / finalité soirées Moeris ; `lastInteractionAt` ; lien optionnel Session
  - [ ] **Uniquement** via `domain/guest` upsert (AD-19) — aucun INSERT Guest ad hoc depuis review/UI
  - [ ] Normalisation : lib E.164 (indicatif SN par défaut raisonnable si national) ; email `trim().toLowerCase()`
  - [ ] Lier Session → Guest après succès ; poser **cookie soft device** (distinct session séjour) pour Epic 5.1 si possible

- [ ] T2. Server Action contact + Sheets (AC: #3)
  - [ ] `domain/contact` : `submitContactOptIn` → Neon d’abord (AD-8) puis enqueue/fire-and-forget sync Sheet
  - [ ] `infra/sheets` : Google Sheets API **v4** ; one-way ; retry soft optionnel ; **jamais** Sheet comme lookup runtime
  - [ ] UX : réponse succès dès Neon OK même si Sheet down
  - [ ] Erreurs validation : `{ ok: false, code, message }` FR doux

- [ ] T3. UI `selecteur-contact` (AC: #1, #2, #4)
  - [ ] Sélecteur Téléphone|Email puis **un** input ; bascule vide le champ inactif
  - [ ] Skip CTA explicite (« Plus tard » / « Non merci ») → Accueil ou fin douce sans écriture
  - [ ] Fond `surface-raised`, `elevation.soft` OK pour panneau formulaire ; `pattern-background` (pas d’illustration dédiée Contact)
  - [ ] Copy anti-spam FR ; pas WhatsApp ; pas Login
  - [ ] Tap targets ≥44px ; focus-ring

- [ ] T4. Privacy process (AC: #5) — livrable doc léger
  - [ ] Ajouter note ops courte (ex. `docs/privacy-contact-erasure.md` ou section README ops) : conservation 24 mois ; demande effacement → manuel Neon+Sheet ≤15 j ouvrés ; pas de revente ; revue conseil avant envoi massif
  - [ ] Pas d’UI self-service erasure V1

- [ ] T5. Garde-fous
  - [ ] Pas de tracking table/heure/compagnie
  - [ ] Pas de double-write concurrent Sheet+Neon
  - [ ] Contacts clair **staff-only** (pas exposés routes client en lecture liste)

## Dev Notes

### Contexte epic

Dernière étape Epic 4. Alimente **Epic 5** (Guest connu + soft cookie). SM-2 = opt-in parmi sessions avec avis.

### Architecture — ADs critiques

| AD | Règle |
| --- | --- |
| **AD-8** | Neon vérité ; Sheet miroir async best-effort ; reconnaissance/prefs = Neon only |
| **AD-15** | Téléphone **XOR** email ; finalité soirées Moeris ; pas tracking intrusif |
| **AD-19** | Upsert Guest **uniquement** `domain/guest` (clé E.164 / email lower) |
| **AD-4** | Mutation = Server Action |
| **AD-5** | Distinguer cookie **session séjour** vs cookie/token **device soft** pour 2ᵉ visite |

### Stack pins

- Google Sheets API **v4**
- Prisma 7.9.0 / Neon
- Secrets env Vercel uniquement (service account Sheets, etc.)

### NFR6 — à rappeler (pas d’AC runtime self-service)

- Conservation contacts **24 mois** après dernière interaction (opt-in ou reconnaissance)
- Effacement sur demande : **manuel documenté**, ≤ **15 jours ouvrés** (Neon + miroir Sheet)
- Pas de revente ; revue conseil avant envoi massif soirées Moeris
- Conformité pratiques V1 : opt-in, finalité, minimisation, staff-only

### Dépendances

- **4.3** Merci chef avant Contact
- **Séquentiel 4.x** respecté
- **Epic 5** consomme Guest + soft link créés ici
- Soft cookie peut être posé dès opt-in réussi (prépare 5.1)

### Hors scope

- WhatsApp champ / deep link
- Self-service RGPD portal
- Envoi massif soirées (hors V1 build ; process conseil)
- Hash/chiffrement contact avancé (spine deferred — clair staff-only V1)
- Mémoire UI Accueil (5.1)

### Testing

- Unit : normalisation email/phone ; XOR refus si les deux fournis
- Intégration : upsert 2× même contact → 1 Guest
- Manuel : skip sans écriture ; submit OK si Sheet mock fail ; pas de champ WhatsApp
- Sécurité : grep logs — pas de numéro/email en clair
- Fixtures : Guest pour Epic 5

### Project Structure Notes

```text
app/(client)/finish/contact/
domain/contact/submitContactOptIn.ts
domain/guest/upsertGuest.ts
infra/sheets/syncGuest.ts
prisma/schema.prisma          # Guest
docs/…                        # process effacement NFR6
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 4.4, NFR6 note]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` — AD-8, AD-15, AD-19]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` — FR-15, §11 Privacy]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — selecteur-contact, Contact skip]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-07-24.md` — NFR6 soft]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
