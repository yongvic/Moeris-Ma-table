# Glossaire — Ma table (normatif)

Vocabulaire produit. Les termes ci-dessous sont la référence pour SPEC, UX, architecture et stories.

| Terme | Définition |
| --- | --- |
| **Ma table** | Expérience digitale client ouverte par le QR dédié ; fil du séjour à table. |
| **Carte table** | Support imprimé à table portant deux QR côte à côte : **Wi‑Fi** et **Ma table**. |
| **QR Wi‑Fi** | QR qui déclenche la connexion Wi‑Fi **native** du téléphone (pas de captive portal). |
| **QR Ma table** | QR qui ouvre l’URL / l’expérience **Ma table** (`tableId` stable). |
| **Session** | Fil numérique d’un séjour, ouvert au scan **Ma table**, persisté (local + serveur), TTL soirée (~6 h), repris après refresh/crash ou rescannage. |
| **Client anonyme** | Enregistrement créé au scan, sans contact. |
| **Client identifié** | Client ayant fourni **téléphone ou email** en opt-in. |
| **Menu** | Catalogue consultable (plats, photos, infos utiles au choix). |
| **Commande** | Intention de commande passée via **Ma table**, visible en **Back-office**. |
| **Goût cuisine** | Préférence de préparation liée à une commande (ex. sans piment, bien cuit) — distinct des allergies. |
| **Service (micro-mission)** | Action courte pendant le séjour via catalogue fermé (serveur / eau / addition / autre). |
| **Terminer mon expérience** | Action explicite, disponible **après** qu’une commande est au statut reçue ou au-delà ; ouvre Avis → merci chef → Contact opt-in. |
| **Avis** | Feedback court de fin (étoiles obligatoires ; emoji plat optionnel ; pas de mur de texte). |
| **Contact opt-in** | Téléphone **XOR** email fourni volontairement **après** le merci chef, pour les soirées Moeris. |
| **Mémoire** | Préférés courts + goûts cuisine réutilisables à la 2ᵉ visite. |
| **Préférés** | Top 3–5 plats (notes hautes + tags soft issus des avis). |
| **Reconnaissance** | Soft auto (appareil/cookie) **et/ou** ressaisie du contact pour débloquer la **Mémoire**. |
| **Back-office** | Interface équipe unique (salle) pour **Menu**, **Commandes** et file **Service**. |
| **Table** | Emplacement physique auquel la **Carte table** / session est associée. |
| **Reprise** | Restauration de l’étape en cours dans la même soirée (bannière soft) — distincte de la Mémoire 2ᵉ visite. |
| **Barre de progression** | Indicateur discret Accueil → Menu → Commande → Fin ; se remplit avec l’étape de session ; non cliquable pour sauter. |
