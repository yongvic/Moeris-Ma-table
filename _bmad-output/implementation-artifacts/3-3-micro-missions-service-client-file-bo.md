# Story 3.3: Micro-missions Service client + file BO

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a client,
I want demander serveur / eau / addition / autre en un tap,
so that j’obtiens de l’aide sans chat ni long formulaire.

## Acceptance Criteria

1. **Given** une Session active  
   **When** j’ouvre Service et je tape une des 4 tuiles (serveur / eau / addition / autre)  
   **Then** une ServiceRequest `open` est créée (type fermé, sans note libre) et confirmée côté client  
   **And** chaque tuile a icône + libellé texte  
   **And** la barre de progression principale n’avance pas

2. **Given** une demande créée  
   **When** le staff ouvre BO Service  
   **Then** la demande apparaît dans la file (Pusher + filet poll) et peut passer `open` → `done`  
   **And** l’état vide de la file est explicite

## Tasks / Subtasks

- [ ] T1. Schéma ServiceRequest (AC: #1, #2)
  - [ ] Model : `id`, `sessionId`, `tableId`, `type` enum **`waiter|water|bill|other`**, `status` enum **`open|done`**, `createdAt`, `updatedAt`
  - [ ] **AD-14** : pas de champ note / free text ; pas d’autres types V1
  - [ ] Création client only → status initial `open` ; transition `open→done` **BO only**

- [ ] T2. Domain actions (AC: #1, #2)
  - [ ] `domain/service/create-request.ts` : Session valide → INSERT + publish Pusher `{ kind:"service", id, tableId, status, at }` post-commit (AD-7)
  - [ ] `domain/service/complete-request.ts` : staff auth → `open→done` + publish
  - [ ] Erreurs `{ ok:false, code, message }` ; anti double-tap pending
  - [ ] Liste BO : open first, puis récentes done (ou filtre open-only V1 — documenter ; file active = `open`)

- [ ] T3. UI client `catalogue-service` (AC: #1)
  - [ ] Route Service depuis barre Menu|Service / Accueil secondaire
  - [ ] 4 tuiles fixes : mapping
    - `waiter` → « Serveur »
    - `water` → « Eau »
    - `bill` → « Addition »
    - `other` → « Autre »
  - [ ] Chaque tuile : **icône + libellé** (jamais icône seule) ; tap target ≥44px ; `surface-raised` / `rounded.md`
  - [ ] Un tap = envoi ; confirmation courte FR (« C’est noté. » / « On arrive. ») — geste sec, **pas** d’illustration dédiée
  - [ ] **Interdit** : chat, textarea, modale de précision
  - [ ] Mettre à jour étape session **sans** avancer la barre (Service = voie latérale) — barre reste sur Accueil/Menu/Commande/Fin courant (FR21 / UX-DR15)

- [ ] T4. UI BO Service file (AC: #2)
  - [ ] Remplacer stub onglet Service : `item-file-service-bo`
  - [ ] Afficher type (label FR), table/session, horodatage ; action « Fait » / « Traité » → `done`
  - [ ] Pusher `bo-floor` kind service + **poll soft** (réutiliser helper 3.2 si possible)
  - [ ] État vide explicite : « Aucune demande en attente »
  - [ ] Auth gate 2.1

- [ ] T5. Garde-fous anti-scope
  - [ ] Pas de free-text ; pas de types custom
  - [ ] Pas d’impact sur barre progression séjour
  - [ ] Pas de paiement addition ; « Addition » = appel staff seulement

## Dev Notes

### Dépendances

- **Bloquantes :** Epic 1 Session ; **2.1** pour BO file.
- **Fortement recommandée :** **3.2** infra Pusher + `use-bo-floor` poll — réutiliser canal `bo-floor`.
- Menu (2.x) non requis pour Service pur, mais parcours Accueil/nav Epic 1 oui.

### Architecture — AD obligatoires

- **AD-14** : type ∈ `{waiter,water,bill,other}` ; `open→done` BO only ; pas de note libre.
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
prisma/schema.prisma                      # ServiceRequest — UPDATE
domain/service/create-request.ts          # NEW
domain/service/complete-request.ts        # NEW
domain/service/list-open.ts               # NEW
app/(client)/service/page.tsx             # NEW
components/client/catalogue-service.tsx   # NEW
app/(bo)/service/page.tsx                 # UPDATE
components/bo/item-file-service-bo.tsx    # NEW
```

### UX / a11y

- EXPERIENCE : Service = micro-mission 10–30 s ; voie latérale
- DESIGN : `catalogue-service`, `item-file-service-bo`
- Accessible name par tuile (libellé visible)
- `pattern-background` OK sur Service
- Copy FR courte ; pas Login/Submit

### Barre de progression — règle dure

- Créer une ServiceRequest **ne change pas** l’étape Accueil|Menu|Commande|Fin
- Tests : avant/après demande, segments barre identiques
- Nom accessible barre inchangé (« Étape N sur 4 : … »)

### Hors scope strict

- Chat / notes staff sur la demande
- Priorisation multi-files / SLA timers
- Push OS staff
- Lien paiement addition

### Testing

- 4 tuiles → 4 types enum corrects ; refus type invalide server-side
- Confirmation client + row `open` Neon + event Pusher kind service
- BO voit item ; complete → `done` ; disparaît de file active / marquage traité
- Poll soft sans Pusher → item apparaît quand même
- Barre progression **inchangée** après envoi Service
- Pas de champ texte dans le DOM Service
- Non-auth BO → redirect Connexion
- État vide file nommé

### NFR soft

- NFR3 : gros targets, icône+texte
- NFR1 : page Service légère
- SM opérationnel : file visible pour ne rater aucune mission

### Previous story intelligence (3.2)

- Réutiliser `bo-floor` + poll — **même** hook / payload `kind`
- `status-pill` optionnel pour open/done si utile ; sinon bouton + label suffit
- Ne pas casser liste Commandes en branchant subscribe multi-kind

### References

- [Source: `epics.md` — Story 3.3, FR11]
- [Source: `ARCHITECTURE-SPINE.md` — AD-14, AD-7]
- [Source: `DESIGN.md` — `catalogue-service`, `item-file-service-bo`]
- [Source: `EXPERIENCE.md` — Service, barre latérale, BO Service, UJ-1/UJ-3]
- [Source: `SPEC.md` — CAP-7, CAP-11]
- [Source: `glossary.md` — Service (micro-mission)]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
