"use client";

import Link from "next/link";
import {
  FacebookLogo,
  TiktokLogo,
  InstagramLogo,
  Phone,
  MapPin,
  WhatsappLogo,
  Star,
  ForkKnife,
} from "@phosphor-icons/react/dist/ssr";
import { MoerisMark } from "@/components/ui/moeris-mark";

export function ClientFooter() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-surface-base/80 pt-8 pb-10 text-ink-secondary backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 sm:px-6 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand & Identity */}
          <div className="flex flex-col gap-3">
            <MoerisMark href="/menu" />
            <p className="max-w-xs text-xs leading-relaxed text-ink-secondary">
              Gastronomie, sérénité & ambiance conviviale à la Résidence Moeris.
            </p>
          </div>

          {/* Quick Links & Contact */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-primary">
              Contact & Réservation
            </p>
            <div className="flex flex-col gap-2 text-xs text-ink-secondary">
              <a
                href="tel:+22890000000"
                className="inline-flex items-center gap-2 transition-colors hover:text-accent-dark"
              >
                <Phone size={16} weight="bold" className="shrink-0 text-accent-dark" />
                <span>+228 90 00 00 00</span>
              </a>
              <a
                href="https://wa.me/22890000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-accent-dark"
              >
                <WhatsappLogo size={16} weight="bold" className="shrink-0 text-emerald-600" />
                <span>WhatsApp Moeris</span>
              </a>
              <div className="inline-flex items-center gap-2">
                <MapPin size={16} weight="bold" className="shrink-0 text-accent-dark" />
                <span>Lomé, Togo · Résidence Moeris</span>
              </div>
            </div>
          </div>

          {/* Social Networks */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-primary">
              Suivez-nous
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Résidence Moeris"
                className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-raised text-ink-primary shadow-soft transition-all hover:border-accent hover:bg-accent hover:text-ink-onaccent"
              >
                <FacebookLogo size={20} weight="bold" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Résidence Moeris"
                className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-raised text-ink-primary shadow-soft transition-all hover:border-accent hover:bg-accent hover:text-ink-onaccent"
              >
                <TiktokLogo size={20} weight="bold" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Résidence Moeris"
                className="flex size-10 items-center justify-center rounded-full border border-border bg-surface-raised text-ink-primary shadow-soft transition-all hover:border-accent hover:bg-accent hover:text-ink-onaccent"
              >
                <InstagramLogo size={20} weight="bold" />
              </a>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs">
              <Link
                href="/menu"
                className="inline-flex items-center gap-1 font-semibold text-ink-secondary hover:text-ink-primary"
              >
                <ForkKnife size={14} weight="bold" />
                <span>La carte</span>
              </Link>
              <span className="text-border-strong">•</span>
              <Link
                href="/avis"
                className="inline-flex items-center gap-1 font-semibold text-ink-secondary hover:text-ink-primary"
              >
                <Star size={14} weight="bold" />
                <span>Donner un avis</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-border/50 pt-4 text-center text-[11px] text-ink-secondary/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Résidence Moeris. Tous droits réservés.</p>
          <p className="text-[11px]">Fait avec soin pour la maison Moeris.</p>
        </div>
      </div>
    </footer>
  );
}
