---
title: "Review adversariale — Architecture Spine"
status: complete
created: 2026-07-24
source: architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md
method: two-units-one-level-down
altitude: feature → epics / agents
verdict: FAIL
---

# Review adversariale — Ma table (spine)

## Méthode

Altitude feature → deux unités du niveau inférieur (épics / agents) construisent **indépendamment**, chacune obéissant **à la lettre** à tous les AD-1…AD-17 et aux Consistency Conventions. Si elles divergent sur forme de données partagée, propriétaire d’entité, ou chemin de mutation — c’est un **trou** à fermer par AD nouveau ou Rule resserrée.

Unités d’attaque récurrentes :

| Label | Scope |
| --- | --- |
| **U-Client** | epic parcours QR : session, panier, envoi commande, service, terminer |
| **U-BO** | epic salle : menu, file commandes, file service, transitions statut |
| **U-Mémoire** | epic Guest / reconnaissance / prefs |
| **U-Contact** | epic opt-in fin d’expérience + sync Sheet |

---

## Verdict

**FAIL** — la spine fixe bien le paradigme (monolithe, surfaces, stack, quelques machines) mais **échoue le test « deux unités »** sur les entités partagées les plus chaudes : `Session` (panier / étape / concurrence table), `Order` (naissance + statut initial + granularité), `Guest` (double créateur), contrats realtime/cache (`Pusher`, tags menu), et cycle de vie `ServiceRequest`. Les AD « Prevents » annoncés ne sont pas tous **enforceables** faute de forme/owner/path uniques.

Ce n’est pas une contradiction interne AD↔AD ; c’est de la **sous-spécification load-bearing** : deux lectures littérales restent légales et incompatibles.

---

## Paires incompatibles (trous)

### H1 — Naissance de `Order` + statut initial vs transitions BO-only

**Unités :** U-Client × U-BO  
**AD cités à la lettre :** AD-4, AD-12, AD-13, AD-16

| U-Client (légal) | U-BO (légal) |
| --- | --- |
| `domain/order.placeOrder` crée `Order` + `OrderLine` avec `status = received` dès l’envoi (AD-12 : côté client « reçue » = ≥ `received` ; création ≠ « transition ») | `domain/order` n’autorise que le BO à **poser** un statut ; le client crée une commande sans statut / avec un 4ᵉ libellé UI mappé en base plus tard — ou attend un ack salle avant `received` |
| Goûts snapshotés sur `Order` à l’envoi (AD-16) | Goûts snapshotés sur chaque `OrderLine` ; BO lit l’autre forme |

**Clash :** gate Terminer (AD-13), file Pusher (AD-7), et board commandes ne partagent pas le même moment « commande existe / est reçue ». AD-12 interdit les transitions client et un 4ᵉ statut, mais **ne dit pas** : (1) qui INSERT `Order`, (2) statut obligatoire à la création, (3) où vivent les goûts (`Order` vs `OrderLine`).

**AD fix :** Resserrer AD-12 (ou AD-18) : *seul `domain/order.placeOrder` (surface client) INSERT `Order` avec `status=received` atomique + lines + tastes snapshot ; seules les Server Actions BO exécutent `received→preparing→served` ; goûts immuables sur `Order` (ou sur chaque `OrderLine` — **choisir un**).*

---

### H2 — Double vérité panier : `Session.panier` vs draft `Order`

**Unités :** U-Client-session × U-Client-order (deux agents sous le même epic client)  
**AD cités :** AD-5, AD-4, AD-12, seed ER

| Unité Session | Unité Order |
| --- | --- |
| Panier = JSON / rows sur `Session` ; `placeOrder` copie puis vide | Panier = `Order` « ouverte » + `OrderLine` avant envoi ; pas de champ panier session |
| Mutations panier = `domain/session/*` | Mutations panier = `domain/order/addLine` |

