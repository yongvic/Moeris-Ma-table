---
name: Ma table
description: Fil digital de la table à la Résidence Moeris — menu, commande, service et mémoire client, sans compte ni surcharge.
status: final
updated: 2026-07-24
colors:
  surface-base: '#FFFEF8'
  surface-raised: '#F5E9B8'
  ink-primary: '#1A1A00'
  ink-secondary: '#6B6B3A'
  accent: '#E8C200'
  accent-soft: '#FFF3A8'
  border: '#E8E0B8'
  pattern-a: '#FFE500'
  pattern-b: '#FF8A00'
  focus-ring: '#1A1A00'
typography:
  display:
    fontFamily: 'Fredoka'
    fontSize: '28px'
    fontWeight: 600
    lineHeight: '34px'
  title:
    fontFamily: 'Fredoka'
    fontSize: '22px'
    fontWeight: 600
    lineHeight: '28px'
  subtitle:
    fontFamily: 'Fredoka'
    fontSize: '17px'
    fontWeight: 500
    lineHeight: '24px'
  body:
    fontFamily: 'Nunito Sans'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: '24px'
  body-sm:
    fontFamily: 'Nunito Sans'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: '20px'
  meta:
    fontFamily: 'Nunito Sans'
    fontSize: '12px'
    fontWeight: 600
    lineHeight: '16px'
    letterSpacing: '0.02em'
  button-label:
    fontFamily: 'Nunito Sans'
    fontSize: '16px'
    fontWeight: 700
    lineHeight: '20px'
rounded:
  sm: 8px
  md: 16px
  lg: 24px
  full: 9999px
  DEFAULT: 16px
elevation:
  soft:
    color: 'rgba(26, 26, 0, 0.10)'
    blur: '12px'
    y: '2px'
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  gutter: 16px
  margin-mobile: 20px
  section-gap: 32px
  tap-target-min: 44px
components:
  button-primary:
    background: '{colors.accent}'
    text: '{colors.ink-primary}'
    radius: '{rounded.full}'
    fontFamily: '{typography.button-label.fontFamily}'
    minHeight: '{spacing.tap-target-min}'
  button-secondary:
    background: '{colors.surface-raised}'
    text: '{colors.ink-primary}'
    border: '{colors.border}'
    radius: '{rounded.full}'
    minHeight: '{spacing.tap-target-min}'
    shadow: '{elevation.soft}'
  card-accueil:
    background: '{colors.surface-base}'
    illustrationSlot: 'illustration-panel'
    primaryAction: 'button-primary'
    secondaryAction: 'button-secondary'
    titleTypography: '{typography.display}'
  card-menu-item:
    background: '{colors.surface-raised}'
    radius: '{rounded.md}'
    imageRadius: '{rounded.md}'
    titleTypography: '{typography.subtitle}'
    priceTypography: '{typography.body}'
    shadow: '{elevation.soft}'
  fiche-commande:
    background: '{colors.surface-base}'
    titleTypography: '{typography.title}'
    bodyTypography: '{typography.body}'
    chips: 'chip-gout'
    submitAction: 'button-primary'
  chip-gout:
    background: '{colors.accent-soft}'
    text: '{colors.ink-primary}'
    radius: '{rounded.full}'
    typography: '{typography.body-sm}'
    minHeight: '{spacing.tap-target-min}'
  catalogue-service:
    background: '{colors.surface-raised}'
    tileRadius: '{rounded.md}'
    tileMinHeight: '{spacing.tap-target-min}'
    tileTypography: '{typography.body-sm}'
    iconAndLabel: true
  avis-stars:
    active:
      color: '{colors.accent}'
      shape: 'filled'
    inactive:
      color: '{colors.ink-secondary}'
      shape: 'outline'
    minHeight: '{spacing.tap-target-min}'
    accessibleName: 'Note : {n} sur 5'
  card-merci-chef:
    background: '{colors.surface-base}'
    accent: '{colors.accent}'
    messageTypography: '{typography.display}'
  selecteur-contact:
    background: '{colors.surface-raised}'
    radius: '{rounded.md}'
    fieldBorder: '{colors.border}'
    labelTypography: '{typography.body}'
  banniere-reprise:
    background: '{colors.accent-soft}'
    text: '{colors.ink-primary}'
    radius: '{rounded.md}'
    typography: '{typography.body-sm}'
  bloc-memoire:
    background: '{colors.surface-raised}'
    radius: '{rounded.md}'
    titleTypography: '{typography.subtitle}'
    chips: 'chip-gout'
  illustration-panel:
    background: '{colors.surface-base}'
    accentPattern:
      - '{colors.pattern-a}'
      - '{colors.pattern-b}'
  pattern-background:
    base: '{colors.surface-base}'
    strokes:
      - '{colors.pattern-a}'
      - '{colors.pattern-b}'
    opacity: '≤10%, décoratif uniquement'
  status-pill-bo:
    recue:
      background: '{colors.accent-soft}'
      text: '{colors.ink-secondary}'
    en-prep:
      background: '{colors.accent}'
      text: '{colors.ink-primary}'
    servie:
      background: '{colors.surface-raised}'
      text: '{colors.ink-secondary}'
  ligne-menu-bo:
    background: '{colors.surface-base}'
    border: '{colors.border}'
    typography: '{typography.body}'
    statusIndicator: 'status-pill-bo'
  carte-commande-bo:
    background: '{colors.surface-raised}'
    radius: '{rounded.md}'
    typography: '{typography.body}'
    statusIndicator: 'status-pill-bo'
  item-file-service-bo:
    background: '{colors.surface-base}'
    border: '{colors.border}'
    typography: '{typography.body-sm}'
    actionLabelTypography: '{typography.button-label}'
