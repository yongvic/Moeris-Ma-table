---
baseline_commit: NO_VCS
---

# Story 1.6: Carte table print â€” dualitÃ© Wiâ€‘Fi / Ma table

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Ã©quipe Moeris,
I want une spÃ©cification / assets de Carte table avec deux QR numÃ©rotÃ©s,
so that chaque table expose clairement 1. Wiâ€‘Fi et 2. Ma table.

## Acceptance Criteria

1. **Given** le besoin dâ€™imprimer des cartes table  
   **When** on produit le kit Carte table V1  
   **Then** deux QR cÃ´te Ã  cÃ´te sont documentÃ©s/gÃ©nÃ©rables : 1 Wiâ€‘Fi (connexion native) et 2 Ma table (URL `tableId`)

2. **And** libellÃ©s, grands numÃ©ros, contraste fort et note matÃ©riau durable sont spÃ©cifiÃ©s

3. **And** aucun QR combinÃ© Wiâ€‘Fi+URL nâ€™est proposÃ©

## Tasks / Subtasks

- [x] T1. Spec print Carte table (AC: #1, #2, #3)
  - [x] RÃ©diger `docs/print/carte-table.md` (FR) : objet unique, deux QR numÃ©rotÃ©s cÃ´te Ã  cÃ´te
  - [x] QR **1 â€” Wiâ€‘Fi** : payload connexion native (`WIFI:S:<ssid>;T:<WPA|WEP|>;P:<password>;;` ou doc Ã©quivalente) â€” **hors runtime Ma table**
  - [x] QR **2 â€” Ma table** : URL absolue `https://<host>/t/<tableId>` alignÃ©e story 1.2 (AD-9)
  - [x] Interdiction explicite : un seul QR qui combine Wiâ€‘Fi + URL / captive portal
  - [x] LibellÃ©s FR : Â« 1. Wiâ€‘Fi Â», Â« 2. Ma table Â» ; grands numÃ©ros lisibles Ã  distance table
  - [x] Contraste fort encre / fond ; pont couleur Â« Ma table Â» avec `{colors.accent}` (#E8C200) sans compromettre le scan QR (zone QR reste noir/blanc fort)
  - [x] Note matÃ©riau : support durable usure de table (plastification / PVC / chevalet â€” choix documentÃ©, pas code)
  - [x] Pas de 3áµ‰ QR ; pas de long texte pÃ©dagogique sur la carte

- [x] T2. Assets gÃ©nÃ©rables (AC: #1)
  - [x] Script ou procÃ©dure sous `docs/print/` **ou** assets sous `public/print/` :
    - Exemples PNG/SVG pour tables seed (ex. `t-1` â€¦) : QR Ma table
    - Exemple QR Wiâ€‘Fi avec SSID/mot de passe **placeholder** documentÃ©s (ne pas committer de secrets prod)
  - [x] README : comment rÃ©gÃ©nÃ©rer (outil CLI `qrcode`, `uqr`, etc.) + variables `BASE_URL`, `WIFI_SSID`, `WIFI_PASSWORD`
  - [x] Template mise en page (HTML print / PDF / Figma-export notes) montrant 1 | 2 cÃ´te Ã  cÃ´te

- [x] T3. Lien produit (AC: #1, #3)
  - [x] RÃ©fÃ©rencer lâ€™URL entry 1.2 ; confirmer quâ€™aucune route app ne sert de captive Wiâ€‘Fi
  - [x] Checklist QA print : scan Wiâ€‘Fi â†’ OS native ; scan Ma table â†’ Accueil session

- [x] T4. Garde-fous
  - [x] **Pas** une feature app runtime (pas de page `/print` mÃ©tier obligatoire)
  - [x] Pas de fusion des deux QR
  - [x] Pas dâ€™Auth / Prisma nouveaux modÃ¨les pour le print

## Dev Notes

### Nature du livrable

Story **print / spec / assets** (FR1 / UX Carte table). Ce nâ€™est **pas** une feature applicative complÃ¨te. Sortie attendue = documentation + fichiers gÃ©nÃ©rables pour impression atelier.

### DÃ©pendance

- **1.2** : format dâ€™URL `tableId` doit Ãªtre connu (`/t/[tableId]`). Si 1.2 change le path, mettre Ã  jour la spec.
- Scaffold 1.1 / Accueil 1.3 utiles pour QA scan Ma table mais non bloquants pour rÃ©diger la spec.

### Architecture

- **AD-9** : QR Ma table = `tableId` ; Wiâ€‘Fi hors produit logiciel.
- **AD-5** : le print ne pose pas de cookie â€” le scan Ma table dÃ©clenche 1.2.
- Aucun AD monolithe Ã  violer : pas de code BO/client requis au-delÃ  dâ€™Ã©ventuels assets statiques `public/print/`.

### Contenu minimal de `docs/print/carte-table.md`

1. Objectif & non-goals (pas de QR combinÃ©, pas de captive)
2. Layout (schÃ©ma ASCII ou figure) : numÃ©ro + libellÃ© + QR Ã—2
3. Spec technique payloads Wiâ€‘Fi vs URL
4. Spec visuelle : numÃ©ros, contraste, accent Ma table, quiet zone QR
5. MatÃ©riau & formats dâ€™impression (ex. 10Ã—15 cm â€” ajuster si dÃ©cidÃ©)
6. ProcÃ©dure gÃ©nÃ©ration + exemples tables
7. Checklist validation scan terrain

### Fichiers Ã  crÃ©er / modifier

| Path | Action |
| --- | --- |
| `docs/print/carte-table.md` | NEW â€” spec FR complÃ¨te |
| `docs/print/README.md` | NEW â€” regen assets |
| `docs/print/generate-qr.mjs` (ou `.ts` / `.ps1`) | NEW optionnel â€” gÃ©nÃ©rateur |
| `public/print/examples/t-1-ma-table.svg` (etc.) | NEW â€” exemples |
| `public/print/examples/wifi-placeholder.svg` | NEW â€” exemple Wiâ€‘Fi factice |
| `docs/print/layout-carte-table.html` | NEW optionnel â€” preview print CSS |

### Hors scope

- Portail captif, provisioning Wiâ€‘Fi automatique depuis lâ€™app
- Impression industrielle / commande fournisseur
- Features app Accueil / session (dÃ©jÃ  1.2â€“1.5)
- Secrets Wiâ€‘Fi production dans le repo

### Testing

- GÃ©nÃ©rer 2 QR â†’ scanner avec tÃ©lÃ©phone : Wiâ€‘Fi propose rÃ©seau ; Ma table ouvre URL table
- Relecture spec : aucun schÃ©ma Â« QR unique combo Â»
- Contraste / taille numÃ©ros validÃ©s sur rendu print preview (pas besoin e2e Next)

### References

- [Source: `epics.md` â€” Story 1.6, FR1]
- [Source: `prd.md` â€” FR-1 dualitÃ© Wiâ€‘Fi / Ma table, Â§12 print]
- [Source: `EXPERIENCE.md` â€” section Carte table (Print), Anti-patterns QR combinÃ©]
- [Source: `ARCHITECTURE-SPINE.md` â€” AD-9]
- [Source: story 1.2 â€” URL `/t/[tableId]`]

## Dev Agent Record

### Agent Model Used

Composer (Cursor Agent)

### Debug Log References

- `npm run print:qr` â†’ SVG Wiâ€‘Fi placeholder + `t-1`â€¦`t-5` Ma table
- Aucune route captive / payload `WIFI:` dans `app/`

### Completion Notes List

- Spec FR complÃ¨te `docs/print/carte-table.md` (dualitÃ©, payloads, contraste, matÃ©riau)
- GÃ©nÃ©rateur `docs/print/generate-qr.mjs` + `npm run print:qr`
- Preview HTML print `docs/print/layout-carte-table.html`
- Assets exemples sous `public/print/examples/` (secrets Wiâ€‘Fi = placeholders)

### Change Log

- 2026-07-24 â€” Story 1.6 kit Carte table print â†’ status `review`

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
