/**
 * Reserved path for Auth.js (next-auth) — Story 2.1+.
 * Do NOT wire Credentials / staff accounts in story 1.1.
 *
 * Catch-all keeps the `/api/auth/*` namespace reserved without installing next-auth.
 */

export async function GET() {
  return new Response("Auth.js route reserved — not configured yet.", {
    status: 501,
  });
}
