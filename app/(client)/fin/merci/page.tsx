export const dynamic = "force-dynamic";

import Link from "next/link";
import { ContactForm } from "@/components/client/contact-form";

export default async function MerciPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <span className="text-4xl" aria-hidden>
          👨‍🍳
        </span>
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Merci chef
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Merci d'avoir choisi Moeris.
        </h1>
        <p className="max-w-md text-base leading-6 text-ink-secondary">
          L'équipe espère t'avoir fait passer une bonne soirée.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-ink-primary">
          Rester en contact ?
        </h2>
        <p className="text-sm text-ink-secondary">
          On t'avertit des prochaines soirées — un tap suffit.
        </p>
        <ContactForm />
      </section>

      <Link
        href="/accueil"
        className="inline-flex min-h-tap-min items-center justify-center rounded-md border border-border px-5 text-base font-bold text-ink-primary"
      >
        Retour à l'accueil
      </Link>
    </main>
  );
}
