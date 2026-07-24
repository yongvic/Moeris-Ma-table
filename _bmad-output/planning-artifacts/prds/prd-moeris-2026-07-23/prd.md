---
title: "PRD — Ma table (Résidence Moeris)"
status: final
created: 2026-07-23
updated: 2026-07-24
---

# PRD: Ma table (Résidence Moeris)

## 0. Document Purpose

Ce PRD définit le produit **Ma table** pour la **Résidence Moeris** au niveau **lancement** : capacités, parcours, exigences testables et hors-scope V1. Destiné au product owner, à l’équipe produit/tech, et aux workflows aval (UX, architecture, epics/stories). Il s’appuie sur le brainstorm figé du 2026-07-23 (`_bmad-output/brainstorming/brainstorm-residence-moeris-plateforme-avis-2026-07-23/`) sans le dupliquer. Le vocabulaire du **Glossaire** est normatif.

## 1. Vision

**Ma table** est le fil digital du séjour à table à la Résidence Moeris. Via une carte imprimée à deux QR, le client se connecte au Wi‑Fi puis ouvre une session légère : menu → commande → micro-besoins de service → fin d’expérience chaleureuse. Pas de compte obligatoire, pas de feed, pas de surcharge — chaque écran a un but précis (quelques dizaines de secondes).

Pour le client, le téléphone devient une nappe utile : découvrir, commander, terminer, et au retour être reconnu par la **mémoire** (préférés et goûts), pas par un login. Pour Moeris, le succès n’est pas « des scans », c’est des **avis + contacts opt-in** obtenus sans forcer, et une base clients respectueuse pour les soirées Moeris.

## 2. Target User

### 2.1 Jobs To Be Done

- **Fonctionnel** — Voir le menu (photos), commander, signaler un besoin simple, terminer le séjour digital.
- **Émotionnel** — Se sentir accueilli (« bienvenue à la maison »), pas jugé ni harcelé pour un numéro.
- **Social / contexte** — Partager facilement à table (un téléphone suffit) ; utile aussi pour quelqu’un peu à l’aise avec le digital (gros gestes, peu de texte).
- **Métier Moeris** — Collecter avis utiles + contacts consentis ; tenir menu et commandes côté équipe.

### 2.2 Non-Users (v1)

- Clients qui exigent une **app native** ou un compte/mot de passe.
- Programmes de **fidélité / avantages** (apéritif offert, etc.) — hors V1.
- Collecte **allergies** comme priorité mémoire — hors V1.
- Gestion multi-établissements / franchise — un seul lieu : Résidence Moeris.

### 2.3 Key User Journeys

- **UJ-1. Première visite — Mame Fatou découvre et termine sans se perdre.**
  - **Persona + context :** Mame Fatou, peu à l’aise téléphone ; veut surtout les photos des plats, gros boutons, zéro jargon.
  - **Entry state :** Assise à table ; carte imprimée visible ; session absente.
  - **Path :** (1) Scan QR **Wi‑Fi** → connexion native. (2) Scan QR **Ma table** → session anonyme. (3) Consulte le **Menu**. (4) Passe une **Commande** (goûts éventuels). (5) Micro-mission **Service** si besoin. (6) Après réception de la commande, tape **Terminer mon expérience**. (7) Avis court → **merci chef** chaleureux (ton selon l’avis) → opt-in **téléphone ou email**.
  - **Climax :** Elle a donné un avis + un contact, après l’émotion du merci, sans mur de saisie ni compte.
  - **Resolution :** Session soirée ; client identifié si opt-in ; prêt pour UJ-2.
  - **Edge case :** Onglet fermé → rescanner **Ma table** reprend le fil (pas tout recommencer).

- **UJ-2. Deuxième visite — Mame Fatou retrouve ses préférences.**
  - **Persona + context :** Même cliente ; a déjà laissé tél ou email (ou soft cookie appareil).
  - **Entry state :** Nouvelle soirée ; scan **Ma table**.
  - **Path :** (1) Reconnaissance **soft auto** si possible **ou** ressaisie volontaire du même tél/email. (2) Accueil mémoire : préférés courts (top 3–5) + goûts cuisine en 1 tap. (3) Suite séjour comme UJ-1 (menu → commande → Terminer…).
  - **Climax :** Elle se sent reconnue sans login.
  - **Resolution :** Mémoire utilisée ; pas de tracking table/heure/compagnie.
  - **Edge case :** Contact inconnu / faute de frappe → message clair, parcours anonyme possible.

