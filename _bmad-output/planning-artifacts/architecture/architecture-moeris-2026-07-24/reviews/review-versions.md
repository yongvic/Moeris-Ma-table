---
title: "Review — versions & claims technologiques"
lens: outdated-or-unverified-tech
status: complete
created: 2026-07-24
checked_against: 'npm registry + docs Neon/Auth.js/Next (2026-07-24)'
spine: architecture-moeris-2026-07-24/ARCHITECTURE-SPINE.md
verdict: MOSTLY_CURRENT_WITH_GAPS
---

# Review — Versions & claims technologiques

## Verdict

**MOSTLY_CURRENT_WITH_GAPS** — les pins Next / Prisma / Neon serverless / Auth.js beta sont **vérifiés npm le 2026-07-24** et cohérents avec le memlog. En revanche : (1) le stack omet le package réellement recommandé pour Prisma 7 + Neon (`@prisma/adapter-neon`) et sur-promut `@neondatabase/serverless` en dépendance directe ; (2) AD-6 Credentials + adapter Prisma est **incomplet / risqué** sans `session.strategy: "jwt"` (Auth.js lève `UnsupportedStrategy` sinon) — le memlog affirmait même « database sessions », contredit par les docs ; (3) TypeScript « 5.x » et Blob/Pusher « pin at implement » laissent des zones non figées face à un registry qui a déjà bougé (TS **7.0.2** latest). Greenfield : **aucun `package.json` projet** pour reality-check local.

## Méthode

| Source | Usage |
| --- | --- |
| `npm view` (2026-07-24) | next, create-next-app, react, typescript, prisma, @prisma/client, @neondatabase/serverless, next-auth (+ dist-tags), @vercel/blob, pusher, pusher-js, tailwindcss, @prisma/adapter-neon, @auth/prisma-adapter, googleapis |
| Docs web | Neon Prisma guide, Auth.js Credentials / Errors / migrating-to-v5, create-next-app Next 16 defaults |
| Projet | Glob `**/package.json` → **0 fichier** (greenfield) |
| Memlog spine | Traçabilité des pins déjà « verified via npm view » |

## Matrice Stack (spine § Stack)

| Claim spine | npm / web 2026-07-24 | Statut |
| --- | --- | --- |
| Next.js / create-next-app **16.2.11** | `next@16.2.11`, `create-next-app@16.2.11` | **OK — vérifié** |
| React **19.x** (bundle Next 16) | `react@19.2.8` ; peer Next `^18.2 \|\| ^19` | **OK — vague mais exact** |
| TypeScript **5.x** (floor CNA) | `typescript@latest` = **7.0.2** ; dist-tag `beta` = 6.0.0-beta ; ligne 5.x encore publiée (ex. 5.9.3) | **FLAG — claim « 5.x » non revalidé vs defaults live CNA / latest** |
| Tailwind CSS **4.x** (default CNA) | `tailwindcss@4.3.3` ; docs CNA Next 16 : Tailwind default | **OK — bande 4.x correcte** |
| Prisma / `@prisma/client` **7.9.0** | `prisma@7.9.0`, `@prisma/client@7.9.0` | **OK — vérifié** |
| `@neondatabase/serverless` **1.1.0** | `1.1.0` current | **VERSION OK ; fit stack FLAG** (voir Finding 1) |
| Auth.js `next-auth` **5.0.0-beta.32** | dist-tag `beta` = `5.0.0-beta.32` ; `latest` = **4.24.15** (v4) | **OK pin beta ; risque produit** (toujours beta, pas stable) |
| Vercel Blob pin-at-implement | `@vercel/blob@2.6.1` existe | **Deferred volontaire — non piné** |
| Pusher `pusher` + `pusher-js` pin-at-implement | `pusher@5.3.4`, `pusher-js@8.6.0` | **Deferred volontaire — non piné** |
| Google Sheets API **v4** | API Sheets toujours v4 ; client npm `googleapis@173.0.0` | **OK claim API ; client npm non nommé** |
| Hosting Vercel | Toujours le default Next | **OK** |
| Neon « current serverless Postgres » | Produit actif ; guide Prisma à jour | **OK produit** |

### Defaults create-next-app (greenfield)

Claims spine alignés avec les defaults documentés Next 16 / CNA :

- App Router, TypeScript, Tailwind → **oui** (recommended defaults)
- Turbopack / ESLint / éventuel `AGENTS.md` / option `src/` → **non mentionnés** dans le Structural Seed (pas faux, incomplets)

Aucun scaffold généré dans le repo pour confirmer le `package.json` réel produit par `create-next-app@16.2.11` aujourd’hui.

## Findings

### F1 — HIGH — Stack Prisma↔Neon : package manquant, dépendance directe surévaluée

**Spine :** table Stack liste `Prisma 7.9.0` + `@neondatabase/serverless 1.1.0` ; convention « Prisma runtime Node (pas Edge) sauf adoption explicite adapter Neon ».

**Réalité (Neon docs, guide Prisma, 2026-07-24) :** le setup recommandé Prisma 7 + Neon installe **`@prisma/client` + `@prisma/adapter-neon`** (+ `prisma` CLI). Note officielle Neon :

> *Do not install `@neondatabase/serverless` or `ws` as separate packages. The `@prisma/adapter-neon` package bundles everything needed.*

De plus Prisma 7+ : pas de `url` dans `schema.prisma` → **`prisma.config.ts`** + `DIRECT_URL` pour le CLI. Le Structural Seed ne montre que `prisma/schema.prisma`.

