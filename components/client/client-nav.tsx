"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForkKnife, Star } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { MoerisMark } from "@/components/ui/moeris-mark";

type NavItem = { href: string; label: string; icon: Icon };

const ITEMS: NavItem[] = [
  { href: "/menu", label: "La carte", icon: ForkKnife },
  { href: "/avis", label: "Avis", icon: Star },
];

export function ClientNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 inset-x-0 z-[var(--z-nav)] border-b border-border/70 bg-surface-base/95 shadow-soft backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Brand Lockup */}
        <div className="shrink-0">
          <MoerisMark href="/menu" />
        </div>

        {/* Segmented Pill Navigation */}
        <nav aria-label="Navigation principale" className="flex items-center">
          <div className="flex items-center rounded-full border border-border/80 bg-surface-raised/80 p-1 shadow-inner">
            {ITEMS.map(({ href, label, icon: IconCmp }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 sm:px-4 sm:py-1.5 sm:text-sm ${
                    active
                      ? "bg-accent text-ink-onaccent shadow-sm"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  <IconCmp size={16} weight={active ? "fill" : "bold"} className="shrink-0 sm:size-[18px]" />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
