import Link from "next/link";
import type { Track } from "@/lib/types";
import { getTrackPrizeTotal, formatNumber } from "@/lib/utils";

interface Props {
  track: Track;
  projectCount: number;
}

export function TrackCard({ track, projectCount }: Props) {
  const total = getTrackPrizeTotal(track);

  return (
    <Link
      href={`/tracks/${track.slug}`}
      className="block glassmorphic rounded-xl p-5 min-w-[280px] hover:glow-border transition-all duration-200 hover:-translate-y-0.5"
    >
      <p className="text-[10px] font-mono uppercase tracking-widest text-accent mb-1">
        {track.company}
      </p>
      <h3 className="font-semibold text-sm leading-snug line-clamp-2">
        {track.name}
      </h3>
      <div className="flex items-center gap-3 mt-3 text-xs text-text-dim">
        {total > 0 && (
          <span className="font-mono text-accent">
            ${formatNumber(total)}
          </span>
        )}
        <span className="font-mono">
          {projectCount} {projectCount === 1 ? "project" : "projects"}
        </span>
      </div>
    </Link>
  );
}
