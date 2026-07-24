---
title: 'Implementation Readiness Assessment Report'
date: '2026-07-24'
project: 'Moeris'
stepsCompleted:
  - step-01-document-discovery
  - step-02-prd-analysis
  - step-03-epic-coverage-validation
  - step-04-ux-alignment
  - step-05-epic-quality-review
  - step-06-final-assessment
assessor: 'Implementation Readiness (BMad)'
readinessStatus: READY
filesIncluded:
  prd: 'prds/prd-moeris-2026-07-23/prd.md'
  architecture: 'architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md'
  epics: 'epics.md'
  ux:
    - 'ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md'
    - 'ux-designs/ux-moeris-2026-07-23/DESIGN.md'
---

# Implementation Readiness Assessment Report

**Date:** 2026-07-24
**Project:** Moeris

## Document Discovery

### PRD
- `prds/prd-moeris-2026-07-23/prd.md` (20 KB, 2026-07-24 09:47)
- Supporting: `reconcile-brainstorm-intent.md`

### Architecture
- `architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` (13,7 KB, 2026-07-24 09:33)
- Supporting reviews in `architecture/.../reviews/`

### Epics & Stories
- `epics.md` (28,1 KB, 2026-07-24 10:17)

### UX Design
- `ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` (23,5 KB, 2026-07-24 10:00)
- `ux-designs/ux-moeris-2026-07-23/DESIGN.md` (23,5 KB, 2026-07-24 08:44)
- Supporting: reviews, validation, mockups

### Issues Resolved
- No whole vs sharded duplicates
- All four required document types present
- UX treated as EXPERIENCE.md + DESIGN.md (confirmed)

## PRD Analysis

### Functional Requirements

FR-1: Afficher la dualité Wi‑Fi / Ma table — Le support Carte table expose clairement QR Wi‑Fi et QR Ma table côte à côte, avec libellés et numérotation. Réalise UJ-1.
FR-2: Ouvrir Ma table depuis le QR dédié — Le client ouvre Ma table en scannant uniquement le QR Ma table. Réalise UJ-1, UJ-2.
FR-3: Persister la Session — Le système persiste la Session (stockage local + identifiant serveur) avec TTL soirée (~6 h). Réalise UJ-1.
FR-4: Reprendre après fermeture d’onglet — Si l’onglet est fermé, rescanner le QR Ma table reprend la Session (lien table/appareil). Réalise UJ-1.
FR-5: Micro-missions à but unique — Chaque écran client poursuit un but précis (ordre de grandeur 10–30 s) ; pas de feed multi-parcours. Réalise UJ-1.
FR-6: Consulter le Menu — Le client consulte le Menu sans compte. Réalise UJ-1.
FR-7: Gérer le Menu en Back-office — L’équipe crée/modifie/désactive des éléments du Menu (au minimum nom, prix, disponibilité, photo si fournie). Réalise UJ-3.
FR-8: Passer une Commande — Le client envoie une Commande depuis Ma table, associée à sa Session / Table. Réalise UJ-1.
FR-9: Capturer des Goûts cuisine — Lors de la commande, le client peut indiquer des Goûts cuisine (pas allergies prioritaires). Réalise UJ-1, UJ-2.
FR-10: Suivre les Commandes en Back-office — L’équipe voit les commandes entrantes (y compris les Goûts cuisine associés) et met à jour un statut minimal utile au service. Réalise UJ-3.
FR-11: Demander de l’aide service — Le client déclenche au moins une micro-mission Service (ex. appeler le serveur / besoin simple). Réalise UJ-1.
FR-12: Déclencher Terminer mon expérience — Le bouton Terminer mon expérience est proposé après que la commande a été reçue (côté client). Réalise UJ-1.
FR-13: Collecter un Avis court — Le client laisse un Avis principalement par note/emoji (texte libre non obligatoire). Réalise UJ-1.
FR-14: Merci chef chaleureux (ton selon l’avis) — Immédiatement après l’Avis, le client voit une clôture chaleureuse (ambiance visuelle + ton chef) avant toute demande de contact. Réalise UJ-1.
FR-15: Collecter Contact opt-in — Après le merci chef, le client peut laisser téléphone ou email pour les soirées Moeris, explicitement opt-in. Réalise UJ-1.
FR-16: Reconnaissance soft automatique — Si l’appareil/cookie permet, le système propose la Mémoire sans login. Réalise UJ-2.
FR-17: Reconnaissance par ressaisie de contact — Le client qui a déjà laissé un contact peut le ressaisir (tél ou email) pour accéder à ses préférences. Réalise UJ-2.
FR-18: Afficher Préférés courts — Afficher un historique court de Préférés (top 3–5). Réalise UJ-2.
FR-19: Réappliquer Goûts cuisine en 1 tap — Proposer les Goûts cuisine mémorisés en un geste. Réalise UJ-2.
FR-20: Authentifier le staff Back-office — Un membre autorisé s’authentifie pour accéder au Back-office. Réalise UJ-3.

