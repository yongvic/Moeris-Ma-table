# Story 2.3: Consulter le Menu client photo-first

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client anonyme,
I want parcourir le Menu avec de grandes photos, sans compte,
so that je choisis un plat facilement (persona Mame Fatou).

## Acceptance Criteria

1. **Given** une Session client active et un catalogue publiÃ©  
   **When** jâ€™ouvre le Menu depuis lâ€™Accueil ou la nav  
   **Then** je vois les plats disponibles (photo, nom, prix) via `card-menu-item` sans login  
   **And** le contenu correspond au catalogue BO publiÃ©  
   **And** la grille sâ€™adapte (1 col phone / 2 tablette / 3 desktop)  
   **And** un plat indisponible est visible comme tel et non sÃ©lectionnable (pas dâ€™erreur bloquante)  
   **And** la barre de progression indique lâ€™Ã©tape Menu

2. **Given** un Ã©chec rÃ©seau au chargement  
   **When** le Menu ne charge pas  
   **Then** un message clair + retry sâ€™affiche (distinct de Â« plat indisponible Â»)

## Tasks / Subtasks

- [ ] T1. Lecture catalogue domain (AC: #1)
  - [ ] RÃ©utiliser / complÃ©ter `domain/menu/queries` : liste publiÃ©e alignÃ©e Neon (mÃªme source que BO)
  - [ ] Cache Next : `unstable_cache` / `fetch` tags `'menu'` cohÃ©rents avec revalidate 2.2 (AD-16)
  - [ ] **Aucune** Server Action write menu depuis `(client)`

- [ ] T2. Route + UI Menu client (AC: #1)
  - [ ] `app/(client)/menu/page.tsx` (ou segment session) â€” accessible depuis Accueil Â« Voir le menu Â» + barre Menu|Service
  - [ ] Composant `card-menu-item` : photo (`next/image`) + nom + prix ; `elevation.soft` + `rounded.md` + `surface-raised` (DESIGN)
  - [ ] Grille responsive : **1** col &lt;640 Â· **2** cols 640â€“1024 Â· **3** cols &gt;1024 ; coque desktop ~1100â€“1200px
  - [ ] `pattern-background` discret OK (opacitÃ© â‰¤10 %) â€” pas dâ€™illustration dÃ©diÃ©e Menu
  - [ ] Plat `available=false` : badge/Ã©tat Â« Indisponible Â», **non cliquable** / pas dâ€™ouverture fiche (3.1) â€” pas dâ€™erreur globale
  - [ ] Anonyme : zÃ©ro login, zÃ©ro jargon

- [ ] T3. Progression sÃ©jour (AC: #1)
  - [ ] Sur ouverture Menu : Ã©tape session = **Menu** ; `barre-progression-sejour` segment Menu actif (Story 1.5)
  - [ ] Barre non cliquable pour skip ; Service nâ€™avance pas (rappel)

- [ ] T4. Ã‰tats rÃ©seau (AC: #2)
  - [ ] Ã‰chec chargement â†’ message FR + bouton Â« RÃ©essayer Â» (distinct copy Â« Plat indisponible Â»)
  - [ ] Chargement bref acceptable (skeleton lÃ©ger OK) â€” pas de spinner cold interminable

- [ ] T5. Navigation fiche (prÃ©pare 3.1)
  - [ ] Tap plat **disponible** â†’ navigation vers fiche plat / commande (route stub OK si 3.1 pas merge, mais lien stable `menuItemId`)
  - [ ] Pas de carousel obligatoire pour parcourir le menu

- [ ] T6. Garde-fous anti-scope
  - [ ] Pas de `placeOrder` / chips goÃ»ts (â†’ 3.1)
  - [ ] Pas dâ€™Ã©dition menu cÃ´tÃ© client
  - [ ] Pas de BO changes sauf smoke dÃ©pendance 2.2

## Dev Notes

### DÃ©pendances

- **Bloquante :** **2.2** (MenuItem + photos + revalidate).
- **Bloquante produit :** Epic 1 Session active (1.2+) + Accueil/nav (1.3) + barre progression (1.5) â€” sinon stub session minimale documentÃ©e pour dev isolÃ©.
- **Suites :** 3.1 ouvre fiche depuis `card-menu-item`.

### Architecture â€” AD obligatoires

- **AD-3** : lecture seule client.
- **AD-16** : catalogue frais post-mutation BO (&lt; 1 min) â€” vÃ©rifier tag/revalidate bout-en-bout.
- **AD-10** : `next/image` sur `photoUrl` Blob.
- **AD-5 / AD-9** : Menu dans une Session table ; pas de choix de table in-app.
- **AD-2** : imports uniquement `domain` read, jamais `(bo)`.

### Stack pins

| Concern | Pin |
| --- | --- |
| Images | `next/image` + URLs Vercel Blob (2.6.1 cÃ´tÃ© upload dÃ©jÃ  fait) |
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
- Indisponible : Â« Indisponible Â» (Ã©tat mÃ©tier)
- RÃ©seau : Â« Impossible de charger le menu. Â» + Â« RÃ©essayer Â»
- Interdit : Login, Submit, Dashboard, feed Â« pour toi Â»

### AccessibilitÃ©

- Tap target â‰¥44px sur cartes
- Contraste ink sur surfaces Citrus
- Focus-ring visible
- Photo : `alt` = nom du plat (contenu informatif, pas dÃ©coratif)
- `prefers-reduced-motion` si animations grille

### Hors scope strict

- Fiche plat + goÃ»ts + `placeOrder` (3.1)
- Mutations BO (2.2)
- MÃ©moire / prÃ©fÃ©rÃ©s (Epic 5)

### Testing

- Session active + plats BO â†’ Menu affiche photo/nom/prix alignÃ©s
- Resize phone/tablette/desktop â†’ 1/2/3 colonnes
- Plat indisponible visible, non sÃ©lectionnable ; pas dâ€™Ã©cran erreur
- Couper rÃ©seau / mock fail query â†’ message + retry (â‰  indisponible)
- Barre progression = Ã©tape Menu
- AprÃ¨s dÃ©sactivation BO + attente/revalidate â†’ client Ã  jour &lt; 1 min
- Aucune UI Ã©dition

### NFR soft

- NFR1 : premier paint Menu utile &lt; ~3 s 4G (images sizes/priority raisonnables)
- Photo-first : image dominante sur `card-menu-item`

### Previous story intelligence (2.2)

- Tag cache `'menu'` / `revalidateTag` â€” **mÃªme clÃ©** cÃ´tÃ© client
- Convention prix (cents vs Decimal) â€” **rÃ©utiliser** formatage BO
- `photoUrl` peut Ãªtre null â†’ placeholder soft FR, pas crash

### References

- [Source: `epics.md` â€” Story 2.3, FR6]
- [Source: `ARCHITECTURE-SPINE.md` â€” AD-3, AD-10, AD-16]
- [Source: `DESIGN.md` â€” `card-menu-item`, elevation, grid]
- [Source: `EXPERIENCE.md` â€” Menu, responsive, Ã©tats rÃ©seau/indispo, mockups/menu.html]
- [Source: `SPEC.md` â€” CAP-3]
- [Source: `glossary.md` â€” Menu, Client anonyme]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
