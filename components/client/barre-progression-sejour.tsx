import type { SessionStep } from "@prisma/client";
import {
  getSejourProgressAria,
  getSejourStepIndex,
  getStepLabelFr,
  SEJOUR_STEPS,
  SEJOUR_STEP_TOTAL,
} from "@/domain/session/steps";

type BarreProgressionSejourProps = {
  step: SessionStep;
  /**
   * Future (epic 4 / UX-DR15): during Contact after Merci chef, hide this bar
   * or freeze at 100% Fin — not implemented until Contact exists.
   */
  mode?: "default" | "frozen-end" | "hidden";
  className?: string;
};

/**
 * barre-progression-sejour — read-only indicator from Neon Session.step.
 * Not a clickable stepper / dashboard hub. Service does not appear as a step.
 */
export function BarreProgressionSejour({
  step,
  mode = "default",
  className = "",
}: BarreProgressionSejourProps) {
  if (mode === "hidden") return null;

  const currentIndex = mode === "frozen-end" ? SEJOUR_STEP_TOTAL : getSejourStepIndex(step);
  const ariaLabel =
    mode === "frozen-end"
      ? `Étape ${SEJOUR_STEP_TOTAL} sur ${SEJOUR_STEP_TOTAL} : Fin`
      : getSejourProgressAria(step);

  return (
    <div
      className={`border-b border-border/70 bg-surface-base px-margin-mobile py-3 md:px-7 ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={SEJOUR_STEP_TOTAL}
          aria-valuenow={currentIndex}
          aria-valuetext={ariaLabel}
          aria-label={ariaLabel}
        >
          <p className="mb-2 text-xs font-semibold tracking-[0.02em] text-ink-secondary">
            {ariaLabel}
          </p>
          <ol className="grid grid-cols-4 gap-2" aria-hidden="true">
            {SEJOUR_STEPS.map((s, i) => {
              const position = i + 1;
              const complete = position < currentIndex;
              const current = position === currentIndex;
              const filled = complete || current;
              const label = getStepLabelFr(s);

              return (
                <li key={s} className="min-w-0">
                  <div
                    className={`flex flex-col gap-1.5 rounded-md p-1 ${
                      current ? "ring-1 ring-ink-primary/15" : ""
                    }`}
                  >
                    <div
                      className={`h-2 w-full rounded-full motion-safe:transition-[background-color] motion-safe:duration-300 ${
                        filled
                          ? "bg-accent"
                          : "border border-border bg-surface-raised"
                      }`}
                    />
                    <span
                      className={`truncate text-center text-[11px] leading-4 font-semibold sm:text-xs ${
                        filled ? "text-ink-primary" : "text-ink-secondary"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
