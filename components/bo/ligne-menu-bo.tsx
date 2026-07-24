"use client";

import { useState, useTransition } from "react";
import {
  createMenuItem,
  setMenuItemAvailability,
  updateMenuItem,
} from "@/domain/menu/actions";
import { formatPriceFr, type MenuItemView } from "@/domain/menu/queries";
import { StatusPillBo } from "./status-pill-bo";

export function LigneMenuBo({ item }: { item: MenuItemView }) {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="rounded-md border border-border bg-surface-base p-4">
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
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Nom
            <input
              name="name"
              defaultValue={item.name}
              required
              className="min-h-tap-min rounded-md border border-border px-3"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Prix (FCFA)
            <input
              name="price"
              type="number"
              step="1"
              min="0"
              defaultValue={item.priceCents}
              required
              className="min-h-tap-min rounded-md border border-border px-3"
            />
            <span className="text-xs font-normal text-ink-secondary">
              En centimes (ex. 4500 = 4 500 FCFA)
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              name="available"
              type="checkbox"
              defaultChecked={item.available}
              className="size-4"
            />
            Disponible
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Photo
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
          </label>
          {message ? (
            <p className="text-sm text-ink-secondary" role="alert">
              {message}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={pending}
              className="min-h-tap-min rounded-md bg-accent px-4 font-bold text-ink-primary disabled:opacity-60"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-tap-min rounded-md border border-border px-4 font-bold"
            >
              Annuler
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-3 rounded-md border border-border bg-surface-base p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-lg font-semibold text-ink-primary">
            {item.name}
          </p>
          <StatusPillBo available={item.available} />
        </div>
        <p className="text-sm text-ink-secondary">
          {formatPriceFr(item.priceCents)}
          {item.photoUrl ? " · photo OK" : " · sans photo"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="min-h-tap-min rounded-md border border-border px-4 text-sm font-bold"
          onClick={() => setEditing(true)}
        >
          Modifier
        </button>
        <button
          type="button"
          disabled={pending}
          className="min-h-tap-min rounded-md border border-border px-4 text-sm font-bold disabled:opacity-60"
          onClick={() => {
            startTransition(async () => {
              const res = await setMenuItemAvailability(item.id, !item.available);
              if (!res.ok) setMessage(res.message);
            });
          }}
        >
          {item.available ? "Désactiver" : "Réactiver"}
        </button>
      </div>
      {message ? (
        <p className="text-sm text-ink-secondary sm:basis-full" role="alert">
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
      className="flex flex-col gap-3 rounded-md border border-dashed border-border bg-surface-raised/30 p-4"
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
      <h2 className="font-display text-lg font-semibold text-ink-primary">
        Nouveau plat
      </h2>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Nom
        <input
          name="name"
          required
          className="min-h-tap-min rounded-md border border-border px-3"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Prix (centimes FCFA)
        <input
          name="price"
          type="number"
          step="1"
          min="0"
          required
          placeholder="4500"
          className="min-h-tap-min rounded-md border border-border px-3"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="available" type="checkbox" defaultChecked className="size-4" />
        Disponible
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Photo (optionnel)
        <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
      </label>
      {message ? (
        <p className="text-sm text-ink-secondary" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-tap-min self-start rounded-md bg-accent px-4 font-bold text-ink-primary disabled:opacity-60"
      >
        Créer le plat
      </button>
    </form>
  );
}
