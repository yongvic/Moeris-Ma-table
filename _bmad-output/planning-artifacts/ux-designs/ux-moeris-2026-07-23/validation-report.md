# Validation Report — Ma table (Résidence Moeris)

- **DESIGN.md:** `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md`
- **EXPERIENCE.md:** `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md`
- **Run at:** 2026-07-23T15:45:00

## Overall verdict

La revue initiale signalait trois points mécaniques bloquants (rayon `card-menu-item`, noms de composants non joignables entre colonnes, référence Niva introuvable) plus des manques d’états, de Responsive et d’accessibilité (étoiles, surfaces, focus). **Après corrections post-revue**, les IDs de composants sont alignés entre `DESIGN.md` et `EXPERIENCE.md`, les étoiles/surfaces/focus-ring et cibles tactiles sont spécifiés côté a11y, les états d’échec (commande, menu, BO) et la section Responsive & Platform sont en place. La citation `imports/ref-niva-family-hero.png` est valide — le fichier **existe** sur disque (faux positif du reviewer). Restent ouverts surtout des sujets medium/low : maquettes absentes, échelle typo en `rem`/zoom 200 %, marge de contraste du pill « reçue », contour de champs Contact, protagoniste BO générique, et légers doublons ASSUMPTION.

## Category verdicts (post-corrections)

- Flow coverage — adequate
- Token completeness — adequate
- Component coverage — adequate
- State coverage — adequate
- Visual reference coverage — thin
- Bloat & overspecification — adequate
- Inheritance discipline — adequate
- Shape fit — adequate

## Findings by severity

### Critical (5) — 5 RÉSOLU · 0 OUVERT

**[Token completeness] — Contradiction rayon `card-menu-item`** (`DESIGN.md` Components / Shapes) — **RÉSOLU**  
Le composant utilisait `{rounded.lg}` contre la règle Shapes `{rounded.md}`. Aligné : `card-menu-item.radius: '{rounded.md}'` et prose Shapes explicite.

**[Component coverage / Inheritance] — Noms de composants non joignables** (`DESIGN.md.Components` vs `EXPERIENCE.md.Component Patterns`) — **RÉSOLU**  
Liste canonique unique (`card-accueil`, `card-menu-item`, `fiche-commande`, `catalogue-service`, `avis-stars`, etc.) utilisée à l’identique dans les deux fichiers.

**[Visual reference coverage] — `imports/ref-niva-family-hero.png` introuvable** (`DESIGN.md` Brand & Style) — **RÉSOLU** (faux positif)  
Le fichier est présent sous `imports/ref-niva-family-hero.png`. La référence n’est pas orpheline.

**[Accessibility] — C1 Avis stars : contraste ~1.3:1 et pas de nom accessible** (`avis-stars`) — **RÉSOLU**  
Actif plein / inactif contour (`ink-secondary`), `accessibleName: 'Note : {n} sur 5'`, `minHeight: tap-target-min` ; emoji décoratif précisé.

**[Accessibility] — C2 Cartes / bouton secondaire quasi invisibles (~1.05:1)** (`surface-raised`, Elevation) — **RÉSOLU**  
`surface-raised` assombri (`#F5E9B8`) ; `{elevation.soft}` autorisée sur `card-menu-item` et `button-secondary`.

### High (6) — 6 RÉSOLU · 0 OUVERT

**[Component coverage] — Composants comportementaux sans spec visuelle** (Contact, Reprise, Mémoire, Catalogue Service, lignes BO) — **RÉSOLU**  
Entrées frontmatter + prose : `selecteur-contact`, `banniere-reprise`, `bloc-memoire`, `catalogue-service`, `ligne-menu-bo`, `carte-commande-bo`, `item-file-service-bo`.

**[State coverage] — Pas d’échec d’envoi de commande** (`EXPERIENCE.md` State Patterns) — **RÉSOLU**  
État « Échec envoi commande (coupure réseau) » : message + retry, jamais de perte silencieuse.

**[Shape fit] — Section Responsive absente malgré deux form-factors** (`EXPERIENCE.md` Foundation) — **RÉSOLU**  
Section **Responsive & Platform** : client mobile web une colonne ; BO desktop/tablette clavier+souris.

