"use client";

import { useState } from "react";
import { MandateCTA } from "@/components/mandate/MandateCTA";

const AGENT_PROMPT = `Preview my Synthesis hackathon project submission on synthesis.mandate.md before I publish. Use the same project JSON I would submit to Devfolio and POST it to https://synthesis.mandate.md/api/preview to get a preview URL.`;

export function PreviewPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(AGENT_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-accent text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Preview Before You Ship
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          See exactly how your project will look on the Synthesis Showcase.
          Publishing on Devfolio is irreversible. Preview first.
        </p>
      </div>

      {/* Agent Command Block */}
      <div className="relative rounded-2xl overflow-hidden noise-bg mandate-glow border border-accent/30 mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-accent/5" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Agent Command
            </span>
          </div>

          <div className="glassmorphic rounded-xl p-4 sm:p-5 mb-4">
            <p className="text-sm sm:text-base text-text-primary leading-relaxed font-medium">
              {AGENT_PROMPT}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-text-dim max-w-md">
              Copy this to your AI agent (Claude Code, Cursor, Codex, etc.).
              It will POST your project data and return a private preview URL.
            </p>
            <button
              onClick={handleCopy}
              className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                copied
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-accent text-bg-base hover:scale-105 hover:shadow-[0_0_30px_rgba(0,183,61,0.3)]"
              }`}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-6 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Copy the prompt",
              desc: "Paste the command above into your AI agent's chat",
            },
            {
              step: "02",
              title: "Agent sends your data",
              desc: "Your agent POSTs your project JSON to our preview API",
            },
            {
              step: "03",
              title: "Get your preview URL",
              desc: "A private link valid for 24 hours, no account needed",
            },
          ].map((item) => (
            <div key={item.step} className="glassmorphic rounded-xl p-5">
              <span className="font-mono text-2xl font-bold text-accent/40">{item.step}</span>
              <h3 className="font-display text-base font-semibold mt-2 mb-1">{item.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API reference for agents */}
      <div className="glassmorphic rounded-xl p-5 sm:p-6 mb-16">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-3">
          For AI Agents: API Reference
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <code className="text-accent font-mono text-xs">POST https://synthesis.mandate.md/api/preview</code>
            <p className="text-text-dim text-xs mt-1">
              Body: same Project JSON shape as Devfolio submission (name, description, submissionMetadata, tracks, etc.)
            </p>
          </div>
          <div>
            <code className="text-text-secondary font-mono text-xs">
              {`Response: { "url": "https://synthesis.mandate.md/preview/{hash}", "expiresAt": "..." }`}
            </code>
          </div>
          <div className="flex gap-4 text-[11px] text-text-dim font-mono pt-1">
            <span>No API key needed</span>
            <span>24h TTL</span>
            <span>100 req/hr limit</span>
          </div>
        </div>
      </div>

      {/* Mandate CTA */}
      <MandateCTA trackNames={[]} variant="banner" />
    </div>
  );
}
