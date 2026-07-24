---
name: reconcile-ux
date: 2026-07-24
sources:
  - ux-moeris-2026-07-23/EXPERIENCE.md (final)
  - ux-moeris-2026-07-23/DESIGN.md (final; tokens/responsive/BO skimmed)
  - architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md (draft)
verdict: GAPS
---

# Réconciliation UX ↔ Architecture spine

## Verdict

**GAPS** — Le spine architecture couvre bien le socle (monolithe 2 surfaces, session Neon, auth staff, statuts commande, Pusher BO, contacts Neon→Sheet, QR table). Plusieurs décisions UX **métier / domaine** qui doivent contraindre l’implémentation n’ont pas été distillées en invariants (AD) ou conventions. Pas de contradiction bloquante dure ; tensions / ambiguïtés listées ci-dessous.

## Alignements (déjà landés)

| Décision UX | Où dans l’archi |
|---|---|
| Client web multi-support (mention) | `scope` + memlog constraint |
| BO salle unique, pas de vue cuisine V1 | Deferred « Rôles BO fins / vue cuisine » ; rôle plat « salle » (AD-6) ; seed `(bo)/` unique |
| Statuts commande reçue → en prép → servie | **AD-12** `received` → `preparing` → `served` |
| Session anonyme, TTL ~6 h, cookie opaque | **AD-5** |
| Soft mémoire appareil + ressaisie tél/email → Guest | **AD-5**, **AD-8** |
| Client jamais login ; staff credentials | **AD-6** |
| Menu écrit uniquement BO | **AD-3** |
| QR Ma table = `tableId` stable ; Wi‑Fi hors produit | **AD-9** |
| Commande + goûts ; Service ; Avis ; Contact ; Mémoire | Capability map + ER (`Order`, `ServiceRequest`, `Review`, `Guest`, `Preference`) |
| Fraîcheur BO commandes/service (anti-fantôme) | **AD-7** Pusher post-commit |
| Contact opt-in + reconnaissance Neon | **AD-8** |

## Gaps — décisions UX qui doivent binder l’archi mais n’ont pas landé

Priorité **P0** = risque de dérive domaine / double vérité / mauvaises stories. **P1** = contrat produit à figer en AD ou convention. **P2** = surtout UI/DESIGN (noter, pas forcément AD).

### P0 — Catalogue Service fermé (4 types)

- **UX** (`catalogue-service`, PRD §4.5) : 4 tuiles fixes — serveur / eau / addition / autre ; **pas** de champ libre, **pas** de chat ; 1 tap = 1 `ServiceRequest`.
- **Archi** : `domain/service` + entité `ServiceRequest` existent ; **aucun AD** ni enum/types autorisés ; rien n’empêche un builder d’ajouter texte libre ou types ouverts.
- **À binder** : AD « `ServiceRequest.type` ∈ {`waiter`,`water`,`bill`,`other`} ; pas de body free-text V1 ».

### P0 — Soft reprise (R2) vs simple persistance session

- **UX** : interruption → bannière « Tu en étais à… » + reprise à l’**étape exacte** ; jamais silencieuse pure ; jamais ré-onboarding (FR-3/FR-4, memlog R2). Distinct de la **Mémoire** 2ᵉ visite.
- **Archi AD-5** : cookie → `Session` Neon (reprise après refresh) + soft mémoire Guest. **Ne fixe pas** : stockage d’une étape/surface courante ; contrat « soft banner obligatoire » ; séparation explicite Reprise (soirée en cours) vs Mémoire (visite suivante).
- **À binder** : champ `Session.currentStep` (ou équivalent) + règle UX/domaine « reopen → soft resume si session active non close » ; capability déjà nommée « Session & reprise » à préciser.

### P0 — Gate client « Terminer mon expérience »

- **UX** : CTA Terminer **absent / non mis en avant** avant commande reçue ; disponible **après** commande reçue (FR-12).
- **Archi** : AD-12 gouverne les transitions **BO** ; aucune règle liant la disponibilité du parcours fin (Avis → Merci chef → Contact) à l’existence / statut d’une `Order` de session.
- **Ambiguïté** : « reçue » UX = succès d’envoi client (`Order` créée, statut initial `received`) **ou** ack salle ? Flow 1 suggère post-envoi réussi. À clarifier en AD : ex. « Terminer unlock si `Session` a ≥1 `Order` en statut `received|preparing|served` ».

### P1 — Fraîcheur menu côté **client** (désactivation plat)

- **UX** : désactivation BO visible côté client quasi temps réel ou **&lt; 1 min** (FR-7).
- **Archi AD-7** : Pusher **BO only** (commandes + service). Aucune stratégie client (revalidate, poll menu, canal Pusher lecture, ISR tags).
- **Risque** : plat désactivé encore commandable jusqu’à refresh manuel.
- **À binder** : convention fraîcheur catalogue client (ex. revalidatePath/tag &lt; 60s + lecture dispo au submit Order).

### P1 — BO = un seul shell à onglets (invariant explicite)

