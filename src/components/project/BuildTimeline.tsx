import { formatDuration, formatDate } from "@/lib/utils";
import type { SubmissionMetadata } from "@/lib/types";

interface Props {
  metadata: SubmissionMetadata;
}

export function BuildTimeline({ metadata }: Props) {
  const { firstCommitAt, lastCommitAt, commitCount, contributorCount } = metadata;

  if (!firstCommitAt || !lastCommitAt) return null;

  const duration = formatDuration(firstCommitAt, lastCommitAt);

  return (
    <div className="glassmorphic rounded-xl p-5">
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-4">
        Build Timeline
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="h-2 bg-bg-raised rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-dim to-accent rounded-full w-full" />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] font-mono text-text-dim">
            <span>{formatDate(firstCommitAt)}</span>
            <span>{formatDate(lastCommitAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <div>
          <span className="font-mono text-accent font-bold">{duration}</span>
          <span className="text-text-dim text-xs ml-1.5">build time</span>
        </div>
        {commitCount && (
          <div>
            <span className="font-mono text-text-primary font-bold">{commitCount}</span>
            <span className="text-text-dim text-xs ml-1.5">commits</span>
          </div>
        )}
        {contributorCount && (
          <div>
            <span className="font-mono text-text-primary font-bold">{contributorCount}</span>
            <span className="text-text-dim text-xs ml-1.5">
              {contributorCount === 1 ? "contributor" : "contributors"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
