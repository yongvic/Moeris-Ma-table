export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience, getSessionReview } from "@/domain/review/actions";
import { ContactForm } from "@/components/client/contact-form";
import { Reveal } from "@/components/ui/reveal";

export default async function ContactPage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const can = await canFinishExperience(session.sessionId);
  if (!can) redirect("/menu");

  const review = await getSessionReview(session.sessionId);
  if (!review) redirect("/fin/avis");

  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-6 px-margin-mobile py-8 md:px-7">
      <Reveal className="flex flex-col gap-2">
        <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-secondary">
          Ensuite
        </span>
        <h1 className="font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ink-primary sm:text-[38px]">
          On se revoit&nbsp;?
        </h1>
        <p className="max-w-md text-[16px] text-ink-secondary">
          On t&apos;avertit des prochaines soirées Moeris. Un seul canal, quand
          tu veux — libre à toi.
        </p>
      </Reveal>
      <Reveal index={1}>
        <ContactForm />
      </Reveal>
    </main>
  );
}
