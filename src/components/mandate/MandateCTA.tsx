import Image from "next/image";
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
        <div className="absolute inset-0 bg-gradient-to-b from-accent/8 via-bg-base to-bg-base" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <div className="relative px-6 py-10 sm:px-12 sm:py-14 text-center">
          {/* Headline */}
          <h3 className="font-accent text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight max-w-2xl mx-auto">
            Increase your chances to win
          </h3>

          {/* Bullets */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-sm text-text-secondary">
            <span className="flex items-center gap-2">
              <span className="text-accent text-xs">&#9657;</span>
              Most agents are exposed to prompt injection
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-2">
              <span className="text-accent text-xs">&#9657;</span>
              This might cause overspending and loss of funds
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="flex items-center gap-2">
              <span className="text-accent text-xs">&#9657;</span>
              Security is a crucial part of the hackathon
            </span>
          </div>

          <p className="mt-5 text-[11px] font-mono uppercase tracking-[0.25em] text-accent">
            Free for participants
          </p>

          {/* Mandate block */}
          <div className="mt-8 pt-8 border-t border-border/50 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <Image
                src="/mandate-logo.png"
                alt="Mandate"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-text-dim">
                Mandate
              </span>
            </div>

            <p className="text-sm text-text-secondary">
              {cta.headline}
            </p>

            <a
              href="https://mandate.md"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-accent text-bg-base text-sm font-bold uppercase tracking-wide hover:scale-105 hover:shadow-[0_0_40px_rgba(0,183,61,0.35)] transition-all duration-200"
            >
              Learn more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
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
        <h4 className="font-accent text-base font-bold leading-snug">
          Increase your chances to win
        </h4>

        <ul className="mt-4 space-y-3">
          <li className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
            <span className="text-accent mt-0.5 shrink-0">&#9657;</span>
            Most agents are exposed to prompt injection
          </li>
          <li className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
            <span className="text-accent mt-0.5 shrink-0">&#9657;</span>
            This might cause overspending and loss of funds
          </li>
          <li className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
            <span className="text-accent mt-0.5 shrink-0">&#9657;</span>
            Security is a crucial part of the hackathon
          </li>
        </ul>

        <p className="mt-4 text-[10px] font-mono uppercase tracking-widest text-accent">
          Free for participants
        </p>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Image
              src="/mandate-logo.png"
              alt="Mandate"
              width={28}
              height={28}
              className="rounded-lg shadow-[0_0_16px_rgba(0,183,61,0.35)]"
            />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-dim">
              Mandate
            </span>
          </div>

          <h4 className="font-accent text-sm font-semibold leading-snug">
            {cta.headline}
          </h4>

          <ul className="mt-2 space-y-1">
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
    </div>
  );
}
