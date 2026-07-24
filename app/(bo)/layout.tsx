import { redirect } from "next/navigation";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { auth, signOut } from "@/infra/auth/auth";
import { MoerisMark } from "@/components/ui/moeris-mark";
import { BoTabs } from "@/components/bo/bo-tabs";

export default async function BoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-base">
      {session?.user ? (
        <header className="sticky top-0 z-[var(--z-nav)] border-b border-border/70 bg-surface-base/90 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-margin-mobile py-3 md:px-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MoerisMark href="/bo/menu" compact />
                <div className="hidden flex-col leading-none sm:flex">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-secondary">
                    Espace équipe
                  </span>
                  <span className="text-sm font-semibold text-ink-primary">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/bo/connexion" });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex min-h-tap-min items-center gap-2 rounded-full border border-border bg-surface-raised px-4 text-sm font-bold text-ink-primary shadow-soft transition-colors hover:bg-surface-sunk"
                >
                  <SignOut size={17} weight="bold" />
                  <span className="hidden sm:inline">Se déconnecter</span>
                </button>
              </form>
            </div>
            <BoTabs />
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
