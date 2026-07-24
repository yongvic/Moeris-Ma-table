---
id: SPEC-moeris
companions:
  - glossary.md
  - ../../planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md
  - ../../planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md
  - ../../planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md
sources:
  - ../../planning-artifacts/prds/prd-moeris-2026-07-23/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Ma table (Résidence Moeris)

## Why

**Pain + opportunity.** À table, le client de la Résidence Moeris a besoin d’un fil digital léger (menu photos → commande → micro-besoins → clôture chaleureuse) sans compte ni surcharge ; Moeris a besoin d’**avis utiles** et de **contacts opt-in** pour les soirées, obtenus après l’émotion du merci chef — pas de scans vides ni de mur d’inscription. **Ma table** réalise ce fil via une carte imprimée à deux QR et une expérience web multi-support.

## Capabilities

- **CAP-1**
  - **intent:** Le client peut entrer dans **Ma table** depuis la **Carte table** (QR Wi‑Fi natif puis QR Ma table) et obtenir une **Session** liée à sa **Table**.
  - **success:** Deux actions QR distinctes lisibles ; le scan Ma table crée ou reprend une session table sans captive portal Wi‑Fi.

- **CAP-2**
  - **intent:** Le système peut persister la **Session** (TTL soirée ~6 h) et la reprendre après refresh, crash ou rescan sans ré-onboarding.
  - **success:** Reprise à l’étape en cours avec bannière soft « Tu en étais à… » ; après TTL, nouvelle session anonyme.

- **CAP-3**
  - **intent:** Le client anonyme peut consulter le **Menu** (photos, infos utiles) aligné sur le catalogue publié.
  - **success:** Accès menu sans identité ; contenus = publication Back-office.

- **CAP-4**
  - **intent:** Le staff authentifié peut créer, modifier et désactiver des éléments du **Menu** (nom, prix, disponibilité, photo).
  - **success:** Une désactivation retire ou marque indisponible côté client en moins d’une minute.

- **CAP-5**
  - **intent:** Le client peut envoyer une **Commande** associée à sa session/table, avec **Goûts cuisine** optionnels (pas d’allergies obligatoires).
  - **success:** Feedback client clair « commande partie » ; la commande apparaît en Back-office avec goûts snapshotés.

- **CAP-6**
  - **intent:** Le staff peut suivre les commandes entrantes (table/session, goûts visibles inline) et faire progresser les statuts reçue → en préparation → servie.
  - **success:** Aucune commande « fantôme » sur période pilote (cible ≈ 0) ; transitions statut BO only.

- **CAP-7**
  - **intent:** Le client peut déclencher une micro-mission **Service** en un geste parmi un catalogue fermé (serveur / eau / addition / autre).
  - **success:** Un tap envoie la demande ; file visible en Back-office ; pas de chat ni champ libre.

- **CAP-8**
  - **intent:** Après qu’une commande est reçue, le client peut **Terminer mon expérience** : **Avis** court → **merci chef** (ton selon avis) → **Contact opt-in** téléphone XOR email.
  - **success:** CTA fin absent du chemin principal avant commande reçue ; avis sans clavier long ; ≥3 tons chef ; contact jamais requis pour voir le merci.

- **CAP-9**
  - **intent:** À la 2ᵉ visite, le client peut être reconnu (soft appareil/cookie et/ou ressaisie contact) et retrouver sa **Mémoire** : Préférés top 3–5 et goûts réappliqués en 1 tap.
  - **success:** Pas de mot de passe ; contact inconnu → message clair + parcours anonyme ; pas de journal table/heure/compagnie.

- **CAP-10**
  - **intent:** Un membre autorisé peut s’authentifier au **Back-office** salle (Menu | Commandes | Service) sans que le client puisse éditer le menu.
  - **success:** Surfaces client en lecture seule sur le catalogue ; BO derrière auth staff.

- **CAP-11**
  - **intent:** Le client peut voir où il en est dans le séjour via une barre de progression discrète (Accueil → Menu → Commande → Fin) qui se remplit selon l’étape.
  - **success:** La barre avance avec l’étape de session ; Service n’avance pas la barre ; pas de navigation libre multi-étapes via la barre ; un seul CTA principal par écran conservé.

## Constraints

- Web multi-support (phone / tablette / desktop) via QR ; **pas** d’app native stores ; PWA installable non requise V1.
- Carte = **deux QR** numérotés (1 Wi‑Fi, 2 Ma table), jamais combinés ; Wi‑Fi = connexion native, hors captive portal ; exigences print : contraste, grands numéros, support durable.
- Pas de compte ni mot de passe client ; pas de **paiement digital** dans Ma table.
- Contact = opt-in **après** merci chef uniquement ; finalité soirées Moeris / relation Résidence ; minimisation (pas de tracking table/heure/compagnie V1) ; conservation **24 mois** après dernière interaction ; effacement sur demande sous **15 jours ouvrés** (process manuel) ; revue conseil loi 2008-12 **avant premier envoi massif**, pas blocker build.
- Écrans client = micro-missions à but unique (~10–30 s) ; pas de feed, pubs, hub dashboard à tuiles égales, ni chat Service.
- Un seul shell Back-office salle (pas de vue cuisine séparée V1) ; écriture Menu = BO only.
- Architecture et stack : monolithe modulaire Next.js Client+BO+domain — invariants AD-1…AD-20 et pins dans le companion Architecture Spine.
- Identité / ton : palette **Citrus** light-only V1, tutoiement doux, anti-jargon froid ; tokens et patterns dans companions UX (`DESIGN.md`, `EXPERIENCE.md`).
- Perf pragmatique : premier écran utile &lt; ~3 s en 4G moyenne ; a11y : gros touch targets, contraste, avis sans clavier.

## Non-goals

- Compte client obligatoire ; captive portal ; QR Wi‑Fi+URL combiné.
- Fidélité / avantages / gestes perso ; allergies comme priorité mémoire V1.
- Redirection Google agressive ; avatar chef 3D ; multi-établissements.
- Paiement digital (Mobile Money, pay-at-table, etc.).
- Maximiser le temps passé dans l’app ou le nombre d’écrans avant le menu.

## Success signal

Cibles V1 provisoirs (à recalibrer après ~2 semaines de mesure réelle) : **SM-1 ≥ 60 %** des sessions ayant atteint « commande reçue » laissent un **Avis** ; **SM-2 ≥ 25 %** des sessions avec avis laissent un **Contact opt-in** ; **SM-4** commandes fantômes ≈ 0. Contre-métriques : ne pas optimiser le temps dans l’app ni gonfler les écrans avant le menu.

## Assumptions

- Auth BO = Credentials Auth.js (JWT), comptes staff provisionnés, rôle plat « salle ».
- Propagation catalogue client &lt; 1 min après mutation BO ; file Service via temps réel BO (Pusher) + poll filet.
- Illustration chef / moments clés en 2D V1.
- Effacement contact = process manuel documenté (staff) sous 15 jours ouvrés ; pas de self-service client V1.
