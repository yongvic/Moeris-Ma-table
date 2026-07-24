---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
validationStatus: pass
validationNotes:
  - "FR1-FR21 couverts par au moins une story avec AC testables"
  - "Starter create-next-app = Story 1.1; entités DB créées à la story qui en a besoin"
  - "Dépendances épics 1→5 OK; pas de dépendance vers le futur dans un epic"
  - "Notes soft non bloquantes: NFR1 perf <3s et NFR6 process effacement 24mois/15j à rappeler en create-story; prefers-reduced-motion (UX-DR11) implicite DESIGN"
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md
  - _bmad-output/specs/spec-moeris/SPEC.md
  - _bmad-output/specs/spec-moeris/glossary.md
---

# Ma table (Résidence Moeris) - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Ma table (Résidence Moeris), decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: La Carte table expose clairement QR Wi‑Fi et QR Ma table côte à côte, avec libellés et numérotation (deux actions distinctes, pas de combo unique).
FR2: Le scan du QR Ma table ouvre/crée ou reprend une Session liée à la Table (tableId stable dans l’URL).
FR3: Le système persiste la Session (stockage local + identifiant serveur) avec TTL soirée (~6 h) ; refresh/crash reprend l’étape en cours ; après TTL, nouvelle session.
FR4: Rescanner le QR Ma table après fermeture d’onglet reprend la Session sans ré-onboarding complet pour la même soirée (bannière soft « Tu en étais à… »).
FR5: Chaque écran client est une micro-mission à but unique (~10–30 s) ; aucun feed / écran « pour toi » / hub dashboard à tuiles égales en V1.
FR6: Le client anonyme consulte le Menu (photos, infos utiles) aligné sur le catalogue publié en Back-office.
FR7: Le staff authentifié crée/modifie/désactive des éléments Menu (nom, prix, disponibilité, photo) ; désactivation visible côté client en &lt; 1 min.
FR8: Le client envoie une Commande associée à Session/Table avec feedback clair « commande partie » ; la commande apparaît en Back-office.
FR9: Lors de la commande, le client peut indiquer des Goûts cuisine optionnels (pas d’allergies obligatoires) ; goûts stockés pour mémoire V1.
FR10: Le staff voit les commandes par table/session, Goûts cuisine visibles inline, et applique les statuts reçue → en préparation → servie (transitions BO only).
FR11: Le client déclenche une micro-mission Service via catalogue fermé (serveur / eau / addition / autre) en un tap ; file visible en Back-office ; pas de chat ni champ libre.
FR12: Le CTA « Terminer mon expérience » n’est disponible qu’après qu’une commande de la session est au statut reçue ou au-delà ; pas chemin principal au scan.
FR13: Le client laisse un Avis court (étoiles 1–5 obligatoires ; emoji plat optionnel ; pas de texte libre requis) rattaché à la session.
FR14: Immédiatement après l’Avis, affichage Merci chef chaleureux avec ≥3 tons/scripts selon la note (super / correct / mitigé) ; pas de jargon UI froid ; illustration 2D V1.
FR15: Après le Merci chef, Contact opt-in téléphone XOR email (sélecteur puis un seul champ) pour soirées Moeris ; skip possible ; jamais requis pour noter ou voir le merci.
FR16: Reconnaissance soft automatique (appareil/cookie) propose la Mémoire sans login ; le client peut ignorer et rester anonyme.
FR17: Ressaisie volontaire tél/email débloque la Mémoire si contact connu ; contact inconnu → message clair + parcours anonyme.
FR18: Afficher Préférés courts top 3–5 ; pas de journal complet ni tracking table/heure/compagnie.
FR19: Réappliquer les Goûts cuisine mémorisés en 1 tap sur la commande/panier en cours.
FR20: Staff s’authentifie pour accéder au Back-office salle ; surfaces client ne permettent pas l’édition menu.
FR21: Une barre de progression discrète du séjour client affiche les étapes Accueil → Menu → Commande → Fin et se remplit selon l’étape de session ; Service est une voie latérale qui n’avance pas la barre ; ce n’est pas un hub cliquable multi-parcours.

