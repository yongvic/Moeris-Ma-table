# Story 3.1: Fiche plat â€” GoÃ»ts cuisine + envoi Commande

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want choisir un plat, indiquer des goÃ»ts cuisine optionnels et envoyer ma commande,
so that la salle reÃ§oit mon intention clairement sans me demander mes allergies.

## Acceptance Criteria

1. **Given** un plat disponible sur le Menu et une Session active  
   **When** jâ€™ouvre la fiche plat / commande  
   **Then** je peux multi-sÃ©lectionner des chips GoÃ»ts cuisine (optionnel) et envoyer avec un seul CTA  
   **And** aucun flux nâ€™oblige la saisie dâ€™allergies

2. **Given** jâ€™envoie la commande avec succÃ¨s  
   **When** `placeOrder` rÃ©ussit  
   **Then** une Order est crÃ©Ã©e en statut `received` avec `tableId` + `sessionId` et goÃ»ts snapshotÃ©s  
   **And** le client voit un feedback clair (Â« Câ€™est parti ! Â» / illustration commande envoyÃ©e)  
   **And** la barre de progression passe Ã  lâ€™Ã©tape Commande

3. **Given** une coupure rÃ©seau Ã  lâ€™envoi  
   **When** lâ€™envoi Ã©choue  
   **Then** un message clair + retry sâ€™affiche ; aucune commande silencieuse Â« fantÃ´me Â» cÃ´tÃ© client

## Tasks / Subtasks

