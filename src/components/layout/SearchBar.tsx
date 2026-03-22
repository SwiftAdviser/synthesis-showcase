"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchBar({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else {
          // re-open triggers parent state
        }
      }
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      if (!allProjects) {
        const el = document.getElementById("__projects_data");
        if (el) {
          try {
            setAllProjects(JSON.parse(el.textContent ?? "[]"));
          } catch {
            setAllProjects([]);
          }
        }
      }
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open, allProjects]);

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      if (!q.trim() || !allProjects) {
        setResults([]);
        return;
      }
      const lower = q.toLowerCase();
      setResults(
        allProjects
          .filter(
            (p) =>
              p.name.toLowerCase().includes(lower) ||
              p.description.toLowerCase().includes(lower) ||
              p.team.name.toLowerCase().includes(lower)
          )
          .slice(0, 8)
      );
    },
    [allProjects]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative max-w-xl mx-auto mt-[20vh] px-4" onClick={(e) => e.stopPropagation()}>
        <div className="glassmorphic rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-dim shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search projects..."
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-dim outline-none text-sm"
            />
            <kbd className="px-1.5 py-0.5 rounded bg-bg-raised text-[10px] font-mono text-text-dim">
              ESC
            </kbd>
          </div>

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((p) => (
                <Link
                  key={p.uuid}
                  href={`/projects/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-raised transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, hsl(${Math.abs(p.name.split("").reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0)) % 360}, 50%, 40%), hsl(${(Math.abs(p.name.split("").reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0)) + 60) % 360}, 50%, 40%))`,
                    }}
                  >
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-text-dim truncate">{p.team.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-text-dim">
              No projects found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
