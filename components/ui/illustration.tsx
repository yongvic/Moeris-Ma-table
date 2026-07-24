import Image from "next/image";

export type IllustrationVariant =
  | "accueil"
  | "merci"
  | "commande"
  | "memoire";

const SOURCES: Record<IllustrationVariant, string> = {
  accueil: "/img/illus-accueil.png",
  merci: "/img/illus-merci.png",
  commande: "/img/illus-commande.png",
  memoire: "/img/illus-memoire.png",
};

/**
 * Signature 2D illustration for the 4 key moments (DESIGN.md illustration-panel).
 * Decorative: alt="" — meaning carried by adjacent copy. Warm sun glow + soft float.
 */
export function Illustration({
  variant,
  className = "",
  priority = false,
  glow = true,
  float = true,
}: {
  variant: IllustrationVariant;
  className?: string;
  priority?: boolean;
  glow?: boolean;
  float?: boolean;
}) {
  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[360px] ${className}`}
      aria-hidden="true"
    >
      {glow ? (
        <div className="sun-glow inset-[6%] motion-safe:animate-sun" />
      ) : null}
      <div
        className={`relative h-full w-full overflow-hidden rounded-full bg-surface-raised bezel ${
          float ? "motion-safe:animate-float" : ""
        }`}
      >
        <Image
          src={SOURCES[variant]}
          alt=""
          fill
          sizes="(max-width: 640px) 80vw, 360px"
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}
