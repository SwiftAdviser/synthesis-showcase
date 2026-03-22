import type { Prize } from "@/lib/types";

interface Props {
  prizes: Prize[];
}

export function PrizeTable({ prizes }: Props) {
  if (prizes.length === 0) return null;

  return (
    <div className="glassmorphic rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
          Prizes
        </h3>
      </div>
      <div className="divide-y divide-border">
        {prizes.map((prize) => (
          <div key={prize.uuid} className="px-5 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{prize.name}</p>
              {prize.description && (
                <p className="text-xs text-text-dim mt-0.5 line-clamp-2">
                  {prize.description}
                </p>
              )}
            </div>
            <span className="font-mono text-accent font-bold text-sm shrink-0">
              ${prize.amount.toLocaleString()} {prize.currency.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
