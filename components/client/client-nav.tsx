"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/menu", label: "Menu" },
  { href: "/service", label: "Service" },
] as const;

/**
 * Fil léger Menu | Service + Terminer conditionnel (AD-13).
 * `canFinish` vient du Server Component parent — gate évalué Neon-side.
 */
export function ClientNav({ canFinish = false }: { canFinish?: boolean }) {
  const pathname = usePathname();

  const allItems = [
    ...NAV_ITEMS,
    ...(canFinish
      ? [{ href: "/fin", label: "Terminer" } as const]
      : []),
  ];

  return (
    <>
      {/* Desktop / tablet top rail */}
      <header className="sticky top-0 z-40 hidden border-b border-border/80 bg-surface-base/95 px-margin-mobile py-3 backdrop-blur-sm sm:block md:px-7">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <Link
            href="/accueil"
            className="font-display text-[17px] leading-6 font-medium text-ink-primary"
          >
            Ma table
          </Link>
          <nav aria-label="Fil séjour" className="flex items-center gap-1">
            {allItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex min-h-tap-min min-w-tap-min items-center justify-center rounded-full px-4 text-base font-bold transition-colors ${
                    active
                      ? "bg-accent-soft text-ink-primary"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Phone bottom bar */}
      <nav
        aria-label="Fil séjour"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-base/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-sm sm:hidden"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-around">
          {allItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`flex min-h-tap-min flex-col items-center justify-center gap-0.5 rounded-md text-sm font-bold ${
                    active ? "text-ink-primary" : "text-ink-secondary"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={`h-1 w-8 rounded-full ${
                      active ? "bg-accent" : "bg-transparent"
                    }`}
                    aria-hidden
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
