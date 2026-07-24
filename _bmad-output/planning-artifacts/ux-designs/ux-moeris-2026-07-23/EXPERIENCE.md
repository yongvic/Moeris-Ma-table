---
name: Ma table (Résidence Moeris)
status: final
sources:
  - {planning_artifacts}/prds/prd-moeris-2026-07-23/prd.md
  - {planning_artifacts}/prds/prd-moeris-2026-07-23/.memlog.md
  - {planning_artifacts}/prds/prd-moeris-2026-07-23/reconcile-brainstorm-intent.md
updated: 2026-07-24
---

# Ma table (Résidence Moeris) — Colonne vertébrale de l'expérience

> Expérience client **web responsive** (entrée typique via QR téléphone, mais **adaptable phone / tablette / desktop**) + **Back-office salle** desktop/tablette. Pas de compte client, pas d'app store. Document en français, vocabulaire Glossaire PRD (§3). Couplé à `DESIGN.md`. **Les spines gagnent en cas de conflit** avec maquettes ou imports.

## Foundation

- **Client** — web **multi-support** (phone, tablette, desktop) : le scan QR reste le cas d’entrée principal, mais l’UI n’est **pas** figée « mobile only ». Session anonyme au scan, aucun compte ni mot de passe (PRD Non-Goals §5). Une session par soirée (~6 h TTL), reprise possible (FR-3/FR-4). Posture visuelle : **photo-first, formes organiques, profondeur** — pas une UI plate / fade (override memlog 2026-07-24 ; refs Obaa / food-order / booking).
- **Équipe** — **Back-office salle** desktop/tablette, authentifié `[ASSUMPTION PRD FR-20 : compte staff simple, pas SSO]`. V1 = **un seul** Back-office salle (pas de vue cuisine séparée) `[ASSUMPTION memlog : B1]`.
- **Posture** — chaque écran est une micro-mission à but unique (10–30 s), jamais un feed ou un dashboard à parcourir (PRD FR-5, SM-C1/SM-C2). Le ton est celui d'une maison qui accueille, pas d'une appli qui retient.
- **Navigation client** — **fil léger** `[ASSUMPTION memlog : proche N2]` : après scan, un accueil court avec un CTA principal (**Voir le menu**) et un accès secondaire discret (**Service**) ; le Menu est la « maison » du séjour d'où part la Commande ; une barre discrète Menu | Service reste visible ; **Terminer mon expérience** n'apparaît qu'après réception de la commande. Explicitement anti-dashboard : pas de hub à 4 tuiles égales.
- **Barre de progression séjour** — indicateur discret à 4 étapes **Accueil → Menu → Commande → Fin** qui se remplit selon l’étape de session (decision Banen 2026-07-24). **Service** = voie latérale : n’avance pas la barre. La barre **n’est pas un stepper cliquable** pour sauter des étapes. Pendant Avis / Merci chef / Contact, l’étape **Fin** est active (Contact peut rester à 100 %). Nom accessible « Étape N sur 4 ».
- **Identité visuelle** — se référer à `DESIGN.md` pour les tokens (couleurs Citrus, typographies Fredoka/Nunito Sans). Cette colonne cite les tokens par nom (ex. `{colors.accent}`) sans les redéfinir.
- **Artefact physique** — la **Carte table** (deux QR) est le point d'entrée hors-écran ; voir section dédiée ci-dessous.

## Information Architecture

