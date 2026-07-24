# Story 2.2: Gérer le Menu en Back-office

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a responsable / serveur authentifié,
I want créer, modifier et désactiver des plats (nom, prix, disponibilité, photo),
so that le catalogue servi aux clients reste juste pendant le service.

## Acceptance Criteria

1. **Given** je suis authentifié BO  
   **When** je crée ou modifie un plat (nom, prix, dispo, photo via Vercel Blob)  
   **Then** les métadonnées et l’URL image sont persistées en Neon  
   **And** l’upload photo n’est possible que depuis le BO authentifié

2. **Given** un plat actif  
   **When** je le désactive  
   **Then** il est marqué indisponible / retiré côté client en moins d’1 minute (revalidate/tag cache)

3. **And** les états vides BO Menu et erreurs de sauvegarde affichent un message clair

## Tasks / Subtasks

- [ ] T1. Schéma MenuItem + Prisma Neon (AC: #1)
  - [ ] Model `MenuItem` : `id`, `name`, `price` (Decimal/Int centimes — choisir **une** convention et documenter), `available` (bool), `photoUrl` (nullable), `createdAt`, `updatedAt`, soft fields optionnels (`sortOrder`)
  - [ ] Prisma **7.9.0** + adapter Neon ; migrations via `DIRECT_URL` ; runtime Node
  - [ ] Seed ≥2–3 plats pour smoke (dont 1 dispo / 1 indispo)

- [ ] T2. Domain écriture menu (AC: #1, #2)
  - [ ] `domain/menu/` Server Actions : `createMenuItem`, `updateMenuItem`, `setMenuItemAvailability` (ou CRUD unifié)
  - [ ] Gate auth staff en tête de chaque action (`auth()` + role salle) — refuse `{ ok:false, code, message }`
  - [ ] **Lecture seule** exposée aussi pour 2.3 (`listPublishedMenu` / tags) — écriture **jamais** importable depuis `(client)` (AD-2, AD-3)
  - [ ] Après mutation : `revalidateTag('menu')` / `revalidatePath` client menu — garantir fraîcheur **&lt; 1 min** (AD-16) ; pas de cache menu « immortal »

- [ ] T3. Upload photo Vercel Blob (AC: #1)
  - [ ] Dépendance `@vercel/blob@2.6.1` uniquement
  - [ ] Upload **BO only** (token / server action authentifiée) — jamais endpoint anonyme
  - [ ] Stocker URL résultante sur `MenuItem.photoUrl` ; client futur = `next/image` (AD-10)
  - [ ] Types image raisonnables (jpeg/png/webp) + taille max pragmatique ; message FR si échec

- [ ] T4. UI BO Menu — `ligne-menu-bo` (AC: #1, #2, #3)
  - [ ] Remplacer stub onglet Menu : liste + créer / éditer inline (nom, prix, dispo, photo)
  - [ ] Composant `ligne-menu-bo` ; dispo via `status-pill-bo` (label + couleur, jamais couleur seule)
  - [ ] État vide : message nommé (« Aucun plat pour l’instant ») + CTA créer — pas d’écran blanc
  - [ ] Erreur sauvegarde : message clair ; UI ne présume pas le succès tant que `{ ok:true }`
  - [ ] Tap targets / focus-ring Citrus ; light mode only

- [ ] T5. Garde-fous anti-scope
  - [ ] Pas d’UI menu client photo-first complète (→ 2.3) — un smoke revalidate suffit
  - [ ] Pas de commandes / Pusher / Service
  - [ ] Pas Cloudinary/S3 ; pas d’upload depuis `(client)`

## Dev Notes

### Dépendances

- **Bloquante :** Story **2.1** (auth staff + shell BO).
- **Souhaitable :** Epic 1 Prisma/Neon déjà branchés ; sinon poser stack data ici.
- **Suites :** 2.3 consomme le catalogue publié ; 3.x suppose des `MenuItem` existants.

### Architecture — AD obligatoires

- **AD-3** : seule écriture catalogue = BO authentifié ; client lecture seule.
- **AD-10** : médias = Vercel Blob BO only ; URL/métadonnées Neon ; rendu client `next/image`.
- **AD-16** : après mutation BO, client à jour **&lt; 1 min** (revalidate/tag).
- **AD-4** : mutations = Server Actions `domain/` ; pas de REST parallèle menu.
- **AD-6** : chaque écriture vérifie session staff JWT.
- **AD-11** : même Neon prod/preview ; pas de `migrate reset` automatisé.

### Stack pins

| Package | Version |
| --- | --- |
| `@vercel/blob` | **2.6.1** |
| Prisma / adapter Neon | **7.9.0** |
| `next-auth` | **5.0.0-beta.32** (déjà 2.1) |

Env : `BLOB_READ_WRITE_TOKEN`, `DATABASE_URL`, `DIRECT_URL`.

### Chemins cibles

```text
prisma/schema.prisma              # MenuItem — UPDATE
domain/menu/actions.ts            # CRUD + revalidate — NEW
domain/menu/queries.ts            # list for BO (+ read API pour 2.3) — NEW
infra/blob/upload.ts              # put() Blob — NEW
app/(bo)/menu/page.tsx            # UI réelle — UPDATE
components/bo/ligne-menu-bo.tsx   # NEW
components/bo/status-pill-bo.tsx  # NEW (dispo + réutilisable 3.2)
```

### UX / DESIGN

- `ligne-menu-bo` : fond `surface-base`, border, body typo ; édition nom/prix/dispo/photo.
- `status-pill-bo` pour disponibilité (label texte obligatoire).
- États EXPERIENCE : BO vide ; BO erreur sauvegarde.
- Copy FR : « Enregistrer », « Indisponible », « Ajouter un plat » — pas Submit.

### Convention prix (à figer dans le code)

Choisir **une** approche et l’utiliser partout (Order lines 3.1) :
- **Recommandé :** `priceCents` Int (ex. 3500 = 3500 XOF) **ou**
- `Decimal` Prisma — documenter format d’affichage FR.

### Hors scope strict

- Grille client `card-menu-item` / retry réseau client (2.3)
- `placeOrder`, goûts, Pusher
- Multi-catégories menu / allergens / stock avancé

### Testing

- Créer plat + photo → ligne Neon + URL Blob
- Modifier prix/nom → persisté
- Désactiver → `available=false` ; fetch client taggé menu reflète changement &lt; 1 min (test manuel revalidate)
- Upload sans auth → refusé
- Liste vide → état vide nommé
- Forcer erreur action → message FR, pas de succès fantôme
- `(client)` ne peut pas appeler actions write (import/build guard ou test)

### NFR soft

- NFR1 : pages BO raisonnablement légères
- NFR4 : auth + pas d’édition client
- Photos : `next/image` prêt pour 2.3 (sizes/alt nom du plat)

### Previous story intelligence (2.1)

- Shell onglets + gate `auth()?.user` déjà en place — **réutiliser**, ne pas recréer login
- Cookie staff distinct session client
- Stubs Commandes/Service restent stubs

### References

- [Source: `epics.md` — Story 2.2, FR7]
- [Source: `ARCHITECTURE-SPINE.md` — AD-3, AD-10, AD-16, Stack Blob]
- [Source: `DESIGN.md` — `ligne-menu-bo`, `status-pill-bo`]
- [Source: `EXPERIENCE.md` — BO Menu, états vide/erreur, UJ-3]
- [Source: `SPEC.md` — CAP-4]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
