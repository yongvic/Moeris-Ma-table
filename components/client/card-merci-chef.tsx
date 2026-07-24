import { IllustrationPanel } from "@/components/client/illustration-panel";
import type { MerciCopy } from "@/domain/review/merci-tone";

export function CardMerciChef({
  copy,
  stars,
}: {
  copy: MerciCopy;
  stars: number;
}) {
  return (
    <article className="flex flex-col gap-5 rounded-md border border-border bg-accent-soft/40 p-5 sm:p-7">
      <IllustrationPanel className="max-w-[240px]" />
      <div className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Merci chef
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          {copy.title}
        </h1>
        <p className="max-w-md text-base leading-6 text-ink-secondary">
          {copy.body}
        </p>
        <p
          className="text-sm font-semibold text-ink-primary"
          role="img"
          aria-label={`Note : ${stars} sur 5`}
        >
          {"★".repeat(stars)}
          <span className="text-ink-secondary" aria-hidden>
            {"☆".repeat(Math.max(0, 5 - stars))}
          </span>
        </p>
      </div>
    </article>
  );
}
