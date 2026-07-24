# Story 5.2: Reconnaissance par ressaisie de contact

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a cliente de retour sans cookie,
I want ressaisir mon téléphone ou email pour retrouver ma Mémoire,
so that je ne dépende pas uniquement de l’appareil.

## Acceptance Criteria

1. **Given** j’ai déjà laissé un contact opt-in auparavant (Guest existant)  
   **When** je ressaisis le **même** tél ou email (normalisé **E.164** / **email lower**)  
   **Then** la **Mémoire** du Guest est débloquée sur l’Accueil (même `bloc-memoire` que 5.1)

2. **Given** un contact **inconnu** ou une faute de frappe  
   **When** je valide la ressaisie  
   **Then** un message **clair non culpabilisant** s’affiche  
   **And** le parcours **anonyme** reste **immédiatement** disponible (pas de blocage, pas de retry obligatoire)

3. **Given** le flux de ressaisie  
   **When** l’UI est présentée  
   **Then** **aucun mot de passe** n’est demandé  
   **And** le sélecteur suit le pattern XOR tél/email (réutiliser `selecteur-contact` ou variante « Me reconnaître »)

4. **Given** une ressaisie réussie  
   **When** le Guest est lié à la Session / device  
   **Then** upsert/liaison passe par **`domain/guest`** (AD-19)  
   **And** lookup = **Neon only** (pas Google Sheet) (AD-8)  
   **And** optionnel : (re)poser soft cookie device pour visites suivantes (5.1)

## Tasks / Subtasks

- [ ] T1. Action `recognizeByContact` (AC: #1, #2, #4)
  - [ ] Server Action `domain/guest` : normalize → find Guest → link Session + soft device
  - [ ] Unknown : `{ ok: false, code: 'GUEST_NOT_FOUND', message }` FR non blâmant
  - [ ] Pas d’Auth.js ; pas de password hash

- [ ] T2. UI ressaisie Accueil / entrée Mémoire (AC: #2, #3)
  - [ ] Entrée discrète si pas de soft recognition (« Déjà venu·e ? » / « Retrouver ma mémoire »)
  - [ ] XOR tél|email ; un champ ; validation locale légère
  - [ ] Succès → afficher `bloc-memoire` (prefs via même API 5.1)
  - [ ] Échec → message doux + CTA anonyme (« Continuer sans mémoire »)
  - [ ] État UX-DR10 « contact inconnu 2ᵉ visite » couvert

- [ ] T3. Normalisation alignée 4.4 (AC: #1)
  - [ ] **Même** helpers E.164 / email lower que opt-in — éviter faux négatifs
  - [ ] Tests croisés : opt-in puis ressaisie même valeur → hit

- [ ] T4. Garde-fous
  - [ ] Rate-limit soft optionnel (anti-énumération basique) sans friction UX forte
  - [ ] Pas de PII dans logs
  - [ ] Pas de création Guest « fantôme » sur unknown (unknown = no insert)

## Dev Notes

### Contexte epic

Complément de **5.1** (soft). PRD FR-17. Cas limite EXPERIENCE Flow 2 : unknown → message clair + anonyme.

### Architecture

| AD | Implication 5.2 |
| --- | --- |
| **AD-8** | Lookup Neon only |
| **AD-15** | Canal unique XOR |
| **AD-19** | Liaison via `domain/guest` uniquement |
| **AD-5** | Débloque Mémoire, pas reprise d’étape R2 |
| **AD-6** | Pas de login client |

### Copy échec (guide)

- OK : « On ne retrouve pas ce contact — tu peux continuer sans mémoire. »
- Interdit : « Identifiants incorrects », « Unauthorized », blâme faute de frappe

### Dépendances

- **4.4** Guest créé à l’opt-in (chemin contact) — **requis** pour hit positif
- **5.1** `bloc-memoire` + Preference read (réutiliser)
- Soft cookie **non requis** pour cette story (c’est le fallback sans cookie)
- Fixtures Guest pour tests

### Hors scope

- Reset password / OTP / magic link
- Création de compte
- Self-service erasure (NFR6 manuel)
- Réapply goûts (5.3)

### Testing

- E2E léger : opt-in → clear cookies → ressaisie même tél → Mémoire
- Unknown email → message + Accueil anonyme utilisable
- Normalisation : `Email@X.com` = `email@x.com`
- Régression : soft 5.1 toujours prioritaire si cookie présent (pas forcer ressaisie)

### NFR6 soft

- Mettre à jour `lastInteractionAt` sur reconnaissance réussie (horloge conservation 24 mois)

### Project Structure Notes

```text
app/(client)/…                 # entrée ressaisie Accueil
domain/guest/recognizeByContact.ts
domain/guest/normalizeContact.ts  # partagé 4.4
components/…/selecteur-contact.tsx  # réemploi
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 5.2]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md` — AD-8, AD-19]
- [Source: `_bmad-output/planning-artifacts/prds/prd-moeris-2026-07-23/prd.md` — FR-17]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — Flow 2 cas limite]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-moeris-2026-07-23/EXPERIENCE.md` — UX-DR10 contact inconnu]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
