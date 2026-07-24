import { redirect } from "next/navigation";
import { ForkKnife } from "@phosphor-icons/react/dist/ssr";
import { auth } from "@/infra/auth/auth";
import { listMenuForBo } from "@/domain/menu/queries";
import { CreateMenuItemForm, LigneMenuBo } from "@/components/bo/ligne-menu-bo";

export const dynamic = "force-dynamic";

export default async function BoMenuPage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");

  const items = await listMenuForBo();

  return (
    <main className="flex flex-1 flex-col gap-6 px-margin-mobile py-7 md:px-7">
      <header className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-deep">
          <ForkKnife size={22} weight="fill" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[26px] font-semibold leading-8 text-ink-primary">
            Menu
          </h1>
          <p className="max-w-lg text-[15px] text-ink-secondary">
            Crée, modifie et active les plats servis aux clients.
          </p>
        </div>
      </header>

      <CreateMenuItemForm />

      {items.length === 0 ? (
        <p className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-raised/40 p-8 text-center text-ink-secondary">
          Aucun plat pour l&apos;instant — crée le premier ci-dessus.
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