**Clash :** ER montre `Session` et `Order`/`OrderLine` sans dire où vit le panier pré-envoi. AD-5 nomme « panier » sur Session ; AD-16 snapshot à l’« envoi » sans définir la source. Deux schémas Prisma, deux actions, reprise R2 restaure un panier que l’autre module n’écrit pas.

**AD fix :** *Panier pré-envoi = structure sur `Session` uniquement ; `Order`/`OrderLine` n’existent qu’après `placeOrder` réussi ; interdiction d’`Order` sans statut du cycle AD-12.*

---

### H3 — Concurrence table : une vs N `Session` actives

**Unités :** U-Client × U-BO (ou 2e scan téléphone)  
**AD cités :** AD-5, AD-9

| U-Client A | U-Client B / U-BO |
| --- | --- |
| Scan QR → **reprendre** l’unique `Session` active de la `Table` (même soirée, TTL) ; nouveau cookie pointe vers elle | Scan QR → **toujours créer** une nouvelle `Session` ; « reprendre » = cookie opaque déjà connu seulement |
| BO « libère la table » = close Session | BO ignore Session ; table = décoration sur `Order.tableId` |

**Clash :** AD-9 « ouvrir/reprendre Session liée à cette table » est ambigu (open XOR resume ? critère d’active ?). Deux `Order` sur la même table physique avec `sessionId` différents ; reprise R2 et bannière soft divergent ; Pusher BO affiche des fantômes.

**AD fix :** *Au plus une `Session` `active` par `tableId` dans le TTL ; scan sans cookie session → attacher à l’active ou en créer si aucune ; close explicite (TTL ou action métier nommée) ; `tableId` format = UUID (ou slug stable documenté — **un**).*

---

### H4 — Deux owners de `Guest` (mémoire vs contact)

**Unités :** U-Mémoire × U-Contact  
**AD cités :** AD-5, AD-8, AD-15

| U-Mémoire | U-Contact |
| --- | --- |
| Ressaisie tél/email en entrée → `upsert Guest` + link `Session.guestId` + lit `Preference` | Opt-in fin → `create Guest` avec canal XOR ; sync Sheet ; peut re-link Session |
| Clé naturelle = phone **ou** email normalisé | Clé = `guestId` opaque ; contact fields nullable séparés ; Sheet colonnes `phone`,`email` |

**Clash :** double `Guest` pour le même humain ; prefs orphelines ; Sheet miroir (AD-8) reçoit des lignes dupliquées ou des shapes colonnes incompatibles. AD-15 fixe XOR à l’opt-in mais **pas** la résolution d’identité ni le writer unique de `Guest` / `Preference`.

**AD fix :** *Un seul module `domain/guest` upsert par canal normalisé (phone E.164 **ou** email lower) ; Contact et Mémoire appellent ce module ; `Preference` écrit uniquement via `domain/guest` (même si algo top-N reste Deferred) ; mapping Sheet figé (colonnes + une ligne / guestId).*

---

### H5 — Contrat Pusher absent (shape + canaux + événements)

**Unités :** U-Client (publish order/service) × U-BO (subscribe shell)  
**AD cités :** AD-7, AD-4, AD-14

| Publisher Order | Publisher Service | Subscriber BO |
| --- | --- | --- |
| Event `order.updated`, payload `{ orderId, status }` | Event `new-service`, payload = row Prisma entière | Attend envelope `{ kind, id, tableId, at }` sur canal `salle` |
| Canal `site-{id}` | Canal `table-{tableId}` | Canal `bo-orders` |

**Clash :** AD-7 impose « publier après commit » et « canal scoped site/salle » sans **nom de canal**, **noms d’events**, ni **DTO**. Chaque côté est conforme et le BO rate des commandes (le Prevents de AD-7 n’est pas enforceable).

**AD fix :** *Canal unique V1 `moeris-salle` (ou équivalent nommé) ; events `order.committed` \| `service.committed` ; payload minimal versionné `{ v, type, id, tableId, sessionId, status? }` ; publish strictement post-commit dans la même Server Action.*

---

### H6 — `ServiceRequest` : types fermés, cycle de vie ouvert

