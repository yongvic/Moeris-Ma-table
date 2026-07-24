# Story 4.2: Avis court (étoiles + emoji)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want laisser un avis rapide sans clavier,
so that je peux noter mon expérience en quelques taps.

## Acceptance Criteria

1. **Given** j’ai déclenché « Terminer mon expérience » (gate 4.1 OK)  
   **When** je suis sur l’écran Avis  
   **Then** je dois choisir **1–5 étoiles** (obligatoire) ; un **emoji plat** est **optionnel** ; **aucun texte libre n’est requis** (pas de textarea obligatoire)

2. **Given** le composant `avis-stars`  
   **When** N étoiles sont sélectionnées (N ∈ 1..5)  
   **Then** le nom accessible exposé est **« Note : N sur 5 »**  
   **And** actif/inactif = **forme + couleur** (pleines `accent` / contour `ink-secondary`) — jamais couleur seule

3. **Given** une note valide (1–5)  
   **When** j’envoie l’avis  
   **Then** une entité **Review** est stockée en Neon, rattachée à la **Session** (et à une Order de la session le cas échéant — ex. dernière Order)  
   **And** transition **immédiate** vers Merci chef (pas d’écran froid type « Submit » / spinner interminable)  
   **And** la barre de progression séjour est à l’étape **Fin** (nom accessible « Étape 4 sur 4 » / Fin)

4. **Given** envoi sans étoiles  
   **When** je tente de valider  
   **Then** l’envoi est refusé côté UI + domain ; message doux FR (pas de jargon)

## Tasks / Subtasks

- [ ] T1. Modèle + mutation Review (AC: #3, #4)
  - [ ] Prisma : `Review` lié `Session` (1 Review / session fin V1 acceptable) ; champs `stars` Int 1–5, `dishEmoji` String? optionnel, `orderId` optionnel, timestamps UTC
  - [ ] Server Action `domain/review` : `submitReview({ sessionId, stars, dishEmoji? })` — AD-4
  - [ ] Valider gate AD-13 avant insert ; refuser si déjà Review pour la session (idempotent soft OK)
  - [ ] Erreurs : `{ ok: false, code, message }` ; pas d’exception nue UI

- [ ] T2. UI `avis-stars` + emoji (AC: #1, #2)
  - [ ] Composant client `avis-stars` : tap targets ≥44px ; focus-ring ; aria-label dynamique « Note : N sur 5 »
  - [ ] Set fermé d’emojis plats (ex. 3–8) — optionnel, décoratif sauf si seule info (alors libellé)
  - [ ] CTA envoi FR chaud (« Envoyer mon avis » ou équivalent) — **jamais** Submit/Login
  - [ ] Complétable 100 % sans clavier

- [ ] T3. Progression Fin + navigation Merci (AC: #3)
  - [ ] Mettre étape session = Fin à l’entrée/succès Avis (aligné EXPERIENCE : pendant Avis/Merci/Contact, Fin active)
  - [ ] Redirect immédiat vers surface Merci chef (Story 4.3 peut stubber le message ; 4.2 doit **atteindre** la route)
  - [ ] Respecter `prefers-reduced-motion` si animation de transition (UX-DR11)

- [ ] T4. Garde-fous
  - [ ] Pas de champ commentaire obligatoire ; pas de multi-critères
  - [ ] Pas de demande Contact sur cet écran
  - [ ] Pas de sync Sheets / Guest ici

## Dev Notes

### Contexte epic

Suite directe de **4.1**. Produit le **Review** consommé par **4.3** (tons) et métrique SM-1. Contact = **4.4** seulement après Merci.

### Architecture — ADs

| AD | Implication 4.2 |
| --- | --- |
| **AD-13** | Refuser submit si pas d’Order ≥ `received` |
| **AD-4** | `submitReview` = Server Action `domain/review` |
| **AD-5** | Données avis en Neon sur Session/Review — **pas** dans le cookie |
| ER spine | `Session \|\|--o\| Review : ends_with` |

### Stack / conventions

- Prisma **7.9.0**, Neon, runtime **Node**
- Copy UI **FR** ; ids/enums code **EN** (`stars`, `dishEmoji`)
- Logging : pas de PII ; `sessionId` / `reviewId` OK

### UX

- Tokens Citrus ; étoiles actives `accent`, inactives contour `ink-secondary`
- Voix : tutoiement doux, phrases courtes
- Micro-mission ~10–30 s ; pas de mur de texte

### Dépendances

- **4.1** gate + route Terminer
- **Epic 3** Orders
- **1.5** barre progression (étape Fin)
- **Suites :** 4.3 lit `stars` ; 4.4 après Merci

### Hors scope

- 3 tons Merci chef (copy/illustration) — 4.3
- Contact / Guest / Sheets — 4.4
- Préférés / ranking Preference — Epic 5 (peut plus tard dériver des avis ; **pas** ici)

### Testing

- Unit : validation stars 0/6 refusés ; 1–5 OK ; emoji null OK
- a11y : lecteur d’écran annonce « Note : N sur 5 » ; distinction forme+couleur
- Manuel : envoi → Merci immédiat ; barre = Fin ; Review en DB liée session
- NFR1 soft : écran léger, polices déjà `swap`

### Project Structure Notes

```text
app/(client)/finish/review/     # écran Avis
domain/review/submitReview.ts
prisma/schema.prisma            # model Review
components/…/avis-stars.tsx
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 4.2]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` — AD-4, AD-13, ER Review]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` — FR-13]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` — avis-stars, a11y]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — Avis, barre Fin, Flow 1]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
