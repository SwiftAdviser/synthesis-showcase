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
      headline: "Your DeFi agent needs guardrails",
      bullets: ["Spend limits per transaction", "Allowlisted contracts only", "Circuit breaker on anomalies"],
    },
  },
  {
    keywords: ["wallet", "payment", "transfer", "escrow", "pay", "settlement"],
    config: {
      headline: "Secure agent payments",
      bullets: ["Per-tx caps in USD", "Recipient allowlists", "Human approval gates"],
    },
  },
  {
    keywords: ["infrastructure", "identity", "protocol", "registry", "standard"],
    config: {
      headline: "Policy layer for agent infra",
      bullets: ["Non-custodial validation", "Full audit trail", "Multi-chain support"],
    },
  },
  {
    keywords: ["privacy", "compute", "tee", "confidential", "encrypted", "sealed"],
    config: {
      headline: "Trust but verify",
      bullets: ["Envelope verification", "Intent state machine", "Immutable audit log"],
    },
  },
];

const DEFAULT_CTA: CTAConfig = {
  headline: "Ship agents that won't drain wallets",
  bullets: ["Spend controls & limits", "Circuit breaker protection", "Approval workflows"],
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
