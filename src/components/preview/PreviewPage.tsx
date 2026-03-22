"use client";

import { useState, useEffect, useCallback } from "react";
import { jsonToProject, encodePreviewData, decodePreviewData, getReadinessChecklist } from "@/lib/preview-utils";
import { getIntentionLabel } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { ProjectHero } from "@/components/project/ProjectHero";
import { TechBadges } from "@/components/project/TechBadges";
import { BuildTimeline } from "@/components/project/BuildTimeline";
import { TeamSpotlight } from "@/components/project/TeamSpotlight";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { MandateCTA } from "@/components/mandate/MandateCTA";

export function PreviewPage() {
  const [jsonText, setJsonText] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(true);

  // Hydrate from URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("d");
    if (encoded) {
      const decoded = decodePreviewData(encoded);
      if (decoded) {
        setJsonText(decoded);
        tryParse(decoded);
      }
    }
  }, []);

  const tryParse = useCallback((text: string) => {
    if (!text.trim()) {
      setProject(null);
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      const proj = jsonToProject(parsed);
      if (!proj.name && !proj.description) {
        setError("JSON parsed but no project data found. Check the format.");
        setProject(null);
        return;
      }
      setProject(proj);
      setError(null);
    } catch (e) {
      setError(e instanceof SyntaxError ? "Invalid JSON syntax" : (e as Error).message);
      setProject(null);
    }
  }, []);

  const handleChange = useCallback((text: string) => {
    setJsonText(text);
    tryParse(text);
  }, [tryParse]);

  const handleShare = useCallback(async () => {
    if (!jsonText.trim()) return;
    const encoded = encodePreviewData(jsonText);
    const url = `${window.location.origin}/preview?d=${encoded}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [jsonText]);

  const checklist = project ? getReadinessChecklist(project) : [];
  const requiredPassed = checklist.filter(i => i.status === "fail").length === 0 && checklist.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Preview Your Submission
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent/15 text-accent border border-accent/30">
            Beta
          </span>
        </div>
        <p className="text-text-secondary max-w-2xl">
          See how your project will look on the Synthesis Showcase before you publish.
          Publishing on Devfolio is irreversible: preview first, ship with confidence.
        </p>
        <div className="mt-3 glassmorphic rounded-lg px-4 py-3 border-l-2 border-l-accent max-w-2xl">
          <p className="text-sm text-text-secondary">
            <span className="text-accent font-mono text-xs">TIP</span>{" "}
            Ask your AI agent: <span className="text-text-primary font-medium">&quot;Show me how my project will look on synthesis.mandate.md before I publish.&quot;</span>{" "}
            Your agent can fetch your draft project JSON and paste it here.
          </p>
        </div>
      </div>

      {/* JSON Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
            Project JSON
          </label>
          <div className="flex items-center gap-2">
            {project && (
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-raised border border-border hover:border-accent/50 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {copied ? "Copied." : "Share preview"}
              </button>
            )}
          </div>
        </div>
        <textarea
          value={jsonText}
          onChange={(e) => handleChange(e.target.value)}
          placeholder='Paste your Devfolio project JSON here... (from GET /projects/:uuid or your draft response)'
          rows={8}
          spellCheck={false}
          className="w-full rounded-xl bg-bg-raised border border-border p-4 font-mono text-sm text-text-primary placeholder:text-text-dim/50 focus:outline-none focus:border-accent/50 transition-colors resize-y"
        />
        {error && (
          <p className="mt-2 text-sm text-red-400 font-mono">{error}</p>
        )}
      </div>

      {/* Submission Checklist */}
      {project && (
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
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
                  {item.detail && (
                    <span className="text-[10px] text-text-dim">({item.detail})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!project && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-raised flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-dim">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <p className="text-text-dim text-sm max-w-sm">
            Paste your project JSON above to see a live preview of how it will appear on the Synthesis Showcase.
          </p>
        </div>
      )}

      {/* Live Preview */}
      {project && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
              Live Preview
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

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
        </div>
      )}

      {/* Footer attribution */}
      <div className="mt-16 pt-6 border-t border-border text-center">
        <p className="text-[11px] font-mono text-text-dim">
          Preview tool by{" "}
          <a href="https://mandate.md" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Mandate
          </a>
          {" "}: transaction intelligence for autonomous agents
        </p>
      </div>
    </div>
  );
}
