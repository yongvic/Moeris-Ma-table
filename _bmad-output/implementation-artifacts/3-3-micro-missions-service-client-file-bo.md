# Story 3.3: Micro-missions Service client + file BO

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want demander serveur / eau / addition / autre en un tap,
so that jâ€™obtiens de lâ€™aide sans chat ni long formulaire.

## Acceptance Criteria

1. **Given** une Session active  
   **When** jâ€™ouvre Service et je tape une des 4 tuiles (serveur / eau / addition / autre)  
   **Then** une ServiceRequest `open` est crÃ©Ã©e (type fermÃ©, sans note libre) et confirmÃ©e cÃ´tÃ© client  
   **And** chaque tuile a icÃ´ne + libellÃ© texte  
   **And** la barre de progression principale nâ€™avance pas

2. **Given** une demande crÃ©Ã©e  
   **When** le staff ouvre BO Service  
   **Then** la demande apparaÃ®t dans la file (Pusher + filet poll) et peut passer `open` â†’ `done`  
   **And** lâ€™Ã©tat vide de la file est explicite

## Tasks / Subtasks

- [ ] T1. SchÃ©ma ServiceRequest (AC: #1, #2)
  - [ ] Model : `id`, `sessionId`, `tableId`, `type` enum **`waiter|water|bill|other`**, `status` enum **`open|done`**, `createdAt`, `updatedAt`
  - [ ] **AD-14** : pas de champ note / free text ; pas dâ€™autres types V1
  - [ ] CrÃ©ation client only â†’ status initial `open` ; transition `openâ†’done` **BO only**

- [ ] T2. Domain actions (AC: #1, #2)
  - [ ] `domain/service/create-request.ts` : Session valide â†’ INSERT + publish Pusher `{ kind:"service", id, tableId, status, at }` post-commit (AD-7)
  - [ ] `domain/service/complete-request.ts` : staff auth â†’ `openâ†’done` + publish
  - [ ] Erreurs `{ ok:false, code, message }` ; anti double-tap pending
  - [ ] Liste BO : open first, puis rÃ©centes done (ou filtre open-only V1 â€” documenter ; file active = `open`)

- [ ] T3. UI client `catalogue-service` (AC: #1)
  - [ ] Route Service depuis barre Menu|Service / Accueil secondaire
  - [ ] 4 tuiles fixes : mapping
    - `waiter` â†’ Â« Serveur Â»
    - `water` â†’ Â« Eau Â»
    - `bill` â†’ Â« Addition Â»
    - `other` â†’ Â« Autre Â»
  - [ ] Chaque tuile : **icÃ´ne + libellÃ©** (jamais icÃ´ne seule) ; tap target â‰¥44px ; `surface-raised` / `rounded.md`
  - [ ] Un tap = envoi ; confirmation courte FR (Â« Câ€™est notÃ©. Â» / Â« On arrive. Â») â€” geste sec, **pas** dâ€™illustration dÃ©diÃ©e
  - [ ] **Interdit** : chat, textarea, modale de prÃ©cision
  - [ ] Mettre Ã  jour Ã©tape session **sans** avancer la barre (Service = voie latÃ©rale) â€” barre reste sur Accueil/Menu/Commande/Fin courant (FR21 / UX-DR15)

- [ ] T4. UI BO Service file (AC: #2)
  - [ ] Remplacer stub onglet Service : `item-file-service-bo`
  - [ ] Afficher type (label FR), table/session, horodatage ; action Â« Fait Â» / Â« TraitÃ© Â» â†’ `done`
  - [ ] Pusher `bo-floor` kind service + **poll soft** (rÃ©utiliser helper 3.2 si possible)
  - [ ] Ã‰tat vide explicite : Â« Aucune demande en attente Â»
  - [ ] Auth gate 2.1

- [ ] T5. Garde-fous anti-scope
  - [ ] Pas de free-text ; pas de types custom
  - [ ] Pas dâ€™impact sur barre progression sÃ©jour
  - [ ] Pas de paiement addition ; Â« Addition Â» = appel staff seulement

## Dev Notes

### DÃ©pendances

- **Bloquantes :** Epic 1 Session ; **2.1** pour BO file.
- **Fortement recommandÃ©e :** **3.2** infra Pusher + `use-bo-floor` poll â€” rÃ©utiliser canal `bo-floor`.
- Menu (2.x) non requis pour Service pur, mais parcours Accueil/nav Epic 1 oui.

### Architecture â€” AD obligatoires

- **AD-14** : type âˆˆ `{waiter,water,bill,other}` ; `openâ†’done` BO only ; pas de note libre.
- **AD-7** : publish Pusher post-commit ; poll filet.
- **AD-4 / AD-5 / AD-9** : Server Actions ; Session + tableId sur la demande.
- **AD-17** : onglet Service du shell unique.

### Stack pins

| Package | Version |
| --- | --- |
| `pusher` / `pusher-js` | **5.3.4** / **8.6.0** |
| Prisma / Neon | **7.9.0** |
| `next-auth` | **5.0.0-beta.32** |

### Chemins cibles

```text
prisma/schema.prisma                      # ServiceRequest â€” UPDATE
domain/service/create-request.ts          # NEW
domain/service/complete-request.ts        # NEW
domain/service/list-open.ts               # NEW
app/(client)/service/page.tsx             # NEW
components/client/catalogue-service.tsx   # NEW
app/(bo)/service/page.tsx                 # UPDATE
components/bo/item-file-service-bo.tsx    # NEW
```

### UX / a11y

- EXPERIENCE : Service = micro-mission 10â€“30 s ; voie latÃ©rale
- DESIGN : `catalogue-service`, `item-file-service-bo`
- Accessible name par tuile (libellÃ© visible)
- `pattern-background` OK sur Service
- Copy FR courte ; pas Login/Submit

### Barre de progression â€” rÃ¨gle dure

- CrÃ©er une ServiceRequest **ne change pas** lâ€™Ã©tape Accueil|Menu|Commande|Fin
- Tests : avant/aprÃ¨s demande, segments barre identiques
- Nom accessible barre inchangÃ© (Â« Ã‰tape N sur 4 : â€¦ Â»)

### Hors scope strict

- Chat / notes staff sur la demande
- Priorisation multi-files / SLA timers
- Push OS staff
- Lien paiement addition

### Testing

- 4 tuiles â†’ 4 types enum corrects ; refus type invalide server-side
- Confirmation client + row `open` Neon + event Pusher kind service
- BO voit item ; complete â†’ `done` ; disparaÃ®t de file active / marquage traitÃ©
- Poll soft sans Pusher â†’ item apparaÃ®t quand mÃªme
- Barre progression **inchangÃ©e** aprÃ¨s envoi Service
- Pas de champ texte dans le DOM Service
- Non-auth BO â†’ redirect Connexion
- Ã‰tat vide file nommÃ©

### NFR soft

- NFR3 : gros targets, icÃ´ne+texte
- NFR1 : page Service lÃ©gÃ¨re
- SM opÃ©rationnel : file visible pour ne rater aucune mission

### Previous story intelligence (3.2)

- RÃ©utiliser `bo-floor` + poll â€” **mÃªme** hook / payload `kind`
- `status-pill` optionnel pour open/done si utile ; sinon bouton + label suffit
- Ne pas casser liste Commandes en branchant subscribe multi-kind

### References

- [Source: `epics.md` â€” Story 3.3, FR11]
- [Source: `ARCHITECTURE-SPINE.md` â€” AD-14, AD-7]
- [Source: `DESIGN.md` â€” `catalogue-service`, `item-file-service-bo`]
- [Source: `EXPERIENCE.md` â€” Service, barre latÃ©rale, BO Service, UJ-1/UJ-3]
- [Source: `SPEC.md` â€” CAP-7, CAP-11]
- [Source: `glossary.md` â€” Service (micro-mission)]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
