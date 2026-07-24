# Brainstorm intent — Résidence Moeris

**Source:** brainstorm 2026-07-23 · **Status:** décisions figées · **Handoff:** product brief / PRD

## Produit

Plateforme digitale « **Ma table** » pour **Résidence Moeris** : séjour à table via QR imprimé — menu → commande → fin (avis + contact), sans surcharger le client.

## Entrée physique (contrainte)

Carte table imprimée, **2 QR côte à côte** (pas de combo unique) :

1. **Wi-Fi** — connexion native téléphone (auto, pas de captive portal / page login Wi-Fi)
2. **Ma table** — ouverture du flux plateforme

Un seul objet mental ; numéros grands, contraste, design durable.

## Flux session (1 scan)

- Scan **Ma table** = ouverture du fil ; **pas de rescans** en cours de séjour
- Session persistée (cache/local + ID serveur) ; refresh/crash → reprise à l’étape ; TTL soirée (~6h)
- Onglet fermé → rescanner le QR = reprise (session liée table/appareil)
- Micro-missions à but précis (10–30 s / écran) : menu, commander, service, terminer — pas de feed

## Identité client

| Moment | État |
|--------|------|
| Scan | Client anonyme en base |
| Fin (opt-in) | Client identifié (tél / WhatsApp) |
| 2e visite | Mémoire si reconnu (même contact ou soft cookie) — pas de login forcé |

## Mémoire 2e visite (V1)

Priorité **mémoire** uniquement (pas avantages / accès rapide) :

- Historique court des **préférés** (top 3–5, plats notés haut + tags soft issus des avis)
- **Goûts de cuisine** mémorisés via commandes (ex. sans piment, bien cuit) — proposition 1 tap
- Pas de tracking intrusif (table/heure/compagnie) ; **allergies hors priorité V1**

## Fin d’expérience

- Déclencheur : bouton **« Terminer mon expérience »** **après** réception de la commande
- **Succès idéal** = **avis + contact** (sans surcharge)
- Fin courte : note/emoji → contact opt-in (« soirées Moeris », jamais de spam)
- Animation chef **chaleureux** (merci ; message selon avis) — chaleur via **ambiance visuelle + ton chef**, pas jargon UI froid

## Aspiration (hors cœur V1)

Partage **Google** soft post-merci (option douce) — artefact futur « scan Ma table » ; pas de pop-up agressive.

## Non-goals / UX bannie

- Compte obligatoire / mot de passe
- Murs de saisie texte ; trop d’étapes
- Pop-ups, pubs
- Feed / engagement / « Pour toi » multi-parcours
- Captive portal Wi-Fi ; combo 1 QR Wi-Fi+URL
- Dashboard client lourd ; avantages / gestes perso en V1
- Allergies comme priorité mémoire V1

## Prochaine étape BMAD

→ **`bmad-product-brief`** (recommandé) puis **`bmad-prd`** — ou PRD direct si le brief est jugé redondant.
