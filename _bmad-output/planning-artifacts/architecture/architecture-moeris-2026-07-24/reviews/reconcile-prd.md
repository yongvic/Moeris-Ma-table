---
title: "Reconcile PRD ↔ Architecture Spine"
status: complete
created: 2026-07-24
sources:
  - prd-moeris-2026-07-23/prd.md
  - architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md
verdict: GAPS
---

# Reconcile — PRD Ma table vs Architecture Spine

## Verdict

**GAPS** — la spine couvre bien le socle technique (session, monolithe, menu BO, commandes, Pusher, contacts Neon→Sheet, auth staff, tableId QR), mais plusieurs exigences PRD (capabilités, NFR, privacy, ton) ne sont pas devenues des invariants / AD. Aucune contradiction dure AD↔PRD ; deux tensions soft.

## Couverture OK (rappel)

| Zone PRD | Couverture spine |
| --- | --- |
| FR-2/3/4 Session + reprise + TTL ~6 h | AD-5 |
| FR-6/7 Menu lecture client / écriture BO | AD-3, AD-10 |
| FR-8/10 Commande + statuts reçue→prep→servie | AD-4, AD-7, AD-12 |
| FR-9 Goûts (présence domaine) | Capability map `Commande + goûts` (sans règles métier) |
| FR-11 Service + notif BO | `domain/service` + AD-7 |
| FR-13/15 Avis + contact opt-in | `domain/review`, AD-8 |
| FR-16/17 Soft cookie + ressaisie | AD-5, AD-8 |
| FR-20 Auth staff, pas édition client | AD-6, AD-2, AD-3 |
| Non-goals paiement / multi-sites / PWA | Deferred |
| Platform web (pas app store) | Paradigm + stack Vercel |
| Contrainte QR Wi‑Fi hors captive | AD-9 (Wi‑Fi hors produit logiciel) |

## Quiet drops — capacités / FR

### FR-5 — Micro-missions à but unique / anti-feed
PRD interdit feed, écrans « pour toi », multi-parcours. Spine structure les routes client mais **aucun AD** n’interdit scroll engagement / surfaces hors but unique.

### FR-12 — CTA « Terminer mon expérience » après commande reçue
Glossaire + FR-12 : déclencheur **après** réception côté client ; pas au scan. Spine a la machine à états BO (AD-12) mais **pas de règle** liant visibilité du CTA fin à un statut observé client (`received` / feedback commande). Capability map : `Avis + merci chef` sans gate.

### FR-14 — Merci chef, ≥3 tons / scripts
Conséquences testables (3 tons, pas de jargon froid, 2D OK) **absentes** des AD. Seule mention soft dans la capability map.

### FR-18 / FR-19 — Préférés top 3–5 + goûts 1 tap
ER `Preference` + `domain/guest` existent ; **pas d’invariant** :
- plafond top 3–5 / pas de journal complet ;
- interdiction tracking table/heure/compagnie (aussi §11 privacy) ;
- réapplication goûts en un geste.

### FR-7 conséquence — propagation menu désactivé
Assumption PRD : quasi temps réel ou **&lt; 1 min**. AD-7 ne couvre que **commandes + Service** via Pusher ; fraîcheur catalogue client **non gouvernée**.

### FR-1 / §12 — Carte imprimée (physique)
AD-9 fixe `tableId` stable et Wi‑Fi hors produit. Contraintes print (contraste, numéros grands, usure, ordre 1/2) **non reprises** comme règles (acceptable hors logiciel, mais drop vs binds `FR-1..FR-20` si on lit la carte comme capacité produit).

## Quiet drops — NFR / platform / privacy / ton

### NFR Performance
PRD : premier écran utile **&lt; 3 s** (4G moyenne). Frontmatter spine `binds` cite « NFR performance… » mais **aucun AD** ni convention perf/budget data.

### NFR Accessibilité pragmatique
PRD : gros boutons, contraste, persona peu à l’aise. Idem : **binds sans AD**.

