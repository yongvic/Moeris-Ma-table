"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

type Props = {
  stepLabel: string;
  continueHref: string;
};

function BanniereRepriseInner({ stepLabel, continueHref }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const fromQuery = searchParams.get("reprise") === "1";
  const [dismissed, setDismissed] = useState(false);
  const visible = fromQuery && !dismissed;

  const clearQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("reprise");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (fromQuery) {
      // Keep banner visible; strip query on dismiss only so refresh of clean URL stays quiet
    }
  }, [fromQuery]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="border-b border-border bg-accent-soft px-margin-mobile py-3 md:px-7"
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-5 text-ink-primary">
          Tu en étais à <span className="font-semibold">{stepLabel}</span>.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={continueHref}
            className="inline-flex min-h-tap-min items-center justify-center rounded-md bg-accent px-4 text-sm font-bold leading-5 text-ink-primary"
            onClick={() => {
              setDismissed(true);
              clearQuery();
            }}
          >
            Continuer
          </Link>
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              clearQuery();
            }}
            className="inline-flex min-h-tap-min items-center justify-center rounded-md px-3 text-sm font-semibold text-ink-secondary underline-offset-2 hover:underline"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Soft resume banner (R2) — shown when `?reprise=1` (QR resume / step restore).
 * Not Mémoire 2ᵉ visite. accent-soft + ink-primary, dismissible.
 */
export function BanniereReprise(props: Props) {
  return (
    <Suspense fallback={null}>
      <BanniereRepriseInner {...props} />
    </Suspense>
  );
}
