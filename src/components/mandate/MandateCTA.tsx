import { getCTAForTracks } from "@/lib/constants";

interface Props {
  trackNames: string[];
  variant?: "sidebar" | "banner";
}

export function MandateCTA({ trackNames, variant = "sidebar" }: Props) {
  const cta = getCTAForTracks(trackNames);

  if (variant === "banner") {
    return (
      <div className="relative rounded-2xl overflow-hidden noise-bg mandate-glow border border-accent/20">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-accent/5 to-bg-base" />
        <div className="relative px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Logo + Headline */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,183,61,0.4)]">
                  <span className="text-bg-base font-bold text-base font-accent">M</span>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-text-dim">
                  Mandate
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl leading-tight">
                {cta.headline}
              </h3>
            </div>

            {/* Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              {cta.bullets.map((b) => (
                <div key={b} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent mt-0.5 text-lg leading-none">&#8250;</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://mandate.md"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-bg-base text-sm font-semibold hover:scale-105 hover:shadow-[0_0_30px_rgba(0,183,61,0.3)] transition-all duration-200"
            >
              Learn more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden noise-bg mandate-glow border border-accent/20">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/80 via-accent/5 to-bg-surface/80" />
      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_16px_rgba(0,183,61,0.35)]">
            <span className="text-bg-base font-bold text-xs font-accent">M</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-dim">
            Mandate
          </span>
        </div>

        <h4 className="font-display text-lg leading-snug">
          {cta.headline}
        </h4>

        <ul className="mt-3 space-y-1.5">
          {cta.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent mt-0.5">&#8250;</span>
              {b}
            </li>
          ))}
        </ul>

        <a
          href="https://mandate.md"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg-base text-xs font-semibold hover:scale-105 hover:shadow-[0_0_24px_rgba(0,183,61,0.3)] transition-all duration-200"
        >
          Learn more
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </div>
  );
}
