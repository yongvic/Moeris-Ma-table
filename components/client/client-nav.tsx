"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForkKnife, Star } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { MoerisMark } from "@/components/ui/moeris-mark";

type NavItem = { href: string; label: string; icon: Icon };

/** Navigation principale client : La carte en premier, puis Avis. */
const ITEMS: NavItem[] = [
  { href: "/menu", label: "La carte", icon: ForkKnife },
  { href: "/avis", label: "Avis", icon: Star },
];

export function ClientNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-[var(--z-nav)] border-b border-border/70 bg-surface-base/90 shadow-soft backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-margin-mobile py-2.5 sm:py-3 md:px-7">
        <MoerisMark href="/menu" />

        <nav aria-label="Navigation principale" className="flex items-center gap-1.5 sm:gap-2">
          {ITEMS.map(({ href, label, icon: IconCmp }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-all duration-300 sm:px-4 sm:text-[14px] ${
                  active
                    ? "bg-accent text-ink-onaccent shadow-sm"
                    : "bg-surface-raised/70 text-ink-secondary hover:bg-surface-raised hover:text-ink-primary"
                }`}
              >
                <IconCmp size={18} weight={active ? "fill" : "bold"} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
