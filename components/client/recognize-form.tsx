"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Phone, EnvelopeSimple, ForkKnife, CheckCircle, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { recognizeByContactAction } from "@/domain/guest/memory-actions";
import { Segmented, Field, inputClass } from "@/components/ui/form";
import { MoerisPhoneInput } from "@/components/ui/phone-input";
import type { Value } from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";

type Channel = "phone" | "email";

export function RecognizeForm() {
  const [channel, setChannel] = useState<Channel>("phone");
  const [phone, setPhone] = useState<Value>();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    preferences: { menuItemId: string; label: string; rank: number }[];
    rememberedTastes: string[];
  } | null>(null);

  if (result) {
    return (
      <div className="flex flex-col gap-4" aria-live="polite">
        <p className="flex items-center gap-2 font-display text-[18px] font-semibold text-ink-primary">
          <CheckCircle size={22} weight="fill" className="text-sage-deep" />
          On t&apos;a retrouvé·e.
        </p>
        {result.preferences.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink-secondary">Tes préférés :</p>
            <ul className="flex flex-wrap gap-2">
              {result.preferences.map((p) => (
                <li key={p.menuItemId}>
                  <Link
                    href={`/menu/${p.menuItemId}`}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-surface-base px-4 text-sm font-bold text-ink-primary shadow-soft"
                  >
                    <ForkKnife size={15} weight="fill" className="text-accent-deep" />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-ink-secondary">
            Pas encore de préférés — ils apparaîtront après ta première commande.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      className="flex max-w-md flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          if (channel === "phone") {
            if (!phone || !isValidPhoneNumber(phone)) {
              setError("Numéro de téléphone invalide.");
              return;
            }
          }
          const res = await recognizeByContactAction({
            channel,
            value: channel === "phone" ? phone! : value,
          });
          if (!res.ok) {
            setError(res.message);
            return;
          }
          setResult({
            preferences: res.preferences,
            rememberedTastes: res.rememberedTastes,
          });
        });
      }}
    >
      <Segmented
        ariaLabel="Canal de reconnaissance"
        value={channel}
        onChange={(c) => {
          setChannel(c);
          setValue("");
          setPhone(undefined);
        }}
        options={[
          { value: "phone", label: "Téléphone", icon: <Phone size={16} weight="fill" /> },
          { value: "email", label: "Email", icon: <EnvelopeSimple size={16} weight="fill" /> },
        ]}
      />
      <Field label={channel === "phone" ? "Ton numéro" : "Ton email"}>
        {channel === "phone" ? (
          <MoerisPhoneInput value={phone} onChange={setPhone} required />
        ) : (
          <input
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            autoComplete="email"
            placeholder="toi@exemple.com"
            className={inputClass}
          />
        )}
      </Field>
      {error ? (
        <p className="text-sm font-semibold text-ember" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-tap-min items-center justify-center gap-2 rounded-full bg-accent px-6 text-[16px] font-bold text-ink-onaccent shadow-glow transition-[transform,background-color] duration-300 hover:bg-accent-deep active:scale-[0.98] disabled:opacity-60"
      >
        <MagnifyingGlass size={17} weight="bold" />
        {pending ? "Recherche…" : "Me retrouver"}
      </button>
    </form>
  );
}
