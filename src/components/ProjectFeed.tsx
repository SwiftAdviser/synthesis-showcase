"use client";

import { useState, useMemo, Suspense } from "react";
import type { Project, Track } from "@/lib/types";
import { filterProjects, getDisplayFramework, getDisplayHarness } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { useFilters } from "@/hooks/useFilters";
import { FilterSidebar } from "./FilterSidebar";
import { ProjectCard } from "./project/ProjectCard";
import { MandateCTA } from "./mandate/MandateCTA";

const MANDATE_INSERT_AFTER = 10;

interface Props {
  projects: Project[];
  tracks: Track[];
}

function FeedInner({ projects, tracks }: Props) {
  const [filters, setFilters] = useFilters();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filtered = useMemo(() => filterProjects(projects, filters), [projects, filters]);
  const visible = filtered.slice(0, visibleCount);

  // Compute filter options from all projects
  const trackOptions = useMemo(() => {
    const counts = new Map<string, { slug: string; count: number }>();
    for (const p of projects) {
      for (const t of p.tracks) {
        const entry = counts.get(t.name) ?? { slug: t.slug, count: 0 };
        entry.count++;
        counts.set(t.name, entry);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, { slug, count }]) => ({ value: slug, label: name, count }));
  }, [projects]);

  const modelOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      const m = p.submissionMetadata.model;
      if (m) counts.set(m, (counts.get(m) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count }));
  }, [projects]);

  const frameworkOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      const f = getDisplayFramework(p.submissionMetadata);
      if (f && f !== "Unknown") counts.set(f, (counts.get(f) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count }));
  }, [projects]);

  const harnessOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      const h = getDisplayHarness(p.submissionMetadata);
      if (h && h !== "Unknown") counts.set(h, (counts.get(h) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count }));
  }, [projects]);

  // Active filter pills
  const activePills = [
    ...filters.tracks.map((v) => ({
      key: `track:${v}`,
      label: trackOptions.find((t) => t.value === v)?.label ?? v,
      remove: () =>
        setFilters({ tracks: filters.tracks.filter((t) => t !== v) }),
    })),
    ...filters.models.map((v) => ({
      key: `model:${v}`,
      label: v,
      remove: () =>
        setFilters({ models: filters.models.filter((m) => m !== v) }),
    })),
    ...filters.frameworks.map((v) => ({
      key: `fw:${v}`,
      label: v,
      remove: () =>
        setFilters({
          frameworks: filters.frameworks.filter((f) => f !== v),
        }),
    })),
    ...filters.harnesses.map((v) => ({
      key: `h:${v}`,
      label: v,
      remove: () =>
        setFilters({
          harnesses: filters.harnesses.filter((h) => h !== v),
        }),
    })),
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <FilterSidebar
        tracks={trackOptions}
        models={modelOptions}
        frameworks={frameworkOptions}
        harnesses={harnessOptions}
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="flex-1 min-w-0">
        {activePills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {activePills.map((pill) => (
              <button
                key={pill.key}
                onClick={pill.remove}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
              >
                {pill.label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-text-dim mb-4 font-mono">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>

        <div className="space-y-3">
          {visible.map((p, i) => (
            <div key={p.uuid}>
              <ProjectCard project={p} index={i} />
              {i === MANDATE_INSERT_AFTER - 1 && visible.length > MANDATE_INSERT_AFTER && (
                <div className="mt-3">
                  <MandateCTA trackNames={[]} variant="banner" />
                </div>
              )}
            </div>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <button
            onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
            className="mt-6 w-full py-3 rounded-xl glassmorphic text-sm text-text-secondary hover:text-text-primary hover:border-text-dim transition-colors"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-dim text-sm">No projects match your filters.</p>
            <button
              onClick={() =>
                setFilters({
                  tracks: [],
                  models: [],
                  frameworks: [],
                  harnesses: [],
                  search: "",
                })
              }
              className="text-accent text-sm mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectFeed(props: Props) {
  return (
    <Suspense>
      <FeedInner {...props} />
    </Suspense>
  );
}