### NonFunctional Requirements

NFR1: Performance — premier écran utile &lt; ~3 s en 4G moyenne ; pages légères adaptées Wi‑Fi resto / mobile.
NFR2: Fiabilité session — reprise après refresh/crash/fermeture d’onglet dans le TTL (~6 h).
NFR3: Accessibilité pragmatique — gros touch targets (≥44px), contraste fort, lisible pour persona peu à l’aise digital ; avis complétable sans clavier.
NFR4: Sécurité BO — auth staff obligatoire ; pas d’édition menu depuis le client ; contacts clair staff-only ; pas de PII contact en clair dans les logs.
NFR5: Disponibilité — objectif « tient un service soirée complet » ; pas de SLA 99.99 formalisé V1.
NFR6: Privacy — contact opt-in uniquement ; finalité soirées Moeris ; conservation 24 mois après dernière interaction ; effacement manuel ≤15 j ouvrés ; pas de revente ; revue conseil avant envoi massif.
NFR7: Plateforme — web multi-support (phone/tablette/desktop) via QR ; pas d’app store ; PWA non requise V1 ; light mode only.
NFR8: Print physique — contraste QR, grands numéros, matériau durable ; ordre 1 Wi‑Fi / 2 Ma table.
NFR9: Succès métier (cibles provisoirs) — SM-1 ≥60 % avis après commande reçue ; SM-2 ≥25 % opt-in parmi avis ; SM-4 ≈0 commandes fantômes ; ne pas maximiser temps in-app ni écrans avant menu.
NFR10: Conventions techniques — IDs UUID/cuid ; dates ISO-8601 UTC ; copy UI FR ; code EN ; erreurs Server Actions `{ ok:false, code, message }`.

### Additional Requirements

- **Starter greenfield :** `create-next-app` Next.js App Router **16.2.11** (React 19.x, TypeScript 5.x, Tailwind 4.x) — impact Epic 1 Story 1.
- Monolithe modulaire Vercel : route groups `app/(client)` · `app/(bo)` · `domain/` · `infra/` ; dépendances `app → domain → infra` (AD-1, AD-2).
- Mutations métier V1 = Server Actions dans `domain/` ; Route Handlers `/api` réservés Auth.js + webhooks (AD-4).
- Session séjour : cookie httpOnly id opaque ; vérité Neon ; panier sur Session uniquement jusqu’à `placeOrder` (AD-5, AD-18).
- Auth BO : Auth.js `next-auth@5.0.0-beta.32` Credentials + JWT ; comptes provisionnés ; rôle plat « salle » (AD-6).
- Realtime BO : Pusher canal `bo-floor` post-commit Order/ServiceRequest ; poll soft = filet (AD-7).
- Contacts : Neon vérité puis sync one-way async → Google Sheet ; reconnaissance/prefs Neon only (AD-8).
- QR Ma table encode `tableId` ; au plus une Session active par table dans le TTL ; QR Wi‑Fi hors produit logiciel (AD-9).
- Photos plats : Vercel Blob upload BO only ; `next/image` côté client (AD-10).
- Environnement data unique V1 : même Neon prod/preview ; Prisma 7.9 + adapter Neon ; runtime Node (AD-11).
- Order : INSERT client only `received` ; transitions `received→preparing→served` BO only ; gate Terminer = ≥ received (AD-12, AD-13).
- ServiceRequest.type ∈ `{waiter,water,bill,other}` ; statuts `open→done` BO only (AD-14).
- Contact téléphone XOR email ; Guest upsert unique domain (tél E.164 / email lower) (AD-15, AD-19).
- Menu client revalidate &lt;1 min après mutation BO ; goûts snapshotés immuables sur Order (AD-16).
- Préférés exposés top 3–5 Preference/Guest (AD-20).
- Stack pins : Neon, Prisma 7.9.0, Vercel Blob 2.6.1, Pusher 5.3.4 / pusher-js 8.6.0, Sheets API v4.
- Process manuel documenté V1 pour effacement contact (hors self-service).

### UX Design Requirements