- **UJ-3. Équipe Moeris — tenir le menu et suivre les commandes.**
  - **Persona + context :** Responsable / serveur avec accès **Back-office**.
  - **Entry state :** Authentifié back-office `[ASSUMPTION: accès par compte staff simple, pas SSO]`.
  - **Path :** Met à jour plats/prix/dispo du **Menu** ; voit les **Commandes** entrantes liées à une **Table** / session **avec les Goûts cuisine** ; marque le traitement opérationnel utile au service `[ASSUMPTION: statuts minimaux reçue / en prep / servie]`.
  - **Climax :** Le menu affiché au client est juste ; la commande n’est pas « fantôme » ; la salle voit les goûts sans les redemander.
  - **Resolution :** Client et salle restent synchronisés sur l’essentiel.

## 3. Glossary

- **Ma table** — Expérience digitale client ouverte par le QR dédié ; fil du séjour à table.
- **Carte table** — Support imprimé à table portant deux QR côte à côte : **Wi‑Fi** et **Ma table**.
- **QR Wi‑Fi** — QR qui déclenche la connexion Wi‑Fi **native** du téléphone (pas de captive portal).
- **QR Ma table** — QR qui ouvre l’URL / l’expérience **Ma table**.
- **Session** — Fil numérique d’un séjour, ouvert au scan **Ma table**, persisté (local + serveur), TTL soirée (~6 h), repris après refresh/crash ou rescannage.
- **Client anonyme** — Enregistrement créé au scan, sans contact.
- **Client identifié** — Client ayant fourni **téléphone ou email** en opt-in.
- **Menu** — Catalogue consultable (plats, photos, infos utiles au choix).
- **Commande** — Intention de commande passée via **Ma table**, visible en **Back-office**.
- **Goût cuisine** — Préférence de préparation liée à une commande (ex. sans piment, bien cuit) — distinct des allergies.
- **Service (micro-mission)** — Action courte pour un besoin pendant le séjour (ex. appeler le serveur).
- **Terminer mon expérience** — Action explicite, disponible **après réception de la commande**, ouvrant la fin : **Avis** → merci chef → **Contact opt-in**.
- **Avis** — Feedback court de fin (note / emoji ; pas un mur de texte).
- **Contact opt-in** — Téléphone **ou** email fourni volontairement **après** le merci chef, pour les soirées Moeris (jamais de spam promis en intention produit).
- **Mémoire** — Préférés courts + goûts cuisine réutilisables à la 2e visite.
- **Préférés** — Top 3–5 plats (notes hautes + tags soft issus des avis).
- **Reconnaissance** — Soft auto (appareil/cookie) **et/ou** ressaisie du contact pour débloquer la **Mémoire**.
- **Back-office** — Interface équipe pour gérer le **Menu** et les **Commandes**.
- **Table** — Emplacement physique auquel la **Carte table** / session est associée.

## 4. Features

### 4.1 Entrée table (Carte & QR)

**Description:** La **Carte table** présente deux QR numérotés (1. Wi‑Fi, 2. Ma table), un seul objet mental, lisible et durable. Réalise UJ-1.

**Functional Requirements:**

#### FR-1: Afficher la dualité Wi‑Fi / Ma table

Le support **Carte table** expose clairement **QR Wi‑Fi** et **QR Ma table** côte à côte, avec libellés et numérotation. Réalise UJ-1.

**Consequences (testable):**
- Un utilisateur lit deux actions distinctes sans ambiguïté ; pas une combo unique.
- Le **QR Wi‑Fi** ne dépend pas d’une page captive / login Wi‑Fi.

#### FR-2: Ouvrir Ma table depuis le QR dédié

Le client ouvre **Ma table** en scannant uniquement le **QR Ma table**. Réalise UJ-1, UJ-2.

**Consequences (testable):**
- Le scan crée ou reprend une **Session** liée à la **Table** / appareil selon les règles de reprise.

### 4.2 Session séjour

**Description:** Un seul scan ouvre le fil ; pas de rescans pendant le séjour sauf reprise après fermeture. Réalise UJ-1, UJ-2.

**Functional Requirements:**

#### FR-3: Persister la Session

Le système persiste la **Session** (stockage local + identifiant serveur) avec TTL soirée (~6 h). Réalise UJ-1.

**Consequences (testable):**
- Refresh / crash → reprise à l’étape en cours.
- Après TTL, la session n’est plus reprise comme séjour actif.

