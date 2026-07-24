# Story 2.1: Authentification staff Back-office

Status: done
<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a membre de lâ€™Ã©quipe salle,
I want mâ€™authentifier pour accÃ©der au Back-office,
so that seuls les comptes staff provisionnÃ©s peuvent gÃ©rer menu, commandes et service.

## Acceptance Criteria

1. **Given** un compte staff provisionnÃ© (Credentials Auth.js, session JWT)  
   **When** je me connecte avec email + mot de passe valides  
   **Then** jâ€™accÃ¨de au shell BO (onglets **Menu | Commandes | Service** â€” Commandes/Service peuvent Ãªtre stubs)

2. **Given** des identifiants invalides ou un visiteur non authentifiÃ©  
   **When** jâ€™essaie dâ€™ouvrir une route BO protÃ©gÃ©e  
   **Then** je suis renvoyÃ© vers **BO Connexion** et aucune mutation menu nâ€™est possible

3. **And** les surfaces client ne permettent pas dâ€™Ã©diter le menu

4. **And** pas dâ€™inscription publique staff (comptes provisionnÃ©s uniquement)

## Tasks / Subtasks

- [ ] T1. Installer & configurer Auth.js pin spine (AC: #1, #4)
  - [ ] Ajouter `next-auth@5.0.0-beta.32` (pas une autre beta, pas v4)
  - [ ] CrÃ©er `infra/auth/` (ou `auth.ts` racine + `infra/auth/config`) : `NextAuth({ providers: [Credentials], session: { strategy: "jwt" } })`
  - [ ] Exposer `handlers`, `auth`, `signIn`, `signOut` ; brancher `app/api/auth/[...nextauth]/route.ts`
  - [ ] Env : `AUTH_SECRET` (obligatoire) ; ne jamais committer le secret
  - [ ] **Interdit** : `session.strategy: "database"` avec Credentials ; OAuth / self-signup public ; adapter Prisma Auth tables sauf besoin explicite hors V1

- [ ] T2. ModÃ¨le Staff + provisionnement (AC: #1, #4)
  - [ ] Prisma 7.9.0 + Neon (`@prisma/adapter-neon@7.9.0`, `@neondatabase/serverless@1.1.0`) si pas dÃ©jÃ  posÃ© par Epic 1
  - [ ] ModÃ¨le `Staff` : `id`, `email` (unique, lower), `passwordHash`, `role` plat `"salle"`, timestamps
  - [ ] Hash mot de passe via `bcrypt` / `bcryptjs` (ou argon2) â€” jamais plain text
  - [ ] Script seed / doc ops : crÃ©er â‰¥1 compte staff provisionnÃ© (pas de route `/register` publique)
  - [ ] `authorize` : lookup email normalisÃ© + compare hash â†’ return `{ id, email, role }` ou `null`

- [ ] T3. UI BO Connexion + shell onglets (AC: #1, #2)
  - [ ] Page `app/(bo)/connexion` (ou `/bo/login`) â€” copy FR (Â« Connexion Â», pas Â« Login Â»)
  - [ ] Formulaire email + mot de passe ; erreurs FR claires (identifiants invalides) sans leak user enumeration excessif
  - [ ] Layout `(bo)` : shell onglets **Menu | Commandes | Service** (UX-DR8 / AD-17)
  - [ ] Onglet Menu : stub Â« bientÃ´t Â» OK si 2.2 pas encore livrÃ©e ; Commandes/Service : stubs OK
  - [ ] Cookie Auth.js staff **prÃ©fixe distinct** du cookie Session client (conventions spine)

- [ ] T4. Protection des routes & mutations (AC: #2, #3)
  - [ ] Middleware ou check `auth()` sur toutes les routes `(bo)` sauf Connexion
  - [ ] VÃ©rifier `!!session?.user` (ou `req.auth?.user`) â€” **jamais** `!!auth` seul (fail-open prÃ©-beta.32 ; pin beta.32 + check user)
  - [ ] Server Actions menu (futures / stubs) : refuse si pas staff ; `(client)` nâ€™importe **jamais** mutateurs menu (AD-2, AD-3)
  - [ ] Smoke : ouvrir route client â†’ aucune UI dâ€™Ã©dition menu

- [ ] T5. Garde-fous anti-scope
  - [ ] Pas de CRUD MenuItem rÃ©el (â†’ 2.2)
  - [ ] Pas de Pusher / placeOrder / ServiceRequest
  - [ ] Pas de signup / reset password public / rÃ´les fins cuisine vs salle

## Dev Notes

### Contexte epic

Epic 2 = Menu vivant (salle + client). **2.1 = porte dâ€™entrÃ©e auth BO** (FR20 / CAP-10). 2.2 Ã©crit le catalogue ; 2.3 lit cÃ´tÃ© client. DÃ©pendances soft : scaffold 1.1 + Neon/Prisma si Session dÃ©jÃ  posÃ©e en 1.2 â€” sinon initialiser Prisma/Neon ici pour `Staff` uniquement.

### Architecture â€” AD obligatoires

- **AD-6** : Client jamais authentifiÃ©. BO = Auth.js Credentials email+password, `session.strategy: "jwt"`. Comptes **provisionnÃ©s**. RÃ´le plat V1 Â« salle Â».
- **AD-1 / AD-2** : monolithe ; `(client)` â†’ `domain` â†’ `infra` ; `(client)` nâ€™importe jamais `(bo)`.
- **AD-4** : `/api` rÃ©servÃ© Auth.js (+ webhooks) ; mutations mÃ©tier = Server Actions `domain/` (menu en 2.2).
- **AD-17** : un shell BO Ã  3 zones Menu | Commandes | Service.

### Stack pins (obligatoire)

| Package | Version |
| --- | --- |
| `next-auth` (Auth.js) | **5.0.0-beta.32** |
| Prisma / `@prisma/client` | **7.9.0** |
| `@prisma/adapter-neon` | **7.9.0** |
| `@neondatabase/serverless` | **1.1.0** |
| Next.js | 16.2.11 (posÃ© en 1.1) |

### Chemins cibles (NEW / UPDATE)

```text
infra/auth/auth.ts          # NextAuth export â€” NEW
infra/auth/credentials.ts   # authorize Staff â€” NEW
app/api/auth/[...nextauth]/route.ts  # handlers â€” UPDATE depuis stub 1.1
app/(bo)/layout.tsx         # shell + gate auth â€” UPDATE
app/(bo)/connexion/page.tsx # BO Connexion â€” NEW
app/(bo)/menu/page.tsx      # stub onglet â€” NEW
app/(bo)/commandes/page.tsx # stub â€” NEW
app/(bo)/service/page.tsx   # stub â€” NEW
prisma/schema.prisma        # model Staff â€” UPDATE
domain/staff/               # optionnel helpers â€” NEW
```

### Auth.js â€” piÃ¨ges Ã  Ã©viter

1. Credentials **exige** JWT â€” ne pas activer strategy database.
2. Pin **beta.32** (correctif fail-open `!!auth`).
3. Checks : `session?.user` / `req.auth?.user`, pas existence nue de `auth`.
4. Runtime **Node** pour Prisma dans `authorize` (pas Edge middleware qui touche Neon sans split config).
5. SÃ©parer cookie session sÃ©jour client (AD-5) vs session Auth.js staff.

### Copy UI FR

- Titre : Â« Connexion Â» / Â« Espace Ã©quipe Â»
- CTA : Â« Se connecter Â» (pas Submit/Login)
- Erreur : Â« Email ou mot de passe incorrect. Â»
- Shell : libellÃ©s onglets Â« Menu Â», Â« Commandes Â», Â« Service Â»

### Hors scope strict

- CRUD plats / Blob / revalidate menu
- Pusher, Orders, ServiceRequests
- Inscription publique, OAuth Google, 2FA, reset password self-service
- RÃ´les cuisine sÃ©parÃ©s, vue mobile BO dÃ©diÃ©e

### Testing

- Connexion valide â†’ shell 3 onglets visibles
- Identifiants invalides â†’ reste/retour Connexion, message FR
- AccÃ¨s direct `/bo/menu` sans session â†’ redirect Connexion
- Surface client : aucune Ã©dition menu
- Aucune route publique de crÃ©ation Staff
- `next build` OK ; Auth sans `AUTH_SECRET` doit Ã©chouer clairement en deploy

### NFR soft

- NFR4 sÃ©curitÃ© BO : auth obligatoire ; pas dâ€™Ã©dition menu client
- NFR1 : page Connexion lÃ©gÃ¨re (&lt; ~3 s)
- Cookies Auth distincts ; pas de PII inutile dans logs

### Project Structure Notes

- Greenfield progressif : 1.1 a rÃ©servÃ© `app/api/auth/[...nextauth]` â€” **brancher** ici, ne pas inventer un second handler
- Si Epic 1 Session cookie dÃ©jÃ  prÃ©sent : ne pas le rÃ©utiliser pour le staff

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` â€” Story 2.1]
- [Source: `ARCHITECTURE-SPINE.md` â€” AD-6, AD-2, AD-4, AD-17, Stack]
- [Source: `EXPERIENCE.md` â€” BO Connexion, shell onglets, Ã©tat staff non auth]
- [Source: `SPEC.md` â€” CAP-10, Assumptions Auth]
- [Source: `epics.md` â€” FR20, NFR4]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

Ultimate context engine analysis completed - comprehensive developer guide created

### File List