UX-DR1: Implémenter la palette tokens **Citrus** light-only (`surface-base`, `surface-raised`, `ink-primary/secondary`, `accent`, `accent-soft`, `border`, `pattern-a/b`, `focus-ring`) — texte sur accent = ink-primary jamais blanc.
UX-DR2: Typographie Fredoka (display/title/subtitle) + Nunito Sans (body/meta/button) avec `font-display: swap` et échelle mobile définie dans DESIGN.md.
UX-DR3: Spacing/shapes/elevation — échelle spacing 4–48px, tap-target-min 44px, rounded sm/md/lg/full, `{elevation.soft}` uniquement sur `card-menu-item` et `button-secondary` (et feuilles qui en ont besoin).
UX-DR4: Composants client — `button-primary`, `button-secondary`, `card-accueil`, `card-menu-item`, `fiche-commande`, `chip-gout`, `catalogue-service`, `avis-stars`, `card-merci-chef`, `selecteur-contact`, `banniere-reprise`, `bloc-memoire`, `illustration-panel`, `pattern-background`.
UX-DR5: Composants BO — `status-pill-bo`, `ligne-menu-bo`, `carte-commande-bo`, `item-file-service-bo` (label texte + couleur, jamais couleur seule).
UX-DR6: Navigation client **fil léger** — Accueil CTA principal « Voir le menu » + Service secondaire ; barre Menu|Service ; Terminer après commande reçue ; anti-dashboard 4 tuiles égales.
UX-DR7: Responsive client — phone &lt;640 une colonne + barre bas ; tablette 640–1024 Menu 2 cols / Accueil split possible ; desktop &gt;1024 coque ~1100–1200px, Menu 3 cols ; mêmes destinations tous viewports.
UX-DR8: BO = un shell onglets Menu | Commandes | Service (desktop/tablette) ; pas de layout mobile dédié BO V1.
UX-DR9: Illustrations 2D décoratives (`alt=""`) aux 4 moments : Accueil, Commande envoyée, Merci chef, Bon retour mémoire ; photos réelles pour Menu.
UX-DR10: États UX à traiter — plat indisponible, échec réseau + retry commande/menu, contact ignoré, session expirée, contact inconnu 2ᵉ visite, BO vide, BO erreur sauvegarde.
UX-DR11: Accessibilité — focus-ring 2px+offset ; avis-stars nom accessible « Note : N sur 5 » ; catalogue-service icône+libellé ; respect prefers-reduced-motion ; pas d’info couleur seule.
UX-DR12: Voix — tutoiement doux, phrases courtes ; bannir Submit/Login/Dashboard client ; Contact copy anti-spam soirées Moeris ; ≥3 tons Merci chef.
UX-DR13: Posture visuelle anti-fade — photo-first, formes organiques, profondeur légère sur Accueil/Merci ; motifs pattern ≤10% opacité sur écrans sans illustration.
UX-DR14: Maquettes de référence composition (spines gagnent en conflit) — `mockups/accueil.html`, `menu.html`, `merci-chef.html`, `bo-commandes.html`.
UX-DR15: Composant `barre-progression-sejour` — 4 segments Accueil | Menu | Commande | Fin ; remplissage lié à l’étape session ; accent `{colors.accent}` pour le segment courant/complété ; non cliquable pour sauter les étapes ; absente ou figée à 100 % sur Contact après Merci chef ; nom accessible du type « Étape N sur 4 : … ».

### FR Coverage Map

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
FR21: Epic 1 — Barre de progression séjour (Accueil|Menu|Commande|Fin)

## Epic List

### Epic 1: Fondation & entrée à table
Le client ouvre **Ma table** depuis la Carte table, dispose d’une Session stable (TTL soirée) avec reprise, voit un Accueil fil léger « maison » (design Citrus) et une **barre de progression** discrète du séjour. Inclut le scaffold Next.js monolithe.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR21

### Epic 2: Menu vivant (salle + client)
Le staff s’authentifie, publie et tient le Menu ; le client anonyme consulte le catalogue photo-first aligné sur le BO.
**FRs covered:** FR6, FR7, FR20

### Epic 3: Commander & servir
Le client envoie une Commande avec Goûts cuisine optionnels et peut demander du Service ; la salle suit commandes et file Service en temps quasi réel.
**FRs covered:** FR8, FR9, FR10, FR11