#### FR-4: Reprendre après fermeture d’onglet

Si l’onglet est fermé, rescanner le **QR Ma table** reprend la **Session** (lien table/appareil). Réalise UJ-1.

**Consequences (testable):**
- Le client ne repasse pas par un onboarding complet inutile pour la même soirée.

#### FR-5: Micro-missions à but unique

Chaque écran client poursuit un but précis (ordre de grandeur 10–30 s) ; pas de feed multi-parcours. Réalise UJ-1.

**Consequences (testable):**
- Aucun écran « pour toi » / engagement scrollable n’est présenté en V1.

### 4.3 Menu

**Description:** Consultation légère du **Menu** (photos, infos utiles). Réalise UJ-1, UJ-2, UJ-3.

**Functional Requirements:**

#### FR-6: Consulter le Menu

Le client consulte le **Menu** sans compte. Réalise UJ-1.

**Consequences (testable):**
- Accès menu possible en **Client anonyme**.
- Les contenus affichés correspondent à ce qui est publié en **Back-office**.

#### FR-7: Gérer le Menu en Back-office

L’équipe crée/modifie/désactive des éléments du **Menu** (au minimum nom, prix, disponibilité, photo si fournie). Réalise UJ-3.

**Consequences (testable):**
- Une désactivation retire ou marque indisponible l’élément côté client dans un délai opérationnel acceptable `[ASSUMPTION: propagation quasi temps réel ou < 1 min]`.

### 4.4 Commande

**Description:** Passer une **Commande** et capturer des **Goûts cuisine** utiles. Réalise UJ-1, UJ-2, UJ-3.

**Functional Requirements:**

#### FR-8: Passer une Commande

Le client envoie une **Commande** depuis **Ma table**, associée à sa **Session** / **Table**. Réalise UJ-1.

**Consequences (testable):**
- La commande apparaît en **Back-office**.
- Le client reçoit un feedback clair que la commande est bien partie.

#### FR-9: Capturer des Goûts cuisine

Lors de la commande, le client peut indiquer des **Goûts cuisine** (pas allergies prioritaires). Réalise UJ-1, UJ-2.

**Consequences (testable):**
- Les goûts sont stockés pour réutilisation mémoire V1.
- Aucun flux V1 n’oblige la saisie d’allergies.

#### FR-10: Suivre les Commandes en Back-office

L’équipe voit les commandes entrantes (y compris les **Goûts cuisine** associés) et met à jour un statut minimal utile au service. Réalise UJ-3.

**Consequences (testable):**
- Une commande est identifiable par table/session.
- Les **Goûts cuisine** de la commande sont visibles sans quitter la fiche commande.
- Les statuts minimaux sont applicables sans ambiguïté `[ASSUMPTION: reçue / en préparation / servie]`.

### 4.5 Service (micro-missions)

**Description:** Besoins courts pendant le séjour, sans transformer **Ma table** en chat. Réalise UJ-1.

**Functional Requirements:**

#### FR-11: Demander de l’aide service

Le client déclenche au moins une micro-mission **Service** (ex. appeler le serveur / besoin simple). Réalise UJ-1.

**Consequences (testable):**
- La demande est signalée à l’équipe `[ASSUMPTION: notification back-office ou file visible]`.
- Le geste tient en un écran.

### 4.6 Fin d’expérience (Avis + Chef + Contact)

**Description:** Après réception de la commande, **Terminer mon expérience** mène à un **Avis** court, puis un **merci chef** chaleureux (ton selon l’avis), puis un **Contact opt-in**. Succès idéal = avis + contact ; l’émotion du merci précède la demande de contact. Réalise UJ-1.

**Functional Requirements:**

#### FR-12: Déclencher Terminer mon expérience

Le bouton **Terminer mon expérience** est proposé **après** que la commande a été reçue (côté client). Réalise UJ-1.

**Consequences (testable):**
- Le déclencheur n’est pas imposé au scan initial.
- Avant « commande reçue », le CTA de fin n’est pas le chemin principal.

#### FR-13: Collecter un Avis court

Le client laisse un **Avis** principalement par note/emoji (texte libre non obligatoire). Réalise UJ-1.

**Consequences (testable):**
- Un avis complet V1 est possible sans clavier long.
- L’avis est stocké et rattaché à la session/commande le cas échéant.

#### FR-14: Merci chef chaleureux (ton selon l’avis)

