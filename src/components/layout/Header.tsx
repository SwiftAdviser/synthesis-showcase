"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 glassmorphic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="font-accent text-[15px] font-medium tracking-[0.2em] text-accent uppercase">
              Synthesis
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/" className="hover:text-text-primary transition-colors">
              Projects
            </Link>
            <Link href="/stats" className="hover:text-text-primary transition-colors">
              Stats
            </Link>
            <Link
              href="/preview"
              className="group/cta relative inline-flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono text-xs tracking-[0.08em] uppercase text-accent border border-accent/30 overflow-hidden hover:border-accent/60 hover:shadow-[0_0_24px_rgba(0,183,61,0.25)] hover:scale-[1.03] transition-all duration-300"
            >
              <span className="absolute inset-0 bg-accent/5 group-hover/cta:bg-accent/10 transition-colors duration-300" />
              <span className="absolute inset-0 cta-shimmer" />
              <span className="relative flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent cta-pulse" />
                // preview
              </span>
            </Link>
            <a
              href="https://mandate.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
            >
              Mandate
            </a>
          </nav>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-text-dim text-sm hover:border-text-dim transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-bg-raised text-[10px] font-mono text-text-dim">
              <span>&#8984;</span>K
            </kbd>
          </button>
        </div>
      </header>

      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
