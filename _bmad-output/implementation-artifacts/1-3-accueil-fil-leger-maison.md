---
baseline_commit: NO_VCS
---

# Story 1.3: Accueil fil lÃ©ger Â« maison Â»

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a cliente peu Ã  lâ€™aise avec le tÃ©lÃ©phone (Mame Fatou),
I want un Accueil simple avec un seul CTA principal et un accÃ¨s Service discret,
so that je sais quoi faire en quelques secondes sans me perdre.

## Acceptance Criteria

1. **Given** une Session fraÃ®che aprÃ¨s scan  
   **When** jâ€™arrive sur lâ€™Accueil  
   **Then** je vois un tutoiement doux (ex. Â« Pose-toi Â»), un CTA principal Â« Voir le menu Â», et un accÃ¨s secondaire Service

2. **And** il nâ€™y a pas de hub Ã  4 tuiles Ã©gales, pas de demande dâ€™identitÃ©, pas de jargon Login/Submit

3. **And** le slot illustration dâ€™accueil est prÃ©sent ; layouts phone / tablette / desktop selon EXPERIENCE

4. **And** la navigation fil lÃ©ger (Menu | Service) est en place (destinations Menu/Service peuvent Ãªtre stub jusquâ€™aux epics suivants)

## Tasks / Subtasks

