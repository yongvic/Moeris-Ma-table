# infra/prisma/

PrismaClient singleton + Neon serverless adapter (Node only).

- `client.ts` — instance partagée
- `env.ts` — validation `DATABASE_URL` / `DIRECT_URL`

Ne pas importer depuis `app/(bo)` pour la session client (AD-2).