Immédiatement après l’**Avis**, le client voit une clôture chaleureuse (ambiance visuelle + ton chef) avant toute demande de contact. Réalise UJ-1.

**Consequences (testable):**
- Au moins **3 tons / scripts** de message chef selon l’avis (ex. super / ok / mitigé).
- La fin n’utilise pas de jargon UI froid type « Submit / Login ».
- `[ASSUMPTION: animation chef 2D légère acceptable V1 ; 3D reporté]`

#### FR-15: Collecter Contact opt-in

**Après** le merci chef, le client peut laisser **téléphone ou email** pour les soirées Moeris, explicitement opt-in. Réalise UJ-1.

**Consequences (testable):**
- Aucun contact n’est requis pour noter ni pour voir le merci chef.
- WhatsApp n’est pas un champ de saisie V1 (tél ou email seulement).
- Le copy exprime l’intention anti-spam (soirées Moeris) et peut rappeler la mémoire des goûts (« garde mon goût pour la prochaine fois »).

### 4.7 Mémoire & Reconnaissance (2e visite)

**Description:** Priorité **Mémoire** uniquement (pas avantages). Soft auto + ressaisie contact. Réalise UJ-2.

**Functional Requirements:**

#### FR-16: Reconnaissance soft automatique

Si l’appareil/cookie permet, le système propose la **Mémoire** sans login. Réalise UJ-2.

**Consequences (testable):**
- Pas de mot de passe.
- Le client peut ignorer / rester anonyme.

#### FR-17: Reconnaissance par ressaisie de contact

Le client qui a déjà laissé un contact peut le **ressaisir** (tél ou email) pour accéder à ses préférences. Réalise UJ-2.

**Consequences (testable):**
- Un contact connu débloque la **Mémoire**.
- Un contact inconnu laisse un message clair et le parcours anonyme.

#### FR-18: Afficher Préférés courts

Afficher un historique court de **Préférés** (top 3–5). Réalise UJ-2.

**Consequences (testable):**
- Pas de journal complet ni tracking table/heure/compagnie.

#### FR-19: Réappliquer Goûts cuisine en 1 tap

Proposer les **Goûts cuisine** mémorisés en un geste. Réalise UJ-2.

**Consequences (testable):**
- Un tap (ou équivalent) réapplique les goûts à la commande en cours.

### 4.8 Accès Back-office

**Description:** Accès équipe pour menu + commandes (+ file service si FR-11). Réalise UJ-3.

**Functional Requirements:**

#### FR-20: Authentifier le staff Back-office

Un membre autorisé s’authentifie pour accéder au **Back-office**. Réalise UJ-3.

**Consequences (testable):**
- Les écrans client ne permettent pas d’éditer le menu.
- `[ASSUMPTION: rôles minimaux admin/serveur suffisent en V1]`

## 5. Non-Goals (Explicit)

- Compte client obligatoire / mot de passe.
- Captive portal Wi‑Fi ; combo 1 QR Wi‑Fi+URL.
- Feed, pubs, pop-ups, engagement « Pour toi » multi-parcours.
- Dashboard client lourd ; avantages / gestes perso en V1.
- Allergies comme priorité mémoire V1.
- Redirection Google agressive (option soft post-merci = aspiration, pas cœur V1).
- **Paiement digital** (in-app, Mobile Money, pay-at-table, etc.) — **non prévu** ; le règlement reste hors **Ma table**.
- App native stores.

## 6. MVP Scope

### 6.1 In Scope

- Carte 2 QR + expérience mobile web **Ma table**
- Session persistée + reprise
- Menu client + gestion Back-office
- Commande + goûts cuisine + suivi Back-office
- Micro-mission Service
- Terminer → avis → merci chef (3 tons) → contact tél/email
- Mémoire 2e visite (soft + ressaisie)
- Ton / chaleur (ambiance + chef)

### 6.2 Out of Scope for MVP

- Fidélité / avantages / anniversaire — différé V2+
- Allergies structurées — différé (santé / responsabilité)
- **Paiement digital** — non prévu (règlement hors Ma table)
- Partage Google soft — aspiration ; `[NOTE FOR PM]` si métrique réputation critique
- Avatar chef 3D — différé
- Multi-sites — hors scope

## 7. Success Metrics

**Primary**

