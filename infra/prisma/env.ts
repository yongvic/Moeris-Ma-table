/**
 * Validate Neon / Prisma env (AD-11).
 * DATABASE_URL = pooled (runtime + adapter Neon)
 * DIRECT_URL   = non-pooled (migrations)
 */

export type DbEnv = {
  databaseUrl: string;
  directUrl: string | undefined;
};

export function getDbEnv(): DbEnv {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL manquante. Copier .env.example → .env et renseigner l’URL Neon (pooled).",
    );
  }

  return {
    databaseUrl,
    directUrl: process.env.DIRECT_URL?.trim() || undefined,
  };
}
