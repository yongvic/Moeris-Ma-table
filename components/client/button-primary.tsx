import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type ButtonPrimaryProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Trailing icon in a nested circle. Defaults to an arrow; set null to hide. */
  icon?: ReactNode | null;
  full?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

/**
 * Primary CTA — golden accent, ink text (never white, a11y), pill, golden glow.
 * Signature "button-in-button" trailing icon. One per screen.
 */
export function ButtonPrimary({
  href,
  children,
  className = "",
  icon,
  full = false,
  ...rest
}: ButtonPrimaryProps) {
  const trailing =
    icon === null ? null : (icon ?? <ArrowRight size={16} weight="bold" />);

  return (
    <Link
      href={href}
      className={`group inline-flex min-h-tap-min items-center justify-center gap-3 rounded-full bg-accent pl-6 ${
        trailing ? "pr-2" : "pr-6"
      } text-[16px] font-bold leading-5 text-ink-onaccent shadow-glow transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent-deep hover:shadow-lift active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
        full ? "w-full" : "w-full sm:w-auto"
      } ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {trailing ? (
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-full bg-surface-base/45 text-ink-onaccent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
        >
          {trailing}
        </span>
      ) : null}
    </Link>
  );
}
