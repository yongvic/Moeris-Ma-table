# Story 3.1: Fiche plat — Goûts cuisine + envoi Commande

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want choisir un plat, indiquer des goûts cuisine optionnels et envoyer ma commande,
so that la salle reçoit mon intention clairement sans me demander mes allergies.

## Acceptance Criteria

1. **Given** un plat disponible sur le Menu et une Session active  
   **When** j’ouvre la fiche plat / commande  
   **Then** je peux multi-sélectionner des chips Goûts cuisine (optionnel) et envoyer avec un seul CTA  
   **And** aucun flux n’oblige la saisie d’allergies

2. **Given** j’envoie la commande avec succès  
   **When** `placeOrder` réussit  
   **Then** une Order est créée en statut `received` avec `tableId` + `sessionId` et goûts snapshotés  
   **And** le client voit un feedback clair (« C’est parti ! » / illustration commande envoyée)  
   **And** la barre de progression passe à l’étape Commande

3. **Given** une coupure réseau à l’envoi  
   **When** l’envoi échoue  
   **Then** un message clair + retry s’affiche ; aucune commande silencieuse « fantôme » côté client

## Tasks / Subtasks

- [ ] T1. Schéma Order + panier Session (AC: #2)
  - [ ] Models : `Order` (`id`, `sessionId`, `tableId`, `status` enum `received|preparing|served`, `tastesJson` / relation snapshot, `createdAt`), `OrderLine` (`orderId`, `menuItemId`, `nameSnapshot`, `priceSnapshot`, `qty`)
  - [ ] **AD-18** : panier (lignes + goûts en cours) sur `Session` uniquement (JSON ou tables filles **non-Order**) jusqu’à `placeOrder`
  - [ ] **AD-12** : seul `placeOrder` **INSERT** Order ; statut initial **obligatoire** `received` ; pas de draft Order
  - [ ] Goûts : snapshot **immuable** sur Order à l’envoi (AD-16) — copie des chips choisies, pas de live-link mutable

- [ ] T2. Domain `placeOrder` (AC: #2, #3)
  - [ ] `domain/order/place-order.ts` Server Action
  - [ ] Prérequis : Session cookie opaque valide + `menuItem` `available=true`
  - [ ] Transaction Neon : INSERT Order+lines depuis panier session → clear/freeze panier post-succès
  - [ ] Retour `{ ok:true, orderId }` ou `{ ok:false, code, message }` — **jamais** exception nue UI
  - [ ] Sur échec réseau/action : **aucune** Order partielle visible client ; retry idempotent guidé (pas de double ghost si possible — documenter stratégie : disable CTA pendant pending + correlation id optionnel)
  - [ ] **Ne pas** publier Pusher ici si 3.2 pas prête — **OU** publier `bo-floor` kind order post-commit (AD-7) pour éviter dette ; préférer hook `infra/pusher` ready-to-call même si BO UI arrive en 3.2

- [ ] T3. UI `fiche-commande` + chips (AC: #1, #2, #3)
  - [ ] Route `app/(client)/menu/[menuItemId]` ou `/commande/...`
  - [ ] `fiche-commande` : titre plat, prix, chips `chip-gout` multi-select **optionnel**, un seul `button-primary` d’envoi
  - [ ] Catalogue V1 chips fermé (EN keys / FR labels), ex. : `no_chili` « Sans piment », `well_done` « Bien cuit », `extra_sauce` « Plus de sauce », `less_salt` « Moins salé » — **pas** champ libre ; **pas** allergies
  - [ ] Succès : « C’est parti ! » + slot `illustration-panel` commande envoyée (`alt=""`)
  - [ ] Échec : message + « Réessayer » ; CTA réactivé seulement après échec confirmé
  - [ ] Indisponible : ne pas permettre l’envoi (garde UI + server)

- [ ] T4. Progression (AC: #2)
  - [ ] Après succès : étape session → **Commande** ; barre progression segment Commande
  - [ ] Ne pas activer « Terminer mon expérience » ici au-delà de ce qu’Epic 4 exige — gate FR12 = story 4.1 (mais statut `received` pose la condition)

- [ ] T5. Garde-fous anti-scope
  - [ ] Pas de transitions `preparing`/`served` côté client
  - [ ] Pas d’UI BO Commandes complète (3.2) — publish event OK
  - [ ] Pas ServiceRequest (3.3)
  - [ ] Pas de collecte allergies

## Dev Notes

### Dépendances

- **Bloquantes :** Epic 1 Session (`tableId`, cookie, panier AD-18) ; **2.2/2.3** MenuItem + navigation depuis carte.
- **Suites :** 3.2 consomme Orders + Pusher ; 4.1 gate Terminer sur `received`.

### Architecture — AD obligatoires

- **AD-12** : INSERT client only `received` ; transitions statut BO only.
- **AD-18** : panier sur Session ; zéro OrderLine avant `placeOrder`.
- **AD-16** : goûts snapshotés immuables sur Order.
- **AD-9** : Order porte `tableId` + `sessionId`.
- **AD-4** : Server Action domain, pas REST métier.
- **AD-7** (prépare 3.2) : après commit, event Pusher `{ kind:"order", id, tableId, status, at }`.

### Stack pins

| Package | Version |
| --- | --- |
| Prisma / Neon | **7.9.0** |
| `pusher` (si publish) | **5.3.4** |
| Auth client | aucune |

### Chemins cibles

```text
prisma/schema.prisma                 # Order, OrderLine, Session.cart — UPDATE
domain/order/place-order.ts          # NEW
domain/session/cart.ts               # panier goûts/lignes — NEW/UPDATE
infra/pusher/publish.ts              # NEW (post-commit)
app/(client)/menu/[menuItemId]/page.tsx  # fiche — NEW
components/client/fiche-commande.tsx # NEW
components/client/chip-gout.tsx      # NEW
```

### UX / DESIGN

- `chip-gout` : `accent-soft` + ink-primary, pilule, tap ≥44px
- `fiche-commande` : un CTA ; confirmation immédiate post-succès
- Copy succès exacte cible : « C’est parti ! » (EXPERIENCE / FR8)
- Interdit : allergies obligatoires, chat, double CTA d’envoi

### SM-4 / anti-fantôme

- Client ne doit afficher succès **que** si action `ok:true`
- Pending state bloque double-submit
- Échec → retry explicite ; pas de « commande partie » locale seule

### Hors scope strict

- BO liste + transitions statut (3.2)
- Service catalogue (3.3)
- Réapply mémoire goûts (5.3) — chips manuelles seulement
- Paiement

### Testing

- Envoi sans chips → Order `received` + tableId/sessionId + tastes vides/[]
- Envoi avec chips → snapshot égal à la sélection ; modifier chips après coup **ne change pas** l’Order
- Plat indisponible → refus server + UI
- Mock network fail → message + retry ; **0** Order créée (vérifier DB)
- Succès → feedback « C’est parti ! » + barre = Commande
- Client ne peut pas setter `preparing`

### NFR soft

- NFR1 / resto Wi‑Fi : action courte, retry clair
- NFR9 SM-4 : ≈0 fantômes
- Code EN / UI FR ; enums status EN (`received`…) ; labels BO FR en 3.2

### Previous story intelligence

- Menu tags/revalidate : fiche doit refuser item devenu indispo
- Format prix : snapshots line = même convention que MenuItem
- Session cookie httpOnly : `placeOrder` résout session serveur, pas trust body `sessionId` client seul

### References

- [Source: `epics.md` — Story 3.1, FR8, FR9]
- [Source: `ARCHITECTURE-SPINE.md` — AD-12, AD-16, AD-18, AD-7, AD-9]
- [Source: `DESIGN.md` — `fiche-commande`, `chip-gout`]
- [Source: `EXPERIENCE.md` — Fiche plat, états envoi/échec, UJ-1]
- [Source: `SPEC.md` — CAP-5]
- [Source: `glossary.md` — Commande, Goût cuisine]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
