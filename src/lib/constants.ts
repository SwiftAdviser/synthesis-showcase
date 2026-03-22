export const SITE_NAME = "Synthesis Showcase";
export const SITE_URL = "https://synthesis.mandate.md";
export const MANDATE_URL = "https://mandate.md";
export const ITEMS_PER_PAGE = 20;

interface CTAConfig {
  headline: string;
  bullets: string[];
}

const CTA_MAP: { keywords: string[]; config: CTAConfig }[] = [
  {
    keywords: ["defi", "trading", "swap", "yield", "liquidity", "amm"],
    config: {
      headline: "Your DeFi agent reasons before it trades. Do you verify that reasoning?",
      bullets: ["Block prompt-injection payments before funds move", "Auto-approve trusted vendors, escalate the rest", "Full audit trail: who, what, when, and why"],
    },
  },
  {
    keywords: ["wallet", "payment", "transfer", "escrow", "pay", "settlement"],
    config: {
      headline: "Session keys check amounts. Mandate checks intent.",
      bullets: ["Evaluate why your agent wants to pay, not just how much", "Stop social engineering that passes spend limits", "One-tap approvals in Slack or Telegram"],
    },
  },
  {
    keywords: ["infrastructure", "identity", "protocol", "registry", "standard"],
    config: {
      headline: "Intent-aware control layer for agent wallets",
      bullets: ["Define policy in plain English via MANDATE.md", "On-chain reputation scoring for counterparties", "Self-learning rules from your approve/reject decisions"],
    },
  },
  {
    keywords: ["privacy", "compute", "tee", "confidential", "encrypted", "sealed"],
    config: {
      headline: "Zero-retention reasoning analysis",
      bullets: ["LLM judge via Venice.ai, no data stored", "Envelope verification matches intent to on-chain tx", "Circuit breaker freezes agents on mismatch"],
    },
  },
];

const DEFAULT_CTA: CTAConfig = {
  headline: "Approve intent, not just transactions",
  bullets: ["See why your agent spends. Stop it when it shouldn't.", "Prompt injection detection in agent reasoning", "Write policy in plain English, behavior changes instantly"],
};

export function getCTAForTracks(trackNames: string[]): CTAConfig {
  const joined = trackNames.join(" ").toLowerCase();
  for (const entry of CTA_MAP) {
    if (entry.keywords.some((kw) => joined.includes(kw))) {
      return entry.config;
    }
  }
  return DEFAULT_CTA;
}
