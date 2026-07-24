# Story 2.2: GÃ©rer le Menu en Back-office

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a responsable / serveur authentifiÃ©,
I want crÃ©er, modifier et dÃ©sactiver des plats (nom, prix, disponibilitÃ©, photo),
so that le catalogue servi aux clients reste juste pendant le service.

## Acceptance Criteria

1. **Given** je suis authentifiÃ© BO  
   **When** je crÃ©e ou modifie un plat (nom, prix, dispo, photo via Vercel Blob)  
   **Then** les mÃ©tadonnÃ©es et lâ€™URL image sont persistÃ©es en Neon  
   **And** lâ€™upload photo nâ€™est possible que depuis le BO authentifiÃ©

2. **Given** un plat actif  
   **When** je le dÃ©sactive  
   **Then** il est marquÃ© indisponible / retirÃ© cÃ´tÃ© client en moins dâ€™1 minute (revalidate/tag cache)

3. **And** les Ã©tats vides BO Menu et erreurs de sauvegarde affichent un message clair

## Tasks / Subtasks

- [ ] T1. SchÃ©ma MenuItem + Prisma Neon (AC: #1)
  - [ ] Model `MenuItem` : `id`, `name`, `price` (Decimal/Int centimes â€” choisir **une** convention et documenter), `available` (bool), `photoUrl` (nullable), `createdAt`, `updatedAt`, soft fields optionnels (`sortOrder`)
  - [ ] Prisma **7.9.0** + adapter Neon ; migrations via `DIRECT_URL` ; runtime Node
  - [ ] Seed â‰¥2â€“3 plats pour smoke (dont 1 dispo / 1 indispo)

- [ ] T2. Domain Ã©criture menu (AC: #1, #2)
  - [ ] `domain/menu/` Server Actions : `createMenuItem`, `updateMenuItem`, `setMenuItemAvailability` (ou CRUD unifiÃ©)
  - [ ] Gate auth staff en tÃªte de chaque action (`auth()` + role salle) â€” refuse `{ ok:false, code, message }`
  - [ ] **Lecture seule** exposÃ©e aussi pour 2.3 (`listPublishedMenu` / tags) â€” Ã©criture **jamais** importable depuis `(client)` (AD-2, AD-3)
  - [ ] AprÃ¨s mutation : `revalidateTag('menu')` / `revalidatePath` client menu â€” garantir fraÃ®cheur **&lt; 1 min** (AD-16) ; pas de cache menu Â« immortal Â»

- [ ] T3. Upload photo Vercel Blob (AC: #1)
  - [ ] DÃ©pendance `@vercel/blob@2.6.1` uniquement
  - [ ] Upload **BO only** (token / server action authentifiÃ©e) â€” jamais endpoint anonyme
  - [ ] Stocker URL rÃ©sultante sur `MenuItem.photoUrl` ; client futur = `next/image` (AD-10)
  - [ ] Types image raisonnables (jpeg/png/webp) + taille max pragmatique ; message FR si Ã©chec

- [ ] T4. UI BO Menu â€” `ligne-menu-bo` (AC: #1, #2, #3)
  - [ ] Remplacer stub onglet Menu : liste + crÃ©er / Ã©diter inline (nom, prix, dispo, photo)
  - [ ] Composant `ligne-menu-bo` ; dispo via `status-pill-bo` (label + couleur, jamais couleur seule)
  - [ ] Ã‰tat vide : message nommÃ© (Â« Aucun plat pour lâ€™instant Â») + CTA crÃ©er â€” pas dâ€™Ã©cran blanc
  - [ ] Erreur sauvegarde : message clair ; UI ne prÃ©sume pas le succÃ¨s tant que `{ ok:true }`
  - [ ] Tap targets / focus-ring Citrus ; light mode only

- [ ] T5. Garde-fous anti-scope
  - [ ] Pas dâ€™UI menu client photo-first complÃ¨te (â†’ 2.3) â€” un smoke revalidate suffit
  - [ ] Pas de commandes / Pusher / Service
  - [ ] Pas Cloudinary/S3 ; pas dâ€™upload depuis `(client)`

## Dev Notes

### DÃ©pendances

- **Bloquante :** Story **2.1** (auth staff + shell BO).
- **Souhaitable :** Epic 1 Prisma/Neon dÃ©jÃ  branchÃ©s ; sinon poser stack data ici.
- **Suites :** 2.3 consomme le catalogue publiÃ© ; 3.x suppose des `MenuItem` existants.

### Architecture â€” AD obligatoires

- **AD-3** : seule Ã©criture catalogue = BO authentifiÃ© ; client lecture seule.
- **AD-10** : mÃ©dias = Vercel Blob BO only ; URL/mÃ©tadonnÃ©es Neon ; rendu client `next/image`.
- **AD-16** : aprÃ¨s mutation BO, client Ã  jour **&lt; 1 min** (revalidate/tag).
- **AD-4** : mutations = Server Actions `domain/` ; pas de REST parallÃ¨le menu.
- **AD-6** : chaque Ã©criture vÃ©rifie session staff JWT.
- **AD-11** : mÃªme Neon prod/preview ; pas de `migrate reset` automatisÃ©.

### Stack pins

| Package | Version |
| --- | --- |
| `@vercel/blob` | **2.6.1** |
| Prisma / adapter Neon | **7.9.0** |
| `next-auth` | **5.0.0-beta.32** (dÃ©jÃ  2.1) |

Env : `BLOB_READ_WRITE_TOKEN`, `DATABASE_URL`, `DIRECT_URL`.

### Chemins cibles

```text
prisma/schema.prisma              # MenuItem â€” UPDATE
domain/menu/actions.ts            # CRUD + revalidate â€” NEW
domain/menu/queries.ts            # list for BO (+ read API pour 2.3) â€” NEW
infra/blob/upload.ts              # put() Blob â€” NEW
app/(bo)/menu/page.tsx            # UI rÃ©elle â€” UPDATE
components/bo/ligne-menu-bo.tsx   # NEW
components/bo/status-pill-bo.tsx  # NEW (dispo + rÃ©utilisable 3.2)
```

### UX / DESIGN

- `ligne-menu-bo` : fond `surface-base`, border, body typo ; Ã©dition nom/prix/dispo/photo.
- `status-pill-bo` pour disponibilitÃ© (label texte obligatoire).
- Ã‰tats EXPERIENCE : BO vide ; BO erreur sauvegarde.
- Copy FR : Â« Enregistrer Â», Â« Indisponible Â», Â« Ajouter un plat Â» â€” pas Submit.

### Convention prix (Ã  figer dans le code)

Choisir **une** approche et lâ€™utiliser partout (Order lines 3.1) :
- **RecommandÃ© :** `priceCents` Int (ex. 3500 = 3500 XOF) **ou**
- `Decimal` Prisma â€” documenter format dâ€™affichage FR.

### Hors scope strict

- Grille client `card-menu-item` / retry rÃ©seau client (2.3)
- `placeOrder`, goÃ»ts, Pusher
- Multi-catÃ©gories menu / allergens / stock avancÃ©

### Testing

- CrÃ©er plat + photo â†’ ligne Neon + URL Blob
- Modifier prix/nom â†’ persistÃ©
- DÃ©sactiver â†’ `available=false` ; fetch client taggÃ© menu reflÃ¨te changement &lt; 1 min (test manuel revalidate)
- Upload sans auth â†’ refusÃ©
- Liste vide â†’ Ã©tat vide nommÃ©
- Forcer erreur action â†’ message FR, pas de succÃ¨s fantÃ´me
- `(client)` ne peut pas appeler actions write (import/build guard ou test)

### NFR soft

- NFR1 : pages BO raisonnablement lÃ©gÃ¨res
- NFR4 : auth + pas dâ€™Ã©dition client
- Photos : `next/image` prÃªt pour 2.3 (sizes/alt nom du plat)

### Previous story intelligence (2.1)

- Shell onglets + gate `auth()?.user` dÃ©jÃ  en place â€” **rÃ©utiliser**, ne pas recrÃ©er login
- Cookie staff distinct session client
- Stubs Commandes/Service restent stubs

### References

- [Source: `epics.md` â€” Story 2.2, FR7]
- [Source: `ARCHITECTURE-SPINE.md` â€” AD-3, AD-10, AD-16, Stack Blob]
- [Source: `DESIGN.md` â€” `ligne-menu-bo`, `status-pill-bo`]
- [Source: `EXPERIENCE.md` â€” BO Menu, Ã©tats vide/erreur, UJ-3]
- [Source: `SPEC.md` â€” CAP-4]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