- **SM-1** : Taux de **fin d’expérience** (sessions avec **Avis** / sessions ayant atteint « commande reçue »). Valide FR-12, FR-13. Cible V1 provisoire : **≥ 60 %** (recalibrer après ~2 semaines de mesure).
- **SM-2** : Taux de **Contact opt-in** parmi les sessions avec avis. Valide FR-15. Cible V1 provisoire : **≥ 25 %** (recalibrer après ~2 semaines de mesure).

**Secondary**

- **SM-3** : Taux de **Reconnaissance** réussie (soft ou ressaisie) parmi les retours identifiés. Valide FR-16–FR-19.
- **SM-4** : Commandes « fantômes » / non vues en Back-office ≈ 0 sur période pilote. Valide FR-8, FR-10.

**Counter-metrics (do not optimize)**

- **SM-C1** : Temps moyen passé dans l’app — **ne pas maximiser** (anti-surcharge). Contrebalance SM-1.
- **SM-C2** : Nombre d’écrans avant le menu — **minimiser**, jamais gonfler pour « engagement ». Contrebalance SM-1.

## 8. Aesthetic and Tone

- **Chaque écran = « bienvenue à la maison »** — pas seulement la fin : ambiance visuelle Résidence + ton chaleureux tout au long du fil.
- **Chaleur** surtout via images/ambiance + ton du chef en fin (plus que par du jargon marketing).
- Tutoiement doux ; phrases courtes. Exemples de voix (indicatif, pas copy finale) : « Pose-toi », « On s’occupe de toi », « Bon retour », « On te prévient des soirées Moeris ? ».
- Bannir jargon froid (Submit, Login, Dashboard client).
- UX anti-patterns bannis : trop d’étapes, murs de texte, pop-ups, pubs, mot de passe client.

## 9. Platform

- V1 : **mobile web** via QR (pas d’app store).
- `[ASSUMPTION: PWA installable non requise V1 ; lien magique 2e visite non requis si ressaisie + soft cookie couvrent le besoin]`.

## 10. Cross-Cutting NFRs

- **Performance / data** : pages légères ; usage acceptable sur réseau mobile/Wi‑Fi resto `[ASSUMPTION: premier écran utile < 3 s sur 4G moyenne]`.
- **Fiabilité session** : reprise après refresh/crash (FR-3, FR-4).
- **Accessibilité pragmatique** : gros boutons, contraste, lisible pour persona peu à l’aise digital.
- **Sécurité back-office** : accès staff authentifié ; pas d’édition menu depuis le client.
- **Disponibilité** : adaptée service resto soirée `[ASSUMPTION: pas de SLA 99.99 formalisé en V1 ; objectif « tient le coup un service complet »]`.

## 11. Constraints — Privacy & Data

- Contact = **opt-in** en fin ; menu consultable sans identité.
- Finalité annoncée : soirées Moeris / relation Résidence — pas de revente.
- Minimisation : pas de tracking intrusif table/heure/compagnie en V1.
- Conservation contacts : **24 mois** après dernière interaction (opt-in ou reconnaissance) ; pas de revente.
- Effacement : sur demande, process **manuel documenté**, délai **15 jours ouvrés** (Neon + miroir Sheet).
- Conformité loi Sénégal 2008-12 : pratiques V1 (opt-in, finalité, minimisation, staff-only) figées pour le build ; **revue conseil obligatoire avant premier envoi massif** soirées Moeris.

## 12. Constraints — Physical print

- QR imprimés : contraste, numéros grands, design durable (usure table).
- Un seul objet mental carte ; ordre 1 Wi‑Fi / 2 Ma table.

## 13. Open Questions

Aucune question bloquante restante pour le lancement V1. Tranché hors PRD (UX/Arch/SPEC) : statuts commande reçue / en préparation / servie ; Service = catalogue 4 gestes ; un seul Back-office salle.

## 14. Assumptions Index

- Accès Back-office par compte staff simple (pas SSO).
- Statuts commande minimaux : reçue / en préparation / servie.
- Propagation menu désactivé quasi temps réel ou < 1 min.
- File / notif pour demandes Service.
- Animation chef 2D V1 ; 3D plus tard.
- PWA / lien magique non requis V1.
- Premier écran utile < 3 s (cible perf).
- Pas de SLA 99.99 formalisé V1.
- SM-1 ≥ 60 % / SM-2 ≥ 25 % provisoirs ; recalibrer après ~2 semaines.
- Conservation contacts 24 mois ; effacement manuel ≤ 15 j ouvrés ; revue conseil avant envoi massif.
