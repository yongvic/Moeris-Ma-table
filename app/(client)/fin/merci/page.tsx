export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience, getSessionReview } from "@/domain/review/actions";
import { merciCopyFromStars } from "@/domain/review/merci-tone";
import { CardMerciChef } from "@/components/client/card-merci-chef";
import { ButtonPrimary } from "@/components/client/button-primary";

export default async function MerciPage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const can = await canFinishExperience(session.sessionId);
  if (!can) redirect("/menu");

  const review = await getSessionReview(session.sessionId);
  if (!review) redirect("/fin/avis");

  const copy = merciCopyFromStars(review.stars);

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center gap-6 px-margin-mobile py-8 md:px-7">
      <CardMerciChef
        copy={copy}
        stars={review.stars}
        starsService={review.starsService}
        starsPlace={review.starsPlace}
      />
      <div className="flex justify-center">
        <ButtonPrimary href="/fin/contact" className="sm:w-auto">
          Continuer
        </ButtonPrimary>
      </div>
    </main>
  );
}
