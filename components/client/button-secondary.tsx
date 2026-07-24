import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonSecondaryProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

/**
 * Secondary CTA — surface-raised, border, soft elevation ; never equal weight to primary.
 */
export function ButtonSecondary({
  href,
  children,
  className = "",
  ...rest
}: ButtonSecondaryProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-tap-min w-full items-center justify-center rounded-full border border-border bg-surface-raised px-6 text-base leading-5 font-bold text-ink-primary shadow-soft transition-[transform,opacity] duration-200 hover:opacity-95 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring sm:w-auto sm:min-w-[200px] ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
