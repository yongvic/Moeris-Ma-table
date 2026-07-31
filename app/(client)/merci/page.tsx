export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getReviewByCookie } from "@/domain/review/actions";
import { merciCopyFromStars } from "@/domain/review/merci-tone";
import { CardMerciChef } from "@/components/client/card-merci-chef";
import { ButtonPrimary } from "@/components/client/button-primary";

export default async function MerciPage() {
  const review = await getReviewByCookie();
  if (!review) redirect("/avis");

  const copy = merciCopyFromStars(review.stars);

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center gap-6 px-margin-mobile py-8 md:px-7">
      <CardMerciChef
        copy={copy}
        stars={review.stars}
        starsService={review.starsService}
        starsPlace={review.starsPlace}
      />
      <div className="flex flex-col items-center gap-3">
        <ButtonPrimary href="/contact" className="sm:w-auto">
          Rester en contact
        </ButtonPrimary>
        <p className="max-w-sm text-center text-sm text-ink-secondary">
          On te prévient des prochaines soirées — un seul canal, quand tu veux.
        </p>
      </div>
    </main>
  );
}
