---
title: "Rubric walker — good-spine checklist"
status: complete
created: 2026-07-24
spine: architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md
altitude: feature
lint_spine: pass (0 findings)
verdict: FAIL
---

# Review rubric — Architecture Spine Ma table

## Verdict

**FAIL** — la spine est dense et largement utile (AD-1..17, seed, stack pinée, envelope ops partiellement couverte), mais elle rate le bar « good-spine » sur trois points load-bearing : (1) cycle de vie `ServiceRequest` silencieux, (2) un Deferred qui laisse encore diverger le plafond Mémoire/Préférés, (3) AD-14 dont la Rule n’enferme pas complètement le Prevents « free-text ».

Lint mécanique (`lint_spine.py`) : **PASS** (0 findings). Les fails ci-dessous sont sémantiques.

## Checklist (item par item)

| # | Critère | Résultat |
| --- | --- | --- |
| 1 | Fixes real divergence points for the level below and misses none | **FAIL** — miss ServiceRequest états ; FR-19 1-tap goûts non gouverné |
| 2 | Every AD’s Rule is enforceable and prevents its stated divergence | **FAIL** — AD-14 (et soft AD-16 SLA) |
| 3 | Nothing under Deferred could let two units diverge | **FAIL** — Prefs top 3–5 / pas de journal |
| 4 | Named tech is verified-current | **PASS** (avec note pins Blob/Pusher) |
| 5 | Ratifies rather than contradicts brownfield | **N/A** (greenfield) — PASS |
| 6 | If a spec drove it, covers that spec’s capabilities | **PARTIAL** — socle FR fort post AD-13..17 ; restes FR-13 shape / FR-19 |
| 7 | Every altitude dimension decided, deferred, or open question (esp. ops/env) | **FAIL** — ServiceRequest lifecycle silencieux ; Auth session strategy silencieuse |

---

## Findings

### CRITICAL / HIGH

#### H1 — Cycle de vie ServiceRequest ni décidé, ni Deferred, ni Open Question
- **Checklist:** 1, 7
- **Disposition:** autofix (AD) ou Open Question → Deferred avec revisit
- **Détail:** AD-12 fige `Order` (`received` → `preparing` → `served`). AD-14 fige seulement `ServiceRequest.type`. UX (EXPERIENCE BO Service) et PRD FR-11 exigent une file traitable (« marquable traité »). Deux epics peuvent diverger : bool `done`, enum `pending|done`, soft-delete, ou statut inventé. Dimension domaine réelle à altitude feature → stories ; absente de la spine.

#### H2 — Deferred « Prefs mémoire top 3–5 » laisse diverger le contrat données
- **Checklist:** 3 (aussi 6)
- **Disposition:** autofix — sortir le **plafond** / anti-journal en AD ou convention ; laisser l’algo exact en Deferred
- **Détail:** Ligne Deferred : « Prefs mémoire top 3–5 algorithme exact | Règle produit en epics ; Guest+Preference seed suffit ». L’algo peut attendre ; le **bound** (top 3–5, pas de journal complet — FR-18 / UX `bloc-memoire`) ne peut pas : deux unités peuvent stocker un historique unbounded vs un plafond. Violates « nothing under Deferred could let two units diverge ».

#### H3 — AD-14 : Rule n’enferme pas le Prevents « free-text »
- **Checklist:** 2
- **Disposition:** autofix — renforcer la Rule
- **Détail:** **Prevents** cite « chat libre / free-text service ». **Rule** verrouille l’enum de types + « pas de fil de discussion ». Un builder peut encore ajouter `note` / `body` libre sur `ServiceRequest` tout en respectant l’enum. La Rule doit explicitement interdire tout champ texte libre V1 (aligné UX `catalogue-service`).

### MEDIUM

#### M1 — FR-19 réappliquer goûts en 1 tap non gouverné
- **Checklist:** 1, 6
- **Disposition:** autofix (étendre AD-5/AD-16 ou AD Mémoire) ou Deferred explicite avec revisit
- **Détail:** Capability map nomme Mémoire / reconnaissance ; AD-16 snapshotte les goûts **à l’envoi** sur `Order`. Aucune règle sur la réapplication des prefs Guest → panier/commande en cours. Deux epics peuvent copier, linker, ou recalculer de façons incompatibles.

#### M2 — Stratégie session Auth.js (JWT vs database) silencieuse
- **Checklist:** 7
- **Disposition:** autofix (une ligne dans AD-6) — memlog a déjà tranché database
- **Détail:** Memlog : « Auth.js v5 Credentials + Prisma adapter ; session strategy database ». AD-6 ne le dit pas. Deux unités staff auth peuvent diverger (cookie JWT vs sessions DB). Ni Deferred ni Open Question.