**Total FRs: 20**

### Non-Functional Requirements

NFR-1 (Performance / data): Pages légères ; usage acceptable sur réseau mobile/Wi‑Fi resto ; premier écran utile < 3 s sur 4G moyenne (assumption).
NFR-2 (Fiabilité session): Reprise après refresh/crash (FR-3, FR-4).
NFR-3 (Accessibilité pragmatique): Gros boutons, contraste, lisible pour persona peu à l’aise digital.
NFR-4 (Sécurité back-office): Accès staff authentifié ; pas d’édition menu depuis le client.
NFR-5 (Disponibilité): Adaptée service resto soirée ; pas de SLA 99.99 formalisé en V1 ; objectif « tient le coup un service complet ».
NFR-6 (Privacy & Data): Contact = opt-in en fin ; menu consultable sans identité ; finalité soirées Moeris / relation Résidence — pas de revente ; minimisation (pas de tracking intrusif table/heure/compagnie) ; conservation contacts 24 mois après dernière interaction ; effacement manuel documenté ≤ 15 jours ouvrés ; conformité loi Sénégal 2008-12 + revue conseil avant envoi massif.
NFR-7 (Platform): V1 mobile web via QR (pas d’app store) ; PWA installable non requise V1.
NFR-8 (Print physique): QR imprimés contraste, numéros grands, design durable ; un seul objet mental carte ; ordre 1 Wi‑Fi / 2 Ma table.
NFR-9 (Aesthetic / Tone): Chaque écran = « bienvenue à la maison » ; tutoiement doux ; bannir jargon froid ; UX anti-patterns bannis.
NFR-10 (Success metrics as product constraints): SM-1 ≥ 60 % ; SM-2 ≥ 25 % ; SM-3 reconnaissance ; SM-4 ≈ 0 fantômes ; ne pas maximiser temps in-app ni écrans avant menu.

**Total NFRs: 10**

### Additional Requirements

- Non-goals explicites : pas de compte client obligatoire, captive portal, feed/pubs, fidélité V1, allergies mémoire V1, paiement digital, app native, multi-sites.
- Assumptions index : comptes staff simples ; statuts reçue/en préparation/servie ; propagation menu < 1 min ; file/notif Service ; chef 2D V1 ; etc.
- Open Questions : aucune question bloquante restante pour V1.
- Success Metrics SM-1 à SM-4 + counter-metrics SM-C1/SM-C2.

### PRD Completeness Assessment

PRD status `final`, structuré et testable : 20 FR numérotées avec conséquences, glossaire normatif, UJ-1/2/3, MVP in/out, NFR cross-cutting, privacy et print. Clair pour démarrer l’implémentation ; les assumptions sont indexées. Écart notable vs epics : le PRD n’a pas de FR numérotée pour la barre de progression séjour (présent en epics comme FR21 / UX-DR15).