| Surface | Atteinte depuis | But |
|---|---|---|
| **Accueil** | Scan QR Ma table (1ʳᵉ visite ou session anonyme) | Accueillir, orienter vers le Menu ; CTA principal unique |
| **Menu** | Accueil · barre Menu\|Service | Consulter les plats (photos) ; point de départ de la Commande |
| **Fiche plat / Commande** | Tap sur un plat du Menu | Choisir un plat, ajouter des Goûts cuisine, envoyer la Commande |
| **Service** | Barre Menu\|Service (accès secondaire, tout le séjour) | Déclencher une micro-mission (serveur / eau / addition / autre) |
| **Terminer / Avis** | CTA **Terminer mon expérience** (visible après commande reçue) | Clore le séjour ; recueillir un Avis court (étoiles + emoji plat optionnel) |
| **Merci chef** | Automatique après envoi de l'Avis | Clôture chaleureuse, ton calé sur la note laissée |
| **Contact** | Automatique après Merci chef | Opt-in téléphone **ou** email (sélecteur C1) pour les soirées Moeris |
| **Reprise** | Rescan Ma table / retour onglet après fermeture, en cours de séjour | Bannière soft « Tu en étais à… » + reprise de l'étape en cours |
| **Mémoire (2ᵉ visite)** | Accueil, si reconnaissance (soft ou ressaisie) | Afficher Préférés courts + proposer les Goûts cuisine en 1 tap |
| **BO Connexion** | URL Back-office | Authentifier le staff (menu non éditable côté client) |
| **BO Menu** | BO Connexion → onglet Menu | Créer / modifier / désactiver plats, prix, dispo, photo |
| **BO Commandes** | BO Connexion → onglet Commandes | Voir les commandes entrantes par table/session, Goûts cuisine inline, statut (reçue / en préparation / servie) |
| **BO Service** | BO Connexion → onglet Service | Voir la file des micro-missions Service en attente |

