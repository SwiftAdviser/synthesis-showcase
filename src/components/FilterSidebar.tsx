"use client";

import { useState } from "react";
import type { FilterState, SortOption } from "@/lib/types";

interface FilterOption {
  value: string;
  label?: string;
  count: number;
}

interface Props {
  tracks: FilterOption[];
  models: FilterOption[];
  frameworks: FilterOption[];
  harnesses: FilterOption[];
  filters: FilterState;
  onFilterChange: (update: Partial<FilterState>) => void;
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, 6);

  return (
    <div className="py-3">
      <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-2">
        {title}
      </h4>
      <div className="space-y-1">
        {visible.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer group text-sm py-0.5"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="accent-accent w-3.5 h-3.5 rounded"
            />
            <span className="text-text-secondary group-hover:text-text-primary transition-colors truncate flex-1 text-xs">
              {opt.label ?? opt.value}
            </span>
            <span className="text-[10px] font-mono text-text-dim">{opt.count}</span>
          </label>
        ))}
      </div>
      {options.length > 6 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-accent mt-1.5 hover:underline"
        >
          {expanded ? "Show less" : `Show all ${options.length}`}
        </button>
      )}
    </div>
  );
}

export function FilterSidebar({
  tracks,
  models,
  frameworks,
  harnesses,
  filters,
  onFilterChange,
}: Props) {
  const toggle = (key: keyof Pick<FilterState, "tracks" | "models" | "frameworks" | "harnesses">, value: string) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ [key]: next });
  };

  const minScore = filters.minScore ?? 0;
  const hasFilters =
    filters.tracks.length > 0 ||
    filters.models.length > 0 ||
    filters.frameworks.length > 0 ||
    filters.harnesses.length > 0 ||
    minScore > 0;

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="glassmorphic rounded-xl p-4 divide-y divide-border sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="pb-3 flex items-center justify-between">
          <span className="font-accent text-xs uppercase tracking-wider text-text-secondary">
            Filters
          </span>
          {hasFilters && (
            <button
              onClick={() =>
                onFilterChange({
                  tracks: [],
                  models: [],
                  frameworks: [],
                  harnesses: [],
                  minScore: 0,
                })
              }
              className="text-[10px] text-accent hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <FilterSection
          title="Track"
          options={tracks}
          selected={filters.tracks}
          onToggle={(v) => toggle("tracks", v)}
        />
        <FilterSection
          title="Model"
          options={models}
          selected={filters.models}
          onToggle={(v) => toggle("models", v)}
        />
        <FilterSection
          title="Framework"
          options={frameworks}
          selected={filters.frameworks}
          onToggle={(v) => toggle("frameworks", v)}
        />
        <FilterSection
          title="Harness"
          options={harnesses}
          selected={filters.harnesses}
          onToggle={(v) => toggle("harnesses", v)}
        />

        <div className="pt-3">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-2">
            Min. Score
          </h4>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => onFilterChange({ minScore: minScore === s ? 0 : s })}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  minScore === s
                    ? "bg-accent text-bg-base"
                    : "bg-bg-raised text-text-dim hover:text-text-secondary"
                }`}
              >
                {s === 0 ? "All" : `${s}\u2605`}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-2">
            Sort
          </h4>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange({ sort: e.target.value as SortOption })}
            className="w-full bg-bg-raised border border-border rounded-lg px-2 py-1.5 text-xs text-text-secondary"
          >
            <option value="newest">Newest first</option>
            <option value="commits">Most commits</option>
            <option value="alphabetical">A to Z</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