## Epic Coverage Validation

### Epic FR Coverage Extracted

FR1: Epic 1 — Dualité QR Carte table (Wi‑Fi + Ma table)
FR2: Epic 1 — Ouverture / reprise Session via QR Ma table + tableId
FR3: Epic 1 — Persistance Session TTL ~6 h
FR4: Epic 1 — Reprise après fermeture d’onglet + bannière soft
FR5: Epic 1 — Micro-missions / fil léger anti-feed
FR6: Epic 2 — Consultation Menu client anonyme
FR7: Epic 2 — Gestion Menu Back-office
FR8: Epic 3 — Passer une Commande
FR9: Epic 3 — Capturer Goûts cuisine
FR10: Epic 3 — Suivi Commandes BO + statuts
FR11: Epic 3 — Micro-missions Service + file BO
FR12: Epic 4 — Gate Terminer mon expérience
FR13: Epic 4 — Avis court
FR14: Epic 4 — Merci chef (3 tons)
FR15: Epic 4 — Contact opt-in tél XOR email
FR16: Epic 5 — Reconnaissance soft automatique
FR17: Epic 5 — Reconnaissance par ressaisie contact
FR18: Epic 5 — Préférés courts top 3–5
FR19: Epic 5 — Réappliquer goûts en 1 tap
FR20: Epic 2 — Authentification staff Back-office
FR21: Epic 1 — Barre de progression séjour (Accueil|Menu|Commande|Fin) — **présent dans epics/UX, absent du PRD comme FR numérotée**

**Total FRs in epics: 21**

### Coverage Matrix

| FR Number | PRD Requirement | Epic Coverage | Status |
| --------- | --------------- | ------------- | ------ |
| FR-1 | Dualité Wi‑Fi / Ma table | Epic 1 / Story 1.6 | ✓ Covered |
| FR-2 | Ouvrir Ma table depuis QR | Epic 1 / Story 1.2 | ✓ Covered |
| FR-3 | Persister Session TTL ~6 h | Epic 1 / Stories 1.2, 1.4 | ✓ Covered |
| FR-4 | Reprendre après fermeture onglet | Epic 1 / Story 1.4 | ✓ Covered |
| FR-5 | Micro-missions à but unique | Epic 1 / Stories 1.3, 1.5 | ✓ Covered |
| FR-6 | Consulter le Menu | Epic 2 / Story 2.3 | ✓ Covered |
| FR-7 | Gérer Menu Back-office | Epic 2 / Story 2.2 | ✓ Covered |
| FR-8 | Passer une Commande | Epic 3 / Story 3.1 | ✓ Covered |
| FR-9 | Capturer Goûts cuisine | Epic 3 / Story 3.1 | ✓ Covered |
| FR-10 | Suivre Commandes BO | Epic 3 / Story 3.2 | ✓ Covered |
| FR-11 | Demander aide Service | Epic 3 / Story 3.3 | ✓ Covered |
| FR-12 | Gate Terminer mon expérience | Epic 4 / Story 4.1 | ✓ Covered |
| FR-13 | Collecter Avis court | Epic 4 / Story 4.2 | ✓ Covered |
| FR-14 | Merci chef (3 tons) | Epic 4 / Story 4.3 | ✓ Covered |
| FR-15 | Contact opt-in | Epic 4 / Story 4.4 | ✓ Covered |
| FR-16 | Reconnaissance soft auto | Epic 5 / Story 5.1 | ✓ Covered |
| FR-17 | Reconnaissance par ressaisie | Epic 5 / Story 5.2 | ✓ Covered |
| FR-18 | Afficher Préférés courts | Epic 5 / Story 5.1 | ✓ Covered |
| FR-19 | Réappliquer Goûts 1 tap | Epic 5 / Story 5.3 | ✓ Covered |
| FR-20 | Auth staff Back-office | Epic 2 / Story 2.1 | ✓ Covered |
| FR21 (epics only) | Barre progression séjour | Epic 1 / Story 1.5 | ⚠ Extra vs PRD (issu UX) |

