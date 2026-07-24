import { redirect } from "next/navigation";
import {
  AddressBook,
  DownloadSimple,
  Phone,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import { auth } from "@/infra/auth/auth";
import { listGuestsForAdmin } from "@/domain/guest/admin";

export const dynamic = "force-dynamic";

function frDateTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Africa/Dakar",
  }).format(new Date(iso));
}

export default async function BoContactsPage() {
  const session = await auth();
  if (!session?.user) redirect("/bo/connexion");

  const guests = await listGuestsForAdmin();

  return (
    <main className="flex flex-1 flex-col gap-6 px-margin-mobile py-7 md:px-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-deep">
            <AddressBook size={22} weight="fill" />
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-[26px] font-semibold leading-8 text-ink-primary">
              Contacts clientèle
            </h1>
            <p className="max-w-lg text-[15px] text-ink-secondary">
              {guests.length > 0
                ? `${guests.length} contact${guests.length > 1 ? "s" : ""} opt-in — pour les soirées Moeris.`
                : "Les contacts laissés par les clients apparaîtront ici."}
            </p>
          </div>
        </div>

        {guests.length > 0 ? (
          <a
            href="/bo/contacts/export"
            download
            className="inline-flex min-h-tap-min items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-bold text-ink-onaccent shadow-glow transition-[transform,background-color] duration-300 hover:bg-accent-deep active:scale-[0.98]"
          >
            <DownloadSimple size={18} weight="bold" />
            Exporter (CSV / Excel)
          </a>
        ) : null}
      </header>

      {guests.length === 0 ? (
        <div className="grid place-items-center rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-raised/50 py-16 text-center">
          <p className="text-[15px] text-ink-secondary">
            Aucun contact pour l&apos;instant.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border/70 bg-surface-base shadow-soft">
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
            <thead>
              <tr className="border-b border-border/70 bg-surface-raised/60 text-[12px] font-bold uppercase tracking-[0.08em] text-ink-secondary">
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Goûts mémorisés</th>
                <th className="px-4 py-3 text-center">Visites</th>
                <th className="px-4 py-3">Première visite</th>
                <th className="px-4 py-3">Dernière interaction</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr
                  key={g.id}
                  className="border-b border-border/40 last:border-0 hover:bg-surface-raised/40"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-semibold text-ink-primary">
                      {g.phone ? (
                        <Phone
                          size={16}
                          weight="fill"
                          className="shrink-0 text-accent-deep"
                        />
                      ) : (
                        <EnvelopeSimple
                          size={16}
                          weight="fill"
                          className="shrink-0 text-accent-deep"
                        />
                      )}
                      {g.phone ?? g.email ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {g.tastes.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {g.tastes.map((t, i) => (
                          <span
                            key={`${g.id}-${i}`}
                            className="rounded-full bg-surface-sunk px-2.5 py-0.5 text-xs font-semibold text-ink-secondary"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-ink-secondary/60">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-ink-primary">
                    {g.visits}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">
                    {frDateTime(g.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">
                    {frDateTime(g.lastInteractionAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
