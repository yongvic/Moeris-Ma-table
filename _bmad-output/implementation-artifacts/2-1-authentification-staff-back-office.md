# Story 2.1: Authentification staff Back-office

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a membre de l’équipe salle,
I want m’authentifier pour accéder au Back-office,
so that seuls les comptes staff provisionnés peuvent gérer menu, commandes et service.

## Acceptance Criteria

1. **Given** un compte staff provisionné (Credentials Auth.js, session JWT)  
   **When** je me connecte avec email + mot de passe valides  
   **Then** j’accède au shell BO (onglets **Menu | Commandes | Service** — Commandes/Service peuvent être stubs)

2. **Given** des identifiants invalides ou un visiteur non authentifié  
   **When** j’essaie d’ouvrir une route BO protégée  
   **Then** je suis renvoyé vers **BO Connexion** et aucune mutation menu n’est possible

3. **And** les surfaces client ne permettent pas d’éditer le menu

4. **And** pas d’inscription publique staff (comptes provisionnés uniquement)

## Tasks / Subtasks

- [ ] T1. Installer & configurer Auth.js pin spine (AC: #1, #4)
  - [ ] Ajouter `next-auth@5.0.0-beta.32` (pas une autre beta, pas v4)
  - [ ] Créer `infra/auth/` (ou `auth.ts` racine + `infra/auth/config`) : `NextAuth({ providers: [Credentials], session: { strategy: "jwt" } })`
  - [ ] Exposer `handlers`, `auth`, `signIn`, `signOut` ; brancher `app/api/auth/[...nextauth]/route.ts`
  - [ ] Env : `AUTH_SECRET` (obligatoire) ; ne jamais committer le secret
  - [ ] **Interdit** : `session.strategy: "database"` avec Credentials ; OAuth / self-signup public ; adapter Prisma Auth tables sauf besoin explicite hors V1

- [ ] T2. Modèle Staff + provisionnement (AC: #1, #4)
  - [ ] Prisma 7.9.0 + Neon (`@prisma/adapter-neon@7.9.0`, `@neondatabase/serverless@1.1.0`) si pas déjà posé par Epic 1
  - [ ] Modèle `Staff` : `id`, `email` (unique, lower), `passwordHash`, `role` plat `"salle"`, timestamps
  - [ ] Hash mot de passe via `bcrypt` / `bcryptjs` (ou argon2) — jamais plain text
  - [ ] Script seed / doc ops : créer ≥1 compte staff provisionné (pas de route `/register` publique)
  - [ ] `authorize` : lookup email normalisé + compare hash → return `{ id, email, role }` ou `null`

- [ ] T3. UI BO Connexion + shell onglets (AC: #1, #2)
  - [ ] Page `app/(bo)/connexion` (ou `/bo/login`) — copy FR (« Connexion », pas « Login »)
  - [ ] Formulaire email + mot de passe ; erreurs FR claires (identifiants invalides) sans leak user enumeration excessif
  - [ ] Layout `(bo)` : shell onglets **Menu | Commandes | Service** (UX-DR8 / AD-17)
  - [ ] Onglet Menu : stub « bientôt » OK si 2.2 pas encore livrée ; Commandes/Service : stubs OK
  - [ ] Cookie Auth.js staff **préfixe distinct** du cookie Session client (conventions spine)

- [ ] T4. Protection des routes & mutations (AC: #2, #3)
  - [ ] Middleware ou check `auth()` sur toutes les routes `(bo)` sauf Connexion
  - [ ] Vérifier `!!session?.user` (ou `req.auth?.user`) — **jamais** `!!auth` seul (fail-open pré-beta.32 ; pin beta.32 + check user)
  - [ ] Server Actions menu (futures / stubs) : refuse si pas staff ; `(client)` n’importe **jamais** mutateurs menu (AD-2, AD-3)
  - [ ] Smoke : ouvrir route client → aucune UI d’édition menu

- [ ] T5. Garde-fous anti-scope
  - [ ] Pas de CRUD MenuItem réel (→ 2.2)
  - [ ] Pas de Pusher / placeOrder / ServiceRequest
  - [ ] Pas de signup / reset password public / rôles fins cuisine vs salle

## Dev Notes

### Contexte epic

Epic 2 = Menu vivant (salle + client). **2.1 = porte d’entrée auth BO** (FR20 / CAP-10). 2.2 écrit le catalogue ; 2.3 lit côté client. Dépendances soft : scaffold 1.1 + Neon/Prisma si Session déjà posée en 1.2 — sinon initialiser Prisma/Neon ici pour `Staff` uniquement.

### Architecture — AD obligatoires

- **AD-6** : Client jamais authentifié. BO = Auth.js Credentials email+password, `session.strategy: "jwt"`. Comptes **provisionnés**. Rôle plat V1 « salle ».
- **AD-1 / AD-2** : monolithe ; `(client)` → `domain` → `infra` ; `(client)` n’importe jamais `(bo)`.
- **AD-4** : `/api` réservé Auth.js (+ webhooks) ; mutations métier = Server Actions `domain/` (menu en 2.2).
- **AD-17** : un shell BO à 3 zones Menu | Commandes | Service.

### Stack pins (obligatoire)

| Package | Version |
| --- | --- |
| `next-auth` (Auth.js) | **5.0.0-beta.32** |
| Prisma / `@prisma/client` | **7.9.0** |
| `@prisma/adapter-neon` | **7.9.0** |
| `@neondatabase/serverless` | **1.1.0** |
| Next.js | 16.2.11 (posé en 1.1) |

### Chemins cibles (NEW / UPDATE)

```text
infra/auth/auth.ts          # NextAuth export — NEW
infra/auth/credentials.ts   # authorize Staff — NEW
app/api/auth/[...nextauth]/route.ts  # handlers — UPDATE depuis stub 1.1
app/(bo)/layout.tsx         # shell + gate auth — UPDATE
app/(bo)/connexion/page.tsx # BO Connexion — NEW
app/(bo)/menu/page.tsx      # stub onglet — NEW
app/(bo)/commandes/page.tsx # stub — NEW
app/(bo)/service/page.tsx   # stub — NEW
prisma/schema.prisma        # model Staff — UPDATE
domain/staff/               # optionnel helpers — NEW
```

### Auth.js — pièges à éviter

1. Credentials **exige** JWT — ne pas activer strategy database.
2. Pin **beta.32** (correctif fail-open `!!auth`).
3. Checks : `session?.user` / `req.auth?.user`, pas existence nue de `auth`.
4. Runtime **Node** pour Prisma dans `authorize` (pas Edge middleware qui touche Neon sans split config).
5. Séparer cookie session séjour client (AD-5) vs session Auth.js staff.

### Copy UI FR

- Titre : « Connexion » / « Espace équipe »
- CTA : « Se connecter » (pas Submit/Login)
- Erreur : « Email ou mot de passe incorrect. »
- Shell : libellés onglets « Menu », « Commandes », « Service »

### Hors scope strict

- CRUD plats / Blob / revalidate menu
- Pusher, Orders, ServiceRequests
- Inscription publique, OAuth Google, 2FA, reset password self-service
- Rôles cuisine séparés, vue mobile BO dédiée

### Testing

- Connexion valide → shell 3 onglets visibles
- Identifiants invalides → reste/retour Connexion, message FR
- Accès direct `/bo/menu` sans session → redirect Connexion
- Surface client : aucune édition menu
- Aucune route publique de création Staff
- `next build` OK ; Auth sans `AUTH_SECRET` doit échouer clairement en deploy

### NFR soft

- NFR4 sécurité BO : auth obligatoire ; pas d’édition menu client
- NFR1 : page Connexion légère (&lt; ~3 s)
- Cookies Auth distincts ; pas de PII inutile dans logs

### Project Structure Notes

- Greenfield progressif : 1.1 a réservé `app/api/auth/[...nextauth]` — **brancher** ici, ne pas inventer un second handler
- Si Epic 1 Session cookie déjà présent : ne pas le réutiliser pour le staff

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Story 2.1]
- [Source: `ARCHITECTURE-SPINE.md` — AD-6, AD-2, AD-4, AD-17, Stack]
- [Source: `EXPERIENCE.md` — BO Connexion, shell onglets, état staff non auth]
- [Source: `SPEC.md` — CAP-10, Assumptions Auth]
- [Source: `epics.md` — FR20, NFR4]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