---

## Brand & Style

**Ma table** est le fil digital du séjour à la Résidence Moeris : pas d'app, pas de compte, un scan et une nappe utile — sur **tout viewport** (phone → desktop), pas seulement le téléphone.

Posture : **Citrus** (frais, accent citron) + **anti-fade**. L’épuré ne veut pas dire plat. On vise le niveau d’ambition des refs food/premium (`imports/ref-obaa-delivery.png`, `ref-food-order-cards.png`, `ref-booking-resto.png`) : **photos de plats héroïques**, formes organiques / cercles qui débordent, blocs couleur affirmés, superposition, profondeur légère. Medivise (`ref-medivise-hero.png`) inspire l’air + une pièce maîtresse centrale ; Quizland (`ref-quizland-glass.png`) inspire une profondeur soft **ponctuelle** (accueil / merci chef), pas un skin violet global.

La chaleur « maison » vient des **illustrations 2D aux moments clés**, du **ton chef**, et surtout des **vraies photos de cuisine** — pas d’une UI grise minimaliste.

Réf. structurelle antérieure Niva (`imports/ref-niva-family-hero.png`) : espace + dynamisme. Lot 2026-07-24 : voir `reconcile-refs-ambition-2026-07-24.md` (spines win on conflict).

La typographie porte une part de cette personnalité de marque : arrondie et amicale, mais délibérément **distinctive**, pas une police système par défaut — le produit doit se reconnaître même sans logo.

