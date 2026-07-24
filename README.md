# Moeris-Ma-table

Application web **Ma table** (Résidence Moeris) — monolithe Next.js (App Router) : parcours client QR + back-office salle.

## Stack

- Next.js 16.2 · React 19 · TypeScript · Tailwind 4
- Prisma 7.9 + Neon (session table)

## Démarrage

```bash
npm install
cp .env.example .env   # renseigner DATABASE_URL + DIRECT_URL (Neon)
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Entrée QR démo : `/t/t-1`.
