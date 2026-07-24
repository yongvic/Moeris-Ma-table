---
baseline_commit: NO_VCS
---

# Story 1.6: Carte table print — dualité Wi‑Fi / Ma table

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a équipe Moeris,
I want une spécification / assets de Carte table avec deux QR numérotés,
so that chaque table expose clairement 1. Wi‑Fi et 2. Ma table.

## Acceptance Criteria

1. **Given** le besoin d’imprimer des cartes table  
   **When** on produit le kit Carte table V1  
   **Then** deux QR côte à côte sont documentés/générables : 1 Wi‑Fi (connexion native) et 2 Ma table (URL `tableId`)

2. **And** libellés, grands numéros, contraste fort et note matériau durable sont spécifiés

3. **And** aucun QR combiné Wi‑Fi+URL n’est proposé

## Tasks / Subtasks

- [x] T1. Spec print Carte table (AC: #1, #2, #3)
  - [x] Rédiger `docs/print/carte-table.md` (FR) : objet unique, deux QR numérotés côte à côte
  - [x] QR **1 — Wi‑Fi** : payload connexion native (`WIFI:S:<ssid>;T:<WPA|WEP|>;P:<password>;;` ou doc équivalente) — **hors runtime Ma table**
  - [x] QR **2 — Ma table** : URL absolue `https://<host>/t/<tableId>` alignée story 1.2 (AD-9)
  - [x] Interdiction explicite : un seul QR qui combine Wi‑Fi + URL / captive portal
  - [x] Libellés FR : « 1. Wi‑Fi », « 2. Ma table » ; grands numéros lisibles à distance table
  - [x] Contraste fort encre / fond ; pont couleur « Ma table » avec `{colors.accent}` (#E8C200) sans compromettre le scan QR (zone QR reste noir/blanc fort)
  - [x] Note matériau : support durable usure de table (plastification / PVC / chevalet — choix documenté, pas code)
  - [x] Pas de 3ᵉ QR ; pas de long texte pédagogique sur la carte

- [x] T2. Assets générables (AC: #1)
  - [x] Script ou procédure sous `docs/print/` **ou** assets sous `public/print/` :
    - Exemples PNG/SVG pour tables seed (ex. `t-1` …) : QR Ma table
    - Exemple QR Wi‑Fi avec SSID/mot de passe **placeholder** documentés (ne pas committer de secrets prod)
  - [x] README : comment régénérer (outil CLI `qrcode`, `uqr`, etc.) + variables `BASE_URL`, `WIFI_SSID`, `WIFI_PASSWORD`
  - [x] Template mise en page (HTML print / PDF / Figma-export notes) montrant 1 | 2 côte à côte

- [x] T3. Lien produit (AC: #1, #3)
  - [x] Référencer l’URL entry 1.2 ; confirmer qu’aucune route app ne sert de captive Wi‑Fi
  - [x] Checklist QA print : scan Wi‑Fi → OS native ; scan Ma table → Accueil session

- [x] T4. Garde-fous
  - [x] **Pas** une feature app runtime (pas de page `/print` métier obligatoire)
  - [x] Pas de fusion des deux QR
  - [x] Pas d’Auth / Prisma nouveaux modèles pour le print

## Dev Notes

### Nature du livrable

Story **print / spec / assets** (FR1 / UX Carte table). Ce n’est **pas** une feature applicative complète. Sortie attendue = documentation + fichiers générables pour impression atelier.

### Dépendance

- **1.2** : format d’URL `tableId` doit être connu (`/t/[tableId]`). Si 1.2 change le path, mettre à jour la spec.
- Scaffold 1.1 / Accueil 1.3 utiles pour QA scan Ma table mais non bloquants pour rédiger la spec.

### Architecture

- **AD-9** : QR Ma table = `tableId` ; Wi‑Fi hors produit logiciel.
- **AD-5** : le print ne pose pas de cookie — le scan Ma table déclenche 1.2.
- Aucun AD monolithe à violer : pas de code BO/client requis au-delà d’éventuels assets statiques `public/print/`.

### Contenu minimal de `docs/print/carte-table.md`

1. Objectif & non-goals (pas de QR combiné, pas de captive)
2. Layout (schéma ASCII ou figure) : numéro + libellé + QR ×2
3. Spec technique payloads Wi‑Fi vs URL
4. Spec visuelle : numéros, contraste, accent Ma table, quiet zone QR
5. Matériau & formats d’impression (ex. 10×15 cm — ajuster si décidé)
6. Procédure génération + exemples tables
7. Checklist validation scan terrain

### Fichiers à créer / modifier

| Path | Action |
| --- | --- |
| `docs/print/carte-table.md` | NEW — spec FR complète |
| `docs/print/README.md` | NEW — regen assets |
| `docs/print/generate-qr.mjs` (ou `.ts` / `.ps1`) | NEW optionnel — générateur |
| `public/print/examples/t-1-ma-table.svg` (etc.) | NEW — exemples |
| `public/print/examples/wifi-placeholder.svg` | NEW — exemple Wi‑Fi factice |
| `docs/print/layout-carte-table.html` | NEW optionnel — preview print CSS |

### Hors scope

- Portail captif, provisioning Wi‑Fi automatique depuis l’app
- Impression industrielle / commande fournisseur
- Features app Accueil / session (déjà 1.2–1.5)
- Secrets Wi‑Fi production dans le repo

### Testing

- Générer 2 QR → scanner avec téléphone : Wi‑Fi propose réseau ; Ma table ouvre URL table
- Relecture spec : aucun schéma « QR unique combo »
- Contraste / taille numéros validés sur rendu print preview (pas besoin e2e Next)

### References

- [Source: `epics.md` — Story 1.6, FR1]
- [Source: `prd.md` — FR-1 dualité Wi‑Fi / Ma table, §12 print]
- [Source: `EXPERIENCE.md` — section Carte table (Print), Anti-patterns QR combiné]
- [Source: `ARCHITECTURE-SPINE.md` — AD-9]
- [Source: story 1.2 — URL `/t/[tableId]`]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- `npm run print:qr` → SVG Wi‑Fi placeholder + `t-1`…`t-5` Ma table
- Aucune route captive / payload `WIFI:` dans `app/`

### Completion Notes List

- Spec FR complète `docs/print/carte-table.md` (dualité, payloads, contraste, matériau)
- Générateur `docs/print/generate-qr.mjs` + `npm run print:qr`
- Preview HTML print `docs/print/layout-carte-table.html`
- Assets exemples sous `public/print/examples/` (secrets Wi‑Fi = placeholders)

### Change Log

- 2026-07-24 — Story 1.6 kit Carte table print → status `review`

### File List

- docs/print/carte-table.md
- docs/print/README.md
- docs/print/generate-qr.mjs
- docs/print/layout-carte-table.html
- public/print/examples/wifi-placeholder.svg
- public/print/examples/t-1-ma-table.svg
- public/print/examples/t-2-ma-table.svg
- public/print/examples/t-3-ma-table.svg
- public/print/examples/t-4-ma-table.svg
- public/print/examples/t-5-ma-table.svg
- package.json
- package-lock.json
- _bmad-output/implementation-artifacts/1-6-carte-table-print-dualite-wifi-ma-table.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