Voix : tutoiement doux, phrases courtes (« Pose-toi », « On s'occupe de toi », « Bon retour »). Aucun jargon UI froid (Submit, Login, Dashboard).

→ Références : `imports/ref-niva-family-hero.png` · lot ambition `reconcile-refs-ambition-2026-07-24.md` (+ Obaa, food-order, booking, Medivise, Quizland).  
→ Maquettes clés : `mockups/accueil.html` · `mockups/menu.html` · `mockups/merci-chef.html` · `mockups/bo-commandes.html`. **Les spines gagnent en cas de conflit.**

## Colors

Palette **Citrus** — thème retenu parmi 6 options générées, choisi pour son registre « zeste électrique, énergie solaire ». **Light mode uniquement en V1** ; aucun token dark n'est défini à ce stade.

- **`{colors.surface-base}`** (`#FFFEF8`) — canevas principal de tous les écrans client. Blanc chaud, jamais clinique ni froid.
- **`{colors.surface-raised}`** (`#F5E9B8`) — surfaces posées sur le canevas : cartes menu, panneaux, bulles de message chef. Teinte assombrie pour garder une frontière lisible avec `{colors.surface-base}` (≥3:1), complétée par une ombre douce sur `card-menu-item` et `button-secondary` (voir Elevation & Depth) — la distinction ne repose plus sur la seule teinte.
- **`{colors.ink-primary}`** (`#1A1A00`) — texte principal et icônes de premier plan. Sert aussi de **texte sur accent** (voir a11y ci-dessous).
- **`{colors.ink-secondary}`** (`#6B6B3A`) — texte secondaire, légendes, métadonnées (statuts, labels de goûts cuisine).
- **`{colors.accent}`** (`#E8C200`) — unique couleur chromatique forte. Réservée au CTA principal de chaque écran (bouton primaire, étoiles actives, mise en avant d'un statut « en préparation »). Ne jamais l'utiliser pour de la simple décoration.
- **`{colors.accent-soft}`** (`#FFF3A8`) — variante douce de l'accent : fond de chip (goût cuisine), fond de statut « reçue », halos discrets derrière les illustrations.
- **`{colors.border}`** (`#E8E0B8`) — séparateurs et contours au plus bas contraste lisible ; jamais un contour épais ou noir. Réservé aux simples séparateurs visuels — pas la couleur de contour d'un élément que l'utilisateur doit *localiser* (ex. champ de saisie).
- **`{colors.pattern-a}`** (`#FFE500`) et **`{colors.pattern-b}`** (`#FF8A00`) — duo réservé exclusivement aux motifs abstraits de fond et aux formes des illustrations 2D. Jamais utilisés comme couleur de texte ou de fond de carte plein.
- **`{colors.focus-ring}`** (`#1A1A00`) — indicateur de focus clavier, contour `2px` avec `2px` d'offset, appliqué à tout élément interactif (client et Back-office). Voir Accessibilité ci-dessous.

**Accessibilité — règle dure sur l'accent :** `{colors.accent}` (#E8C200) est un jaune clair à luminosité élevée. Le texte du bouton primaire doit toujours être **`{colors.ink-primary}`**, jamais blanc — un texte blanc sur cet accent ne passe pas le contraste minimal. `{colors.ink-primary}` sur `{colors.accent}` mesure ~10:1, largement au-dessus du seuil WCAG AAA (7:1 texte normal).

À éviter : dégradés, teintes terre/bois (anti-référence Niva explicite), tout second accent chromatique qui concurrencerait le citron.

## Typography

Direction typographique validée après itération : une police système classique (Inter/Roboto/Arial) a été explicitement écartée — le produit doit se différencier tout en gardant un esprit rond et amical.

- **Titres — Fredoka.** Utilisée pour `{typography.display}`, `{typography.title}` et `{typography.subtitle}`. Formes rondes et amicales avec un vrai caractère de marque ; portée par les moments d'accueil, les titres d'écran et les titres de section menu.
- **Corps — Nunito Sans.** Utilisée pour `{typography.body}`, `{typography.body-sm}`, `{typography.meta}` et `{typography.button-label}`. Très lisible, garde une parenté arrondie avec Fredoka sans jamais rivaliser avec les titres.

Échelle concrète (mobile web) :

| Rôle | Token | Taille / interligne | Poids | Usage |
|---|---|---|---|---|
| Display | `{typography.display}` | 28px / 34px | 600 | Accroche d'accueil (« Pose-toi »), titre merci chef |
| Title | `{typography.title}` | 22px / 28px | 600 | Titres d'écran (Menu, Service, Terminer) |
| Subtitle | `{typography.subtitle}` | 17px / 24px | 500 | Titres de plat, titres de section |
| Body | `{typography.body}` | 16px / 24px | 400 | Texte courant, descriptions de plat |
| Body-sm | `{typography.body-sm}` | 14px / 20px | 400 | Texte secondaire, aide contextuelle |
| Meta | `{typography.meta}` | 12px / 16px | 600 | Labels, statuts, horodatage — `letterSpacing` 0.02em |
| Button label | `{typography.button-label}` | 16px / 20px | 700 | Libellés de CTA |

Aucune taille display géante ni tout-capitales agressif : l'énergie vient de la forme des lettres (Fredoka), pas de l'échelle.

**Chargement des polices :** `font-display: swap` sur Fredoka et Nunito Sans, avec une pile de repli de métrique proche (police système) — l'écran d'accueil (« Pose-toi ») est le premier paint après le scan QR, souvent sur un wifi de qualité incertaine ; on évite un flash de texte invisible à ce moment précis.

## Layout & Spacing

Échelle : `{spacing.1}` 4px → `{spacing.7}` 48px, doublement progressif. Les plus grands écarts (`{spacing.6}`, `{spacing.7}`) séparent les blocs majeurs d'un écran (ex. bloc accroche vs. bloc CTA) ; les plus petits (`{spacing.1}`, `{spacing.2}`) tiennent des éléments étroitement liés (icône + label, étoile + étoile). `{spacing.section-gap}` (32px) est réservé à la séparation entre deux sections sémantiques distinctes **au sein d'un même écran** (ex. bloc Mémoire vs. liste Menu sur l'Accueil 2ᵉ visite) — usage plus étroit que `{spacing.6}` (même valeur, mais réservé aux blocs majeurs inter-écrans).

Le client est **web multi-support** (override 2026-07-24) : entrée QR typique, layouts responsive. Phone = une colonne + `{spacing.margin-mobile}` (20px). Tablette/desktop = grilles Menu (2 puis 3 cols), Accueil/Merci en split possible, coque centrée desktop. `{spacing.gutter}` (16px) entre cartes. Détail breakpoints : `EXPERIENCE.md` §Responsive & Platform.

Chaque écran garde un **but unique** (micro-mission 10–30s, PRD §4.2) : un seul CTA principal visible sans scroll sur un écran mobile standard, jamais un hub à tuiles égales.

Zone tactile minimale `{spacing.tap-target-min}` (44px) sur tout élément interactif — cohérent avec l'exigence PRD « gros boutons, contraste » pour une persona peu à l'aise avec le digital.

## Elevation & Depth

Le registre reste **globalement plat et épuré**, cohérent avec l'ambiance « beaucoup de blanc » retenue. La hiérarchie entre `{colors.surface-base}` et `{colors.surface-raised}` se fait d'abord par teinte — mais la teinte seule ne suffit pas à garantir une frontière lisible en extérieur/plein soleil (contexte terrasse). `{elevation.soft}` (ombre douce, faible opacité, faible étalement) est donc explicitement autorisée sur exactement deux composants qui ont le plus besoin d'un repère non-couleur : **`card-menu-item`** et **`button-secondary`**. Elle reste interdite ailleurs (pas sur `button-primary`, l'illustration, les chips) pour ne pas alourdir le registre visuel.

[ASSUMPTION] La valeur exacte d'`{elevation.soft}` n'a pas été validée dans le memlog ; elle prolonge la posture « épurée » tout en corrigeant le déficit de contraste de bordure identifié en revue accessibilité (C2). Les autres surfaces qui se détachent physiquement du fil (panneau Service en feuille remontante, formulaire Contact opt-in) peuvent réutiliser le même token `{elevation.soft}` le cas échéant.

## Shapes

Coins arrondis sur toute la surface interactive, en écho direct au choix typographique (Fredoka, rond et amical) : `{rounded.sm}` (8px) pour les petits éléments (chips, champs), `{rounded.md}` (16px, `DEFAULT`) pour les cartes menu et panneaux — y compris `card-menu-item`, qui utilise `{rounded.md}` pour cohérence stricte avec cette règle —, `{rounded.lg}` (24px) pour les grandes feuilles/modales, `{rounded.full}` pour tous les boutons (forme pilule) et les badges.

[ASSUMPTION] L'échelle précise de rayon n'était pas chiffrée dans le memlog ; elle prolonge la décision déjà actée « typo amicale/arrondie » vers le reste du langage de formes, en cohérence avec la posture épurée.

Les images (photos plats) suivent toujours le rayon de leur conteneur — jamais un carré vif à l'intérieur d'une carte arrondie.

## Components

- **`button-primary`** — Fond `{colors.accent}`, texte `{colors.ink-primary}` (jamais blanc, voir a11y), forme pilule `{rounded.full}`, hauteur mini `{spacing.tap-target-min}`. Un seul par écran (« Voir le menu », « Envoyer ma commande », « Terminer mon expérience »).
- **`button-secondary`** — Fond `{colors.surface-raised}`, contour `{colors.border}`, texte `{colors.ink-primary}`, même forme pilule, ombre `{elevation.soft}` (frontière non-couleur, voir a11y C2). Utilisé pour l'action secondaire d'accueil (« J'ai besoin de quelque chose ») ou une annulation.
- **`card-accueil`** — Composition de l'écran Accueil : `illustration-panel` en tête, titre `{typography.display}`, `button-primary` (Voir le menu) et `button-secondary` (Service) en dessous. Visuel minimal — la structure comportementale est détaillée dans `EXPERIENCE.md`.
- **`card-menu-item`** — Carte `{colors.surface-raised}`, rayon `{rounded.md}` (aligné avec Shapes), photo du plat en pleine largeur avec rayon `{rounded.md}`, titre en `{typography.subtitle}`, prix en `{typography.body}`, ombre `{elevation.soft}`. Le **Menu s'appuie sur la photo du plat**, pas sur une illustration dédiée.
- **`fiche-commande`** — Fond `{colors.surface-base}`, titre plat `{typography.title}`, description `{typography.body}`, chips `chip-gout` en multi-sélection, un seul `button-primary` d'envoi. Visuel minimal.
- **`chip-gout`** — Fond `{colors.accent-soft}`, texte `{colors.ink-primary}`, forme pilule, `{typography.body-sm}`, hauteur/zone tactile mini `{spacing.tap-target-min}` (padding autour du glyphe visuel, pas nécessairement la hauteur visible). Porte un goût cuisine (ex. « sans piment ») ; réutilisable en un tap depuis la mémoire 2e visite.
- **`catalogue-service`** — 4 tuiles fixes (serveur / eau / addition / autre), fond `{colors.surface-raised}`, rayon `{rounded.md}`, hauteur mini `{spacing.tap-target-min}`, `{typography.body-sm}`. Chaque tuile porte **icône et libellé texte visible**, jamais une icône seule (voir Accessibilité). Visuel minimal.
- **`avis-stars`** — 1 à 5 étoiles ; actives **pleines** en `{colors.accent}`, inactives en **contour** (`{colors.ink-secondary}`) — distinction par forme *et* couleur, pas la couleur seule. Zone tactile mini `{spacing.tap-target-min}` par étoile. Nom accessible obligatoire : « Note : {n} sur 5 » (voir Accessibilité). Plus un emoji plat optionnel. Pas de champ texte libre obligatoire.
- **`card-merci-chef`** — Fond `{colors.surface-base}`, `illustration-panel` + message en `{typography.display}`, accent de clôture `{colors.accent}`. Ton parmi 3 variantes selon la note laissée. Visuel minimal.
- **`selecteur-contact`** — Fond `{colors.surface-raised}`, rayon `{rounded.md}`, contour de champ `{colors.border}` (à renforcer si le champ doit être localisé, voir a11y L1), label `{typography.body}`. Un seul champ actif à la fois (sélecteur Téléphone/Email d'abord). Visuel minimal.
- **`banniere-reprise`** — Fond `{colors.accent-soft}`, texte `{colors.ink-primary}`, rayon `{rounded.md}`, `{typography.body-sm}`. Bandeau non-bloquant avec CTA continuer. Visuel minimal.
- **`bloc-memoire`** — Fond `{colors.surface-raised}`, rayon `{rounded.md}`, titre `{typography.subtitle}`, chips `chip-gout` réappliquées en un tap. Visuel minimal.
- **`illustration-panel`** — Zone dédiée aux personnages 2D plats (chef/client), fond `{colors.surface-base}`, accompagnée de touches `{colors.pattern-a}` / `{colors.pattern-b}` en formes abstraites autour du personnage. Réservée à 4 moments précis : **Accueil**, **Commande envoyée**, **Merci chef**, **Bon retour** (mémoire 2e visite). Style : personnage plat, lisible, léger — pas de rendu 3D (différé, PRD). Décorative : `alt=""`, le sens est porté par le texte qui l'accompagne (voir Accessibilité).
- **`pattern-background`** — Motif abstrait léger (rubans/formes issus de `{colors.pattern-a}` / `{colors.pattern-b}`, opacité **≤10%**) utilisé en toile de fond statique sur les écrans **sans** illustration dédiée (Menu, Service, Contact opt-in). Toujours décoratif et non-interactif, jamais au point de gêner la lecture du contenu au premier plan.
- **`status-pill-bo`** — Back-office salle uniquement : statut commande `reçue` (fond `{colors.accent-soft}`), `en préparation` (fond `{colors.accent}`), `servie` (fond `{colors.surface-raised}`, texte `{colors.ink-secondary}`). Label texte toujours visible en plus de la couleur (jamais couleur seule).
- **`ligne-menu-bo`** — Fond `{colors.surface-base}`, séparateur `{colors.border}`, `{typography.body}`. Édition inline nom/prix/dispo/photo, `status-pill-bo` pour la dispo. Visuel minimal.
- **`carte-commande-bo`** — Fond `{colors.surface-raised}`, rayon `{rounded.md}`, `{typography.body}`, `status-pill-bo` pour le statut (reçue / en préparation / servie). Goûts cuisine visibles sans quitter la fiche. Visuel minimal.
- **`item-file-service-bo`** — Fond `{colors.surface-base}`, contour `{colors.border}`, `{typography.body-sm}`, libellé d'action en `{typography.button-label}`. Marquable comme traité. Visuel minimal.

[NOTE FOR UX] Le Back-office n'est pas le foyer principal de cette distillation (V1 = expérience client mobile web) ; les entrées `-bo` ci-dessus couvrent le minimum partagé identifié dans le PRD.

### Accessible naming

- **`avis-stars`** — nom accessible « Note : {n} sur 5 » porté par le composant, pas seulement par une légende visuelle ; l'emoji plat optionnel est décoratif (pas d'alternative texte requise) sauf s'il devient la seule information transmise.
- **Illustrations (`illustration-panel`)** — toujours `alt=""` (décoratives) tant que le message qui les accompagne porte le sens ; si un moment illustré venait à ne plus avoir de texte associé, une alternative texte devient obligatoire.
- **`catalogue-service`** — icône **et** libellé texte visible sur chaque tuile, jamais une icône seule.
- **`status-pill-bo`** — label texte obligatoire en plus de la couleur, pour toute surface Back-office.
- **`{colors.focus-ring}`** — contour de focus visible (2px, offset 2px) sur tout élément interactif tabulable, priorité Back-office (clavier + souris explicite).

## Do's and Don'ts

| Do | Don't |
|---|---|
| Fredoka pour les titres, Nunito Sans pour le corps | Inter, Roboto, Arial ou toute police système par défaut en primaire |
| Texte `{colors.ink-primary}` sur bouton `{colors.accent}` | Texte blanc sur le jaune accent (échec de contraste) |
| Motifs abstraits légers en fond, illustrations 2D plates aux 4 moments dédiés | Illustration à chaque écran, ou motif de fond qui gêne la lecture |
| Photos de plats pour le Menu | Illustration décorative à la place d'une vraie photo de plat |
| Un accent chromatique unique (`{colors.accent}`), réservé au CTA principal | Multiplier les couleurs vives / accents concurrents |
| S'inspirer de l'énergie spatiale et des motifs dynamiques de la référence Niva | Copier 1:1 la référence Niva, ou reprendre sa palette terre/bois |
| Un CTA principal unique par écran, épuré | Hub à tuiles égales type dashboard, murs de texte, pop-ups |
| Coins arrondis cohérents (`{rounded.*}`) sur boutons, cartes, chips | Angles vifs isolés qui contredisent la personnalité ronde de la marque |
| Nom accessible explicite (`avis-stars`), icône **et** texte (`catalogue-service`), `alt=""` sur illustrations décoratives | Information portée par la couleur seule, icône sans libellé, étoiles sans nom accessible |

---

**Gaps restants (non tranchés en amont, à valider en revue UX) :**
- [ASSUMPTION] Valeur exacte d'`{elevation.soft}` (Elevation & Depth) : aucune décision memlog explicite, extrapolée depuis la posture « épurée » + la correction de contraste C2.
- [ASSUMPTION] Échelle précise de rayon d'angle (Shapes) : dérivée de la décision typographique « arrondi/amical », non chiffrée en amont.
- [NOTE FOR UX] Le mode sombre n'est pas couvert (hors scope V1, décision explicite « light only ») ; le mode contraste élevé / couleurs forcées du système n'est pas non plus tranché explicitement (à valider si besoin, hors urgence V1).
- [NOTE FOR UX] Les tokens `status-pill-bo`, `ligne-menu-bo`, `carte-commande-bo`, `item-file-service-bo` couvrent un minimum Back-office ; une passe dédiée BO pourrait être nécessaire si le scope salle s'étoffe.
- [NOTE FOR UX] Motion/animation (durée, easing, fallback mouvement réduit) n'est pas encore spécifié dans `DESIGN.md`, alors qu'`EXPERIENCE.md` promet déjà « aucune animation d'illustration non désactivable » — à formaliser dans une passe ultérieure.
