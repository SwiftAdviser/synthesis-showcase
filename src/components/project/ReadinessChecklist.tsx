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

  const passed = checklist.filter((i) => i.status === "pass").length;
  const total = checklist.length;
  const failCount = checklist.filter((i) => i.status === "fail").length;
  const allRequired = failCount === 0;
  const missedItems = checklist.filter((i) => i.status !== "pass");
  const pct = Math.round((passed / total) * 100);

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
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-raised/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-text-dim whitespace-nowrap">
            Readiness
          </h3>
          {allRequired ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Ready
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/15 text-red-400 border border-red-500/30">
              {failCount} missing
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-text-dim">{passed}/{total}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-text-dim transition-transform ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-0.5 bg-border">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct === 100 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444",
          }}
        />
      </div>

      {open && (
        <div className="px-4 py-3 space-y-1">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-2 py-0.5">
              <span className={`text-[11px] leading-none ${
                item.status === "pass" ? "text-emerald-400" : item.status === "fail" ? "text-red-400" : "text-amber-400"
              }`}>
                {item.status === "pass" ? "\u2713" : item.status === "fail" ? "\u2717" : "\u25CB"}
              </span>
              <span className={`text-[11px] leading-snug ${
                item.status === "pass" ? "text-text-secondary" : "text-text-primary"
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {open && missedItems.length > 0 && (
        <div className="px-4 pb-3 pt-0">
          <button
            onClick={handleShareMissed}
            className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-all duration-200 ${
              copied
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "Copied for agent" : `Share ${missedItems.length} missed with agent`}
          </button>
        </div>
      )}
    </div>
  );
}
