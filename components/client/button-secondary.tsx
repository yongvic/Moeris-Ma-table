import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type ButtonSecondaryProps = {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  full?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

/**
 * Secondary CTA — raised surface, hairline, soft depth. Never equal weight to primary.
 */
export function ButtonSecondary({
  href,
  children,
  className = "",
  icon,
  full = false,
  ...rest
}: ButtonSecondaryProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-tap-min items-center justify-center gap-2.5 rounded-full border border-border bg-surface-raised px-6 text-[16px] font-bold leading-5 text-ink-primary shadow-soft transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-border-strong hover:bg-surface-sunk active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
        full ? "w-full" : "w-full sm:w-auto"
      } ${className}`}
      {...rest}
    >
      {icon ? (
        <span aria-hidden className="text-ink-secondary">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </Link>
  );
}
