"use client";

import { useState, useEffect, use } from "react";
import { getReadinessChecklist } from "@/lib/preview-utils";
import { getIntentionLabel } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { ProjectHero } from "@/components/project/ProjectHero";
import { TechBadges } from "@/components/project/TechBadges";
import { BuildTimeline } from "@/components/project/BuildTimeline";
import { TeamSpotlight } from "@/components/project/TeamSpotlight";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { MandateCTA } from "@/components/mandate/MandateCTA";

interface Props {
  paramsPromise: Promise<{ hash: string }>;
}

export function PreviewHashPage({ paramsPromise }: Props) {
  const { hash } = use(paramsPromise);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(true);

  useEffect(() => {
    fetch(`/api/preview/${hash}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Preview not found");
        }
        return res.json();
      })
      .then((data) => setProject(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [hash]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-text-dim text-sm mt-4">Loading preview...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-bg-raised flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-dim">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-bold mb-2">Preview Not Found</h2>
        <p className="text-text-dim text-sm max-w-sm mx-auto">
          {error || "This preview may have expired (24h limit) or the URL is invalid."}
        </p>
        <a href="/preview" className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-accent text-bg-base text-sm font-semibold hover:bg-accent/90 transition-colors">
          Create a new preview
        </a>
      </div>
    );
  }

  const [sharecopied, setSharecopied] = useState(false);
  const checklist = getReadinessChecklist(project);
  const requiredPassed = checklist.filter(i => i.status === "fail").length === 0;
  const missedItems = checklist.filter(i => i.status !== "pass");

  const handleShareMissed = async () => {
    const lines = missedItems.map(i =>
      `- ${i.label}${i.status === "fail" ? " (required)" : " (recommended)"}`
    ).join("\n");
    const prompt = `My Synthesis project submission preview is missing these fields. Please update my project submission to include them:\n\n${lines}\n\nThen re-submit the preview to https://synthesis.mandate.md/api/preview to get an updated preview URL.`;
    await navigator.clipboard.writeText(prompt);
    setSharecopied(true);
    setTimeout(() => setSharecopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Preview banner */}
      <div className="mb-8 flex items-center gap-3 flex-wrap">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-accent/15 text-accent border border-accent/30">
          Preview Mode
        </span>
        <span className="text-text-dim text-xs font-mono">
          This is a preview. The project has not been published yet.
        </span>
      </div>

      {/* Submission Checklist */}
      <div className="mb-8 glassmorphic rounded-xl overflow-hidden">
        <button
          onClick={() => setChecklistOpen(!checklistOpen)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-bg-raised/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
              Submission Readiness
            </h3>
            {requiredPassed ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Ready
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/15 text-red-400 border border-red-500/30">
                {checklist.filter(i => i.status === "fail").length} required missing
              </span>
            )}
          </div>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`text-text-dim transition-transform ${checklistOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {checklistOpen && (
          <div className="px-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-2 py-1">
                {item.status === "pass" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {item.status === "fail" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
                {item.status === "warn" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
                <span className={`text-xs ${item.status === "fail" ? "text-text-primary" : "text-text-secondary"}`}>
                  {item.label}
                </span>
                {item.status !== "pass" && (
                  <span className={`text-[10px] font-mono ${item.status === "fail" ? "text-red-400" : "text-amber-400"}`}>
                    (missed)
                  </span>
                )}
                {item.detail && item.status === "pass" && (
                  <span className="text-[10px] text-text-dim">({item.detail})</span>
                )}
              </div>
            ))}
          </div>
        )}
        {checklistOpen && missedItems.length > 0 && (
          <div className="px-5 pb-4 pt-1 border-t border-border">
            <button
              onClick={handleShareMissed}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                sharecopied
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {sharecopied ? "Copied. Paste to your agent." : `Share ${missedItems.length} missed fields with agent`}
            </button>
          </div>
        )}
      </div>

      {/* Project Preview */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-8">
          <ProjectHero
            name={project.name}
            videoURL={project.videoURL}
            coverImageURL={project.coverImageURL}
          />

          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              {project.name || "Untitled Project"}
            </h1>
            <p className="text-text-secondary mt-1">{project.team.name || "Your Team"}</p>
            <div className="mt-4">
              <TechBadges metadata={project.submissionMetadata} />
            </div>
          </div>

          {project.description && (
            <div className="prose prose-invert max-w-none">
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {project.problemStatement && (
            <div className="border-l-2 border-accent pl-5">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-2">
                Problem Statement
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
          )}

          <BuildTimeline metadata={project.submissionMetadata} />
          <TeamSpotlight members={project.members} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <MandateCTA trackNames={project.tracks.map((t) => t.name)} />

          {project.repoURL && (
            <ProjectLinks
              repoURL={project.repoURL}
              deployedURL={project.deployedURL}
              videoURL={project.videoURL}
            />
          )}

          {project.tracks.length > 0 && (
            <div className="glassmorphic rounded-xl p-4">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-3">
                Tracks
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tracks.map((t) => (
                  <span
                    key={t.uuid || t.slug || t.name}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.submissionMetadata.intention && (
            <div className="glassmorphic rounded-xl p-4">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-2">
                Intention
              </h3>
              <p className="text-sm text-text-secondary">
                {getIntentionLabel(project.submissionMetadata.intention)}
              </p>
              {project.submissionMetadata.intentionNotes && (
                <p className="text-xs text-text-dim mt-1">
                  {project.submissionMetadata.intentionNotes}
                </p>
              )}
            </div>
          )}

          {project.submissionMetadata.helpfulResources &&
            project.submissionMetadata.helpfulResources.length > 0 && (
              <div className="glassmorphic rounded-xl p-4">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-2">
                  Resources
                </h3>
                <div className="space-y-1">
                  {project.submissionMetadata.helpfulResources.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-text-secondary hover:text-accent transition-colors truncate"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Mandate CTA Banner */}
      <div className="mt-16">
        <MandateCTA trackNames={project.tracks.map((t) => t.name)} variant="banner" />
      </div>
    </div>
  );
}
