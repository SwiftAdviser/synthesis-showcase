import Image from "next/image";

const HEADLINE = "Increase your chances to win";
const BULLETS = [
  "Most agents in the hackathon are exposed to prompt injection",
  "This might cause overspending and loss of funds",
  "Security is a crucial part of the hackathon",
];
const CTA_TEXT = "Free for participants";
const CTA_URL = "https://mandate.md";

interface Props {
  trackNames?: string[];
  variant?: "sidebar" | "banner";
}

export function MandateCTA({ variant = "sidebar" }: Props) {
  if (variant === "banner") {
    return (
      <div className="relative rounded-2xl overflow-hidden noise-bg mandate-glow border border-accent/20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/8 via-bg-base to-bg-base" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <div className="relative px-6 py-10 sm:px-12 sm:py-14 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-6">
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

          <h3 className="font-accent text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight max-w-2xl mx-auto">
            {HEADLINE}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-sm text-text-secondary">
            {BULLETS.map((b, i) => (
              <span key={b} className="flex items-center gap-2">
                {i > 0 && <span className="hidden sm:inline text-border">|</span>}
                <span className="text-accent text-xs">&#10003;</span>
                {b}
              </span>
            ))}
          </div>

          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-accent text-bg-base text-sm font-bold uppercase tracking-wide hover:scale-105 hover:shadow-[0_0_40px_rgba(0,183,61,0.35)] transition-all duration-200"
          >
            {CTA_TEXT}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden noise-bg mandate-glow border border-accent/20">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/80 via-accent/5 to-bg-surface/80" />
      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-3">
          <Image
            src="/mandate-logo.png"
            alt="Mandate"
            width={32}
            height={32}
            className="rounded-lg shadow-[0_0_16px_rgba(0,183,61,0.35)]"
          />
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-dim">
            Mandate
          </span>
        </div>

        <h4 className="font-accent text-lg font-bold leading-snug">
          {HEADLINE}
        </h4>

        <ul className="mt-3 space-y-1.5">
          {BULLETS.map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-accent mt-0.5">&#8250;</span>
              {b}
            </li>
          ))}
        </ul>

        <a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg-base text-xs font-semibold hover:scale-105 hover:shadow-[0_0_24px_rgba(0,183,61,0.3)] transition-all duration-200"
        >
          {CTA_TEXT}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </div>
  );
}
