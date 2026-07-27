import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Ma table — Résidence Moeris",
  description:
    "Le fil de ton séjour à la Résidence Moeris. Un scan, et on s'occupe de toi.",
  icons: {
    icon: "/img/moeris-emblem.png",
    apple: "/img/moeris-emblem.png",
  },
  openGraph: {
    title: "Ma table — Résidence Moeris",
    description:
      "Le fil de ton séjour à la Résidence Moeris. Un scan, et on s'occupe de toi.",
    images: ["/img/illus-accueil.png"],
    locale: "fr_SN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fcf6e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${fredoka.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-base text-ink-primary font-sans">
        {children}
        <div className="grain-overlay" aria-hidden />
        <Analytics />
      </body>
    </html>
  );
}
