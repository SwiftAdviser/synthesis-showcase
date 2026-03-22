import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submission Scoring",
  description:
    "How project readiness scores are calculated on the Synthesis Showcase.",
};

const REQUIRED = [
  { label: "Project name", desc: "Must have a name" },
  { label: "Description", desc: "Explain what you built" },
  { label: "GitHub repo URL", desc: "Public repository required" },
  { label: "At least 1 track", desc: "Select a competition track" },
  { label: "Agent model specified", desc: "Which LLM powers your agent" },
  { label: "Agent framework", desc: "e.g. LangChain, Anthropic SDK, etc." },
  { label: "Agent harness", desc: "e.g. Claude Code, Cursor, Codex, etc." },
];

const RECOMMENDED = [
  { label: "Problem statement", desc: "The specific challenge you're solving" },
  { label: "Demo video URL", desc: "Strongly recommended for human judges" },
  { label: "Live deployment URL", desc: "Judges interact with live deployments" },
  { label: "Tools listed", desc: "Concrete tools/libraries used" },
  { label: "Skills listed", desc: "Agent skills actually loaded" },
];

export default function ScoringPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        Submission Scoring
      </h1>
      <p className="text-text-secondary mb-10 max-w-xl">
        Each project gets a 1-5 readiness score based on how complete the submission is.
        This helps judges prioritize and helps builders identify what's missing.
      </p>

      {/* Formula */}
      <div className="glassmorphic rounded-xl p-5 mb-8">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-3">
          How it works
        </h3>
        <div className="flex items-center gap-3 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full ${i <= 3 ? "bg-accent" : "bg-bg-raised"}`} />
            </div>
          ))}
          <span className="text-sm text-text-secondary ml-1">= 3/5 readiness</span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Required fields carry <span className="text-accent font-mono">70%</span> of the score weight.
          Recommended fields carry <span className="text-accent font-mono">30%</span>.
          The raw score (0-1) is mapped to 1-5 dots.
        </p>
      </div>

      {/* Required */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
            Required (70% weight)
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/15 text-red-400 border border-red-500/30">
            {REQUIRED.length} fields
          </span>
        </div>
        <div className="space-y-2">
          {REQUIRED.map((item) => (
            <div key={item.label} className="glassmorphic rounded-lg px-4 py-3 flex items-start gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-text-dim mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
            Recommended (30% weight)
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {RECOMMENDED.length} fields
          </span>
        </div>
        <div className="space-y-2">
          {RECOMMENDED.map((item) => (
            <div key={item.label} className="glassmorphic rounded-lg px-4 py-3 flex items-start gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-text-dim mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Example */}
      <div className="glassmorphic rounded-xl p-5">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-3">
          Example
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          A project with all 7 required fields but no recommended fields scores
          <span className="text-accent font-mono"> 0.7 x 5 = 3.5 </span>
          rounded to <span className="text-accent font-mono">4/5</span>.
          Fill in all fields for a perfect <span className="text-accent font-mono">5/5</span>.
        </p>
      </div>
    </div>
  );
}
