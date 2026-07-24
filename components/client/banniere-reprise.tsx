"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BookmarkSimple, X, ArrowRight } from "@phosphor-icons/react/dist/ssr";

type Props = {
  stepLabel: string;
  continueHref: string;
};

function BanniereRepriseInner({ stepLabel, continueHref }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const fromQuery = searchParams.get("reprise") === "1";
  const [dismissed, setDismissed] = useState(false);
  const visible = fromQuery && !dismissed;

  const clearQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("reprise");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  if (!visible) return null;

  return (
    <div role="status" className="px-margin-mobile pt-3 md:px-7">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-soft bg-accent-soft/60 px-4 py-3 shadow-soft"
      >
        <p className="flex items-center gap-2.5 text-[15px] leading-5 text-ink-primary">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-base text-accent-deep">
            <BookmarkSimple size={17} weight="fill" />
          </span>
          Tu en étais à <span className="font-bold">{stepLabel}</span>.
        </p>
        <div className="flex items-center gap-1.5">
          <Link
            href={continueHref}
            onClick={() => {
              setDismissed(true);
              clearQuery();
            }}
            className="group inline-flex min-h-tap-min items-center gap-2 rounded-full bg-accent px-4 text-sm font-bold leading-5 text-ink-onaccent transition-colors hover:bg-accent-deep"
          >
            Continuer
            <ArrowRight
              size={15}
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => {
              setDismissed(true);
              clearQuery();
            }}
            className="grid size-9 place-items-center rounded-full text-ink-secondary transition-colors hover:bg-surface-base hover:text-ink-primary"
          >
            <X size={17} weight="bold" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/** Soft resume banner (R2) — shown on `?reprise=1`. Not Mémoire 2ᵉ visite. */
export function BanniereReprise(props: Props) {
  return (
    <Suspense fallback={null}>
      <BanniereRepriseInner {...props} />
    </Suspense>
  );
}
