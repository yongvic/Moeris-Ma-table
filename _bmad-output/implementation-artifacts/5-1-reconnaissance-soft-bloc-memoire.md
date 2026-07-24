# Story 5.1: Reconnaissance soft + bloc Mémoire

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a cliente de retour,
I want être reconnue sans mot de passe si mon appareil le permet,
so that je retrouve un accueil « Bon retour » avec mes préférés.

## Acceptance Criteria

1. **Given** un Guest déjà identifié lié à un cookie/appareil soft  
   **When** je scanne Ma table pour une **nouvelle soirée** (nouvelle Session)  
   **Then** l’Accueil propose la **Mémoire** sans login (bloc « Bon retour » + illustration dédiée `illustration-panel` moment bon retour)

2. **Given** la Mémoire affichée  
   **When** les Préférés sont listés  
   **Then** les Préférés courts **top 3–5** s’affichent en chips (`bloc-memoire`)  
   **And** **pas** de journal table/heure/compagnie

3. **Given** le bloc Mémoire  
   **When** je choisis d’ignorer  
   **Then** je peux rester en parcours **anonyme** immédiatement (CTA discret « Continuer sans ma mémoire » / équivalent)

4. **Given** un Guest avec historique (avis/commandes passés)  
   **When** les Préférés sont calculés/stockés  
   **Then** au plus **5** `Preference` sont exposées (**plafond AD-20** ; ranking simple V1 acceptable)

5. **Given** AD-5  
   **When** soft recognition s’applique  
   **Then** c’est **distinct** de la **reprise R2** (même soirée « Tu en étais à… ») : nouvelle Session = Mémoire Guest, **pas** restauration d’étape d’une ancienne soirée

## Tasks / Subtasks

- [ ] T1. Soft device link + résolution Guest (AC: #1, #5)
  - [ ] Cookie/token device soft (httpOnly, distinct du cookie Session séjour) posé à l’opt-in 4.4 ou à la liaison Guest
  - [ ] Au scan nouvelle Session : si soft token → resolve Guest via `domain/guest` ; **ne pas** confondre avec reprise étape R2 (`banniere-reprise`)
  - [ ] Pas de mot de passe ; client jamais Auth.js

- [ ] T2. Preference store + ranking (AC: #2, #4)
  - [ ] Modèle `Preference` lié Guest (max 5 exposés)
  - [ ] Ranking V1 simple documenté — ex. fréquence `MenuItem` dans OrderLines passées du Guest, tie-break récence ; **cap 5**
  - [ ] Job/lazy compute à la reconnaissance ou post-order (idempotent) ; Neon only (AD-8)

- [ ] T3. UI `bloc-memoire` sur Accueil (AC: #1, #2, #3)
  - [ ] Ton « Bon retour » ; illustration dédiée `alt=""` 
  - [ ] Chips Préférés 3–5 ; section-gap vs reste Accueil
  - [ ] Ignorer → hide mémoire pour la session / parcours anonyme
  - [ ] CTA principal Accueil reste « Voir le menu » si anonyme ; avec mémoire, Mémoire = bloc dédié **sans** transformer Accueil en dashboard 4 tuiles

- [ ] T4. Garde-fous
  - [ ] Pas de login client
  - [ ] Pas de lecture Sheet pour prefs
  - [ ] Ne pas muter Orders passées
  - [ ] Réapply goûts = Story **5.3** (peut afficher teaser CTA désactivé/stub si 5.3 pas prêt — préférer lien prêt si même sprint)

## Dev Notes

### Contexte epic

Epic 5 = UJ-2 Mémoire. Soft auto **et** ressaisie (5.2) sont complémentaires. Soft cookie **peut** être posé dès 4.4.

### Architecture

| AD | Implication 5.1 |
| --- | --- |
| **AD-5** | Session séjour ≠ Mémoire 2ᵉ visite ; cookie opaque session vs soft device → Guest |
| **AD-8** | Prefs / reconnaissance = **Neon only** |
| **AD-19** | Toute liaison Guest via `domain/guest` |
| **AD-20** | Top **3–5** Preference ; pas journal tracking |
| **AD-6** | Client anonyme — jamais credentials |

### Ranking V1 (figer en code + commentaire)

1. Compter occurrences MenuItem dans Orders historiques liées Guest (via sessions passées liées).
2. Trier desc fréquence, puis `updatedAt` desc.
3. Truncate à 5 ; UI affiche 3–5 selon dispo.

Si &lt;3 prefs : afficher ce qui existe (1–2 OK) ; si 0 : soft recognition sans chips (message doux) ou ne pas forcer le bloc.

### Dépendances

- **4.4** Guest + soft cookie (chemin contact)
- Soft cookie peut exister sans 5.2
- **Epic 3** Orders/goûts pour alimenter prefs
- **1.3** Accueil host du `bloc-memoire`
- **Distinct** 1.4 reprise R2
- **Fixtures** Guest+Preference recommandées pour dev isolé

### Hors scope

- Ressaisie contact UI (5.2)
- Réapply 1-tap goûts (5.3) — sauf stub CTA
- Avantages / fidélité / allergies
- Lien magique / PWA

### Testing

- Manuel : Guest+soft cookie → nouvelle Session → Bon retour + ≤5 chips ; ignorer → anonyme
- Manuel : sans soft → Accueil classique (pas de faux Bon retour)
- Unit : ranking cap 5 ; jamais &gt;5 exposés
- Régression : reprise R2 même soirée inchangée

### NFR soft

- NFR1 : Accueil léger (&lt;~3s)
- NFR6 : lastInteractionAt Guest mis à jour à la reconnaissance soft (conservation 24 mois)

### Project Structure Notes

```text
app/(client)/…/accueil          # bloc-memoire conditionnel
domain/guest/resolveSoft.ts
domain/guest/preferences.ts
components/…/bloc-memoire.tsx
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 5.1]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` — AD-5, AD-20]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` — FR-16, FR-18]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — bloc-memoire, Flow 2]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/DESIGN.md` — illustration-panel Bon retour]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