- [ ] T1. SchÃ©ma Order + panier Session (AC: #2)
  - [ ] Models : `Order` (`id`, `sessionId`, `tableId`, `status` enum `received|preparing|served`, `tastesJson` / relation snapshot, `createdAt`), `OrderLine` (`orderId`, `menuItemId`, `nameSnapshot`, `priceSnapshot`, `qty`)
  - [ ] **AD-18** : panier (lignes + goÃ»ts en cours) sur `Session` uniquement (JSON ou tables filles **non-Order**) jusquâ€™Ã  `placeOrder`
  - [ ] **AD-12** : seul `placeOrder` **INSERT** Order ; statut initial **obligatoire** `received` ; pas de draft Order
  - [ ] GoÃ»ts : snapshot **immuable** sur Order Ã  lâ€™envoi (AD-16) â€” copie des chips choisies, pas de live-link mutable

- [ ] T2. Domain `placeOrder` (AC: #2, #3)
  - [ ] `domain/order/place-order.ts` Server Action
  - [ ] PrÃ©requis : Session cookie opaque valide + `menuItem` `available=true`
  - [ ] Transaction Neon : INSERT Order+lines depuis panier session â†’ clear/freeze panier post-succÃ¨s
  - [ ] Retour `{ ok:true, orderId }` ou `{ ok:false, code, message }` â€” **jamais** exception nue UI
  - [ ] Sur Ã©chec rÃ©seau/action : **aucune** Order partielle visible client ; retry idempotent guidÃ© (pas de double ghost si possible â€” documenter stratÃ©gie : disable CTA pendant pending + correlation id optionnel)
  - [ ] **Ne pas** publier Pusher ici si 3.2 pas prÃªte â€” **OU** publier `bo-floor` kind order post-commit (AD-7) pour Ã©viter dette ; prÃ©fÃ©rer hook `infra/pusher` ready-to-call mÃªme si BO UI arrive en 3.2

- [ ] T3. UI `fiche-commande` + chips (AC: #1, #2, #3)
  - [ ] Route `app/(client)/menu/[menuItemId]` ou `/commande/...`
  - [ ] `fiche-commande` : titre plat, prix, chips `chip-gout` multi-select **optionnel**, un seul `button-primary` dâ€™envoi
  - [ ] Catalogue V1 chips fermÃ© (EN keys / FR labels), ex. : `no_chili` Â« Sans piment Â», `well_done` Â« Bien cuit Â», `extra_sauce` Â« Plus de sauce Â», `less_salt` Â« Moins salÃ© Â» â€” **pas** champ libre ; **pas** allergies
  - [ ] SuccÃ¨s : Â« Câ€™est parti ! Â» + slot `illustration-panel` commande envoyÃ©e (`alt=""`)
  - [ ] Ã‰chec : message + Â« RÃ©essayer Â» ; CTA rÃ©activÃ© seulement aprÃ¨s Ã©chec confirmÃ©
  - [ ] Indisponible : ne pas permettre lâ€™envoi (garde UI + server)

- [ ] T4. Progression (AC: #2)
  - [ ] AprÃ¨s succÃ¨s : Ã©tape session â†’ **Commande** ; barre progression segment Commande
  - [ ] Ne pas activer Â« Terminer mon expÃ©rience Â» ici au-delÃ  de ce quâ€™Epic 4 exige â€” gate FR12 = story 4.1 (mais statut `received` pose la condition)

- [ ] T5. Garde-fous anti-scope
  - [ ] Pas de transitions `preparing`/`served` cÃ´tÃ© client
  - [ ] Pas dâ€™UI BO Commandes complÃ¨te (3.2) â€” publish event OK
  - [ ] Pas ServiceRequest (3.3)
  - [ ] Pas de collecte allergies

## Dev Notes

### DÃ©pendances

- **Bloquantes :** Epic 1 Session (`tableId`, cookie, panier AD-18) ; **2.2/2.3** MenuItem + navigation depuis carte.
- **Suites :** 3.2 consomme Orders + Pusher ; 4.1 gate Terminer sur `received`.

### Architecture â€” AD obligatoires

- **AD-12** : INSERT client only `received` ; transitions statut BO only.
- **AD-18** : panier sur Session ; zÃ©ro OrderLine avant `placeOrder`.
- **AD-16** : goÃ»ts snapshotÃ©s immuables sur Order.
- **AD-9** : Order porte `tableId` + `sessionId`.
- **AD-4** : Server Action domain, pas REST mÃ©tier.
- **AD-7** (prÃ©pare 3.2) : aprÃ¨s commit, event Pusher `{ kind:"order", id, tableId, status, at }`.

### Stack pins

| Package | Version |
| --- | --- |
| Prisma / Neon | **7.9.0** |
| `pusher` (si publish) | **5.3.4** |
| Auth client | aucune |

### Chemins cibles

```text
prisma/schema.prisma                 # Order, OrderLine, Session.cart â€” UPDATE
domain/order/place-order.ts          # NEW
domain/session/cart.ts               # panier goÃ»ts/lignes â€” NEW/UPDATE
infra/pusher/publish.ts              # NEW (post-commit)
app/(client)/menu/[menuItemId]/page.tsx  # fiche â€” NEW
components/client/fiche-commande.tsx # NEW
components/client/chip-gout.tsx      # NEW
```

### UX / DESIGN

- `chip-gout` : `accent-soft` + ink-primary, pilule, tap â‰¥44px
- `fiche-commande` : un CTA ; confirmation immÃ©diate post-succÃ¨s
- Copy succÃ¨s exacte cible : Â« Câ€™est parti ! Â» (EXPERIENCE / FR8)
- Interdit : allergies obligatoires, chat, double CTA dâ€™envoi

### SM-4 / anti-fantÃ´me

- Client ne doit afficher succÃ¨s **que** si action `ok:true`
- Pending state bloque double-submit
- Ã‰chec â†’ retry explicite ; pas de Â« commande partie Â» locale seule

### Hors scope strict

- BO liste + transitions statut (3.2)
- Service catalogue (3.3)
- RÃ©apply mÃ©moire goÃ»ts (5.3) â€” chips manuelles seulement
- Paiement

### Testing

- Envoi sans chips â†’ Order `received` + tableId/sessionId + tastes vides/[]
- Envoi avec chips â†’ snapshot Ã©gal Ã  la sÃ©lection ; modifier chips aprÃ¨s coup **ne change pas** lâ€™Order
- Plat indisponible â†’ refus server + UI
- Mock network fail â†’ message + retry ; **0** Order crÃ©Ã©e (vÃ©rifier DB)
- SuccÃ¨s â†’ feedback Â« Câ€™est parti ! Â» + barre = Commande
- Client ne peut pas setter `preparing`

### NFR soft

- NFR1 / resto Wiâ€‘Fi : action courte, retry clair
- NFR9 SM-4 : â‰ˆ0 fantÃ´mes
- Code EN / UI FR ; enums status EN (`received`â€¦) ; labels BO FR en 3.2

### Previous story intelligence

- Menu tags/revalidate : fiche doit refuser item devenu indispo
- Format prix : snapshots line = mÃªme convention que MenuItem
- Session cookie httpOnly : `placeOrder` rÃ©sout session serveur, pas trust body `sessionId` client seul

### References

- [Source: `epics.md` â€” Story 3.1, FR8, FR9]
- [Source: `ARCHITECTURE-SPINE.md` â€” AD-12, AD-16, AD-18, AD-7, AD-9]
- [Source: `DESIGN.md` â€” `fiche-commande`, `chip-gout`]
- [Source: `EXPERIENCE.md` â€” Fiche plat, Ã©tats envoi/Ã©chec, UJ-1]
- [Source: `SPEC.md` â€” CAP-5]
- [Source: `glossary.md` â€” Commande, GoÃ»t cuisine]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
