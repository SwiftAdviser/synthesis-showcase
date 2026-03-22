"use client";

import { useState } from "react";
import type { ChecklistItem } from "@/lib/preview-utils";

interface Props {
  checklist: ChecklistItem[];
  defaultOpen?: boolean;
}

export function ReadinessChecklist({ checklist, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const failCount = checklist.filter((i) => i.status === "fail").length;
  const allRequired = failCount === 0;
  const missedItems = checklist.filter((i) => i.status !== "pass");

  const handleShareMissed = async () => {
    const lines = missedItems.map(
      (i) =>
        `- [ ] ${i.label} (${i.status === "fail" ? "required" : "recommended"})`
    );
    const text = `Missing fields for submission:\n${lines.join("\n")}\n\nPlease help me fill these in.`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="glassmorphic rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-bg-raised/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
            Submission Readiness
          </h3>
          {allRequired ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Ready
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/15 text-red-400 border border-red-500/30">
              {failCount} required missing
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
          className={`text-text-dim transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
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
      {open && missedItems.length > 0 && (
        <div className="px-5 pb-4 pt-1 border-t border-border">
          <button
            onClick={handleShareMissed}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              copied
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "Copied. Paste to your agent." : `Share ${missedItems.length} missed fields with agent`}
          </button>
        </div>
      )}
    </div>
  );
}
