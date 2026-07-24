# Story 4.2: Avis court (Ã©toiles + emoji)

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want laisser un avis rapide sans clavier,
so that je peux noter mon expÃ©rience en quelques taps.

## Acceptance Criteria

1. **Given** jâ€™ai dÃ©clenchÃ© Â« Terminer mon expÃ©rience Â» (gate 4.1 OK)  
   **When** je suis sur lâ€™Ã©cran Avis  
   **Then** je dois choisir **1â€“5 Ã©toiles** (obligatoire) ; un **emoji plat** est **optionnel** ; **aucun texte libre nâ€™est requis** (pas de textarea obligatoire)

2. **Given** le composant `avis-stars`  
   **When** N Ã©toiles sont sÃ©lectionnÃ©es (N âˆˆ 1..5)  
   **Then** le nom accessible exposÃ© est **Â« Note : N sur 5 Â»**  
   **And** actif/inactif = **forme + couleur** (pleines `accent` / contour `ink-secondary`) â€” jamais couleur seule

3. **Given** une note valide (1â€“5)  
   **When** jâ€™envoie lâ€™avis  
   **Then** une entitÃ© **Review** est stockÃ©e en Neon, rattachÃ©e Ã  la **Session** (et Ã  une Order de la session le cas Ã©chÃ©ant â€” ex. derniÃ¨re Order)  
   **And** transition **immÃ©diate** vers Merci chef (pas dâ€™Ã©cran froid type Â« Submit Â» / spinner interminable)  
   **And** la barre de progression sÃ©jour est Ã  lâ€™Ã©tape **Fin** (nom accessible Â« Ã‰tape 4 sur 4 Â» / Fin)

4. **Given** envoi sans Ã©toiles  
   **When** je tente de valider  
   **Then** lâ€™envoi est refusÃ© cÃ´tÃ© UI + domain ; message doux FR (pas de jargon)

## Tasks / Subtasks

- [ ] T1. ModÃ¨le + mutation Review (AC: #3, #4)
  - [ ] Prisma : `Review` liÃ© `Session` (1 Review / session fin V1 acceptable) ; champs `stars` Int 1â€“5, `dishEmoji` String? optionnel, `orderId` optionnel, timestamps UTC
  - [ ] Server Action `domain/review` : `submitReview({ sessionId, stars, dishEmoji? })` â€” AD-4
  - [ ] Valider gate AD-13 avant insert ; refuser si dÃ©jÃ  Review pour la session (idempotent soft OK)
  - [ ] Erreurs : `{ ok: false, code, message }` ; pas dâ€™exception nue UI

- [ ] T2. UI `avis-stars` + emoji (AC: #1, #2)
  - [ ] Composant client `avis-stars` : tap targets â‰¥44px ; focus-ring ; aria-label dynamique Â« Note : N sur 5 Â»
  - [ ] Set fermÃ© dâ€™emojis plats (ex. 3â€“8) â€” optionnel, dÃ©coratif sauf si seule info (alors libellÃ©)
  - [ ] CTA envoi FR chaud (Â« Envoyer mon avis Â» ou Ã©quivalent) â€” **jamais** Submit/Login
  - [ ] ComplÃ©table 100 % sans clavier

- [ ] T3. Progression Fin + navigation Merci (AC: #3)
  - [ ] Mettre Ã©tape session = Fin Ã  lâ€™entrÃ©e/succÃ¨s Avis (alignÃ© EXPERIENCE : pendant Avis/Merci/Contact, Fin active)
  - [ ] Redirect immÃ©diat vers surface Merci chef (Story 4.3 peut stubber le message ; 4.2 doit **atteindre** la route)
  - [ ] Respecter `prefers-reduced-motion` si animation de transition (UX-DR11)

- [ ] T4. Garde-fous
  - [ ] Pas de champ commentaire obligatoire ; pas de multi-critÃ¨res
  - [ ] Pas de demande Contact sur cet Ã©cran
  - [ ] Pas de sync Sheets / Guest ici

## Dev Notes

### Contexte epic

Suite directe de **4.1**. Produit le **Review** consommÃ© par **4.3** (tons) et mÃ©trique SM-1. Contact = **4.4** seulement aprÃ¨s Merci.

### Architecture â€” ADs

| AD | Implication 4.2 |
| --- | --- |
| **AD-13** | Refuser submit si pas dâ€™Order â‰¥ `received` |
| **AD-4** | `submitReview` = Server Action `domain/review` |
| **AD-5** | DonnÃ©es avis en Neon sur Session/Review â€” **pas** dans le cookie |
| ER spine | `Session \|\|--o\| Review : ends_with` |

### Stack / conventions

- Prisma **7.9.0**, Neon, runtime **Node**
- Copy UI **FR** ; ids/enums code **EN** (`stars`, `dishEmoji`)
- Logging : pas de PII ; `sessionId` / `reviewId` OK

### UX

- Tokens Citrus ; Ã©toiles actives `accent`, inactives contour `ink-secondary`
- Voix : tutoiement doux, phrases courtes
- Micro-mission ~10â€“30 s ; pas de mur de texte

### DÃ©pendances

- **4.1** gate + route Terminer
- **Epic 3** Orders
- **1.5** barre progression (Ã©tape Fin)
- **Suites :** 4.3 lit `stars` ; 4.4 aprÃ¨s Merci

### Hors scope

- 3 tons Merci chef (copy/illustration) â€” 4.3
- Contact / Guest / Sheets â€” 4.4
- PrÃ©fÃ©rÃ©s / ranking Preference â€” Epic 5 (peut plus tard dÃ©river des avis ; **pas** ici)

### Testing

- Unit : validation stars 0/6 refusÃ©s ; 1â€“5 OK ; emoji null OK
- a11y : lecteur dâ€™Ã©cran annonce Â« Note : N sur 5 Â» ; distinction forme+couleur
- Manuel : envoi â†’ Merci immÃ©diat ; barre = Fin ; Review en DB liÃ©e session
- NFR1 soft : Ã©cran lÃ©ger, polices dÃ©jÃ  `swap`

### Project Structure Notes

```text
app/(client)/finish/review/     # Ã©cran Avis
domain/review/submitReview.ts
prisma/schema.prisma            # model Review
components/â€¦/avis-stars.tsx
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 4.2]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` â€” AD-4, AD-13, ER Review]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` â€” FR-13]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` â€” avis-stars, a11y]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` â€” Avis, barre Fin, Flow 1]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