### Missing Requirements

### Critical Missing FRs

Aucun FR PRD (FR-1 à FR-20) manquant dans les epics.

### High Priority Missing FRs

Aucun.

### Note — FR dans epics hors PRD

- **FR21** (barre de progression séjour) : couvert Epic 1 / Story 1.5 et UX-DR15, mais **non numéroté dans le PRD**. Recommandation soft : ajouter FR-21 au PRD pour aligner la numérotation, ou documenter explicitement comme exigence UX-only.

### Coverage Statistics

- Total PRD FRs: **20**
- FRs covered in epics: **20**
- Coverage percentage: **100 %**
- FRs in epics not in PRD: **1** (FR21)

## UX Alignment Assessment

### UX Document Status

**Found** — artefacts UX complets et `status: final` :
- `ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` (colonne expérience / IA / flows / états)
- `ux-designs/ux-moeris-2026-07-23/DESIGN.md` (tokens Citrus, typo, composants)
- Maquettes de référence : `mockups/accueil.html`, `menu.html`, `merci-chef.html`, `bo-commandes.html`

### UX ↔ PRD Alignment

| Zone | Statut | Notes |
| --- | --- | --- |
| UJ-1 / UJ-2 / UJ-3 | ✓ Aligné | Flows 1–3 EXPERIENCE = parcours PRD |
| FR-1..FR-20 (comportement) | ✓ Aligné | Surfaces, composants et états UX couvrent les FR |
| Fin avis → merci → contact | ✓ Aligné | Ordre émotionnel PRD respecté |
| Service catalogue fermé | ✓ Aligné | 4 gestes ; pas de chat (PRD §4.5) |
| Mémoire / reconnaissance | ✓ Aligné | Soft + ressaisie ; préférés 3–5 ; 1 tap goûts |
| Plateforme | ⚠ Écart soft | PRD §9 dit « mobile web » ; UX + Arch exigent **multi-support** phone/tablette/desktop (décision 2026-07-24) — cohérent Arch AD-17, à noter dans PRD |
| Barre progression séjour | ⚠ Hors FR PRD | UX + Epic FR21 / UX-DR15 ; pas de FR numérotée PRD |
| « Bienvenue à la maison » (§8) | ⚠ Soft | Principe Voice/Foundation UX, pas FR testable PRD (gap déjà noté EXPERIENCE) |

### UX ↔ Architecture Alignment

| Zone | Statut | Notes |
| --- | --- | --- |
| Surfaces Client + BO shell | ✓ Aligné | AD-1, AD-17 ↔ EXPERIENCE IA |
| Session cookie + reprise R2 | ✓ Aligné | AD-5 ↔ `banniere-reprise` |
| Gate Terminer ≥ received | ✓ Aligné | AD-13 ↔ FR-12 / State Patterns |
| Service types fermés | ✓ Aligné | AD-14 ↔ `catalogue-service` |
| Contact XOR + Guest upsert | ✓ Aligné | AD-15, AD-19 ↔ `selecteur-contact` |
| Mémoire top 3–5 + réapply | ✓ Aligné | AD-20 ↔ `bloc-memoire` |
| Fraîcheur BO (Pusher) | ✓ Aligné | AD-7 soutient SM-4 / anti-fantômes UX |
| Photos plats Blob | ✓ Aligné | AD-10 ↔ Menu photo-first DESIGN |
| Tokens Citrus / a11y | ✓ Aligné | Conventions Arch citent UX Citrus ; tokens restent ownership UX |
| Motion / prefers-reduced-motion | ⚠ Soft | EXPERIENCE l’exige ; DESIGN.md note motion non encore spécifié (durée/easing/fallback) |
| Copy 3 tons Merci chef | ✓ Acceptable | Arch Deferred correctement → UX/copy ; structure UX fixe ≥3 tons |

