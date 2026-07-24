import type { SessionStep } from "@prisma/client";
import { Check } from "@phosphor-icons/react/dist/ssr";
import {
  getSejourProgressAria,
  getSejourStepIndex,
  getStepLabelFr,
  SEJOUR_STEPS,
  SEJOUR_STEP_TOTAL,
} from "@/domain/session/steps";

type BarreProgressionSejourProps = {
  step: SessionStep;
  mode?: "default" | "frozen-end" | "hidden";
  className?: string;
};

/**
 * "Le fil" — read-only séjour thread from Neon Session.step (4 nodes).
 * Not a clickable stepper. Service is a lateral path (not a node).
 */
export function BarreProgressionSejour({
  step,
  mode = "default",
  className = "",
}: BarreProgressionSejourProps) {
  if (mode === "hidden") return null;

  const currentIndex =
    mode === "frozen-end" ? SEJOUR_STEP_TOTAL : getSejourStepIndex(step);
  const ariaLabel =
    mode === "frozen-end"
      ? `Étape ${SEJOUR_STEP_TOTAL} sur ${SEJOUR_STEP_TOTAL} : Fin`
      : getSejourProgressAria(step);

  const fillPct =
    SEJOUR_STEP_TOTAL > 1
      ? ((currentIndex - 1) / (SEJOUR_STEP_TOTAL - 1)) * 100
      : 0;

  return (
    <div
      className={`bg-surface-base/70 px-margin-mobile py-3 backdrop-blur-sm md:px-7 ${className}`}
    >
      <div
        className="mx-auto max-w-[1200px]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={SEJOUR_STEP_TOTAL}
        aria-valuenow={currentIndex}
        aria-valuetext={ariaLabel}
        aria-label={ariaLabel}
      >
        <ol className="relative flex items-start justify-between" aria-hidden="true">
          {/* thread track */}
          <span className="absolute left-[10%] right-[10%] top-[11px] h-[3px] rounded-full bg-border" />
          <span
            className="absolute left-[10%] top-[11px] h-[3px] rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `calc(${(fillPct * 80) / 100}%)` }}
          />
          {SEJOUR_STEPS.map((s, i) => {
            const position = i + 1;
            const complete = position < currentIndex;
            const current = position === currentIndex;
            const label = getStepLabelFr(s);
            return (
              <li
                key={s}
                className="relative z-[1] flex flex-1 flex-col items-center gap-1.5"
              >
                <span
                  className={`grid size-[23px] place-items-center rounded-full border-2 text-[10px] font-bold transition-colors duration-500 ${
                    complete
                      ? "border-accent bg-accent text-ink-onaccent"
                      : current
                        ? "border-accent bg-surface-base text-accent-deep ring-4 ring-accent-soft"
                        : "border-border bg-surface-base text-ink-secondary"
                  }`}
                >
                  {complete ? <Check size={12} weight="bold" /> : position}
                </span>
                <span
                  className={`text-center text-[11px] font-semibold leading-4 ${
                    complete || current ? "text-ink-primary" : "text-ink-secondary"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
