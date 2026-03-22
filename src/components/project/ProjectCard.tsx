import Link from "next/link";
import type { Project } from "@/lib/types";
import { hashGradient } from "@/lib/utils";
import { TechBadges } from "./TechBadges";

interface Props {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: Props) {
  const p = project;
  const commitCount = p.submissionMetadata.commitCount ?? 0;
  const commitPercent = Math.min(100, (commitCount / 100) * 100);

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
            {commitCount > 0 && (
              <span className="text-[10px] font-mono text-text-dim shrink-0 bg-bg-raised px-1.5 py-0.5 rounded">
                {commitCount} commits
              </span>
            )}
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
