---
baseline_commit: NO_VCS
---

# Story 1.3: Accueil fil léger « maison »

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a cliente peu à l’aise avec le téléphone (Mame Fatou),
I want un Accueil simple avec un seul CTA principal et un accès Service discret,
so that je sais quoi faire en quelques secondes sans me perdre.

## Acceptance Criteria

1. **Given** une Session fraîche après scan  
   **When** j’arrive sur l’Accueil  
   **Then** je vois un tutoiement doux (ex. « Pose-toi »), un CTA principal « Voir le menu », et un accès secondaire Service

2. **And** il n’y a pas de hub à 4 tuiles égales, pas de demande d’identité, pas de jargon Login/Submit

3. **And** le slot illustration d’accueil est présent ; layouts phone / tablette / desktop selon EXPERIENCE

4. **And** la navigation fil léger (Menu | Service) est en place (destinations Menu/Service peuvent être stub jusqu’aux epics suivants)

## Tasks / Subtasks

- [x] T1. Shell Accueil + `card-accueil` (AC: #1, #2)
  - [x] Composer `app/(client)/` Accueil comme cible post-scan (route déjà redirigée depuis 1.2)
  - [x] Composant `card-accueil` : titre tutoiement (« Pose-toi. »), sous-texte court optionnel type « On s’occupe de toi. »
  - [x] `button-primary` : « Voir le menu » → stub Menu (`/(client)/menu` placeholder OK)
  - [x] `button-secondary` : accès Service discret (libellé type « J’ai besoin de quelque chose » / Service) → stub Service
  - [x] Un seul CTA primaire visible ; secondaire clairement moins fort (DESIGN)
  - [x] Interdire : hub 4 tuiles, formulaire identité, Login/Submit/Dashboard

- [x] T2. `illustration-panel` slot Accueil (AC: #3)
  - [x] Slot `illustration-panel` présent (placeholder SVG/asset OK si pas d’illustration finale)
  - [x] `alt=""` décoratif — sens porté par le texte
  - [x] Touches pattern-a / pattern-b abstraites autorisées autour du personnage (DESIGN)

- [x] T3. Layouts responsive EXPERIENCE (AC: #3)
  - [x] Phone (&lt;640) : une colonne ; marges `margin-mobile` (20)
  - [x] Tablette (640–1024) : Accueil split possible (visuel | texte+CTA)
  - [x] Desktop (&gt;1024) : coque max-width ~1100–1200px centrée ; composition « landing table » (bloc organique + slot visuel + CTA) — **pas** de nav marketing SaaS
  - [x] Tap targets ≥ 44px ; tokens Citrus 1.1 (accent + ink-primary sur primaire)

- [x] T4. Nav fil léger Menu | Service (AC: #4)
  - [x] Barre / rail : destinations **Menu** et **Service** (mêmes destinations tous viewports)
  - [x] Phone : barre bas ; desktop : en-tête ou rail discret
  - [x] Stubs pages Menu + Service (copy FR courte « Bientôt » OK) — pas d’implémentation catalogue/missions
  - [x] **Terminer mon expérience** absent (gate epic 4 / AD-13)

- [x] T5. Session + step Accueil (AC: #1)
  - [x] Accueil exige Session active (cookie 1.2) ; sinon rediriger vers entry QR / message FR
  - [x] S’assurer `Session.step = WELCOME` sur session fraîche (aligné 1.2/1.5)
  - [x] Pas de bloc Mémoire / « Bon retour » (epic 5)

- [x] T6. Garde-fous
  - [x] Pas bannière reprise (1.4), pas barre progression (1.5), pas print (1.6)
  - [x] Pas Auth, Menu métier, Order, ServiceRequest

## Dev Notes

### Contexte epic

Première surface UX « maison » du fil client. Persona Mame Fatou : gros CTA, peu de texte, zéro jargon. Posture anti-dashboard (UX-DR6).

### Dépendance story précédente

- **1.1** : tokens Citrus, polices Fredoka/Nunito Sans, shells.
- **1.2** : Session + cookie + redirect Accueil fonctionnels. Sans 1.2, l’Accueil ne peut pas être « après scan ».

### Architecture

- Surfaces dans `app/(client)` uniquement ; logique session via `domain/session` (AD-2).
- Pas de nouvelles tables DB requises.
- AD-17 : responsive multi-support obligatoire.
- AD-5/AD-19 : ne pas démarrer Guest / mémoire soft ici.

### UX / DESIGN — composants

| Composant | Règles |
| --- | --- |
| `card-accueil` | illustration + display title + primary + secondary |
| `button-primary` | accent bg, **ink-primary** text, pill, min 44px |
| `button-secondary` | surface-raised, border, elevation.soft, jamais même poids que primary |
| `illustration-panel` | moment Accueil ; alt="" |

Voice : tutoiement doux — Do « Pose-toi. » / Don’t « Bienvenue sur notre plateforme ! ».

Réf. composition : `mockups/accueil.html` (spines gagnent en conflit).

### Fichiers à créer / modifier

| Path | Action |
| --- | --- |
| `app/(client)/layout.tsx` | UPDATE — shell nav Menu\|Service |
| `app/(client)/page.tsx` ou `accueil/page.tsx` | UPDATE — Accueil réel |
| `app/(client)/menu/page.tsx` | NEW stub |
| `app/(client)/service/page.tsx` | NEW stub |
| `components/client/card-accueil.tsx` (ou `app/(client)/_components/`) | NEW |
| `components/client/button-primary.tsx` | NEW (si pas encore) |
| `components/client/button-secondary.tsx` | NEW |
| `components/client/illustration-panel.tsx` | NEW |
| `components/client/client-nav.tsx` | NEW — Menu \| Service |
| `public/` ou `assets/` placeholder illustration | NEW optionnel |

### Hors scope

- Catalogue menu photo-first (2.3), fiche commande (3.1), catalogue service 4 tuiles métier (3.3)
- `banniere-reprise`, `barre-progression-sejour`, `bloc-memoire`
- Copy marketing desktop / multi-CTA

### Testing

- Manuel viewport phone/tablette/desktop : 1 CTA primaire, Service secondaire, illustration slot, nav Menu|Service
- A11y : focus-ring, contraste accent/ink-primary, cibles 44px
- `prefers-reduced-motion` : pas d’anim bloquante sur illustration
- Session absente → pas d’Accueil « fantôme » authentifié

### References

- [Source: `epics.md` — Story 1.3, FR5, UX-DR6/DR7/DR9]
- [Source: `EXPERIENCE.md` — Foundation nav fil léger, Accueil IA, Responsive, Voice, `card-accueil`]
- [Source: `DESIGN.md` — Components card-accueil, buttons, illustration-panel]
- [Source: `mockups/accueil.html`]
- [Source: stories 1.1, 1.2]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- `npm run build` OK — routes `/accueil`, `/menu`, `/service`
- `npm test` 5/5 ; `npm run lint` OK
- Nav : bottom bar phone / top rail ≥sm ; pas de « Terminer mon expérience »

### Completion Notes List

- `card-accueil` : « Pose-toi. » + « On s’occupe de toi. » + CTA Voir le menu + Service discret
- `illustration-panel` décoratif (assiette + blobs pattern-a/b) ; reduced-motion respecté
- Layouts responsive split ≥sm ; coque max 1200px ; landing table organique
- Session requise pour Accueil « maison » ; sinon message scan QR
- Stubs Menu/Service « Bientôt »

### Change Log

- 2026-07-24 — Story 1.3 Accueil fil léger maison → status `review`

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
