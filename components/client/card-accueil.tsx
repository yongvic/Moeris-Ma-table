import { ButtonPrimary } from "./button-primary";
import { ButtonSecondary } from "./button-secondary";
import { IllustrationPanel } from "./illustration-panel";

/**
 * card-accueil — illustration + display title + primary + secondary.
 * One primary CTA only ; no hub tiles / identity form.
 */
export function CardAccueil() {
  return (
    <section
      className="grid w-full grid-cols-1 items-center gap-section-gap sm:grid-cols-2 sm:gap-7 lg:gap-7"
      aria-labelledby="accueil-title"
    >
      <div className="order-1 flex justify-center sm:order-2 lg:order-2">
        <IllustrationPanel />
      </div>

      <div className="order-2 flex flex-col gap-5 sm:order-1 lg:order-1">
        <div className="flex flex-col gap-3">
          <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
            Ma table
          </p>
          <h1
            id="accueil-title"
            className="font-display text-[28px] leading-[34px] font-semibold text-ink-primary lg:text-[40px] lg:leading-[46px]"
          >
            Pose-toi.
          </h1>
          <p className="max-w-md text-base leading-6 text-ink-secondary">
            On s’occupe de toi.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-start">
          <ButtonPrimary href="/menu">Voir le menu</ButtonPrimary>
          <ButtonSecondary href="/service">
            J’ai besoin de quelque chose
          </ButtonSecondary>
        </div>
      </div>
    </section>
  );
}