### Alignment Issues

1. **FR21 barre de progression** — exigence UX/Epic non portée comme FR PRD (traceabilité).
2. **Plateforme multi-support** — UX/Arch plus larges que le wording PRD « mobile web » (alignés entre eux, PRD à synchroniser).
3. **Motion a11y** — engagement EXPERIENCE sans spec DESIGN formelle (durée, easing, `prefers-reduced-motion`).
4. **Note stale EXPERIENCE** — §Gaps dit « Aucune maquette n’est encore liée » alors que maquettes + refs sont listées plus haut (doc interne à nettoyer, non bloquant build).

### Warnings

- Aucun warning bloquant « UX manquant alors qu’UI est impliquée » — UX est présent et final.
- Soft : formaliser motion/`prefers-reduced-motion` en DESIGN ou story Epic 1 avant polish.
- Soft : micro-copy définitive (3 tons chef, bannière Reprise, Contact) encore à rédiger — structure OK pour build.
- Soft : aligner PRD (FR-21 + wording multi-support) pour éviter divergence docs.

## Epic Quality Review

Beginning **Epic Quality Review** against create-epics-and-stories standards (user value, independence, dependencies, ACs, starter/DB timing).

### Epic Structure Validation

| Epic | User value | Independence | Verdict |
| --- | --- | --- | --- |
| Epic 1 — Fondation & entrée à table | ✓ Client ouvre Ma table, session, Accueil, barre | ✓ Standalone (Menu/Service stub OK) | Pass |
| Epic 2 — Menu vivant | ✓ Staff publie ; client consulte | ✓ Dépend seulement Epic 1 | Pass |
| Epic 3 — Commander & servir | ✓ Commande + Service + file BO | ✓ Dépend Epic 1–2 | Pass |
| Epic 4 — Clôturer le séjour | ✓ Avis → Merci → Contact | ✓ Dépend Epic 3 (gate commande) | Pass |
| Epic 5 — Revenir comme un habitué | ✓ Mémoire 2ᵉ visite | ✓ Dépend données Epic 3–4 (séquentiel produit, pas forward) | Pass |

**Starter template :** Architecture impose `create-next-app` → Story 1.1 conforme (scaffold Next.js + tokens Citrus + shells).

**DB timing :** Pas de « create all models » en 1.1 ; Table/Session en 1.2, Menu en 2.2, Order en 3.1, ServiceRequest en 3.3, Review/Contact en 4.x, Guest/Preference en 5.x — conforme.

### Story Quality & ACs

- **19 stories** (1.1–1.6, 2.1–2.3, 3.1–3.3, 4.1–4.4, 5.1–5.3), format Given/When/Then présent partout.
- ACs testables : erreurs réseau (Menu, Commande), états vides BO, contact inconnu, TTL expiré, skip contact, transitions statut BO only.
- Stubs explicites et bornés : Story 1.3 (Menu/Service destinations), Story 2.1 (onglets Commandes/Service) — acceptables pour indépendance Epic N.

### Dependency Analysis

- **Intra-epic :** ordre croissant uniquement (pas de référence Story N+k).
- **Inter-epic :** 1 → 2 → 3 → 4 → 5 ; aucune dépendance vers un epic futur.
- **Forward dependency :** aucune critique détectée.

### Best Practices Compliance Checklist

| Critère | Epic 1 | Epic 2 | Epic 3 | Epic 4 | Epic 5 |
| --- | --- | --- | --- | --- | --- |
| User value | ✓ | ✓ | ✓ | ✓ | ✓ |
| Independence | ✓ | ✓ | ✓ | ✓ | ✓ |
| Stories sized | ✓ | ✓ | ✓ | ✓ | ✓ |
| No forward deps | ✓ | ✓ | ✓ | ✓ | ✓ |
| DB when needed | ✓ | ✓ | ✓ | ✓ | ✓ |
| Clear ACs | ✓ | ✓ | ✓ | ✓ | ✓ |
| FR traceability | ✓ | ✓ | ✓ | ✓ | ✓ |