#### M3 — Shape Avis (FR-13) sous-spécifié pour le domaine partagé
- **Checklist:** 6
- **Disposition:** discuss / companion domaine ou convention courte
- **Détail:** ER a `Review` ; pas de règle « étoiles obligatoires + emoji optionnel ; texte non requis ». Moins critique que ServiceRequest (moins de surfaces qui écrivent), mais le domaine partagé client/BO peut encore diverger sur le schéma. 3 tons merci chef correctement en Deferred (copy).

#### M4 — AD-16 fraîcheur « &lt; 1 min » faiblement enforceable
- **Checklist:** 2 (soft)
- **Disposition:** defer / sharpen — OK si on accepte revalidate/tag comme mécanisme unique
- **Détail:** Empêche bien le cache menu « immortal ». Le SLA &lt;1 min n’est pas mesurable depuis le Rule seul ; deux builders peuvent choisir des stratégies revalidate incompatibles tant que l’intention est respectée. Acceptable en soft si on considère le mécanisme nommé (revalidate/tag) comme le vrai invariant.

### LOW

#### L1 — Stack Blob / Pusher « pin at implement »
- **Checklist:** 4 (note)
- **Disposition:** ignore / Deferred déjà nommé — pin avant premier epic d’intégration
- **Détail:** Next 16.2.11, Prisma 7.9.0, `@neondatabase/serverless` 1.1.0, `next-auth@5.0.0-beta.32`, Tailwind 4.x, React 19.x : **vérifiés current** (npm 2026-07-24). Blob (`2.6.1`) et Pusher (`5.3.4` / `pusher-js@8.6.0`) existent mais non pinés dans la table ; Deferred le reconnaît. Pas un fail dur si le pin est obligatoire à l’implémentation.

#### L2 — Frontmatter `binds: FR-1..FR-20` encore un peu large
- **Checklist:** 6 (soft)
- **Disposition:** discuss — resserrer binds ou fermer M1/M3
- **Détail:** Post AD-13..17, la plupart des drops reconcile sont landés. Restent surtout FR-19, shape FR-13, et anti-feed FR-5 (plutôt UX/IA — hors divergence infra typique). Overclaim soft, pas contradiction.

#### L3 — Pas de section Open Questions
- **Checklist:** 7
- **Disposition:** autofix si des silences restent ; sinon OK
- **Détail:** Absence OK seulement si tout est décidé ou Deferred. Les silences H1/M2 font échouer le critère faute d’y figurer.

---

## Ce qui passe bien

- **Paradigme + AD-1..4** : monolithe, deps, ownership menu, Server Actions — divergence réelle et Rules claires.
- **AD-5 / 8 / 9 / 15** : session opaque, Neon→Sheet one-way, QR `tableId`, contact XOR + privacy min — corrects et enforceables.
- **AD-7 / 11 / 12 / 13 / 16 / 17** : Pusher BO, env unique, machine Order, gate Terminer, snapshot goûts + fraîcheur menu, shell BO multi-support — couvrent les gaps reconcile majeurs.
- **Consistency Conventions** : naming, erreurs Actions, cookies distincts, PII logs, Prisma Node — bons filets.
- **Envelope ops/env (partiel OK)** : Vercel, Neon unique, secrets env, pas de migrate reset, observabilité avancée Deferred — pas une dimension ops entièrement silencieuse.
- **Greenfield** : N/A brownfield — pas de contradiction code.
- **Tech pins principaux** : verified-current.

---

## Disposition summary

| ID | Severity | Action |
| --- | --- | --- |
| H1 | high | **autofix** — AD états ServiceRequest (`pending` → `done` ou équivalent) |
| H2 | high | **autofix** — plafond Préférés 3–5 / anti-journal en AD ou convention ; algo reste Deferred |
| H3 | high | **autofix** — AD-14 : interdire body/note free-text V1 |
| M1 | medium | **autofix** ou Deferred explicite — contrat 1-tap goûts Guest → commande |
| M2 | medium | **autofix** — AD-6 : session strategy database |
| M3 | medium | **discuss** — convention Review schema vs companion |
| M4 | medium | **defer** — accepter revalidate/tag comme invariant |
| L1–L3 | low | pin Blob/Pusher à l’impl ; resserrer binds ; ajouter OQ si silences |

**Gate recommendation:** ne pas finaliser (`status: final`) tant que H1–H3 ne sont pas résolus. M1–M2 fortement recommandés dans la même passe.
