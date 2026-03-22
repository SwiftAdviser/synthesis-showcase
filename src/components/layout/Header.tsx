"use client";

import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 glassmorphic">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-bg-base font-bold text-sm font-accent">M</span>
            </div>
            <span className="font-display text-lg tracking-tight">
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
            <Link href="/preview" className="hover:text-text-primary transition-colors">
              Preview
            </Link>
            <a
              href="https://synthesis.devfolio.co/submission/skill.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Submit
            </a>
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
