# Spine Pair Review — Ma table (Résidence Moeris)

## Overall verdict

La paire de colonnes est solide sur la couverture des flux et la forme générale (ordre canonique DESIGN.md respecté, sections requises EXPERIENCE.md toutes présentes), mais **casse en trois points mécaniques** qui bloqueraient une extraction propre par un consommateur aval : une contradiction interne DESIGN.md sur le rayon des cartes menu, une absence totale de correspondance de noms entre `DESIGN.md.Components` et `EXPERIENCE.md.Component Patterns`, et une référence visuelle (`imports/ref-niva-family-hero.png`) citée deux fois mais introuvable sur disque. La couverture d'états est correcte pour le fil client principal mais reste mince côté Back-office et sur les chemins d'échec réseau (commande, menu).

## 1. Flow coverage — adequate

Sources frontmatter (`prd.md`) → UJ-1, UJ-2, UJ-3 extraits. Les trois ont une Key Flow nommée avec protagoniste, étapes numérotées et un beat **Climax** explicite.

### Findings
- **medium** Flow 3 (UJ-3, Équipe Moeris) n'a pas de chemin d'échec / cas limite, contrairement aux Flows 1 et 2 qui en ont chacun un (`EXPERIENCE.md` §Key Flows, Flow 3, lignes 168-179 vs Flow 1 ligne 153 et Flow 2 ligne 166). *Fix:* ajouter un « Cas limite » pour le BO (ex. propagation menu en retard, commande non vue / « fantôme », staff déconnecté en cours de service).
- **low** Le protagoniste du Flow 3 reste générique (« il/elle », « responsable ou serveur ») sans prénom, alors que les Flows 1-2 nomment Mame Fatou — mais le PRD lui-même (UJ-3) ne nomme personne, donc l'écart est hérité, pas introduit par la colonne. *Fix:* si un persona staff est nommé plus tard dans le PRD, le répercuter ici pour homogénéité.

## 2. Token completeness — thin

Frontmatter `DESIGN.md` : 9 couleurs, 7 rôles typographiques, 5 rayons, 10 valeurs d'espacement, 8 composants. Tous les tokens couleurs/typo sont commentés en prose avec valeurs hex/littérales complètes (aucun hex manquant).

