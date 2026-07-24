"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  ForkKnife,
  PencilSimple,
  Plus,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react/dist/ssr";
import {
  createMenuItem,
  setMenuItemAvailability,
  updateMenuItem,
} from "@/domain/menu/actions";
import { formatPriceFr, type MenuItemView } from "@/domain/menu/queries";
import { StatusPillBo } from "./status-pill-bo";
import { inputClass } from "@/components/ui/form";

const boInput =
  "min-h-tap-min w-full rounded-[var(--radius-md)] border border-border bg-surface-base px-3 text-[15px] text-ink-primary focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export function LigneMenuBo({ item }: { item: MenuItemView }) {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-5 shadow-soft">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              const res = await updateMenuItem(fd);
              if (!res.ok) {
                setMessage(res.message);
                return;
              }
              setMessage(null);
              setEditing(false);
            });
          }}
        >
          <input type="hidden" name="id" value={item.id} />
          <label className="flex flex-col gap-1 text-sm font-bold text-ink-primary">
            Nom
            <input name="name" defaultValue={item.name} required className={boInput} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ink-primary">
            Prix (FCFA)
            <input
              name="price"
              type="number"
              step="1"
              min="0"
              defaultValue={item.priceCents}
              required
              className={boInput}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-ink-primary">
            <input
              name="available"
              type="checkbox"
              defaultChecked={item.available}
              className="size-4 accent-[var(--citrus-accent)]"
            />
            Disponible
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-ink-primary">
            Photo
            <input
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="text-sm text-ink-secondary file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-bold file:text-ink-primary"
            />
          </label>
          {message ? (
            <p className="text-sm font-semibold text-ember" role="alert">
              {message}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-tap-min items-center rounded-full bg-accent px-5 font-bold text-ink-onaccent shadow-glow transition-colors hover:bg-accent-deep disabled:opacity-60"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex min-h-tap-min items-center rounded-full border border-border bg-surface-raised px-5 font-bold text-ink-primary"
            >
              Annuler
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border/70 bg-surface-base p-3.5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <span className="relative size-14 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-surface-sunk">
          {item.photoUrl ? (
            <Image
              src={item.photoUrl}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-ink-secondary">
              <ForkKnife size={22} weight="duotone" />
            </span>
          )}
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-[17px] font-semibold text-ink-primary">
              {item.name}
            </p>
            <StatusPillBo available={item.available} />
          </div>
          <p className="tnum text-sm font-semibold text-ink-secondary">
            {formatPriceFr(item.priceCents)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex min-h-tap-min items-center gap-2 rounded-full border border-border bg-surface-raised px-4 text-sm font-bold text-ink-primary transition-colors hover:bg-surface-sunk"
          onClick={() => setEditing(true)}
        >
          <PencilSimple size={16} weight="bold" />
          Modifier
        </button>
        <button
          type="button"
          disabled={pending}
          className="inline-flex min-h-tap-min items-center gap-2 rounded-full border border-border bg-surface-raised px-4 text-sm font-bold text-ink-primary transition-colors hover:bg-surface-sunk disabled:opacity-60"
          onClick={() => {
            startTransition(async () => {
              const res = await setMenuItemAvailability(item.id, !item.available);
              if (!res.ok) setMessage(res.message);
            });
          }}
        >
          {item.available ? (
            <>
              <EyeSlash size={16} weight="bold" /> Désactiver
            </>
          ) : (
            <>
              <Eye size={16} weight="bold" /> Réactiver
            </>
          )}
        </button>
      </div>
      {message ? (
        <p className="text-sm font-semibold text-ember sm:basis-full" role="alert">
          {message}
        </p>
      ) : null}
    </li>
  );
}

export function CreateMenuItemForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-raised/40 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        startTransition(async () => {
          const res = await createMenuItem(fd);
          if (!res.ok) {
            setMessage(res.message);
            return;
          }
          setMessage(null);
          form.reset();
        });
      }}
    >
      <h2 className="flex items-center gap-2 font-display text-[18px] font-semibold text-ink-primary">
        <Plus size={18} weight="bold" className="text-accent-deep" />
        Nouveau plat
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-bold text-ink-primary">
          Nom
          <input name="name" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold text-ink-primary">
          Prix (FCFA)
          <input
            name="price"
            type="number"
            step="1"
            min="0"
            required
            placeholder="4500"
            className={inputClass}
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-bold text-ink-primary">
        <input
          name="available"
          type="checkbox"
          defaultChecked
          className="size-4 accent-[var(--citrus-accent)]"
        />
        Disponible
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold text-ink-primary">
        Photo (optionnel)
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-sm text-ink-secondary file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-bold file:text-ink-primary"
        />
      </label>
      {message ? (
        <p className="text-sm font-semibold text-ember" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-tap-min items-center gap-2 self-start rounded-full bg-accent px-5 font-bold text-ink-onaccent shadow-glow transition-colors hover:bg-accent-deep disabled:opacity-60"
      >
        <Plus size={17} weight="bold" />
        {pending ? "Création…" : "Créer le plat"}
      </button>
    </form>
  );
}
