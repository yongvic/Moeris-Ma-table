# Moeris — Ma table

Application web **Ma table** (Résidence Moeris) — monolithe Next.js : parcours client QR + back-office salle.

## Stack

- Next.js 16.2 · React 19 · TypeScript · Tailwind 4
- Prisma 7.9 + Neon · Auth.js 5 (staff JWT) · Vercel Blob / Pusher / Sheets (optionnels)

## Démarrage local

```bash
npm install
cp .env.example .env   # DATABASE_URL, DIRECT_URL, AUTH_SECRET
npx prisma migrate deploy
npm run db:seed
npm run dev
```

- Client démo : [http://localhost:3000/t/t-1](http://localhost:3000/t/t-1)
- BO : [http://localhost:3000/bo/connexion](http://localhost:3000/bo/connexion)

### Comptes seed (provisionnés)

| Variable | Défaut |
| --- | --- |
| `STAFF_EMAIL` | `salle@moeris.local` |
| `STAFF_PASSWORD` | `moeris-salle` |

Tables seed : `t-1` … `t-5`. Menu : 2 plats dispo + 1 indispo.

## Smoke test MVP

1. `/t/t-1` → Accueil → Voir le menu (barre → Menu)
2. Ouvrir un plat → goûts optionnels → **Commander** → `/commande` « C’est parti »
3. BO connecté → Commandes → avancer reçue → préparation → servie
4. Client `/service` → une tuile → BO Service → **Fait**
5. Nav **Terminer** → avis → merci (ton selon note) → contact XOR → accueil
6. Nouvelle soirée / soft cookie ou « Déjà venu·e ? » → préférés

## Variables d’environnement

| Clé | Requis | Rôle |
| --- | --- | --- |
| `DATABASE_URL` | oui | Neon pooled (runtime) |
| `DIRECT_URL` | oui | Neon direct (migrations) |
| `AUTH_SECRET` | oui | Auth.js staff |
| `STAFF_EMAIL` / `STAFF_PASSWORD` | seed | Compte salle |
| `BLOB_READ_WRITE_TOKEN` | non | Photos plats BO |
| `PUSHER_*` / `NEXT_PUBLIC_PUSHER_*` | non | Temps réel BO (sinon poll 12 s) |
| `GOOGLE_SHEETS_ID` | non | Miroir contact (stub log si absent) |
| `COOKIE_SECURE` | non | Force Secure cookie en local |

## Déploiement Vercel

1. Lier le repo GitHub ; framework **Next.js**.
2. Env prod (et preview) : `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (générer fort), optionnels Blob/Pusher.
3. **Build Command** : `npx prisma migrate deploy && next build` (ou `npm run build` si le script inclut migrate).
4. Seed **une seule fois** en ops (`npm run db:seed`) — ne pas re-seed automatique à chaque deploy.
5. **AD-11** : preview et prod partagent le même Neon — **jamais** `prisma migrate reset` sur cette base.
6. Après URL prod : régénérer les QR print (`PRINT_BASE_URL=https://ton-domaine npm run print:qr`) — voir `docs/print/README.md`.
7. Privacy ops : `docs/privacy-ops.md`.

## Scripts utiles

```bash
npm run build
npm run test
npm run db:migrate
npm run db:seed
npm run print:qr
```