**[Accessibility] — H1 Pas de token focus-visible** (`DESIGN.md`) — **RÉSOLU**  
`{colors.focus-ring}` (`#1A1A00`), contour 2px + offset 2px, client et BO.

**[Accessibility] — H2 `chip-gout` / étoiles hors `tap-target-min`** — **RÉSOLU**  
`minHeight: '{spacing.tap-target-min}'` sur `chip-gout` et `avis-stars`.

**[Accessibility] — H3 Stratégie de nommage accessible absente** — **RÉSOLU**  
Sous-section **Accessible naming** : illustrations `alt=""`, tuiles Service icône+texte, pills BO label obligatoire, focus-ring.

### Medium (9) — 6 RÉSOLU · 3 OUVERT

**[Flow coverage] — Flow 3 sans cas limite** (`EXPERIENCE.md` Key Flows) — **RÉSOLU**  
Cas limite ajouté (commande fantôme, staff déconnecté).

**[Token completeness] — `{spacing.section-gap}` orphelin** — **RÉSOLU**  
Référencé en Layout & Spacing (séparation de sections sémantiques vs `spacing.6`).

**[Component coverage] — `pattern-background` sans ligne comportementale** — **RÉSOLU**  
Ligne « Fond motif » : statique, non-interactif, jamais devant le contenu.

**[Component coverage] — `button-secondary` sans ligne comportementale propre** — **RÉSOLU**  
Ligne dédiée dans Component Patterns.

**[State coverage] — États BO vides / erreur de sauvegarde manquants** — **RÉSOLU**  
« BO vide » et « BO erreur de sauvegarde » ajoutés.

**[Accessibility] — M3 Opacité pattern sans plafond numérique** — **RÉSOLU**  
`opacity: '≤10%, décoratif uniquement'`.

**[Visual reference coverage] — Aucune maquette pour les 15 surfaces** (`EXPERIENCE.md` IA / Gaps) — **OUVERT**  
Déclaré honnêtement (« maquettes à venir ») ; couverture Pass 1 toujours vide.

**[Accessibility] — M1 Typo en px fixes, pas de stance rem/zoom 200 %** (`DESIGN.md` Typography) — **OUVERT**  
Échelle toujours en px littéraux ; pas de règle rem / reflow WCAG 1.4.4 / 1.4.10.

**[Accessibility] — M2 Contraste pill « reçue » borderline (~4.9:1)** (`status-pill-bo.recue`) — **OUVERT**  
Toujours `ink-secondary` sur `accent-soft` ; marge de sécurité ≥5.5:1 non engagée.

### Low (7) — 4 RÉSOLU · 3 OUVERT

**[Token completeness] — Cible de contraste accent non chiffrée** — **RÉSOLU**  
Doc : `ink-primary` sur `accent` ~10:1, au-dessus AAA (7:1).

**[State coverage] — Menu sans état hors-ligne / réseau** — **RÉSOLU**  
« Chargement à froid / échec réseau » sur Menu.

**[Bloat] — NOTE FOR UX imbriquée dans `status-pill-bo`** — **RÉSOLU**  
Puce composant factuelle ; notes processus en Gaps / NOTE séparée.

**[Accessibility] — L2 Pas de stance font-loading Fredoka/Nunito** — **RÉSOLU**  
`font-display: swap` + pile de repli métrique proche.

**[Flow coverage] — Protagoniste Flow 3 générique** — **OUVERT**  
Toujours « il/elle », « responsable ou serveur » (hérité PRD UJ-3).

**[Bloat] — Doublon ASSUMPTION inline + Gaps** (Elevation / Shapes) — **OUVERT**  
Annotations encore répétées en fin de `DESIGN.md`.

**[Accessibility] — L1 `border` trop faible pour contours de champs** (`selecteur-contact`) — **OUVERT**  
Composant présent avec `fieldBorder: '{colors.border}'` et note « à renforcer » ; contour plus fort non encore spécifié.

## Reviewer files

- `review-rubric.md`
- `review-accessibility.md`

## Compteurs post-corrections

| Sévérité | RÉSOLU | OUVERT |
|---|---:|---:|
| Critical | 5 | 0 |
| High | 6 | 0 |
| Medium | 6 | 3 |
| Low | 4 | 3 |