- [x] T1. Shell Accueil + `card-accueil` (AC: #1, #2)
  - [x] Composer `app/(client)/` Accueil comme cible post-scan (route dÃ©jÃ  redirigÃ©e depuis 1.2)
  - [x] Composant `card-accueil` : titre tutoiement (Â« Pose-toi. Â»), sous-texte court optionnel type Â« On sâ€™occupe de toi. Â»
  - [x] `button-primary` : Â« Voir le menu Â» â†’ stub Menu (`/(client)/menu` placeholder OK)
  - [x] `button-secondary` : accÃ¨s Service discret (libellÃ© type Â« Jâ€™ai besoin de quelque chose Â» / Service) â†’ stub Service
  - [x] Un seul CTA primaire visible ; secondaire clairement moins fort (DESIGN)
  - [x] Interdire : hub 4 tuiles, formulaire identitÃ©, Login/Submit/Dashboard

- [x] T2. `illustration-panel` slot Accueil (AC: #3)
  - [x] Slot `illustration-panel` prÃ©sent (placeholder SVG/asset OK si pas dâ€™illustration finale)
  - [x] `alt=""` dÃ©coratif â€” sens portÃ© par le texte
  - [x] Touches pattern-a / pattern-b abstraites autorisÃ©es autour du personnage (DESIGN)

- [x] T3. Layouts responsive EXPERIENCE (AC: #3)
  - [x] Phone (&lt;640) : une colonne ; marges `margin-mobile` (20)
  - [x] Tablette (640â€“1024) : Accueil split possible (visuel | texte+CTA)
  - [x] Desktop (&gt;1024) : coque max-width ~1100â€“1200px centrÃ©e ; composition Â« landing table Â» (bloc organique + slot visuel + CTA) â€” **pas** de nav marketing SaaS
  - [x] Tap targets â‰¥ 44px ; tokens Citrus 1.1 (accent + ink-primary sur primaire)

- [x] T4. Nav fil lÃ©ger Menu | Service (AC: #4)
  - [x] Barre / rail : destinations **Menu** et **Service** (mÃªmes destinations tous viewports)
  - [x] Phone : barre bas ; desktop : en-tÃªte ou rail discret
  - [x] Stubs pages Menu + Service (copy FR courte Â« BientÃ´t Â» OK) â€” pas dâ€™implÃ©mentation catalogue/missions
  - [x] **Terminer mon expÃ©rience** absent (gate epic 4 / AD-13)

- [x] T5. Session + step Accueil (AC: #1)
  - [x] Accueil exige Session active (cookie 1.2) ; sinon rediriger vers entry QR / message FR
  - [x] Sâ€™assurer `Session.step = WELCOME` sur session fraÃ®che (alignÃ© 1.2/1.5)
  - [x] Pas de bloc MÃ©moire / Â« Bon retour Â» (epic 5)

- [x] T6. Garde-fous
  - [x] Pas banniÃ¨re reprise (1.4), pas barre progression (1.5), pas print (1.6)
  - [x] Pas Auth, Menu mÃ©tier, Order, ServiceRequest

## Dev Notes

### Contexte epic

PremiÃ¨re surface UX Â« maison Â» du fil client. Persona Mame Fatou : gros CTA, peu de texte, zÃ©ro jargon. Posture anti-dashboard (UX-DR6).

### DÃ©pendance story prÃ©cÃ©dente

- **1.1** : tokens Citrus, polices Fredoka/Nunito Sans, shells.
- **1.2** : Session + cookie + redirect Accueil fonctionnels. Sans 1.2, lâ€™Accueil ne peut pas Ãªtre Â« aprÃ¨s scan Â».

### Architecture

- Surfaces dans `app/(client)` uniquement ; logique session via `domain/session` (AD-2).
- Pas de nouvelles tables DB requises.
- AD-17 : responsive multi-support obligatoire.
- AD-5/AD-19 : ne pas dÃ©marrer Guest / mÃ©moire soft ici.

### UX / DESIGN â€” composants

| Composant | RÃ¨gles |
| --- | --- |
| `card-accueil` | illustration + display title + primary + secondary |
| `button-primary` | accent bg, **ink-primary** text, pill, min 44px |
| `button-secondary` | surface-raised, border, elevation.soft, jamais mÃªme poids que primary |
| `illustration-panel` | moment Accueil ; alt="" |

Voice : tutoiement doux â€” Do Â« Pose-toi. Â» / Donâ€™t Â« Bienvenue sur notre plateforme ! Â».

RÃ©f. composition : `mockups/accueil.html` (spines gagnent en conflit).

### Fichiers Ã  crÃ©er / modifier

| Path | Action |
| --- | --- |
| `app/(client)/layout.tsx` | UPDATE â€” shell nav Menu\|Service |
| `app/(client)/page.tsx` ou `accueil/page.tsx` | UPDATE â€” Accueil rÃ©el |
| `app/(client)/menu/page.tsx` | NEW stub |
| `app/(client)/service/page.tsx` | NEW stub |
| `components/client/card-accueil.tsx` (ou `app/(client)/_components/`) | NEW |
| `components/client/button-primary.tsx` | NEW (si pas encore) |
| `components/client/button-secondary.tsx` | NEW |
| `components/client/illustration-panel.tsx` | NEW |
| `components/client/client-nav.tsx` | NEW â€” Menu \| Service |
| `public/` ou `assets/` placeholder illustration | NEW optionnel |

### Hors scope

- Catalogue menu photo-first (2.3), fiche commande (3.1), catalogue service 4 tuiles mÃ©tier (3.3)
- `banniere-reprise`, `barre-progression-sejour`, `bloc-memoire`
- Copy marketing desktop / multi-CTA

### Testing

- Manuel viewport phone/tablette/desktop : 1 CTA primaire, Service secondaire, illustration slot, nav Menu|Service
- A11y : focus-ring, contraste accent/ink-primary, cibles 44px
- `prefers-reduced-motion` : pas dâ€™anim bloquante sur illustration
- Session absente â†’ pas dâ€™Accueil Â« fantÃ´me Â» authentifiÃ©

### References

- [Source: `epics.md` â€” Story 1.3, FR5, UX-DR6/DR7/DR9]
- [Source: `EXPERIENCE.md` â€” Foundation nav fil lÃ©ger, Accueil IA, Responsive, Voice, `card-accueil`]
- [Source: `DESIGN.md` â€” Components card-accueil, buttons, illustration-panel]
- [Source: `mockups/accueil.html`]
- [Source: stories 1.1, 1.2]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- `npm run build` OK â€” routes `/accueil`, `/menu`, `/service`
- `npm test` 5/5 ; `npm run lint` OK
- Nav : bottom bar phone / top rail â‰¥sm ; pas de Â« Terminer mon expÃ©rience Â»

### Completion Notes List

- `card-accueil` : Â« Pose-toi. Â» + Â« On sâ€™occupe de toi. Â» + CTA Voir le menu + Service discret
- `illustration-panel` dÃ©coratif (assiette + blobs pattern-a/b) ; reduced-motion respectÃ©
- Layouts responsive split â‰¥sm ; coque max 1200px ; landing table organique
- Session requise pour Accueil Â« maison Â» ; sinon message scan QR
- Stubs Menu/Service Â« BientÃ´t Â»

### Change Log

- 2026-07-24 â€” Story 1.3 Accueil fil lÃ©ger maison â†’ status `review`

### File List

- components/client/button-primary.tsx
- components/client/button-secondary.tsx
- components/client/illustration-panel.tsx
- components/client/card-accueil.tsx
- components/client/client-nav.tsx
- app/(client)/layout.tsx
- app/(client)/accueil/page.tsx
- app/(client)/menu/page.tsx
- app/(client)/service/page.tsx
- app/globals.css
- _bmad-output/implementation-artifacts/1-3-accueil-fil-leger-maison.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