### Findings
- **critical** Le composant `card-menu-item` utilise `radius: '{rounded.lg}'` (24px) dans le frontmatter, mais la section **Shapes** affirme que `{rounded.md}` (16px, `DEFAULT`) sert « pour les cartes menu et panneaux » (`DESIGN.md` composants ligne ~86 vs §Shapes ligne 189). Le code aval consommera le token composant (24px), en contradiction avec la règle documentée (16px). *Fix:* choisir une valeur et aligner les deux — probablement `{rounded.md}` sur le composant pour matcher la prose Shapes.
- **medium** `{spacing.section-gap}` (32px) est défini en frontmatter mais n'est référencé nulle part en prose ni dans un composant — token orphelin, et il duplique la valeur de `{spacing.6}` (aussi 32px) sans règle distinguant quand utiliser lequel (§Layout & Spacing, ligne 173, ne cite que `spacing.6`/`spacing.7`). *Fix:* soit référencer explicitement `section-gap` là où il s'applique (ex. séparation entre blocs d'écran distincts de `spacing.6`), soit le retirer.
- **low** Aucune cible de contraste chiffrée n'est donnée pour la combinaison `{colors.accent}` + `{colors.ink-primary}`, seulement une affirmation qualitative (« ne passe pas le contraste minimal », §Colors ligne 146). *Fix:* citer une cible (ex. WCAG AA 4.5:1 texte normal / 3:1 grand texte) pour que l'aval puisse vérifier objectivement.

## 3. Component coverage — broken

Extraction de tous les noms de composants cités : `DESIGN.md.Components` (8 : `button-primary`, `button-secondary`, `card-menu-item`, `chip-gout`, `illustration-panel`, `pattern-background`, `avis-stars`, `status-pill-bo`) vs `EXPERIENCE.md.Component Patterns` (12 lignes : Carte Accueil, Carte plat, Fiche plat / Commande, Catalogue Service, Étoiles + emoji plat, Carte Merci chef, Sélecteur Contact (C1), Bannière Reprise, Bloc Mémoire, Ligne Menu (BO), Carte Commande (BO), Item file Service (BO)).

### Findings
- **critical** Aucun nom de composant ne correspond littéralement entre les deux tables (`DESIGN.md` §Components lignes 195-204 vs `EXPERIENCE.md` §Component Patterns lignes 74-87). Un consommateur aval ne peut pas joindre les deux specs par nom (ex. impossible de savoir que « Carte plat » = `card-menu-item`, « Étoiles + emoji plat » = `avis-stars`, « Carte Commande (BO) » utilise `status-pill-bo`). *Fix:* adopter une liste canonique unique de noms de composants et l'utiliser à l'identique dans les deux fichiers.
- **high** Composants avec une ligne comportementale dans `EXPERIENCE.md` mais **aucune** spec visuelle correspondante dans `DESIGN.md.Components` : Sélecteur Contact (C1), Bannière Reprise, Bloc Mémoire, Catalogue Service (4 tuiles), Ligne Menu (BO), Item file Service (BO), Carte Commande (BO) (`EXPERIENCE.md` lignes 78-87). *Fix:* ajouter une entrée frontmatter + une ligne prose dans `DESIGN.md.Components` pour chacun, même minimale.
- **medium** `pattern-background` a une spec visuelle complète dans `DESIGN.md` (ligne 202, utilisé sur Menu/Service/Contact) mais aucune ligne comportementale dans `EXPERIENCE.md.Component Patterns` — son usage n'est jamais confirmé côté comportement (statique ? animé au scroll ?). *Fix:* ajouter une ligne « Fond motif » dans Component Patterns précisant le comportement (statique, non-interactif, jamais devant le contenu).
- **medium** `button-secondary` a une spec visuelle dédiée dans `DESIGN.md` mais n'a pas de ligne comportementale propre dans `EXPERIENCE.md.Component Patterns` ; il n'apparaît qu'en creux dans la ligne « Carte Accueil » (« accès secondaire (Service) »). *Fix:* lui donner sa propre ligne comportementale ou fusionner explicitement avec la règle de la Carte Accueil.

## 4. State coverage — thin

Parcours des 15 surfaces IA (11 client + 4 BO) contre `EXPERIENCE.md` §State Patterns (13 lignes).

### Findings
- **high** Aucun état d'échec n'est défini pour l'envoi de la Commande (coupure réseau pendant l'envoi) — seul le succès « Commande envoyée » est couvert (§State Patterns ligne 95), alors que FR-8 exige un feedback clair et que le PRD note explicitement le risque réseau resto (§10 NFR). *Fix:* ajouter une ligne « Échec envoi commande → message + retry, jamais une commande silencieusement perdue ».
- **medium** Les surfaces BO Menu, BO Service et BO Connexion n'ont quasiment aucun état dédié au-delà de la redirection partagée « Staff non authentifié » — pas d'état vide (aucun plat/aucune mission en file), ni de chargement, ni d'erreur de sauvegarde (`EXPERIENCE.md` §State Patterns lignes 89-105 ; IA lignes 38-40). *Fix:* ajouter au moins un état vide + un état d'erreur de sauvegarde par surface BO.
- **low** Le Menu n'a pas d'état hors-ligne / perte de connexion, seulement « Plat indisponible » qui est un état métier, pas réseau — incohérent avec l'attention portée au réseau resto dans le PRD (§10). *Fix:* ajouter un état de chargement à froid / échec réseau pour le Menu, sur le modèle de l'exemple Quill (`experience-example-mobile.md` §State Patterns, « Cold open »).

## 5. Visual reference coverage — broken

Recherche de `imports/`, `mockups/`, `wireframes/` sous l'espace de travail UX : **aucun des trois dossiers n'existe** sur disque.

### Findings
- **critical** `imports/ref-niva-family-hero.png` est cité comme référence structurelle dans `DESIGN.md` §Brand & Style (ligne 127), dans `.memlog.md` (ligne 13) et comme source unique de `reconcile-ref-niva-family-hero.md` (ligne 3) — le fichier est introuvable dans tout le projet. La référence est orpheline : un consommateur aval ne peut pas ouvrir le fichier que la colonne nomme comme sa référence de structure. *Fix:* réimporter le fichier sous `imports/ref-niva-family-hero.png`, ou retirer/corriger la citation si l'image n'est plus disponible.
- **medium** Aucune maquette n'existe encore pour les 15 surfaces IA — fait honnêtement déclaré dans `EXPERIENCE.md` §IA (« maquettes à venir ») et §Gaps hérités (« Aucune maquette n'est encore liée »), donc pas une omission silencieuse, mais la couverture Pass 1 reste vide à ce stade. *Fix:* aucune action immédiate requise si le parent ajoute les maquettes à l'étape suivante ; à revalider à ce moment-là.