**Unités :** U-Client × U-BO  
**AD cités :** AD-14, AD-7, AD-4

| U-Client | U-BO |
| --- | --- |
| INSERT `ServiceRequest` `{ type }` ; done = absence UI | Statuts `pending→acked→done` ; dismiss = mutation Neon + Pusher |
| Pas de champ status | Status inventé localement ; poll soft lit autre colonne |

**Clash :** file BO et realtime ne convergent pas. AD-14 ferme les **types** seulement ; le Prevents « types inventés » est couvert, pas « états inventés » (contrairement à AD-12 pour Order).

**AD fix :** *Machine `ServiceRequest.status` : `open → done` (ou `open → acked → done` si besoin) ; transitions **uniquement** Server Actions BO ; client ne fait que `create(type)` → `open` ; publish Pusher sur create + transition (AD-7).*

---

### H7 — « Catalogue publié » + tags cache menu

**Unités :** U-BO-menu × U-Client-menu  
**AD cités :** AD-3, AD-16

| U-BO | U-Client |
| --- | --- |
| `MenuItem.available` bool ; draft = row absente | `status: draft\|published` + `available` ; client filtre `published` |
| `revalidateTag('menu')` après save | `revalidatePath('/menu')` ; lit tag `menu-items` |

**Clash :** client voit brouillons ou rate des dispo &lt; 1 min. AD-3 « catalogue publié » et AD-16 « revalidate/tag » sans **modèle de publication** ni **tag canonique**.

**AD fix :** *V1 : tout `MenuItem` en base est publiable ; visibilité client = `available=true` (+ soft-delete/archive hors catalogue si besoin) ; après toute mutation menu BO → `revalidateTag('menu')` obligatoire (tag nommé) ; client fetch uniquement via ce tag.*

---

### H8 — Snapshot commande incomplet (prix / libellé / dispo)

**Unités :** U-Client-order × U-BO-commandes  
**AD cités :** AD-16, AD-3, AD-12

| U-Client | U-BO |
| --- | --- |
| Snapshot **goûts seulement** ; BO joint `MenuItem` live pour nom/prix | Snapshot `name`, `unitPrice`, `tastes` sur chaque `OrderLine` à l’envoi |
| Refuse submit si item `available=false` au read | Accepte lines ; BO découvre plat retiré après coup |

**Clash :** ticket salle ≠ ce que le client a validé après edit prix BO (AD-3+AD-16). Prevents « goûts réinterprétés » est partiel.

**AD fix :** *À `placeOrder`, chaque `OrderLine` snapshot `menuItemId`, `name`, `unitPrice`, `tastes` ; immuables ; re-check `available` dans la transaction d’envoi.*

---

### H9 — Cardinalité commandes par session

**Unités :** U-Client × U-BO  
**AD cités :** AD-12, AD-13, seed ER `Session ||--o{ Order`

| U-Client | U-BO |
| --- | --- |
| Un seul `Order` par Session ; rajouts = nouvelles lines (même si `preparing`) | Chaque envoi = nouvel `Order` ; board groupé par table |
| Terminer si ≥1 Order ≥ received | Agrège N orders ; transitions par order |

**Clash :** ER autorise N ; aucun AD ne dit si re-commande = nouvel Order ou amend. Statuts et Pusher divergent.

**AD fix :** *Chaque succès `placeOrder` = nouvel `Order` immuable en lines ; pas d’amend post-`received` ; N orders / session autorisé et c’est le modèle BO.*  
*(Alternative explicitée : un Order mutable jusqu’à `preparing` — mais **il faut choisir**.)*

---

### H10 — `Session.étape` / reprise : enum vs route

**Unités :** deux agents client (parcours × reprise)  
**AD cités :** AD-5

| Agent Parcours | Agent Reprise |
| --- | --- |
| `currentStep` ∈ enum métier `welcome\|menu\|cart\|ordered\|closing` | Stocke pathname Next `/fr/menu` etc. |
| Bannière lit labels FR depuis enum | Bannière affiche la route brute |

