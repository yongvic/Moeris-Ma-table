# Reconcile — ref Niva / Hernández Family → Ma table

**Source:** `imports/ref-niva-family-hero.png`  
**Cible:** spines UX Ma table (Résidence Moeris)  
**Décision memlog:** structure / espace / dynamique — **pas** copie 1:1  
**Date:** 2026-07-23

---

## Kept (into spines)

- **Composition hero card** — un grand bloc central aéré comme point focal d’accueil, pas un dashboard de tuiles égales.
- **Layout aéré** — beaucoup de blanc / respiration ; hiérarchie claire (salutation → message → actions).
- **Rubans / formes abstraites dynamiques** — motif léger en fond ou dans un plan visuel, pour du mouvement sans surcharge.
- **Langage UI doux** — coins arrondis, chips / pastilles d’action, surfaces light.
- **Ambiance frais & contemporain** — beaucoup de blanc + accents vifs (esprit « Niva light », pas palette terre).
- **Chips d’actions secondaires** — pattern de raccourcis sous le message principal (réinterprété pour le parcours table).
- **Ton accueillant** — salutation + question/proposition claire en tête de parcours (adapté FR + voix maison).

---

## Adapted

| Ref Niva | Ma table |
| --- | --- |
| Famille / assistant IA « Niva » | Fil séjour resto : menu, commande, service, avis |
| Gradient purple-aurora (violet / bleu / orange) | Palette **Citrus** (surface crème claire, accents citron/zeste `#E8C200` / `#FFE500` / `#FF8A00`) |
| Copy EN (« HELLO JUAN! », « How can I help… ») | Copy **FR**, voix chef / maison |
| Chips « Add activity / Organize / Delegate » | CTA parcours : ex. **Voir le menu** (principal) + **Service** (secondaire) — pas un hub 4 tuiles |
| Barre « Ask Niva anything » + pastille micro | Pas d’input IA ; interactions métier (menu, commande, 4 gestes service) |
| Liste « upcoming activities » + tags CHILDREN/PARENTS | Pas de feed familial ; contenu = plats, commande, micro-missions service |
| Micro comme CTA primaire (bleu) | Pas de CTA micro V1 ; chaleur = illustrations + ton chef |
| Illustration = gradient abstrait comme identité | Motif léger + **illustrations 2D** aux moments clés (accueil, commande envoyée, merci chef, bon retour) |
| Chrome app (historique / réglages) | Navigation V1 = fil léger Menu \| Service ; Terminer après commande reçue |
| Typo sans générique UI | Fredoka (titres) + Nunito Sans (corps) — arrondi distinctif, pas Inter/Roboto |

---

## Dropped (qualitative ideas from the ref NOT carried into Ma table)

- **Barre d’input assistant IA** (« Ask Niva anything ») — produit = parcours table, pas chat.
- **Bouton micro / voix entrante** comme CTA primaire — hors scope V1 ; « voix maison » = ton copy, pas capture audio.
- **Liste d’activités familiales** (« Your upcoming activities » / See all) — modèle agenda famille, pas resto.
- **Tags CHILDREN / PARENTS** — segmentation foyer inutile pour Ma table.
- **Marque / framing « Hernández Family » + Niva** — identité remplacée par Résidence Moeris / Ma table.
- **Copy anglaise** — produit FR.
- **Purple-aurora comme signature de marque** — utilisateur a choisi **Citrus** (light only V1).
- **Pastille CTA bleue saturée** type primary app — accents Citrus (citron / zeste), pas bleu Niva.
- **Icônes chrome type historique + settings** en header d’accueil — anti-dashboard ; header minimal.
- **Métaphore « How can I help you today? » orientée assistant** — remplacée par proposition séjour (menu / service), pas un agent conversationnel.
- **Densité « product AI family OS »** (plusieurs jobs égaux sur un écran) — explicitement rejetée au profit d’un **fil** post-QR.

---

## Risks if someone copies the ref 1:1

1. **Mauvais produit** — on livre une UI d’assistant familial / IA au lieu d’un fil de commande à table ; le QR client attend menu & service, pas « Ask Niva ».
2. **Palette & marque** — purple-aurora + micro bleu contredisent la décision **Citrus** et l’identité Moeris ; le look devient générique « AI app 2024 ».
3. **Attentes hors V1** — micro, chat libre, historique, settings, feed d’activités → scope, accessibilité salle, et dette UX non prévues (avis = étoiles + emoji, service = 4 gestes, pas de chat).
4. **Langue & ton** — EN + ton assistant froident la « voix maison » chef ; rupture avec le PRD FR.
5. **Navigation dashboard** — égaliser chips / listes / chrome donne un hub, alors que V1 impose un fil léger (accueil → menu maison → service secondaire).
6. **Fausse accessibilité voix** — un gros micro suggère la commande vocale ; sans backend voix, c’est une promesse cassée en salle.

---

*Reconcile honnête : la ref Niva alimente l’espace, la douceur et le dynamisme abstrait — pas le modèle produit, la palette, ni les patterns IA.*
