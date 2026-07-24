import { redirect } from "next/navigation";
import { auth } from "@/infra/auth/auth";
import { listMenuForBo } from "@/domain/menu/queries";
import {
  CreateMenuItemForm,
  LigneMenuBo,
} from "@/components/bo/ligne-menu-bo";

export const dynamic = "force-dynamic";

export default async function BoMenuPage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");

  const items = await listMenuForBo();

  return (
    <main className="flex flex-1 flex-col gap-6 px-margin-mobile py-7 md:px-7">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-[22px] leading-7 font-semibold text-ink-primary">
          Menu
        </h1>
        <p className="max-w-lg text-base text-ink-secondary">
          Crée, modifie et active les plats servis aux clients.
        </p>
      </header>

      <CreateMenuItemForm />

      {items.length === 0 ? (
        <p className="rounded-md border border-border bg-surface-base p-6 text-ink-secondary">
          Aucun plat pour l’instant — crée le premier ci-dessus.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <LigneMenuBo key={item.id} item={item} />
          ))}
        </ul>
      )}
    </main>
  );
}