### Epic 4: Clôturer le séjour
Après commande reçue, le client termine : Avis court → Merci chef (3 tons) → Contact opt-in (tél XOR email).
**FRs covered:** FR12, FR13, FR14, FR15

### Epic 5: Revenir comme un habitué
À la 2ᵉ visite, reconnaissance soft et/ou ressaisie contact débloque la Mémoire (Préférés 3–5 + goûts en 1 tap).
**FRs covered:** FR16, FR17, FR18, FR19

## Epic 1: Fondation & entrée à table

Le client ouvre **Ma table** depuis la Carte table, dispose d’une Session stable (TTL soirée) avec reprise, voit un Accueil fil léger « maison » (design Citrus) et une **barre de progression** discrète du séjour. Inclut le scaffold Next.js monolithe.

### Story 1.1: Scaffold Next.js monolithe + tokens Citrus

As a équipe Moeris,
I want une application web Ma table initialisée (Next.js App Router monolithe, shells Client/BO, design tokens Citrus),
So that on peut déployer et construire le fil séjour sur une base conforme à l’architecture et à l’identité visuelle.

**Acceptance Criteria:**

**Given** un repo greenfield
**When** on initialise via create-next-app (Next.js 16.2.x, React 19, TypeScript, Tailwind 4) selon la spine
**Then** la structure `app/(client)`, `app/(bo)`, `domain/`, `infra/` existe
**And** les tokens Citrus (couleurs, typo Fredoka/Nunito Sans, spacing, rounded, focus-ring) sont disponibles en CSS/Tailwind
**And** une route client minimale et une route BO minimale répondent sans erreur
**And** le texte sur accent utilise `ink-primary` (jamais blanc)

### Story 1.2: Table + Session au scan QR Ma table

As a client à table,
I want qu’un scan du QR Ma table ouvre ou reprenne une Session liée à ma Table,
So that je démarre le séjour digital sans compte ni choix de table in-app.

**Acceptance Criteria:**

**Given** une Table connue avec `tableId` stable et une URL QR portant ce `tableId`
**When** j’ouvre le QR Ma table sans session active
**Then** une Session anonyme est créée (vérité Neon), un cookie httpOnly opaque est posé, et j’arrive sur l’Accueil
**And** au plus une Session `active` existe pour cette table dans le TTL (~6 h)
**Given** une Session active non expirée pour cette table
**When** je rescane le même QR
**Then** la Session existante est reprise (pas de nouvelle session concurrente)
**And** le QR Wi‑Fi reste hors produit logiciel (pas de captive portal Ma table)

### Story 1.3: Accueil fil léger « maison »

As a cliente peu à l’aise avec le téléphone (Mame Fatou),
I want un Accueil simple avec un seul CTA principal et un accès Service discret,
So that je sais quoi faire en quelques secondes sans me perdre.

**Acceptance Criteria:**

**Given** une Session fraîche après scan
**When** j’arrive sur l’Accueil
**Then** je vois un tutoiement doux (ex. « Pose-toi »), un CTA principal « Voir le menu », et un accès secondaire Service
**And** il n’y a pas de hub à 4 tuiles égales, pas de demande d’identité, pas de jargon Login/Submit
**And** le slot illustration d’accueil est présent ; layouts phone / tablette / desktop selon EXPERIENCE
**And** la navigation fil léger (Menu | Service) est en place (destinations Menu/Service peuvent être stub jusqu’aux epics suivants)

### Story 1.4: Reprise de session + bannière soft

As a client,
I want reprendre mon séjour après refresh, crash ou fermeture d’onglet,
So that je ne recommence pas à zéro la même soirée.

**Acceptance Criteria:**

**Given** une Session active avec une étape en cours
**When** je refresh ou rouvre l’app dans le TTL (~6 h)
**Then** je suis remis à l’étape en cours
**And** une bannière soft « Tu en étais à… » avec CTA continuer s’affiche
**Given** le TTL session est expiré
**When** je rescane le QR Ma table
**Then** une nouvelle Session anonyme est créée (pas de reprise d’un séjour clos)

