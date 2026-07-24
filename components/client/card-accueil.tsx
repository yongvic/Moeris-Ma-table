import { ButtonPrimary } from "./button-primary";
import { ButtonSecondary } from "./button-secondary";
import { Illustration } from "@/components/ui/illustration";
import { Reveal } from "@/components/ui/reveal";
import { HandWaving } from "@phosphor-icons/react/dist/ssr";

/**
 * card-accueil — golden-hour split hero. One primary CTA + one secondary.
 * No hub tiles, no identity form (PRD anti-dashboard).
 */
export function CardAccueil() {
  return (
    <section
      className="grid w-full grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_1.05fr] sm:gap-8 lg:gap-12"
      aria-labelledby="accueil-title"
    >
      <div className="order-2 flex flex-col gap-6 sm:order-1">
        <Reveal className="flex flex-col gap-3" index={0}>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-base/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
            Ma table
          </span>
          <h1
            id="accueil-title"
            className="font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink-primary sm:text-[46px] lg:text-[58px]"
          >
            Pose-toi.
          </h1>
          <p className="max-w-md text-[17px] leading-7 text-ink-secondary">
            Bienvenue à la maison. On s&apos;occupe de toi, à ton rythme, sans
            compte ni prise de tête.
          </p>
        </Reveal>

        <Reveal className="flex flex-col gap-3 sm:max-w-sm" index={1}>
          <ButtonPrimary href="/menu">Voir la carte</ButtonPrimary>
          <ButtonSecondary
            href="/service"
            icon={<HandWaving size={18} weight="fill" />}
          >
            J&apos;ai besoin de quelque chose
          </ButtonSecondary>
        </Reveal>
      </div>

      <Reveal className="order-1 sm:order-2" index={0} y={24}>
        <Illustration variant="accueil" priority className="max-w-[420px]" />
      </Reveal>
    </section>
  );
}
