/**
 * Accueil illustration slot — decorative (alt="").
 * Abstract plate + pattern blobs (placeholder until final art).
 */
export function IllustrationPanel({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] ${className}`}
      aria-hidden="true"
    >
      {/* pattern-b organic blob */}
      <div
        className="illustration-blob absolute -right-2 top-6 h-[42%] w-[42%] rounded-[60%_40%_55%_45%] bg-pattern-b opacity-90 motion-safe:animate-[blob-drift_8s_ease-in-out_infinite]"
      />
      {/* pattern-a soft glow */}
      <div
        className="illustration-blob absolute -left-3 bottom-8 h-[36%] w-[36%] rounded-[45%_55%_40%_60%] bg-pattern-a opacity-80 motion-safe:animate-[blob-drift_10s_ease-in-out_infinite_reverse]"
      />
      {/* plate hero */}
      <div
        className="absolute inset-[12%] rounded-full shadow-[0_22px_44px_rgba(26,26,0,0.24),0_0_0_8px_var(--citrus-surface-base)]"
        style={{
          background: `
            radial-gradient(circle at 30% 26%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 16%),
            radial-gradient(circle at 68% 68%, #5C3A22 0%, rgba(92,58,34,0) 36%),
            radial-gradient(circle at 22% 68%, #3F6B34 0%, rgba(63,107,52,0) 30%),
            radial-gradient(circle at 76% 26%, #E8A25F 0%, rgba(232,162,95,0) 42%),
            radial-gradient(circle at 50% 50%, #F0C46B 0%, #D89A45 55%, #B97A2E 100%)
          `,
        }}
        role="img"
        aria-label=""
      />
    </div>
  );
}
