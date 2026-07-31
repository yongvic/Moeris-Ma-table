export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { listReviewsForAdmin } from "@/domain/review/admin";
import { Star } from "@phosphor-icons/react/dist/ssr";
import { auth } from "@/infra/auth/auth";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function Stars({ n }: { n: number | null }) {
  if (n == null) return <span className="text-ink-secondary">—</span>;
  return (
    <span className="inline-flex items-center gap-0.5 tnum font-bold text-ink-primary">
      {n}
      <Star size={14} weight="fill" className="text-accent-deep" />
    </span>
  );
}

export default async function BoAvisPage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");

  const reviews = await listReviewsForAdmin();

  return (
    <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-6 px-margin-mobile py-8 md:px-7">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-[28px] font-semibold text-ink-primary">
          Avis
        </h1>
        <p className="text-sm text-ink-secondary">
          {reviews.length} avis reçu{reviews.length === 1 ? "" : "s"}
        </p>
      </header>

      {reviews.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-raised/40 p-10 text-center">
          <p className="font-display text-[18px] font-semibold text-ink-primary">
            Pas encore d&apos;avis
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            Ils apparaîtront ici dès qu&apos;un client envoie le formulaire.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-4 shadow-soft sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="text-ink-secondary">Repas</span>
                    <Stars n={r.stars} />
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-ink-secondary">Service</span>
                    <Stars n={r.starsService} />
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-ink-secondary">Lieu</span>
                    <Stars n={r.starsPlace} />
                  </span>
                </div>
                <time
                  dateTime={r.createdAt.toISOString()}
                  className="text-xs text-ink-secondary"
                >
                  {formatDate(r.createdAt)}
                </time>
              </div>

              {r.comment ? (
                <p className="mt-3 text-[15px] leading-6 text-ink-primary">
                  {r.comment}
                </p>
              ) : null}

              {r.highlights.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {r.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-ink-primary"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              ) : null}

              {r.guest ? (
                <p className="mt-3 text-sm text-ink-secondary">
                  Contact&nbsp;:{" "}
                  <span className="font-semibold text-ink-primary">
                    {r.guest.phoneE164 ?? r.guest.emailLower}
                  </span>
                </p>
              ) : (
                <p className="mt-3 text-xs text-ink-secondary">
                  Pas de contact lié
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
