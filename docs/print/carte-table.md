# Carte table — spécification print V1

> Artefact physique d’entrée (FR-1 / AD-9). **Pas** une feature runtime de l’app Ma table.

## 1. Objectif & non-goals

### Objectif

Un seul objet mental à table : la **Carte table**, avec **deux QR numérotés côte à côte** :

1. **Wi‑Fi** — connexion réseau **native** du téléphone  
2. **Ma table** — ouverture de l’expérience web (`/t/<tableId>`)

### Non-goals (interdits)

- Un **seul QR** qui combine Wi‑Fi + URL / deep link  
- Portail **captif** Wi‑Fi servi par Ma table  
- 3ᵉ QR, long texte pédagogique, ou formulaire sur la carte  
- Secrets Wi‑Fi de production dans le dépôt Git  

## 2. Layout (schéma)

Format cible V1 : **carte ~10 × 15 cm** (orientation paysage recommandée), chevalet ou PVC table.

```text
┌──────────────────────────────────────────────────────────┐
│  Résidence Moeris · Ma table                             │
│                                                          │
│   ┌─────────────┐              ┌─────────────┐           │
│   │      1      │              │      2      │           │
│   │   Wi‑Fi     │              │  Ma table   │           │
│   │  ┌───────┐  │              │  ┌───────┐  │           │
│   │  │ QR    │  │              │  │ QR    │  │           │
│   │  │ WIFI  │  │              │  │ URL   │  │           │
│   │  └───────┘  │              │  └───────┘  │           │
│   └─────────────┘              └─────────────┘           │
│                                                          │
│  Table : t-1                                             │
└──────────────────────────────────────────────────────────┘
```

- **Grands numéros** `1` et `2` lisibles à distance table (~1 m)  
- Libellés FR exacts : **« 1. Wi‑Fi »**, **« 2. Ma table »**  
- Quiet zone QR respectée (marge blanche autour du module)  

Preview HTML : [`layout-carte-table.html`](./layout-carte-table.html)

## 3. Payloads techniques

### QR 1 — Wi‑Fi (hors produit logiciel)

Payload standard (connexion OS native) :

```text
WIFI:S:<SSID>;T:<WPA|WEP|>;P:<PASSWORD>;;
```

Exemple **placeholder** (jamais un secret prod) :

```text
WIFI:S:Moeris-Guest;T:WPA;P:change-me;;
```

- `T:` vide = réseau ouvert  
- Échapper `;` `,` `:` `\` et `"` dans SSID/mot de passe selon la spec WIFI QR  

L’app Ma table **ne sert pas** ce flux : aucune route captive (`/wifi`, portal, etc.).

### QR 2 — Ma table (produit)

URL absolue alignée story **1.2** / AD-9 :

```text
https://<host>/t/<tableId>
```

Exemples seed V1 :

| tableId | URL (prod à substituer) |
| --- | --- |
| `t-1` | `https://<host>/t/t-1` |
| `t-2` | `https://<host>/t/t-2` |
| … | … |
| `t-5` | `https://<host>/t/t-5` |

Le scan déclenche l’ouverture/reprise de Session (cookie `mt_session`) — le print **ne pose pas** de cookie.

## 4. Spec visuelle

| Élément | Règle |
| --- | --- |
| Fond carte | Clair (blanc / crème proche `surface-base` `#FFFEF8`) |
| Encre principale | Sombre (`ink-primary` `#1A1A00`) — contraste fort |
| Accent « Ma table » | Bande / pastille `accent` `#E8C200` **autour** du bloc 2, **pas** sur les modules QR |
| Zones QR | **Noir / blanc** uniquement (contraste scan maximal) |
| Numéros | Très grands, Fredoka ou équivalent print bold |
| Texte | Minimal — libellés + id table optionnel |

## 5. Matériau & impression

| Choix V1 documenté | Motivation |
| --- | --- |
| **PVC souple plastifié** ou **chevalet acrylique** | Usure de table, liquides, nettoyage |
| Impression laser/offset + pelliculage mat | Évite reflets qui gênent le scan |
| Format ~10 × 15 cm | Deux QR confortables + quiet zones |

Décision atelier : privilégier **chevalet** si la carte doit rester verticale face client ; sinon PVC à plat sous verre.  
Pas de commande fournisseur dans ce repo — spec seule.

## 6. Génération des exemples

Voir [`README.md`](./README.md). Assets d’exemple :

- `public/print/examples/wifi-placeholder.svg`  
- `public/print/examples/t-1-ma-table.svg` … `t-5-ma-table.svg`  

## 7. Lien produit & QA terrain

| Check | Attendu |
| --- | --- |
| Scan QR 1 Wi‑Fi | L’OS propose de rejoindre le réseau (pas de page web Ma table) |
| Scan QR 2 Ma table | Ouvre `/t/<tableId>` → Accueil / reprise session |
| Aucune route app | Pas de captive portal dans le monolithe Next |
| Dualité | Deux QR distincts — **jamais** un QR combo |

## 8. Références

- PRD FR-1 · EXPERIENCE « Carte table (Print) » · ARCHITECTURE AD-9  
- Story 1.2 — entry `app/(client)/t/[tableId]/route.ts`  
