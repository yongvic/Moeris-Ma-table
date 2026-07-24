"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ForkKnife,
  HandWaving,
  Confetti,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { MoerisMark } from "@/components/ui/moeris-mark";

type NavItem = { href: string; label: string; icon: Icon };

const BASE_ITEMS: NavItem[] = [
  { href: "/menu", label: "La carte", icon: ForkKnife },
  { href: "/service", label: "Service", icon: HandWaving },
];

/**
 * Fil léger Menu | Service (+ Terminer conditionnel, AD-13).
 * Desktop: rail supérieur discret. Mobile: île flottante en bas.
 */
export function ClientNav({ canFinish = false }: { canFinish?: boolean }) {
  const pathname = usePathname();

  const items: NavItem[] = [
    ...BASE_ITEMS,
    ...(canFinish
      ? [{ href: "/fin", label: "Terminer", icon: Confetti } as NavItem]
      : []),
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Desktop / tablet top rail */}
      <header className="sticky top-0 z-[var(--z-nav)] hidden border-b border-border/70 bg-surface-base/85 backdrop-blur-md sm:block">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-margin-mobile py-3 md:px-7">
          <MoerisMark />
          <nav aria-label="Fil séjour" className="flex items-center gap-1">
            {items.map(({ href, label, icon: IconCmp }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-tap-min items-center gap-2 rounded-full px-4 text-[15px] font-bold transition-colors duration-300 ${
                    active
                      ? "bg-accent-soft text-ink-primary"
                      : "text-ink-secondary hover:bg-surface-raised hover:text-ink-primary"
                  }`}
                >
                  <IconCmp size={19} weight={active ? "fill" : "regular"} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Phone floating island */}
      <nav
        aria-label="Fil séjour"
        className="fixed inset-x-0 bottom-0 z-[var(--z-nav)] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden"
      >
        <ul className="mx-auto flex max-w-sm items-stretch justify-around gap-1 rounded-full border border-border/70 bg-surface-base/90 p-1.5 shadow-lift backdrop-blur-xl">
          {items.map(({ href, label, icon: IconCmp }) => {
            const active = isActive(href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-tap-min flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[11px] font-bold transition-colors duration-300 ${
                    active
                      ? "bg-accent text-ink-onaccent"
                      : "text-ink-secondary"
                  }`}
                >
                  <IconCmp size={22} weight={active ? "fill" : "regular"} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
