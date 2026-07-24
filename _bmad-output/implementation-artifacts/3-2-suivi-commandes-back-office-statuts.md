# Story 3.2: Suivi Commandes Back-office + statuts

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a serveur / responsable en salle,
I want voir les commandes entrantes par table avec les goûts inline et faire avancer les statuts,
so that aucune commande n’est oubliée et la salle n’a pas à redemander les goûts.

## Acceptance Criteria

1. **Given** une Order créée côté client  
   **When** le commit Neon réussit  
   **Then** un événement Pusher `bo-floor` (kind order) est publié et la commande apparaît en BO Commandes  
   **And** table/session et Goûts cuisine sont visibles sans quitter la fiche

2. **Given** une commande en `received`  
   **When** le staff passe `received` → `preparing` → `served`  
   **Then** seules ces transitions BO sont possibles ; le client ne change pas les statuts  
   **And** les `status-pill-bo` ont label texte + couleur (pas couleur seule)  
   **And** un poll soft peut servir de filet si Pusher rate un event

## Tasks / Subtasks

- [ ] T1. Infra Pusher (AC: #1, #2)
  - [ ] Packages : `pusher@5.3.4` (server) + `pusher-js@8.6.0` (BO client)
  - [ ] Canal privé ou public documenté : **`bo-floor`** ; payload `{ kind: "order"|"service", id, tableId, status, at }` (AD-7) — ISO-8601 UTC pour `at`
  - [ ] Publish **après** commit Neon réussi uniquement (dans `placeOrder` 3.1 + transitions statut)
  - [ ] Env : `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER` (+ next public key pour client)
  - [ ] Échec publish : log + **ne pas** rollback Order ; s’appuyer sur poll soft

- [ ] T2. Domain transitions statut (AC: #2)
  - [ ] `domain/order/update-status.ts` : transitions autorisées uniquement `received→preparing`, `preparing→served` (pas de skip arbitraire V1 sauf si produit décide — **défaut : pas de skip**)
  - [ ] BO staff auth obligatoire ; client actions **interdites**
  - [ ] Retour `{ ok, code, message }` ; re-publish Pusher post-commit
  - [ ] Interdit : INSERT Order depuis BO (AD-12)

- [ ] T3. UI BO Commandes (AC: #1, #2)
  - [ ] Remplacer stub `app/(bo)/commandes` : liste `carte-commande-bo`
  - [ ] Afficher : tableId (lisible), sessionId court/ref, lignes plat, **Goûts cuisine inline** (chips texte) sans navigation secondaire
  - [ ] `status-pill-bo` mapping DESIGN :
    - `received` → label FR « Reçue » / fond `accent-soft`
    - `preparing` → « En préparation » / fond `accent` + ink-primary
    - `served` → « Servie » / fond `surface-raised` + ink-secondary
  - [ ] Actions staff pour avancer le statut (boutons libellés FR)
  - [ ] État vide : « Aucune commande pour l’instant »
  - [ ] Abonnement Pusher → refetch domain ; **poll soft** (ex. 15–30 s) filet si event manqué
  - [ ] Shell desktop/tablette ; pas de layout mobile BO V1

- [ ] T4. Garde-fous anti-scope
  - [ ] Pas de vue cuisine séparée / rôles fins
  - [ ] Pas Service file (3.3) sauf si event kind service déjà ignoré proprement
  - [ ] Pas de modification des goûts snapshotés

## Dev Notes

### Dépendances

- **Bloquantes :** **2.1** auth BO ; **3.1** `placeOrder` + modèles Order (+ publish de préférence déjà branché).
- Soft : menu lines snapshots pour libellés plats.

### Architecture — AD obligatoires

- **AD-7** : fraîcheur BO = Pusher post-commit ; poll = filet only.
- **AD-12** : transitions `received→preparing→served` **BO only**.
- **AD-16** : goûts snapshot lecture seule inline.
- **AD-6 / AD-4** : auth + Server Actions domain.
- **AD-17** : un shell, onglet Commandes.

### Stack pins

| Package | Version |
| --- | --- |
| `pusher` | **5.3.4** |
| `pusher-js` | **8.6.0** |
| Prisma / Neon | **7.9.0** |
| `next-auth` | **5.0.0-beta.32** |

### Chemins cibles

```text
infra/pusher/client.ts           # server publish — NEW/UPDATE
infra/pusher/browser.ts          # BO subscribe helper — NEW
domain/order/update-status.ts    # NEW
domain/order/list-orders.ts      # NEW
app/(bo)/commandes/page.tsx      # UPDATE
components/bo/carte-commande-bo.tsx  # NEW
components/bo/status-pill-bo.tsx     # UPDATE/reuse 2.2
components/bo/use-bo-floor.ts        # subscribe + poll — NEW
```

### UX / a11y

- Label texte **toujours** avec couleur (UX-DR5 / UX-DR11)
- Goûts visibles sans quitter la fiche (FR10)
- Focus clavier sur actions statut
- Réf. composition : `mockups/bo-commandes.html` (spine gagne en conflit)

### Anti-fantôme (SM-4)

- Toute Order `placeOrder` ok doit apparaître BO (Pusher + poll)
- Si absente : poll doit la remonter ; pas de succès client sans row Neon

### Hors scope strict

- ServiceRequest UI (3.3)
- Notifications Browser Push API
- Édition menu / stats CA

### Testing

- `placeOrder` → event `kind:order` + carte visible BO (temps quasi réel)
- Couper Pusher / mauvais key → poll soft fait apparaître la commande quand même
- Transitions valides BO only ; tentative client update-status → refus
- Pills : texte visible + couleurs tokens
- Goûts inline = snapshot Order
- État vide nommé
- Staff non auth → redirect Connexion

### NFR soft

- NFR5 : tient un service soirée (poll filet)
- Pas de PII contact dans payloads Pusher (order id / tableId only)

### Previous story intelligence (3.1)

- Payload Pusher standardisé — ne pas inventer un second shape
- Enums status EN en DB ; labels FR UI
- Double-submit placeOrder déjà géré — liste BO ordonnée `createdAt desc`

### References

- [Source: `epics.md` — Story 3.2, FR10]
- [Source: `ARCHITECTURE-SPINE.md` — AD-7, AD-12, Stack Pusher]
- [Source: `DESIGN.md` — `carte-commande-bo`, `status-pill-bo`]
- [Source: `EXPERIENCE.md` — BO Commandes, UJ-3, fantômes]
- [Source: `SPEC.md` — CAP-6]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
