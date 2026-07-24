export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/domain/session/get-current";
import { canFinishExperience, getSessionReview } from "@/domain/review/actions";
import { merciCopyFromStars } from "@/domain/review/merci-tone";
import { CardMerciChef } from "@/components/client/card-merci-chef";

export default async function MerciPage() {
  const session = await getActiveSession();
  if (!session) redirect("/accueil");

  const can = await canFinishExperience(session.sessionId);
  if (!can) redirect("/menu");

  const review = await getSessionReview(session.sessionId);
  if (!review) redirect("/fin/avis");

  const copy = merciCopyFromStars(review.stars);

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-section-gap px-margin-mobile py-7 md:px-7">
      <CardMerciChef copy={copy} stars={review.stars} />
      <Link
        href="/fin/contact"
        className="inline-flex min-h-tap-min items-center justify-center self-start rounded-md bg-accent px-5 text-base font-bold text-ink-primary"
      >
        Continuer
      </Link>
    </main>
  );
}