### NFR Disponibilité
Aligné en Deferred (« tient un service ») — OK, pas un drop silencieux.

### Platform
PRD §9 : **mobile web** via QR. Spine scope : « web **multi-support** ». Élargissement soft (tablette BO ?) sans contradiction dure, mais dérive de wording.

### Privacy §11
Landed partiel :
- Opt-in + Neon vérité + Sheet miroir : AD-8
- Pas PII contact en logs : Consistency Conventions
- Hash/chiffrement + conformité SN : Deferred (explicite)

**Non landed comme invariants :**
- Finalité annoncée (soirées Moeris / relation) — pas de revente ;
- Minimisation : pas de tracking intrusif table/heure/compagnie ;
- Droits accès/suppression (process manuel V1 documenté) — hors spine.

### Aesthetic & Tone §8
Chaleur tout au long du fil, tutoiement, bannir Submit/Login/Dashboard client, anti-patterns (murs de texte, pop-ups). **Hors altitude architecture** en pratique, mais binds UX via sources UX — **aucun AD de ton** (FR-14 lié).

### Success metrics / counter-metrics
SM-1..4 / SM-C1–C2 : non attendus en spine ; AD-7 cite SM-4 (fantômes). Counter-metrics anti-temps-passé / anti-écrans-avant-menu : **non liés** à FR-5 / design paradigm.

## Spine ADs vs PRD — contradictions

### Aucune contradiction dure
Les AD-1..12 n’inversent pas une conséquence testable FR ni un non-goal explicite (paiement, captive, compte client, multi-sites, PWA).

### Tensions soft (à trancher, pas des breaks)

1. **AD-6 — rôle plat « salle »** vs assumption FR-20 « rôles minimaux **admin/serveur** suffisent ». La spine aplati ; le Deferred « rôles BO fins » assume que la distinction n’est pas V1. Compatible si « salle » = un seul rôle opérationnel ; diverge si le PRD attend déjà deux rôles nommés.

2. **Scope spine « multi-support »** vs **§9 Platform mobile web**. Risque de scope creep desktop client ; à recentrer « mobile-first client + BO tablette/desktop ».

3. **AD-8 contact en clair staff-only** vs esprit privacy §11 — **pas une contradiction** : PRD laisse conformité/conservation en assumption ; spine Deferred le chiffrement. À garder visible pour le conseil SN.

## Overclaim frontmatter

`binds: ['FR-1..FR-20', … 'NFR performance/session/a11y/BO auth']` **sur-promet** : session + BO auth sont AD-5/AD-6 ; perf, a11y, FR-5/12/14/18/19 et privacy minimisation ne sont pas dans les 12 AD.

## Recommandations (hors livrable terse)

Si la spine doit vraiment « binder » le PRD lancement :
1. AD gate fin d’expérience (FR-12) + lecture statut client.
2. AD/convention NFR perf budget + a11y floor.
3. AD mémoire : prefs top 3–5, no tracking contexte table, 1-tap goûts.
4. Étendre AD-7 (ou AD menu) à la propagation dispo catalogue.
5. Companion ou AD produit-léger : 3 tons merci chef + contrainte anti-feed (FR-5/14/§8) — ou retirer ces FR des `binds` spine.
6. Invariant privacy minimisation + finalité (même une ligne).
7. Corriger wording scope → mobile web client ; clarifier AD-6 vs admin/serveur.

## Synthèse exécutive (≤8 bullets)

- **Verdict : GAPS**
- Drop NFR perf &lt;3s + a11y (binds orphelins)
- Drop FR-12 gate « Terminer » post-réception
- Drop FR-14 / §8 (3 tons, chaleur)
- Drop privacy minimisation + finalité + droits suppression
- Drop FR-18/19 règles mémoire ; FR-7 fraîcheur menu
- Pas de contradiction dure AD↔PRD
- Soft : AD-6 rôle plat vs admin/serveur ; « multi-support » vs mobile web
