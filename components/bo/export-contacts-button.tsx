"use client";

import { useState } from "react";
import { DownloadSimple, FileCsv, FileXls } from "@phosphor-icons/react/dist/ssr";

type ExportFormat = "csv" | "xlsx";

export function ExportContactsButton() {
  const [format, setFormat] = useState<ExportFormat>("csv");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="inline-flex rounded-full border border-border bg-surface-raised/60 p-1"
        role="radiogroup"
        aria-label="Format d'export"
      >
        <button
          type="button"
          role="radio"
          aria-checked={format === "csv"}
          onClick={() => setFormat("csv")}
          className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-sm font-bold transition-colors ${
            format === "csv"
              ? "bg-accent text-ink-onaccent shadow-soft"
              : "text-ink-secondary hover:text-ink-primary"
          }`}
        >
          <FileCsv size={16} weight="fill" />
          CSV
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={format === "xlsx"}
          onClick={() => setFormat("xlsx")}
          className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-sm font-bold transition-colors ${
            format === "xlsx"
              ? "bg-accent text-ink-onaccent shadow-soft"
              : "text-ink-secondary hover:text-ink-primary"
          }`}
        >
          <FileXls size={16} weight="fill" />
          Excel
        </button>
      </div>

      <a
        href={`/bo/contacts/export?format=${format}`}
        download
        className="inline-flex min-h-tap-min items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-bold text-ink-onaccent shadow-glow transition-[transform,background-color] duration-300 hover:bg-accent-deep active:scale-[0.98]"
      >
        <DownloadSimple size={18} weight="bold" />
        Exporter
      </a>
    </div>
  );
}
