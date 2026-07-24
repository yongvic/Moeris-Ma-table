# Story 3.2: Suivi Commandes Back-office + statuts

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a serveur / responsable en salle,
I want voir les commandes entrantes par table avec les goÃ»ts inline et faire avancer les statuts,
so that aucune commande nâ€™est oubliÃ©e et la salle nâ€™a pas Ã  redemander les goÃ»ts.

## Acceptance Criteria

1. **Given** une Order crÃ©Ã©e cÃ´tÃ© client  
   **When** le commit Neon rÃ©ussit  
   **Then** un Ã©vÃ©nement Pusher `bo-floor` (kind order) est publiÃ© et la commande apparaÃ®t en BO Commandes  
   **And** table/session et GoÃ»ts cuisine sont visibles sans quitter la fiche

2. **Given** une commande en `received`  
   **When** le staff passe `received` â†’ `preparing` â†’ `served`  
   **Then** seules ces transitions BO sont possibles ; le client ne change pas les statuts  
   **And** les `status-pill-bo` ont label texte + couleur (pas couleur seule)  
   **And** un poll soft peut servir de filet si Pusher rate un event

## Tasks / Subtasks

- [ ] T1. Infra Pusher (AC: #1, #2)
  - [ ] Packages : `pusher@5.3.4` (server) + `pusher-js@8.6.0` (BO client)
  - [ ] Canal privÃ© ou public documentÃ© : **`bo-floor`** ; payload `{ kind: "order"|"service", id, tableId, status, at }` (AD-7) â€” ISO-8601 UTC pour `at`
  - [ ] Publish **aprÃ¨s** commit Neon rÃ©ussi uniquement (dans `placeOrder` 3.1 + transitions statut)
  - [ ] Env : `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER` (+ next public key pour client)
  - [ ] Ã‰chec publish : log + **ne pas** rollback Order ; sâ€™appuyer sur poll soft

- [ ] T2. Domain transitions statut (AC: #2)
  - [ ] `domain/order/update-status.ts` : transitions autorisÃ©es uniquement `receivedâ†’preparing`, `preparingâ†’served` (pas de skip arbitraire V1 sauf si produit dÃ©cide â€” **dÃ©faut : pas de skip**)
  - [ ] BO staff auth obligatoire ; client actions **interdites**
  - [ ] Retour `{ ok, code, message }` ; re-publish Pusher post-commit
  - [ ] Interdit : INSERT Order depuis BO (AD-12)

- [ ] T3. UI BO Commandes (AC: #1, #2)
  - [ ] Remplacer stub `app/(bo)/commandes` : liste `carte-commande-bo`
  - [ ] Afficher : tableId (lisible), sessionId court/ref, lignes plat, **GoÃ»ts cuisine inline** (chips texte) sans navigation secondaire
  - [ ] `status-pill-bo` mapping DESIGN :
    - `received` â†’ label FR Â« ReÃ§ue Â» / fond `accent-soft`
    - `preparing` â†’ Â« En prÃ©paration Â» / fond `accent` + ink-primary
    - `served` â†’ Â« Servie Â» / fond `surface-raised` + ink-secondary
  - [ ] Actions staff pour avancer le statut (boutons libellÃ©s FR)
  - [ ] Ã‰tat vide : Â« Aucune commande pour lâ€™instant Â»
  - [ ] Abonnement Pusher â†’ refetch domain ; **poll soft** (ex. 15â€“30 s) filet si event manquÃ©
  - [ ] Shell desktop/tablette ; pas de layout mobile BO V1

- [ ] T4. Garde-fous anti-scope
  - [ ] Pas de vue cuisine sÃ©parÃ©e / rÃ´les fins
  - [ ] Pas Service file (3.3) sauf si event kind service dÃ©jÃ  ignorÃ© proprement
  - [ ] Pas de modification des goÃ»ts snapshotÃ©s

## Dev Notes

### DÃ©pendances

- **Bloquantes :** **2.1** auth BO ; **3.1** `placeOrder` + modÃ¨les Order (+ publish de prÃ©fÃ©rence dÃ©jÃ  branchÃ©).
- Soft : menu lines snapshots pour libellÃ©s plats.

### Architecture â€” AD obligatoires

- **AD-7** : fraÃ®cheur BO = Pusher post-commit ; poll = filet only.
- **AD-12** : transitions `receivedâ†’preparingâ†’served` **BO only**.
- **AD-16** : goÃ»ts snapshot lecture seule inline.
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
infra/pusher/client.ts           # server publish â€” NEW/UPDATE
infra/pusher/browser.ts          # BO subscribe helper â€” NEW
domain/order/update-status.ts    # NEW
domain/order/list-orders.ts      # NEW
app/(bo)/commandes/page.tsx      # UPDATE
components/bo/carte-commande-bo.tsx  # NEW
components/bo/status-pill-bo.tsx     # UPDATE/reuse 2.2
components/bo/use-bo-floor.ts        # subscribe + poll â€” NEW
```

### UX / a11y

- Label texte **toujours** avec couleur (UX-DR5 / UX-DR11)
- GoÃ»ts visibles sans quitter la fiche (FR10)
- Focus clavier sur actions statut
- RÃ©f. composition : `mockups/bo-commandes.html` (spine gagne en conflit)

### Anti-fantÃ´me (SM-4)

- Toute Order `placeOrder` ok doit apparaÃ®tre BO (Pusher + poll)
- Si absente : poll doit la remonter ; pas de succÃ¨s client sans row Neon

### Hors scope strict

- ServiceRequest UI (3.3)
- Notifications Browser Push API
- Ã‰dition menu / stats CA

### Testing

- `placeOrder` â†’ event `kind:order` + carte visible BO (temps quasi rÃ©el)
- Couper Pusher / mauvais key â†’ poll soft fait apparaÃ®tre la commande quand mÃªme
- Transitions valides BO only ; tentative client update-status â†’ refus
- Pills : texte visible + couleurs tokens
- GoÃ»ts inline = snapshot Order
- Ã‰tat vide nommÃ©
- Staff non auth â†’ redirect Connexion

### NFR soft

- NFR5 : tient un service soirÃ©e (poll filet)
- Pas de PII contact dans payloads Pusher (order id / tableId only)

### Previous story intelligence (3.1)

- Payload Pusher standardisÃ© â€” ne pas inventer un second shape
- Enums status EN en DB ; labels FR UI
- Double-submit placeOrder dÃ©jÃ  gÃ©rÃ© â€” liste BO ordonnÃ©e `createdAt desc`

### References

- [Source: `epics.md` â€” Story 3.2, FR10]
- [Source: `ARCHITECTURE-SPINE.md` â€” AD-7, AD-12, Stack Pusher]
- [Source: `DESIGN.md` â€” `carte-commande-bo`, `status-pill-bo`]
- [Source: `EXPERIENCE.md` â€” BO Commandes, UJ-3, fantÃ´mes]
- [Source: `SPEC.md` â€” CAP-6]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
