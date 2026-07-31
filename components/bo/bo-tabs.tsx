"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ForkKnife,
  AddressBook,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

const TABS: { href: string; label: string; icon: Icon }[] = [
  { href: "/bo/avis", label: "Avis", icon: Star },
  { href: "/bo/contacts", label: "Contacts", icon: AddressBook },
  { href: "/bo/menu", label: "Menu", icon: ForkKnife },
];

export function BoTabs() {
  const pathname = usePathname();
  return (
    <nav
      className="flex gap-1 overflow-x-auto"
      aria-label="Zones back-office"
    >
      {TABS.map(({ href, label, icon: IconCmp }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-tap-min shrink-0 items-center gap-2 rounded-full px-4 text-[15px] font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
              active
                ? "bg-accent text-ink-onaccent shadow-soft"
                : "text-ink-secondary hover:bg-surface-raised hover:text-ink-primary"
            }`}
          >
            <IconCmp size={18} weight={active ? "fill" : "regular"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