## 6. Bloat & overspecification — adequate

Peu de restatement de sources ou de pixel-specs redondants ; les deux fichiers utilisent des tables plutôt que de la prose là où c'est pertinent.

### Findings
- **low** Les mises en garde `[ASSUMPTION]` d'Elevation & Depth et de Shapes sont énoncées en ligne (`DESIGN.md` lignes 185 et 191) puis effectivement répétées dans la section finale « Gaps restants » (lignes 222-223) — léger doublon pour le lecteur aval. *Fix:* garder l'annotation inline courte et renvoyer vers « Gaps restants » plutôt que de répéter le même texte.
- **low** La note `[NOTE FOR UX]` sur `status-pill-bo` est imbriquée dans la puce de spec du composant lui-même (`DESIGN.md` ligne 204), mélangeant commentaire de processus et valeurs de tokens engagées dans le même paragraphe que lirait un développeur. *Fix:* déplacer la note de processus vers la section Gaps, garder la puce composant strictement factuelle.

## 7. Inheritance discipline — thin

`sources` frontmatter d'`EXPERIENCE.md` (prd.md, .memlog.md, reconcile-brainstorm-intent.md) résolvent tous les trois sur disque. Les noms UJ-1/UJ-2/UJ-3 sont repris verbatim du PRD. Le Glossaire (Client, Session, Commande, Goût(s) cuisine, Service, Terminer mon expérience, Avis, Contact opt-in, Mémoire, Préférés, Reconnaissance, Back-office, Table, Carte table, QR Wi-Fi, QR Ma table) est cohérent entre PRD et les deux colonnes, à une variation cosmétique près (« Goût cuisine » singulier au Glossaire PRD vs « Goûts cuisine » pluriel dans les deux colonnes — non bloquant).

### Findings
- **critical** Voir « Component coverage » (§3) : les noms de composants ne sont **pas** identiques entre `DESIGN.md.Components` et `EXPERIENCE.md.Component Patterns`, ce qui est précisément la règle que cette catégorie nomme explicitement. Non recompté séparément ici — cf. §3 pour le détail et le fix.

## 8. Shape fit — adequate

`DESIGN.md` respecte l'ordre canonique complet (Brand & Style → Colors → Typography → Layout & Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts). `EXPERIENCE.md` a les huit sections par défaut requises (Foundation, IA, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Key Flows) ; les sections inventées (Carte table (Print), Gaps hérités) et déclenchées-si-applicable (Inspiration & Anti-patterns, légitimée par les refs Niva + rejets memlog) gagnent leur place.

### Findings
- **high** `EXPERIENCE.md` §Foundation déclare explicitement deux form-factors (« expérience client mobile web… et Back-office salle desktop/tablette », ligne 13) — c'est exactement la condition déclenchante que le rubric nomme pour une section **Responsive** requise-si-applicable, absente du document. *Fix:* ajouter une courte section Responsive couvrant les règles mobile client (breakpoints s'il y en a) et le layout desktop/tablette du BO, ou justifier explicitement pourquoi la ligne unique de Foundation suffit.

## Mechanical notes

- **Incohérences de nommage :** aucun nom de composant partagé entre `DESIGN.md.Components` et `EXPERIENCE.md.Component Patterns` (détail en §3/§7). Variation cosmétique « Goût cuisine » (PRD, singulier) vs « Goûts cuisine » (deux colonnes, pluriel) — non bloquant.
- **Cross-refs cassées :** `imports/ref-niva-family-hero.png` cité dans `DESIGN.md`, `.memlog.md` et `reconcile-ref-niva-family-hero.md`, introuvable sur disque ; aucun dossier `imports/`, `mockups/` ou `wireframes/` n'existe sous l'espace de travail UX (détail en §5).
- **Contradiction interne :** `card-menu-item.radius` (`{rounded.lg}`) vs règle Shapes (`{rounded.md}` pour les cartes menu) — détail en §2.
- **Frontmatter :** `DESIGN.md` n'a pas de champ `sources` (conforme à l'exemple `design-example-mobile.md`, qui n'en a pas non plus — pas un défaut). `EXPERIENCE.md.sources` résout intégralement (3/3 fichiers présents).
- **Mermaid :** aucun diagramme Mermaid dans les deux fichiers — sans objet.
- **Artefact non lié :** `.working/color-themes-1.html` (outil créatif ayant produit la palette Citrus) n'est cité par aucune des deux colonnes ; sans conséquence puisqu'il s'agit d'un outil de travail, pas d'une référence de composition requise.