**Impact :** un builder suivant la table Stack à la lettre rate le package pivot et peut installer une dépendance redondante / pattern obsolète. La mention « sauf adapter Neon » est trop soft pour un greenfield Prisma 7 sur Neon/Vercel.

**Recommandation :** ajouter `@prisma/adapter-neon` (pin npm current = **7.9.0** au check) au Stack ; rétrograder `@neondatabase/serverless` en note transitive ou le retirer ; documenter `prisma.config.ts` dans le seed.

### F2 — HIGH — AD-6 Auth.js Credentials + adapter Prisma sans stratégie JWT

**Spine AD-6 :** « BO via Auth.js Credentials … adapter Prisma ».

**Réalité Auth.js :** avec un adapter, la stratégie session défaut bascule en `"database"`. Or la présence d’un Credentials provider **exige** `"jwt"` — erreur documentée `UnsupportedStrategy` (*Credentials provider present but JWT strategy not enabled*).

**Memlog (non publié dans la spine mais source de la décision) :** « session strategy database » — **non confirmé / contredit** par Auth.js.

**Impact :** claim d’auth « ADOPTED » techniquement incorrecte si prise au pied de la lettre. Le package `@auth/prisma-adapter` (**2.11.3** current) n’apparaît pas non plus dans le Stack.

**Recommandation :** figer explicitement `session: { strategy: "jwt" }` + Credentials ; clarifier le rôle de l’adapter (comptes Staff / User tables vs sessions DB) ; ajouter `@auth/prisma-adapter` au Stack ; invalider l’assumption memlog « database sessions ».

### F3 — MEDIUM — TypeScript « 5.x » non reality-checké vs registry live

**Spine :** `TypeScript | 5.x (strict ; floor create-next-app)`.

**npm :** `latest` = **7.0.2**, `rc` = 7.0.1-rc, `beta` = 6.0.0-beta. La bande 5.x existe encore mais n’est plus le default global du langage.

Sans génération CNA dans le repo, on ne sait pas si le template 16.2.11 pin encore `typescript@5.x` ou a déjà sauté. Claim **non revalidée** contre un starter frais.

**Recommandation :** soit générer un scaffold jetable et figer la version exacte du `package.json` CNA, soit écrire `TypeScript (version shipped by create-next-app@16.2.11 — verify at scaffold)`.

### F4 — MEDIUM — Blob & Pusher laissés « pin at implement » alors que des versions stables existent

Intentional (Deferred + memlog), donc pas une erreur de pin — mais **non reality-checkées dans la spine** :

| Package | Current npm |
| --- | --- |
| `@vercel/blob` | 2.6.1 |
| `pusher` | 5.3.4 |
| `pusher-js` | 8.6.0 |

**Risque :** dérive silencieuse entre distill et implémentation ; pas de preuve d’incompatibilité Next 16 / React 19.

**Recommandation :** pin seed maintenant (au moins major.minor) ou noter « candidates : … » pour éviter une assertion vide.

### F5 — LOW — Auth.js v5 toujours sur tag `beta` ; `latest` npm = v4

Le pin `5.0.0-beta.32` est **correct pour la ligne v5** (dist-tag `beta`). Mais `npm view next-auth version` sans tag renvoie **4.24.15**. Un install naïf `npm i next-auth` rate la ligne décidée.

**Recommandation :** documenter explicitement `next-auth@beta` / pin exact `5.0.0-beta.32` dans les instructions d’implémentation.

### F6 — LOW — Claims starter / structure incomplets (pas faux)

- Defaults CNA (Turbopack, ESLint/Biome, `AGENTS.md`, option `src/`) non reflétés — OK pour une spine feature, mais **non croisés** avec un starter généré.
- Google Sheets « v4 » OK ; pas de client nommé (`googleapis` vs libs plus légères).
- React « via Next » OK ; peer Next accepte encore React 18 — le floor 19.x est un choix stack, pas une contrainte Next stricte.

## Ce qui est solide (pas de flag version)

- Monolithe Next App Router sur Vercel + Server Actions : fit greenfield 2026.
- Pusher Channels comme realtime managé (évite WS self-host Vercel) : toujours pertinent.
- Vercel Blob + `next/image` : stack toujours vivante.
- Neon pooled `DATABASE_URL` + `DIRECT_URL` : confirmé docs Neon/Prisma.
- Pas de microservices V1 : cohérent avec le paradigme.

## Synthèse actions

| Priorité | Action |
| --- | --- |
| P0 | Ajouter `@prisma/adapter-neon` ; corriger le rôle de `@neondatabase/serverless` ; seed `prisma.config.ts` |
| P0 | AD-6 : Credentials ⇒ `strategy: "jwt"` ; lister `@auth/prisma-adapter` ; corriger memlog database sessions |
| P1 | Reality-check TypeScript via scaffold CNA ou reformuler le claim |
| P1 | Pin candidats Blob / Pusher / pusher-js |
| P2 | Noter install `next-auth@5.0.0-beta.32` (pas `latest`) |

## Preuve npm (extrait, 2026-07-24)

```
next                    16.2.11
create-next-app         16.2.11
react                   19.2.8
typescript (latest)     7.0.2
tailwindcss             4.3.3
prisma / @prisma/client 7.9.0
@prisma/adapter-neon    7.9.0
@neondatabase/serverless 1.1.0
next-auth latest        4.24.15
next-auth beta          5.0.0-beta.32
@auth/prisma-adapter    2.11.3
@vercel/blob            2.6.1
pusher                  5.3.4
pusher-js               8.6.0
googleapis              173.0.0
```