**Clash :** AD-5 impose reprise d’étape + bannière soft sans **enum d’étapes** ni writer unique de ce champ.

**AD fix :** *Enum code `SessionStep` fermé (EN) ; seule `domain/session` écrit `currentStep` ; surfaces client reportent via actions nommées ; bannière mappe enum → copy FR.*

---

### H11 — Conventions erreur / codes : shape sans catalogue

**Unités :** tout × tout  
**AD / conventions :** Consistency « Erreurs Server Actions »

| Unité A | Unité B |
| --- | --- |
| `{ ok:false, code:'ORDER_GONE', message }` | `{ ok:false, code:'not-found', message }` + i18n côté action |

**Clash :** UI et logs ne peuvent pas brancher ; ce n’est pas un owner d’entité mais ça casse l’intégration multi-epic. Mineur vs H1–H6 mais réel au niveau feature.

**AD fix (convention resserrée) :** *Catalogue codes V1 minimal figé dans `domain/errors` (EN_SNAKE) ; `message` = copy FR stable ou clé i18n — **un** ; pas de codes libres par module.*

---

### H12 — Prefs : writer non nommé (Deferred trop large)

**Unités :** U-Mémoire × U-Order  
**AD cités :** AD-5, Deferred « Prefs mémoire top 3–5 »

| U-Order | U-Mémoire |
| --- | --- |
| Après `served`, dérive `Preference` depuis OrderLines | À l’opt-in / reconnaissance, écrit prefs depuis UI ou Review |

**Clash :** le Deferred renvoie l’**algo** aux epics mais laisse **deux writers** sur la même entité seed. Reviewer-gate : *nothing under Deferred could let two units diverge*.

**AD fix :** *Même si le ranking top-N reste Deferred : `Preference` mutée uniquement par `domain/guest` ; sources (order history vs explicit) = paramètre d’une seule action — pas d’INSERT Prisma depuis `domain/order`.*

---

## Synthèse des trous → AD

| ID | Trou | Suggestion |
| --- | --- | --- |
| H1 | Order create + statut initial + tastes locus | Resserrer AD-12 / nouvel AD placeOrder |
| H2 | Panier Session vs draft Order | Nouvel AD ownership panier |
| H3 | 1 vs N Session / table | Resserrer AD-9 (+ close/TTL active) |
| H4 | Dual owner Guest | Nouvel AD identité Guest upsert |
| H5 | Pusher contract | Resserrer AD-7 (canal/event/DTO) |
| H6 | ServiceRequest lifecycle | Nouvel AD parallèle à AD-12 |
| H7 | Publié + cache tag | Resserrer AD-3 + AD-16 |
| H8 | Snapshot line incomplet | Resserrer AD-16 |
| H9 | N Orders / session sémantique | Nouvel AD cardinalité Order |
| H10 | SessionStep enum | Resserrer AD-5 |
| H11 | Error codes | Convention → AD léger ou table codes |
| H12 | Preference writers | AD ownership malgré Deferred algo |

---

## Ce qui tient (pas un trou sous ce test)

- AD-1 monolithe / un déployable — difficile à contourner « à la lettre ».
- AD-2 direction des deps — empêche import client↔BO ; ne suffit pas seul pour owners domaine (d’où H1–H4).
- AD-6 auth staff vs client anonyme — clair.
- AD-10 Blob upload BO-only — clair.
- AD-11 Neon unique — clair (risque ops, pas divergence de forme entre unités).
- AD-15 XOR canal à l’opt-in — clair **localement** ; le trou est l’identité cross-flow (H4).
- AD-17 shell BO trois zones + responsive — clair structurellement.

---

## Recommandation

Avant epics/stories : fermer **au minimum H1, H2, H3, H4, H5, H6** (mutations + owners + realtime). H7–H10 dans la même passe si le distill reste lean. H11–H12 en convention/AD court.

Ne pas « documenter les deux options » dans le seed ER sans Rule : le seed n’est pas un contrat ; les unités le lireont comme permission de diverger.
