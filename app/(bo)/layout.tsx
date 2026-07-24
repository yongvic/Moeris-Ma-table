import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/infra/auth/auth";

const TABS = [
  { href: "/bo/menu", label: "Menu" },
  { href: "/bo/commandes", label: "Commandes" },
  { href: "/bo/service", label: "Service" },
] as const;

export default async function BoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Connexion page uses its own layout branch via pathname check in page;
  // gate everything except when no user — pages under /bo/connexion skip via nested layout.

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-base">
      {session?.user ? (
        <header className="border-b border-border bg-surface-raised/40">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-margin-mobile py-4 md:px-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
                  Espace équipe
                </p>
                <p className="text-sm text-ink-secondary">{session.user.email}</p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/bo/connexion" });
                }}
              >
                <button
                  type="submit"
                  className="min-h-tap-min rounded-md border border-border px-4 text-sm font-bold text-ink-primary"
                >
                  Se déconnecter
                </button>
              </form>
            </div>
            <nav className="flex gap-2" aria-label="Zones back-office">
              {TABS.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="inline-flex min-h-tap-min items-center rounded-md bg-accent-soft px-4 text-base font-bold text-ink-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
      ) : null}
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}

/** Helper used by protected pages. */
export async function requireBoPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/bo/connexion");
  }
  return session;
}
