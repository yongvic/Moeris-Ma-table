import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/infra/prisma/client";

/**
 * Auth.js v5 — staff Credentials, JWT sessions (AD-6).
 * Cookie prefix distinct from client séjour `mt_session`.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const staff = await prisma.staff.findUnique({ where: { email } });
        if (!staff) return null;

        const ok = await bcrypt.compare(password, staff.passwordHash);
        if (!ok) return null;

        return {
          id: staff.id,
          email: staff.email,
          role: staff.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/bo/connexion",
  },
  cookies: {
    sessionToken: {
      name: "mt_staff.session-token",
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "salle";
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        (session.user as { role?: string }).role =
          (token.role as string) ?? "salle";
      }
      return session;
    },
  },
  trustHost: true,
});
