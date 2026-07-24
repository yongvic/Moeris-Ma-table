"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeServiceRequestAction } from "@/domain/service/actions";
import {
  serviceTypeLabelFr,
  type ServiceBoView,
} from "@/domain/service/queries";

export function BoServicePanel({
  initialRequests,
  pusher,
}: {
  initialRequests: ServiceBoView[];
  pusher: { key: string; cluster: string } | null;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialRequests);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(initialRequests);
  }, [initialRequests]);

  const refresh = useCallback(() => router.refresh(), [router]);

  useEffect(() => {
    const id = setInterval(refresh, 12000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (!pusher) return;
    let cancelled = false;
    let channel: { unbind_all?: () => void; unsubscribe?: () => void } | null =
      null;
    let client: { disconnect?: () => void } | null = null;

    void import("pusher-js").then(({ default: Pusher }) => {
      if (cancelled) return;
      client = new Pusher(pusher.key, { cluster: pusher.cluster });
      channel = (
        client as unknown as { subscribe: (c: string) => typeof channel }
      ).subscribe("bo-floor");
      (
        channel as unknown as { bind: (e: string, cb: () => void) => void }
      ).bind("floor-update", () => refresh());
    });

    return () => {
      cancelled = true;
      channel?.unbind_all?.();
      channel?.unsubscribe?.();
      client?.disconnect?.();
    };
  }, [pusher, refresh]);

  if (items.length === 0) {
    return (
      <p className="rounded-md border border-border bg-surface-base p-6 text-ink-secondary">
        Aucune demande de service ouverte.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((req) => (
        <li
          key={req.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface-base p-4"
        >
          <div>
            <p className="font-display text-lg font-semibold text-ink-primary">
              Table {req.tableId}
            </p>
            <p className="text-sm text-ink-secondary">
              {serviceTypeLabelFr(req.type)}
            </p>
          </div>
          <button
            type="button"
            disabled={pending}
            className="min-h-tap-min rounded-md bg-accent px-4 font-bold text-ink-primary disabled:opacity-60"
            onClick={() => {
              startTransition(async () => {
                const res = await completeServiceRequestAction(req.id);
                if (!res.ok) setError(res.message);
                else {
                  setError(null);
                  refresh();
                }
              });
            }}
          >
            Fait
          </button>
        </li>
      ))}
      {error ? (
        <p className="text-sm text-ink-secondary" role="alert">
          {error}
        </p>
      ) : null}
    </ul>
  );
}
