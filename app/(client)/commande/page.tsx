export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience } from "@/domain/review/actions";
import { ContactForm } from "@/components/client/contact-form";
import { RecognizeForm } from "@/components/client/recognize-form";

export default async function CommandePage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const canFinish = await canFinishExperience(session.sessionId);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <p className="font-display text-[12px] leading-4 font-semibold tracking-[0.02em] text-ink-secondary uppercase">
          Retrouve-toi
        </p>
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Ressaisie de contact
        </h1>
        <p className="max-w-md text-base text-ink-secondary">
          Tu es déjà venu(e) ? Saisis ton numéro ou email pour retrouver
          tes préférés et ton historique.
        </p>
      </header>
      <RecognizeForm sessionId={session.sessionId} />
      {canFinish ? null : (
        <p className="text-sm text-ink-secondary">
          Commande d'abord un plat — le bouton Terminer s'activera ensuite.
        </p>
      )}
    </main>
  );
}
