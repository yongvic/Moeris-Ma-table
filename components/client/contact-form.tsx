"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Phone,
  EnvelopeSimple,
  CheckCircle,
  BellRinging,
  ForkKnife,
  X,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import {
  acknowledgeContactAction,
  submitContactAction,
} from "@/domain/guest/contact-action";
import { Segmented, Field, inputClass } from "@/components/ui/form";
import { MoerisPhoneInput } from "@/components/ui/phone-input";
import type { Value } from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";

type Channel = "phone" | "email";

const MERCI_STORAGE_KEY = "mt_contact_merci";

export function ContactForm() {
  const router = useRouter();
  const [channel, setChannel] = useState<Channel>("phone");
  const [phone, setPhone] = useState<Value>();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(MERCI_STORAGE_KEY) === "1") {
        setShowPopup(true);
      }
    } catch {
      /* private mode */
    }
  }, []);

  const openMerci = () => {
    try {
      sessionStorage.setItem(MERCI_STORAGE_KEY, "1");
    } catch {
      /* private mode */
    }
    setShowPopup(true);
  };

  const handleFinish = () => {
    try {
      sessionStorage.removeItem(MERCI_STORAGE_KEY);
    } catch {
      /* private mode */
    }
    setShowPopup(false);
    startTransition(async () => {
      await acknowledgeContactAction();
      router.push("/menu");
    });
  };

  return (
    <>
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
            openMerci();
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
          onClick={() => router.push("/menu")}
        >
          Non merci
        </button>
      </form>

      {mounted && showPopup
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-popup-title"
            >
              <div className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-border/80 bg-surface-base p-6 text-center shadow-lift">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full bg-surface-raised text-ink-secondary transition-colors hover:text-ink-primary"
                  aria-label="Fermer"
                >
                  <X size={18} weight="bold" />
                </button>

                <div className="flex size-14 items-center justify-center rounded-full bg-sage/20 text-sage-deep">
                  <CheckCircle size={32} weight="fill" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3
                    id="contact-popup-title"
                    className="font-display text-xl font-bold text-ink-primary"
                  >
                    C&apos;est bien noté&nbsp;!
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-secondary">
                    Ton contact a bien été enregistré. On te tiendra informé des
                    prochaines soirées de la Résidence Moeris.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-ink-primary">
                  <Sparkle size={14} weight="fill" />
                  <span>À très vite à la Résidence Moeris</span>
                </div>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 px-5 text-sm font-bold text-ink-onaccent shadow-lift transition-all hover:bg-accent-deep active:scale-95"
                >
                  <ForkKnife size={18} weight="bold" />
                  <span>Voir nos cartes & menus</span>
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