- **UX** : quatre surfaces BO = **un** shell (Connexion → onglets Menu | Commandes | Service) ; pas d’apps séparées (memlog B1).
- **Archi** : structure `(bo)/` + deferred cuisine ; **pas d’AD** « un layout authentifié, trois onglets métier, pas de surface cuisine V1 ».
- Memlog UX override l’exige ; spine ne le **règle** pas (seulement l’implique).

### P1 — Multi-support (obligatoire UX) sous-spécifié en archi

- **UX / DESIGN** : breakpoints phone / tablette / desktop ; mêmes destinations ; pas de features desktop-only ; BO desktop/tablette **sans** layout mobile dédié V1.
- **Archi** : mot « multi-support » dans `scope` uniquement ; pas de règle plateforme (responsive shared routes, BO viewport floor).
- Suffisant pour ne pas contredire ; insuffisant pour empêcher un builder « mobile-only client » ou un BO mobile.

### P1 — Contact C1 (tél XOR email)

- **UX** : sélecteur puis **un seul** champ ; jamais les deux simultanés ; opt-in optionnel.
- **AD-8** : écriture Guest + Sheet ; **pas** de contrainte « un seul canal contact actif à l’opt-in ».
- **À binder** : schéma Guest `contactChannel` + `contactValue` (ou XOR email/phone non tous deux requis).

### P1 — Goûts cuisine inline sur la commande (FR-10)

- **UX** : goûts visibles **sans quitter** la fiche BO ; multi-select sur fiche plat.
- **Archi** : capability « Commande + goûts » ; ER `OrderLine` / `Preference` sans règle « tastes persisted on `Order`/`OrderLine` at submit ».
- **À binder** : goûts snapshotés sur la ligne/commande à l’envoi (pas seulement Preference Guest).

### P1 — Cycle de vie ServiceRequest

- **UX** : file BO ; item **marquable traité** ; états vides explicites.
- **Archi** : pas de machine à états Service (pending → done) parallèle à AD-12.

### P2 — Contrats UI / copy (hors spine ou companions)

- 3 tons Merci chef selon note ; avis étoiles obligatoires + emoji optionnel sans texte libre ; Préférés top 3–5 sans tracking table/heure/compagnie (FR-18) ; light-only Citrus ; tokens DESIGN.
- `domain/review` + `Preference` existent sans schéma d’avis / borne mémoire.
- Peuvent vivre en companion domaine ou stories ; pas bloquant pour le spine actuel si P0/P1 traités.

## Contradictions & tensions

| # | Nature | Détail |
|---|---|---|
| C1 | Tension UX interne | `DESIGN.md` Components note encore « V1 = expérience client **mobile web** » alors qu’`EXPERIENCE.md` + memlog archi imposent **multi-support**. L’archi a suivi le override multi-support (scope) — aligner la note DESIGN. |
| C2 | Tension fraîcheur | UX FR-7 menu client &lt;1 min vs AD-7 Pusher limité au BO commandes/service → **pas de mécanisme** archi pour la synchro dispo menu client. |
| C3 | Ambiguïté sémantique | Libellé UX « commande **reçue** » (gate Terminer) homonyme du statut AD-12 `received` / pill BO — sans règle d’unlock client, risque d’implémentations divergentes (post-submit local vs wait BO). |
| C4 | Confusion conceptuelle soft | AD-5 mélange dans une même rule « reprise session » et « soft mémoire Guest ». UX les sépare (Reprise R2 vs Mémoire UJ-2). Données OK ; narration AD à scinder pour éviter qu’un builder traite la 2ᵉ visite comme une reprise d’étape. |
| C5 | Soft (memlog vs spine) | Header memlog archi « mobile web » vs constraint multi-support — spine `scope` correct ; memlog header stale. |

**Pas de contradiction dure** type « UX dit X, AD dit non-X » sur auth, QR, monolithe, statuts BO, ou contacts Neon-first.

## Recommandations (pour mise à jour spine)

1. Ajouter **AD-ServiceCatalog** : enum 4 types, no free-text.
2. Étendre **AD-5** (ou AD-Resume) : `currentStep` + soft resume obligatoire ; scinder mémoire Guest.
3. Ajouter règle **Terminer** liée à présence/`Order.status`.
4. Ajouter convention **menu freshness client** (complément AD-7 ou AD-3).
5. AD ou Consistency : **BO shell unique** 3 onglets ; **Contact XOR** ; **tastes on Order** ; **ServiceRequest** pending→done.
6. Optionnel P2 : companion `domain-contracts` (avis shape, Prefereds bounds, light-only).

## Sources consultées

- `EXPERIENCE.md` : Foundation, IA, Component/State patterns, Responsive, Key Flows UJ-1..3
- `DESIGN.md` : tokens Citrus, components dont `catalogue-service` / `banniere-reprise` / `status-pill-bo`, layout multi-support, note BO
- `ARCHITECTURE-SPINE.md` : AD-1..12, Capability map, Deferred, ER
