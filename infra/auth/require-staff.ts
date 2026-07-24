import { auth } from "./auth";

/** Require authenticated staff for BO Server Actions / pages. */
export async function requireStaff() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, code: "UNAUTHORIZED", message: "Connexion staff requise." };
  }
  return { ok: true as const, session };
}
