import { getCTAForTracks } from "@/lib/constants";

interface Props {
  trackNames: string[];
}

export function MandateCTA({ trackNames }: Props) {
  const cta = getCTAForTracks(trackNames);

  return (
    <div className="glassmorphic rounded-xl p-5 border-l-2 border-l-accent">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <span className="text-bg-base font-bold text-[10px] font-accent">M</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-dim">
          Mandate
        </span>
      </div>

      <h4 className="font-display text-base font-semibold leading-snug">
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
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg-base text-xs font-semibold hover:bg-accent/90 transition-colors"
      >
        Learn more
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </div>
  );
}
