import Image from "next/image";
import Link from "next/link";

/**
 * Brand lockup — emblem + "Ma table" wordmark with "Résidence Moeris" kicker.
 * Used in client nav and back-office header.
 */
export function MoerisMark({
  href = "/avis",
  compact = false,
}: {
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      aria-label="Résidence Moeris — avis"
    >
      <span className="relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-raised ring-1 ring-border shadow-soft">
        <Image
          src="/img/moeris-emblem.png"
          alt=""
          width={36}
          height={36}
          className="size-9 object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </span>
      {compact ? null : (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-semibold text-ink-primary">
            Ma table
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-secondary">
            Résidence Moeris
          </span>
        </span>
      )}
    </Link>
  );
}