### Story 1.5: Barre de progression du séjour

As a client,
I want voir où j’en suis dans le séjour (Accueil → Menu → Commande → Fin),
So that je comprends l’avancement sans naviguer comme dans un dashboard.

**Acceptance Criteria:**

**Given** une Session client active
**When** je consulte une surface du fil séjour
**Then** la barre affiche 4 étapes Accueil | Menu | Commande | Fin et se remplit selon l’étape de session
**And** la barre n’est pas cliquable pour sauter des étapes
**And** une visite Service n’avance pas la barre principale
**And** le nom accessible indique « Étape N sur 4 : … »
**And** le segment actif/complété utilise l’accent Citrus

### Story 1.6: Carte table print — dualité Wi‑Fi / Ma table

As a équipe Moeris,
I want une spécification / assets de Carte table avec deux QR numérotés,
So that chaque table expose clairement 1. Wi‑Fi natif et 2. Ma table.

**Acceptance Criteria:**

**Given** le besoin d’imprimer des cartes table
**When** on produit le kit Carte table V1
**Then** deux QR côte à côte sont documentés/générables : 1 Wi‑Fi (connexion native) et 2 Ma table (URL `tableId`)
**And** libellés, grands numéros, contraste fort et note matériau durable sont spécifiés
**And** aucun QR combiné Wi‑Fi+URL n’est proposé

## Epic 2: Menu vivant (salle + client)

Le staff s’authentifie, publie et tient le Menu ; le client anonyme consulte le catalogue photo-first aligné sur le BO.

### Story 2.1: Authentification staff Back-office

As a membre de l’équipe salle,
I want m’authentifier pour accéder au Back-office,
So that seuls les comptes staff provisionnés peuvent gérer menu, commandes et service.

**Acceptance Criteria:**

**Given** un compte staff provisionné (Credentials Auth.js, session JWT)
**When** je me connecte avec email + mot de passe valides
**Then** j’accède au shell BO (onglets Menu | Commandes | Service — Commandes/Service peuvent être stubs)
**Given** des identifiants invalides ou un visiteur non authentifié
**When** j’essaie d’ouvrir une route BO protégée
**Then** je suis renvoyé vers BO Connexion et aucune mutation menu n’est possible
**And** les surfaces client ne permettent pas d’éditer le menu
**And** pas d’inscription publique staff (comptes provisionnés uniquement)

### Story 2.2: Gérer le Menu en Back-office

As a responsable / serveur authentifié,
I want créer, modifier et désactiver des plats (nom, prix, disponibilité, photo),
So that le catalogue servi aux clients reste juste pendant le service.

**Acceptance Criteria:**

**Given** je suis authentifié BO
**When** je crée ou modifie un plat (nom, prix, dispo, photo via Vercel Blob)
**Then** les métadonnées et l’URL image sont persistées en Neon
**And** l’upload photo n’est possible que depuis le BO authentifié
**Given** un plat actif
**When** je le désactive
**Then** il est marqué indisponible / retiré côté client en moins d’1 minute (revalidate/tag cache)
**And** les états vides BO Menu et erreurs de sauvegarde affichent un message clair

### Story 2.3: Consulter le Menu client photo-first

As a client anonyme,
I want parcourir le Menu avec de grandes photos, sans compte,
So that je choisis un plat facilement (persona Mame Fatou).

**Acceptance Criteria:**

**Given** une Session client active et un catalogue publié
**When** j’ouvre le Menu depuis l’Accueil ou la nav
**Then** je vois les plats disponibles (photo, nom, prix) via `card-menu-item` sans login
**And** le contenu correspond au catalogue BO publié
**And** la grille s’adapte (1 col phone / 2 tablette / 3 desktop)
**And** un plat indisponible est visible comme tel et non sélectionnable (pas d’erreur bloquante)
**And** la barre de progression indique l’étape Menu
**Given** un échec réseau au chargement
**When** le Menu ne charge pas
**Then** un message clair + retry s’affiche (distinct de « plat indisponible »)

## Epic 3: Commander & servir

