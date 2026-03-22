import Link from "next/link";
import type { Project } from "@/lib/types";
import { hashGradient } from "@/lib/utils";
import { getReadinessScore } from "@/lib/preview-utils";
import { TechBadges } from "./TechBadges";

interface Props {
  project: Project;
  index?: number;
}

function ReadinessStars({ score }: { score: number }) {
  return (
    <div className="group/stars relative inline-flex items-center gap-px cursor-help">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill={i <= score ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i <= score ? "text-accent" : "text-text-dim/40"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-bg-base border border-border text-[10px] text-text-secondary whitespace-nowrap opacity-0 pointer-events-none group-hover/stars:opacity-100 transition-opacity duration-200 z-10 shadow-lg">
        <span className="text-text-primary font-medium">{score}/5</span> submission readiness
        <br />
        <span className="text-text-dim">Based on completeness of required fields</span>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
      </div>
    </div>
  );
}

export function ProjectCard({ project, index = 0 }: Props) {
  const p = project;
  const commitCount = p.submissionMetadata.commitCount ?? 0;
  const commitPercent = Math.min(100, (commitCount / 100) * 100);
  const score = getReadinessScore(p);

  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group block glassmorphic rounded-xl p-4 hover:glow-border transition-all duration-200 hover:-translate-y-0.5 animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div
          className="w-20 h-14 sm:w-28 sm:h-20 rounded-lg shrink-0 overflow-hidden relative noise-bg"
          style={{ background: p.coverImageURL ? undefined : hashGradient(p.name) }}
        >
          {p.coverImageURL ? (
            <img
              src={p.coverImageURL}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="absolute bottom-1 right-2 text-3xl sm:text-4xl font-display text-white/20 leading-none select-none">
              {p.name.charAt(0).toUpperCase()}
            </span>
          )}
          {p.videoURL && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white" className="ml-0.5">
                  <polygon points="2,1 9,5 2,9" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate group-hover:text-accent transition-colors">
                {p.name}
              </h3>
              <p className="text-xs text-text-dim mt-0.5">{p.team.name}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ReadinessStars score={score} />
              {commitCount > 0 && (
                <span className="text-[10px] font-mono text-text-dim bg-bg-raised px-1.5 py-0.5 rounded">
                  {commitCount}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
            {p.description}
          </p>

          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            {p.tracks.slice(0, 2).map((t) => (
              <span
                key={t.uuid}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-accent bg-accent/10 text-accent border border-accent/20"
              >
                {t.name.length > 30 ? t.name.slice(0, 30) + "..." : t.name}
              </span>
            ))}
            <TechBadges metadata={p.submissionMetadata} compact />
          </div>
        </div>
      </div>

      {/* Commit activity bar */}
      {commitCount > 0 && (
        <div className="h-0.5 bg-accent/10 mt-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent/60 rounded-full transition-all"
            style={{ width: `${commitPercent}%` }}
          />
        </div>
      )}
    </Link>
  );
}