Les quatre surfaces BO composent un **seul shell Back-office salle** (onglets d'une même appli, pas des applis séparées) `[ASSUMPTION memlog B1]`. Pas de hiérarchie plus profonde côté client : navigation à plat, un niveau de profondeur (Accueil/Menu → Fiche plat, jamais deux modales empilées).

→ Composition : `mockups/accueil.html` · `mockups/menu.html` · `mockups/merci-chef.html` · `mockups/bo-commandes.html`. Surfaces non mockées (Fiche commande, Service, Avis, Contact, Reprise, Mémoire, BO Menu/Service/Connexion, Carte print) = **spine-only**. Cette colonne prime en cas de conflit.

## Carte table (Print)

- Un seul objet mental : la **Carte table** porte deux QR numérotés côte à côte — **1. Wi‑Fi**, **2. Ma table** — jamais combinés en un seul QR (PRD FR-1, Non-Goals §5).
- Le QR Wi‑Fi déclenche la connexion **native** du téléphone (pas de portail captif). Le QR Ma table ouvre l'expérience (FR-2).
- Exigences physiques (PRD §12) : contraste fort, numéros grands et lisibles, matériau durable à l'usure de table.
- Le libellé « Ma table » utilise `{colors.accent}` (accent citron/zeste) pour rester reconnaissable et faire le pont visuel avec l'écran Accueil qui suit immédiatement le scan — même famille de couleur, pas la même surface.
- Pas de troisième QR, pas de texte long : la carte est un déclencheur, pas un support d'explication.

## Voice and Tone

Microcopy comportementale. Ton et identité de marque détaillés dans `DESIGN.md`.

| Do | Don't |
|---|---|
| « Pose-toi. » | « Bienvenue sur notre plateforme ! » |
| « On s'occupe de toi. » | « Soumettre une requête » |
| « Bon retour. » | « Se connecter » / « Login » |
| « On te prévient des soirées Moeris ? » | « Inscrivez-vous à notre newsletter » |
| Tutoiement doux, phrases courtes, une idée par écran. | Jargon d'appli froid (Submit, Login, Dashboard client), murs de texte, pop-ups. |

- La chaleur « maison » passe d'abord par l'ambiance visuelle et les illustrations (voir Component Patterns), le ton n'est qu'un renfort — jamais l'inverse.
- Le Merci chef porte au moins **3 tons** distincts selon la note laissée (super / correct / mitigé) ; aucun des trois ne blâme le client (PRD FR-14).
- Le Contact ne se demande jamais avant l'émotion du Merci chef ; son copy peut rappeler la mémoire des goûts (« garde mon goût pour la prochaine fois »).

## Component Patterns

Comportemental. Specs visuelles dans `DESIGN.md.Components` — noms de composants identiques entre les deux fichiers.

| Component | Usage | Règles comportementales |
|---|---|---|
| `card-accueil` | **Carte Accueil** — Accueil | Un CTA principal (Voir le menu), un accès secondaire (Service). Illustration dédiée au premier chargement `[ASSUMPTION memlog : moment illustration 1]`. |
| `card-menu-item` | **Carte plat** — Menu | Photo + nom + prix ; tap ouvre la Fiche plat. Pas de swipe-carousel obligatoire pour naviguer le menu principal. |
| `fiche-commande` | **Fiche plat / Commande** — Fiche plat | Chips Goûts cuisine (multi-sélection légère) ; bouton unique d'envoi. Après envoi, confirmation visuelle claire (« commande partie ») — illustration dédiée à cet instant `[ASSUMPTION memlog : moment illustration « commande envoyée »]`. |
| `catalogue-service` | **Catalogue Service** — Service | 4 tuiles fixes : serveur / eau / addition / autre. Un tap = une mission envoyée, pas de champ libre, pas de chat (PRD §4.5, decision memlog). Pas d'illustration dédiée — geste volontairement sec. |
| `avis-stars` | **Étoiles + emoji plat** — Terminer / Avis | 1–5 étoiles obligatoires ; emoji plat **optionnel** ; aucun champ texte requis (PRD FR-13). Complétable sans clavier. Nom accessible « Note : N sur 5 » (voir Accessibility Floor). |
| `card-merci-chef` | **Carte Merci chef** — Merci chef | Illustration + message parmi 3 tons selon la note. `{colors.accent}` porte l'accent visuel de clôture. `[ASSUMPTION memlog : moment illustration « merci chef »]` |
| `selecteur-contact` | **Sélecteur Contact (C1)** — Contact | Sélecteur Téléphone/Email d'abord, **un seul champ** ensuite ; jamais les deux champs affichés en même temps ; étape entièrement optionnelle (decision memlog C1). |
| `banniere-reprise` | **Bannière Reprise** — Toute surface, en cours de séjour | « Tu en étais à… » + CTA continuer ; jamais silencieuse pure, jamais un formulaire de relance (decision memlog R2). |
| `barre-progression-sejour` | **Barre progression** — Shell client (hors BO) | 4 segments Accueil\|Menu\|Commande\|Fin ; remplie selon étape session ; non cliquable pour skip ; Service n’avance pas la barre ; `aria` « Étape N sur 4 ». |
| `bloc-memoire` | **Bloc Mémoire** — Accueil (2ᵉ visite) | Préférés courts (top 3–5) en chips + Goûts cuisine réappliqués en 1 tap. Ton « Bon retour ». Illustration dédiée `[ASSUMPTION memlog : moment illustration « bon retour mémoire »]`. Pas de journal complet, pas de tracking table/heure/compagnie (PRD FR-18). |
| `pattern-background` | **Fond motif** — Menu, Service, Contact (écrans sans illustration dédiée) | Statique, non-interactif, jamais devant le contenu ; purement décoratif (voir `DESIGN.md` pour l'opacité). |
| `button-secondary` | **Bouton secondaire** — Accueil (accès Service), annulations | Action secondaire discrète, jamais un second CTA de même poids que le bouton principal de l'écran. |
| `ligne-menu-bo` | **Ligne Menu (BO)** — BO Menu | Édition inline nom/prix/dispo/photo ; désactivation immédiate visible côté client `[ASSUMPTION PRD FR-7 : propagation quasi temps réel ou < 1 min]`. |
| `carte-commande-bo` | **Carte Commande (BO)** — BO Commandes | Table/session identifiable, Goûts cuisine visibles **sans quitter la fiche** (PRD FR-10) ; statut en 3 crans : reçue / en préparation / servie `[ASSUMPTION PRD FR-10]`. |
| `item-file-service-bo` | **Item file Service (BO)** — BO Service | Liste/notification des micro-missions en attente `[ASSUMPTION PRD FR-11 : file visible ou notification]` ; marquable comme traité. |

## State Patterns

| État | Surface | Traitement |
|---|---|---|
| Session anonyme fraîche | Accueil | Illustration + CTA Voir le menu ; pas de demande d'identité. |
| Plat indisponible | Menu / Fiche plat | Marqué indisponible, non sélectionnable ; pas d'erreur bloquante. |
| Commande envoyée | Fiche plat → confirmation | Feedback clair et immédiat (« C'est parti ! ») ; pas de doute possible côté client (PRD FR-8). |
| Échec envoi commande (coupure réseau) | Fiche plat → envoi | Message clair + retry ; jamais une commande silencieusement perdue (PRD FR-8, §10 NFR réseau resto). |
| Chargement à froid / échec réseau | Menu | Chargement bref puis, en cas d'échec, message clair + retry — distinct de « Plat indisponible » qui est un état métier, pas réseau (PRD §10 NFR). |
| Avant commande reçue | Barre Menu\|Service | **Terminer mon expérience** absent ou non mis en avant — ce n'est pas le chemin principal (PRD FR-12). |
| Après commande reçue | Barre Menu\|Service | **Terminer mon expérience** devient le CTA disponible. |
| Avis donné | Terminer / Avis → Merci chef | Transition immédiate vers le ton chef correspondant (super / correct / mitigé) ; jamais d'écran de chargement froid entre les deux. |
| Contact ignoré | Contact | Skip explicite sans friction ; aucune donnée requise pour avoir vu le Merci chef (PRD FR-15). |
| Session interrompue (refresh/crash/fermeture) | N'importe quelle surface en cours | Bannière Reprise « Tu en étais à… » à la réouverture, reprise à l'étape exacte, pas de ré-onboarding (PRD FR-3/FR-4 ; decision memlog R2). |
| Session expirée (TTL ~6 h) | Rescan Ma table | Nouvelle session anonyme ; pas de reprise d'un séjour clos. |
| Reconnaissance réussie (2ᵉ visite) | Accueil | Bloc Mémoire affiché (soft auto ou ressaisie) ; ton « Bon retour ». |
| Contact inconnu / faute de frappe (2ᵉ visite) | Accueil → ressaisie | Message clair, non culpabilisant ; parcours anonyme reste disponible immédiatement (PRD UJ-2 edge case). |
| Commande « fantôme » (BO) | BO Commandes | À éviter par design : chaque commande envoyée doit apparaître ≈ immédiatement (SM-4, cible ≈ 0). |
| Staff non authentifié | BO (toutes surfaces) | Redirection BO Connexion ; aucune surface client ne permet l'édition menu (PRD FR-20). |
| BO vide (aucun plat / aucune mission en file) | BO Menu / BO Service | État vide explicite et nommé, jamais un écran blanc silencieux. |
| BO erreur de sauvegarde | BO Menu / BO Commandes | Message clair sur l'échec ; rien n'est présumé enregistré côté client tant que non confirmé. |

## Interaction Primitives

- Tap comme geste principal ; larges cibles tactiles pour une persona peu à l'aise avec le digital (Mame Fatou, PRD §2.1).
- Progression en fil unique côté client : pas de retour arrière complexe, pas de modales empilées à deux niveaux.
- Gestes en un tap : réappliquer les Goûts cuisine mémorisés, envoyer une micro-mission Service, continuer depuis la bannière Reprise.
- Avis complétable sans clavier (étoiles + emoji tap-only) ; emoji plat jamais requis.
- Contact : un champ actif à la fois, jamais deux champs de saisie simultanés (sélecteur C1 d'abord).
- **Bannis** : chat/texte libre pour Service, carousels obligatoires pour naviguer le menu principal, pop-ups, publicités, mot de passe client, hub à tuiles égales (anti-dashboard), scroll infini « pour toi ».

## Responsive & Platform

- **Client — multi-support (obligatoire).** Même fil (Accueil → Menu → …), layouts qui **s’adaptent** :
  - **Phone (<640px)** : une colonne ; barre bas Menu|Service|Terminer(si dispo) ; marges `{spacing.margin-mobile}`.
  - **Tablette (640–1024px)** : Menu en grille 2 colonnes ; Accueil / Merci chef peuvent passer en composition split (visuel | texte+CTA).
  - **Desktop (>1024px)** : coque max-width ~1100–1200px centrée ; Menu grille 3 colonnes ; Accueil type « landing table » (bloc couleur organique + photo plat héroïque + CTA) inspiré Obaa/Medivise (air + pièce maîtresse), **sans** nav marketing SaaS.
- Navigation : bas mobile ↔ en-tête ou rail discret desktop — **mêmes destinations**, pas de features desktop-only.
- Entrée QR = chemin nominal ; ouverture directe URL sur grand écran = même session / mêmes surfaces.
- **Back-office salle** — desktop/tablette, usage explicite clavier + souris (staff authentifié). Un seul shell à onglets (Menu / Commandes / Service), pas de layout mobile dédié en V1.

## Accessibility Floor

Comportemental. Contrastes précis dans `DESIGN.md`.

- Cibles tactiles larges partout côté client, calibrées pour une persona à l'aise limitée avec le digital (peu de texte, beaucoup de photos).
- Chaque écran client tient en une action lisible sans faire défiler pour comprendre le but (micro-mission ≤ 10–30 s).
- L'Avis est entièrement complétable sans clavier (étoiles + emoji) ; jamais de mur de texte requis.
- Le Contact demande un seul champ à la fois avec label explicite (« Ton numéro » / « Ton email »), jamais un formulaire double.
- La bannière Reprise et les messages Merci chef restent lisibles en contraste fort, cohérents avec les tokens `{colors.ink-primary}` sur `{colors.surface-base}`.
- BO : cibles adaptées à un usage tablette/desktop avec clavier et souris ; statuts de commande distinguables sans dépendre uniquement de la couleur (label texte + couleur) ; chaque élément interactif a un indicateur de focus visible au clavier (`{colors.focus-ring}`, voir `DESIGN.md`).
- Aucun contenu clignotant, aucune animation d'illustration non désactivable qui bloquerait la lecture (respect d'un mode mouvement réduit implicite).
- `avis-stars` porte un nom accessible explicite (« Note : N sur 5 ») ; actif/inactif ne reposent jamais sur la couleur seule (forme + couleur, voir `DESIGN.md`).
- Les tuiles du Catalogue Service (`catalogue-service` : serveur/eau/addition/autre) portent toujours icône **et** libellé texte visible, jamais une icône seule.
- Les illustrations des 4 moments dédiés (`illustration-panel`) sont décoratives (`alt=""`) — le sens est déjà porté par le texte/ton qui les accompagne.

## Inspiration & Anti-patterns

- **Repris de la référence Niva (Hernández Family)** : structure aérée, carte héro généreuse, rubans/motifs abstraits en fond — pas une copie 1:1, mais l'espace et le dynamisme du layout (decision memlog).
- **Repris** : chaleur portée par illustrations à moments clés + ton chef, plutôt que par une palette « terre »/marketing — la fraîcheur (`{colors.accent}` citron/zeste sur `{colors.surface-base}` très clair) reste le fond, la chaleur est ajoutée par le contenu, pas la couleur (decision memlog).
- **Rejeté — Dashboard à tuiles égales** : un hub à 4 tuiles de même poids donne l'impression d'une appli utilitaire à explorer ; Ma table impose un chemin (fil léger) avec un seul CTA principal par écran.
- **Rejeté — Chat pour le Service** : un champ de texte libre ou un fil de discussion transformerait une micro-mission de 10 s en tâche de rédaction ; le catalogue à 4 gestes reste fermé et immédiat.
- **Rejeté — Mur de texte / avis façon formulaire produit** : pas de champ commentaire obligatoire, pas de notation multi-critères ; l'Avis reste étoiles + emoji.
- **Rejeté — Portail captif Wi‑Fi et QR combiné** : chaque QR a un seul rôle ; mélanger Wi‑Fi et Ma table dans un seul geste casserait la lisibilité de la Carte table (PRD Non-Goals).

## Key Flows

### Flow 1 (UJ-1) — Première visite : Mame Fatou découvre et termine sans se perdre

Persona : Mame Fatou, peu à l'aise avec le téléphone ; veut des photos, de gros boutons, zéro jargon. Entrée : assise à table, carte imprimée visible, aucune session active.

1. Elle scanne le **QR Wi‑Fi** de la Carte table → connexion native, sans portail captif.
2. Elle scanne le **QR Ma table** → une session anonyme s'ouvre sur l'**Accueil**, illustration d'accueil, un seul CTA « Voir le menu ».
3. Elle consulte le **Menu** — grandes photos, pas de jargon, pas de compte demandé.
4. Elle ouvre une **Fiche plat**, ajoute un Goût cuisine si besoin, envoie la **Commande** — confirmation visuelle immédiate (« C'est parti ! »), illustration de l'instant.
5. Si besoin, elle déclenche une micro-mission **Service** (ex. eau) depuis la barre discrète Menu|Service — un tap, un écran, pas de chat.
6. Une fois la commande reçue, le CTA **Terminer mon expérience** devient disponible ; elle le déclenche.
7. Elle laisse un **Avis** (étoiles + emoji plat en option, sans clavier) → **Climax :** la carte **Merci chef** s'affiche aussitôt, ton chaleureux calé sur sa note, avant toute autre demande — puis, seulement après cette émotion, l'écran **Contact** propose (sélecteur C1) de laisser téléphone ou email pour les soirées Moeris, sans obligation.

**Résolution :** avis + contact obtenus après l'émotion du chef, sans mur de saisie ni compte — session soirée terminée, prête pour une éventuelle 2ᵉ visite (Flow 2).

**Cas limite :** si elle ferme l'onglet en cours de route, rescanner le **QR Ma table** déclenche la bannière **Reprise** (« Tu en étais à… ») et la remet exactement à l'étape en cours, jamais à zéro.

### Flow 2 (UJ-2) — Deuxième visite : Mame Fatou retrouve ses préférences

Persona : la même cliente, a déjà laissé un téléphone ou un email (ou possède un cookie appareil doux). Entrée : nouvelle soirée, nouveau scan **Ma table**.

1. Le système tente une **reconnaissance soft automatique** (appareil/cookie) ; à défaut, elle peut ressaisir volontairement le même téléphone/email.
2. L'**Accueil** affiche le bloc **Mémoire** : ton « Bon retour », Préférés courts (top 3–5), Goûts cuisine réutilisables en un tap.
3. **Climax :** elle se sent reconnue sans jamais avoir eu à se connecter — un tap réapplique ses goûts habituels à la commande en cours.
4. Elle poursuit le séjour comme au Flow 1 (Menu → Commande → Service si besoin → Terminer mon expérience → Avis → Merci chef → Contact).

**Résolution :** la mémoire est utilisée sans créer de tracking table/heure/compagnie ; aucune donnée au-delà des Préférés et des Goûts cuisine n'est réexposée.

**Cas limite :** contact ressaisi inconnu ou faute de frappe → message clair et non culpabilisant, parcours anonyme immédiatement disponible en repli (pas de blocage).

### Flow 3 (UJ-3) — Équipe Moeris : tenir le menu et suivre les commandes

Persona : responsable ou serveur, accès **Back-office salle**. Entrée : authentifié `[ASSUMPTION PRD FR-20 : compte staff simple, pas SSO]`.

1. Il/elle se connecte sur **BO Connexion**.
2. Dans **BO Menu**, il met à jour un plat (prix, disponibilité, photo) — la désactivation se propage côté client quasi en temps réel `[ASSUMPTION PRD FR-7]`.
3. Dans **BO Commandes**, il voit les commandes entrantes classées par table/session, chaque fiche affichant les **Goûts cuisine** associés sans clic supplémentaire.
4. Il fait progresser le statut d'une commande (reçue → en préparation → servie) `[ASSUMPTION PRD FR-10]`.
5. Dans **BO Service**, il traite une micro-mission signalée (ex. demande de serveur) dès qu'elle apparaît dans la file `[ASSUMPTION PRD FR-11]`.
6. **Climax :** le menu affiché au client est toujours juste, aucune commande n'est « fantôme », et la salle voit les goûts sans avoir à les redemander à table.

**Résolution :** client et salle restent synchronisés sur l'essentiel, sans vue cuisine séparée ni outil supplémentaire en V1.

**Cas limite :** une commande « fantôme » (envoyée côté client mais absente du BO) doit être repérable plutôt que silencieuse (voir État « Commande fantôme », cible ≈ 0, SM-4) ; si un membre du staff se déconnecte en cours de service, le reste de l'équipe reprend la file BO Commandes/Service sans qu'aucune commande ou micro-mission en attente ne soit perdue.

## Gaps hérités (non résolus par cette colonne)

- `DESIGN.md` porte désormais les tokens complets — les tokens cités ici (`{colors.accent}`, `{colors.surface-base}`, `{colors.ink-primary}`, `{typography.title}`/`{typography.body}`, `{colors.focus-ring}`, etc.) sont alignés sur les noms actés dans `DESIGN.md`.
- Le principe PRD « chaque écran = bienvenue à la maison » (§8) n'a pas d'exigence testable (FR) dédiée au-delà de la clôture chef — cette colonne l'encode comme principe de Voice/Foundation, pas comme FR ; à surveiller si un FR transverse est ajouté plus tard.
- Micro-copy définitive (3 tons Merci chef, texte exact de la bannière Reprise, libellés du sélecteur Contact) reste à rédiger — cette colonne fixe la structure et les règles, pas le copy final.
- Aucune maquette n'est encore liée ; les références de composition seront ajoutées par le parent.
