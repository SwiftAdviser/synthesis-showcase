const PITCH_POINTS = [
  "Most agents are exposed to prompt injection",
  "This might cause overspending and loss of funds",
  "Security is a crucial part of the hackathon",
];

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
          <h3 className="font-accent text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight max-w-2xl mx-auto">
            Increase your chances to win
          </h3>

          <div className="space-y-2.5 mt-6">
            {PITCH_POINTS.map((p) => (
              <div
                key={p}
                className="flex items-center gap-2.5 text-sm text-text-secondary justify-center"
              >
                <span className="text-accent shrink-0">&rsaquo;</span>
                {p}
              </div>
            ))}
          </div>

          <p className="mt-5 text-[11px] font-mono text-accent uppercase tracking-wider">
            Free for participants
          </p>

          <a
            href="https://mandate.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-accent text-bg-base text-sm font-bold uppercase tracking-wide hover:scale-105 hover:shadow-[0_0_40px_rgba(0,183,61,0.35)] transition-all duration-200"
          >
            See how it works
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
        <h4 className="font-accent text-base font-bold leading-snug mb-4">
          Increase your chances to win
        </h4>

        <div className="space-y-2.5">
          {PITCH_POINTS.map((p) => (
            <div
              key={p}
              className="flex gap-2.5 text-xs text-text-secondary leading-relaxed"
            >
              <span className="text-accent shrink-0 mt-px">&rsaquo;</span>
              {p}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <span className="text-[11px] font-mono text-accent uppercase tracking-wider">
            Free for participants
          </span>
        </div>

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