Le client envoie une Commande avec Goûts cuisine optionnels et peut demander du Service ; la salle suit commandes et file Service en temps quasi réel.

### Story 3.1: Fiche plat — Goûts cuisine + envoi Commande

As a client,
I want choisir un plat, indiquer des goûts cuisine optionnels et envoyer ma commande,
So that la salle reçoit mon intention clairement sans me demander mes allergies.

**Acceptance Criteria:**

**Given** un plat disponible sur le Menu et une Session active
**When** j’ouvre la fiche plat / commande
**Then** je peux multi-sélectionner des chips Goûts cuisine (optionnel) et envoyer avec un seul CTA
**And** aucun flux n’oblige la saisie d’allergies
**Given** j’envoie la commande avec succès
**When** `placeOrder` réussit
**Then** une Order est créée en statut `received` avec tableId + sessionId et goûts snapshotés
**And** le client voit un feedback clair (« C’est parti ! » / illustration commande envoyée)
**And** la barre de progression passe à l’étape Commande
**Given** une coupure réseau à l’envoi
**When** l’envoi échoue
**Then** un message clair + retry s’affiche ; aucune commande silencieuse « fantôme » côté client

### Story 3.2: Suivi Commandes Back-office + statuts

As a serveur / responsable en salle,
I want voir les commandes entrantes par table avec les goûts inline et faire avancer les statuts,
So that aucune commande n’est oubliée et la salle n’a pas à redemander les goûts.

**Acceptance Criteria:**

**Given** une Order créée côté client
**When** le commit Neon réussit
**Then** un événement Pusher `bo-floor` (kind order) est publié et la commande apparaît en BO Commandes
**And** table/session et Goûts cuisine sont visibles sans quitter la fiche
**Given** une commande en `received`
**When** le staff passe `received` → `preparing` → `served`
**Then** seules ces transitions BO sont possibles ; le client ne change pas les statuts
**And** les `status-pill-bo` ont label texte + couleur (pas couleur seule)
**And** un poll soft peut servir de filet si Pusher rate un event

### Story 3.3: Micro-missions Service client + file BO

As a client,
I want demander serveur / eau / addition / autre en un tap,
So that j’obtiens de l’aide sans chat ni long formulaire.

**Acceptance Criteria:**

**Given** une Session active
**When** j’ouvre Service et je tape une des 4 tuiles (serveur / eau / addition / autre)
**Then** une ServiceRequest `open` est créée (type fermé, sans note libre) et confirmée côté client
**And** chaque tuile a icône + libellé texte
**And** la barre de progression principale n’avance pas
**Given** une demande créée
**When** le staff ouvre BO Service
**Then** la demande apparaît dans la file (Pusher + filet poll) et peut passer `open` → `done`
**And** l’état vide de la file est explicite

## Epic 4: Clôturer le séjour

Après commande reçue, le client termine : Avis court → Merci chef (3 tons) → Contact opt-in (tél XOR email).

### Story 4.1: Gate « Terminer mon expérience »

As a client,
I want pouvoir terminer mon expérience seulement après qu’une commande a été reçue,
So that je ne suis pas poussé à noter dès le scan.

**Acceptance Criteria:**

**Given** une Session sans Order en statut `received` ou au-delà
**When** je navigue le fil client
**Then** le CTA « Terminer mon expérience » est absent ou non mis en avant (pas le chemin principal)
**Given** au moins une Order de la session en `received` ou plus
**When** je consulte la nav / surfaces client
**Then** le CTA « Terminer mon expérience » est disponible
**And** le déclencher ouvre le flux Avis (pas le contact en premier)

### Story 4.2: Avis court (étoiles + emoji)

As a client,
I want laisser un avis rapide sans clavier,
So that je peux noter mon expérience en quelques taps.

**Acceptance Criteria:**

**Given** j’ai déclenché Terminer mon expérience
**When** je suis sur l’écran Avis
**Then** je dois choisir 1–5 étoiles ; un emoji plat est optionnel ; aucun texte libre n’est requis
**And** `avis-stars` expose le nom accessible « Note : N sur 5 » (forme + couleur, pas couleur seule)
**When** j’envoie l’avis
**Then** l’Avis est stocké et rattaché à la session (et commande le cas échéant)
**And** transition immédiate vers Merci chef (pas d’écran froid type Submit)
**And** la barre de progression est à l’étape Fin

