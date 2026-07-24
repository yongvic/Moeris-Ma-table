import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonPrimaryProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

/**
 * Primary CTA — accent bg, ink-primary text (never white), pill, min 44px.
 */
export function ButtonPrimary({
  href,
  children,
  className = "",
  ...rest
}: ButtonPrimaryProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-tap-min w-full items-center justify-center rounded-full bg-accent px-6 text-base leading-5 font-bold text-ink-primary transition-[transform,opacity] duration-200 hover:opacity-95 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring sm:w-auto sm:min-w-[200px] ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