### Quality Findings by Severity

#### Critical Violations

Aucun.

#### Major Issues

Aucun bloquant. Points à surveiller (non bloquants) :
- **Story 1.1** est technique (scaffold) — justifiée par starter greenfield Arch ; valeur utilisateur indirecte via Epic 1 global.
- **Epic 5** suppose contacts/prefs issus d’Epic 4/3 — séquence produit normale ; prévoir données de seed/test pour dev Epic 5 en isolation.

#### Minor Concerns

1. **Pas de story CI/CD / env early** — greenfield checklist BMAD ; non exigé Arch explicitement ; peut rester hors epics V1.
2. **Story 1.6 (print Carte table)** — livrable artefact/spec plus que code ; FR-1/NFR print couverts ; sizing OK si traité comme kit print.
3. **NFR1 perf <3s** et **NFR6 process effacement 24mois/15j** — notés soft dans `epics.md` validationNotes ; à rappeler en `create-story`, pas d’AC dédiées.
4. **`prefers-reduced-motion` (UX-DR11)** — implicite DESIGN/EXPERIENCE ; pas d’AC story explicite.
5. **Micro-copy définitive** (3 tons chef, etc.) — structure AC OK (« ≥3 variantes ») ; copy finale hors stories.

### Remediation Recommendations

1. Optionnel : story/chore « process effacement contact documenté » liée NFR6 avant go-live contacts.
2. Optionnel : AC motion/`prefers-reduced-motion` dans Story 1.1 ou 1.3.
3. Aligner PRD FR-21 + multi-support (déjà noté UX) pour cohérence docs — n’empêche pas le build.
4. Pour Epic 5 en parallèle de test : fixtures Guest + Preference + cookie soft.

## Summary and Recommendations

### Overall Readiness Status

**READY**

Les artefacts PRD, UX (EXPERIENCE + DESIGN), Architecture Spine et Epics/Stories sont présents, finals, et alignés pour démarrer la Phase 4. Couverture FR PRD = **100 %** (20/20). Aucune violation critique de qualité d’epics. Les écarts restants sont soft (synchronisation docs / polish NFR).

### Critical Issues Requiring Immediate Action

Aucun.

### Soft Issues (non bloquants)

1. **FR21 barre de progression** dans epics/UX sans FR numérotée PRD.
2. **Wording plateforme** : PRD « mobile web » vs UX/Arch multi-support.
3. **Motion / `prefers-reduced-motion`** pas encore formalisé en DESIGN ni en AC.
4. **NFR6** process manuel d’effacement contact (24 mois / 15 j) à documenter avant envoi massif.
5. Note stale EXPERIENCE sur maquettes « non liées » alors que mockups existent.

### Recommended Next Steps

1. Lancer **sprint planning** / **create-story** sur Epic 1 Story 1.1 (scaffold Next.js + tokens Citrus).
2. Optionnel avant ou en parallèle : patch PRD (FR-21 + multi-support) pour figer la traceabilité.
3. En create-story : rappeler NFR1 perf &lt;3s, NFR6 privacy process, UX-DR11 motion.
4. Prévoir fixtures Guest/Preference pour tests Epic 5.

### Final Note

Cette évaluation a identifié **0 issue critique** et **5 points soft** sur 4 catégories (couverture FR, alignement UX, qualité epics, NFR/process). Tu peux procéder à l’implémentation en l’état ; les softs améliorent la cohérence documentaire et le polish, sans bloquer le build V1.

**Assessor:** Implementation Readiness (BMad)  
**Date:** 2026-07-24