### Story 4.3: Merci chef — 3 tons

As a client,
I want une clôture chaleureuse calée sur ma note,
So that je me sens accueilli avant qu’on me demande un contact.

**Acceptance Criteria:**

**Given** un Avis vient d’être envoyé
**When** l’écran Merci chef s’affiche
**Then** le message/ton correspond à l’une des ≥3 variantes (super / correct / mitigé) selon la note
**And** aucun des tons ne blâme le client ; pas de jargon Login/Submit
**And** l’illustration 2D Merci chef (slot dédié) est présente
**And** aucune demande de contact n’apparaît sur cet écran

### Story 4.4: Contact opt-in (tél XOR email)

As a client,
I want laisser volontairement mon téléphone ou mon email après le merci chef,
So that Moeris peut me prévenir des soirées — sans spam ni obligation.

**Acceptance Criteria:**

**Given** je viens de voir Merci chef
**When** l’écran Contact s’affiche
**Then** un sélecteur Téléphone/Email précède **un seul** champ actif (jamais les deux simultanés)
**And** je peux skip sans friction ; aucun contact n’est requis pour avoir vu le merci
**Given** je soumets un contact valide
**When** l’opt-in est enregistré
**Then** le Guest est upserté en Neon (tél E.164 ou email lower) avec finalité soirées Moeris
**And** une sync one-way best-effort vers Google Sheet est déclenchée sans bloquer l’UX
**And** WhatsApp n’est pas un champ de saisie V1
**And** le copy rappelle l’anti-spam / soirées Moeris (et peut mentionner garder les goûts)

## Epic 5: Revenir comme un habitué

À la 2ᵉ visite, reconnaissance soft et/ou ressaisie contact débloque la Mémoire (Préférés 3–5 + goûts en 1 tap).

### Story 5.1: Reconnaissance soft + bloc Mémoire

As a cliente de retour,
I want être reconnue sans mot de passe si mon appareil le permet,
So that je retrouve une accueil « Bon retour » avec mes préférés.

**Acceptance Criteria:**

**Given** un Guest déjà identifié lié à un cookie/appareil soft
**When** je scanne Ma table pour une nouvelle soirée (nouvelle Session)
**Then** l’Accueil propose la Mémoire sans login (bloc « Bon retour » + illustration dédiée)
**And** les Préférés courts top 3–5 s’affichent (pas de journal table/heure/compagnie)
**And** je peux ignorer et rester en parcours anonyme
**Given** un Guest avec avis/commandes passés
**When** les Préférés sont calculés/stockés
**Then** au plus 5 Preference sont exposées (plafond AD-20 ; règle de ranking simple acceptable V1)

### Story 5.2: Reconnaissance par ressaisie de contact

As a cliente de retour sans cookie,
I want ressaisir mon téléphone ou email pour retrouver ma Mémoire,
So that je ne dépende pas uniquement de l’appareil.

**Acceptance Criteria:**

**Given** j’ai déjà laissé un contact opt-in auparavant
**When** je ressaisis le même tél ou email (normalisé E.164 / lower)
**Then** la Mémoire du Guest est débloquée sur l’Accueil
**Given** un contact inconnu ou une faute de frappe
**When** je valide la ressaisie
**Then** un message clair non culpabilisant s’affiche et le parcours anonyme reste immédiatement disponible
**And** aucun mot de passe n’est demandé

### Story 5.3: Réappliquer les Goûts cuisine en 1 tap

As a cliente reconnue,
I want réappliquer mes goûts mémorisés en un geste,
So that je n’ai pas à les retaper à chaque visite.

**Acceptance Criteria:**

**Given** une Mémoire active avec goûts cuisine mémorisés
**When** je tape l’action « réappliquer mes goûts » (ou équivalent)
**Then** le panier / fiche commande en cours est prérempli avec ces goûts
**And** aucune Order passée n’est mutée
**And** le geste tient en un tap (micro-mission)
