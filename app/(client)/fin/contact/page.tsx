export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience, getSessionReview } from "@/domain/review/actions";
import { ContactForm } from "@/components/client/contact-form";

export default async function ContactPage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const can = await canFinishExperience(session.sessionId);
  if (!can) redirect("/menu");

  const review = await getSessionReview(session.sessionId);
  if (!review) redirect("/fin/avis");

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Ensuite
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Rester en contact ?
        </h1>
        <p className="max-w-md text-base text-ink-secondary">
          On t&apos;avertit des prochaines soirées Moeris — téléphone ou email,
          un seul canal.
        </p>
      </header>
      <ContactForm />
      <Link
        href="/accueil"
        className="text-sm text-ink-secondary underline underline-offset-2"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
