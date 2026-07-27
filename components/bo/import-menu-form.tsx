"use client";

import { useState, useTransition } from "react";
import { FileXls, UploadSimple, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { importMenuFromSpreadsheet } from "@/domain/menu/actions";

export function ImportMenuForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-5 shadow-soft"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        setMessage(null);
        setSuccess(null);
        startTransition(async () => {
          const res = await importMenuFromSpreadsheet(fd);
          if (!res.ok) {
            setMessage(res.message);
            return;
          }
          setSuccess(res.imported ?? 0);
          form.reset();
        });
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-2 font-display text-[18px] font-semibold text-ink-primary">
          <FileXls size={18} weight="fill" className="text-accent-deep" />
          Importer depuis Excel / CSV
        </h2>
        <p className="text-sm leading-6 text-ink-secondary">
          Colonnes attendues :{" "}
          <strong className="text-ink-primary">nom</strong>,{" "}
          <strong className="text-ink-primary">prix</strong> (FCFA). Optionnel
          : disponible (oui/non), photo (URL).
        </p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink-primary">
        Fichier
        <input
          name="file"
          type="file"
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          required
          className="text-sm text-ink-secondary file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-bold file:text-ink-primary"
        />
      </label>

      {success !== null ? (
        <p
          className="flex items-center gap-2 rounded-[var(--radius-md)] border border-sage/40 bg-sage/5 px-3 py-2 text-sm font-semibold text-sage-deep"
          role="status"
        >
          <CheckCircle size={17} weight="fill" />
          {success} plat{success > 1 ? "s" : ""} importé{success > 1 ? "s" : ""}{" "}
          ou mis à jour.
        </p>
      ) : null}

      {message ? (
        <p className="text-sm font-semibold text-ember" role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-tap-min items-center gap-2 self-start rounded-full border border-border bg-surface-raised px-5 font-bold text-ink-primary shadow-soft transition-colors hover:bg-surface-sunk disabled:opacity-60"
      >
        <UploadSimple size={17} weight="bold" />
        {pending ? "Import…" : "Importer le menu"}
      </button>
    </form>
  );
}
