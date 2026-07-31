"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  EnvelopeSimple,
  CheckCircle,
  BellRinging,
} from "@phosphor-icons/react/dist/ssr";
import { submitContactAction } from "@/domain/guest/contact-action";
import { Segmented, Field, inputClass } from "@/components/ui/form";
import { MoerisPhoneInput } from "@/components/ui/phone-input";
import type { Value } from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";

type Channel = "phone" | "email";

export function ContactForm() {
  const router = useRouter();
  const [channel, setChannel] = useState<Channel>("phone");
  const [phone, setPhone] = useState<Value>();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div
        className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-sage/40 bg-sage/5 p-6"
        aria-live="polite"
      >
        <p className="flex items-center gap-2 font-display text-[20px] font-semibold text-ink-primary">
          <CheckCircle size={24} weight="fill" className="text-sage-deep" />
          C&apos;est noté&nbsp;!
        </p>
        <p className="text-[15px] text-ink-secondary">
          On te préviendra pour les prochaines soirées Moeris. À très vite.
        </p>
        <button
          type="button"
          className="inline-flex min-h-tap-min items-center rounded-full border border-border bg-surface-base px-5 text-[16px] font-bold text-ink-primary shadow-soft transition-transform active:scale-[0.98]"
          onClick={() => router.push("/avis")}
        >
          Retour à l&apos;avis
        </button>
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
          const res = await submitContactAction({
            channel,
            value: channel === "phone" ? phone! : value,
          });
          if (!res.ok) {
            setError(res.message);
            return;
          }
          setDone(true);
        });
      }}
    >
      <Segmented
        ariaLabel="Canal de contact"
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

      <Field
        label={channel === "phone" ? "Numéro de téléphone" : "Adresse email"}
      >
        {channel === "phone" ? (
          <MoerisPhoneInput
            value={phone}
            onChange={setPhone}
            required
          />
        ) : (
          <input
            name="contact-value"
            type="email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="email"
            placeholder="toi@exemple.com"
            required
            className={inputClass}
          />
        )}
      </Field>

      <p className="text-xs leading-5 text-ink-secondary">
        Uniquement pour les soirées Moeris / Résidence. Données réservées à
        l&apos;équipe. Pas de revente, pas de spam.
      </p>

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
        <BellRinging size={18} weight="fill" />
        {pending ? "Enregistrement…" : "Rester en contact"}
      </button>

      <button
        type="button"
        className="text-sm font-semibold text-ink-secondary underline underline-offset-4 transition-colors hover:text-ink-primary"
        onClick={() => router.push("/avis")}
      >
        Non merci
      </button>
    </form>
  );
}
