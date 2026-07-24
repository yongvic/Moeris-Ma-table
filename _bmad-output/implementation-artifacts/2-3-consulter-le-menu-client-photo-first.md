# Story 2.3: Consulter le Menu client photo-first

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client anonyme,
I want parcourir le Menu avec de grandes photos, sans compte,
so that je choisis un plat facilement (persona Mame Fatou).

## Acceptance Criteria

1. **Given** une Session client active et un catalogue publié  
   **When** j’ouvre le Menu depuis l’Accueil ou la nav  
   **Then** je vois les plats disponibles (photo, nom, prix) via `card-menu-item` sans login  
   **And** le contenu correspond au catalogue BO publié  
   **And** la grille s’adapte (1 col phone / 2 tablette / 3 desktop)  
   **And** un plat indisponible est visible comme tel et non sélectionnable (pas d’erreur bloquante)  
   **And** la barre de progression indique l’étape Menu

2. **Given** un échec réseau au chargement  
   **When** le Menu ne charge pas  
   **Then** un message clair + retry s’affiche (distinct de « plat indisponible »)

## Tasks / Subtasks

- [ ] T1. Lecture catalogue domain (AC: #1)
  - [ ] Réutiliser / compléter `domain/menu/queries` : liste publiée alignée Neon (même source que BO)
  - [ ] Cache Next : `unstable_cache` / `fetch` tags `'menu'` cohérents avec revalidate 2.2 (AD-16)
  - [ ] **Aucune** Server Action write menu depuis `(client)`

- [ ] T2. Route + UI Menu client (AC: #1)
  - [ ] `app/(client)/menu/page.tsx` (ou segment session) — accessible depuis Accueil « Voir le menu » + barre Menu|Service
  - [ ] Composant `card-menu-item` : photo (`next/image`) + nom + prix ; `elevation.soft` + `rounded.md` + `surface-raised` (DESIGN)
  - [ ] Grille responsive : **1** col &lt;640 · **2** cols 640–1024 · **3** cols &gt;1024 ; coque desktop ~1100–1200px
  - [ ] `pattern-background` discret OK (opacité ≤10 %) — pas d’illustration dédiée Menu
  - [ ] Plat `available=false` : badge/état « Indisponible », **non cliquable** / pas d’ouverture fiche (3.1) — pas d’erreur globale
  - [ ] Anonyme : zéro login, zéro jargon

- [ ] T3. Progression séjour (AC: #1)
  - [ ] Sur ouverture Menu : étape session = **Menu** ; `barre-progression-sejour` segment Menu actif (Story 1.5)
  - [ ] Barre non cliquable pour skip ; Service n’avance pas (rappel)

- [ ] T4. États réseau (AC: #2)
  - [ ] Échec chargement → message FR + bouton « Réessayer » (distinct copy « Plat indisponible »)
  - [ ] Chargement bref acceptable (skeleton léger OK) — pas de spinner cold interminable

- [ ] T5. Navigation fiche (prépare 3.1)
  - [ ] Tap plat **disponible** → navigation vers fiche plat / commande (route stub OK si 3.1 pas merge, mais lien stable `menuItemId`)
  - [ ] Pas de carousel obligatoire pour parcourir le menu

- [ ] T6. Garde-fous anti-scope
  - [ ] Pas de `placeOrder` / chips goûts (→ 3.1)
  - [ ] Pas d’édition menu côté client
  - [ ] Pas de BO changes sauf smoke dépendance 2.2

## Dev Notes

### Dépendances

- **Bloquante :** **2.2** (MenuItem + photos + revalidate).
- **Bloquante produit :** Epic 1 Session active (1.2+) + Accueil/nav (1.3) + barre progression (1.5) — sinon stub session minimale documentée pour dev isolé.
- **Suites :** 3.1 ouvre fiche depuis `card-menu-item`.

### Architecture — AD obligatoires

- **AD-3** : lecture seule client.
- **AD-16** : catalogue frais post-mutation BO (&lt; 1 min) — vérifier tag/revalidate bout-en-bout.
- **AD-10** : `next/image` sur `photoUrl` Blob.
- **AD-5 / AD-9** : Menu dans une Session table ; pas de choix de table in-app.
- **AD-2** : imports uniquement `domain` read, jamais `(bo)`.

### Stack pins

| Concern | Pin |
| --- | --- |
| Images | `next/image` + URLs Vercel Blob (2.6.1 côté upload déjà fait) |
| Data | Prisma 7.9 / Neon |
| Auth client | **aucune** |

### Chemins cibles

```text
app/(client)/menu/page.tsx              # NEW/UPDATE
components/client/card-menu-item.tsx    # NEW
components/client/menu-grid.tsx         # NEW
components/client/menu-error-retry.tsx  # NEW
domain/menu/queries.ts                  # UPDATE (published list)
```

### UX / copy FR

- Voix tutoiement : titres courts ; prix lisibles
- Indisponible : « Indisponible » (état métier)
- Réseau : « Impossible de charger le menu. » + « Réessayer »
- Interdit : Login, Submit, Dashboard, feed « pour toi »

### Accessibilité

- Tap target ≥44px sur cartes
- Contraste ink sur surfaces Citrus
- Focus-ring visible
- Photo : `alt` = nom du plat (contenu informatif, pas décoratif)
- `prefers-reduced-motion` si animations grille

### Hors scope strict

- Fiche plat + goûts + `placeOrder` (3.1)
- Mutations BO (2.2)
- Mémoire / préférés (Epic 5)

### Testing

- Session active + plats BO → Menu affiche photo/nom/prix alignés
- Resize phone/tablette/desktop → 1/2/3 colonnes
- Plat indisponible visible, non sélectionnable ; pas d’écran erreur
- Couper réseau / mock fail query → message + retry (≠ indisponible)
- Barre progression = étape Menu
- Après désactivation BO + attente/revalidate → client à jour &lt; 1 min
- Aucune UI édition

### NFR soft

- NFR1 : premier paint Menu utile &lt; ~3 s 4G (images sizes/priority raisonnables)
- Photo-first : image dominante sur `card-menu-item`

### Previous story intelligence (2.2)

- Tag cache `'menu'` / `revalidateTag` — **même clé** côté client
- Convention prix (cents vs Decimal) — **réutiliser** formatage BO
- `photoUrl` peut être null → placeholder soft FR, pas crash

### References

- [Source: `epics.md` — Story 2.3, FR6]
- [Source: `ARCHITECTURE-SPINE.md` — AD-3, AD-10, AD-16]
- [Source: `DESIGN.md` — `card-menu-item`, elevation, grid]
- [Source: `EXPERIENCE.md` — Menu, responsive, états réseau/indispo, mockups/menu.html]
- [Source: `SPEC.md` — CAP-3]
- [Source: `glossary.md` — Menu, Client anonyme]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
