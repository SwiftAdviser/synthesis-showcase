import type { Project, Track, FilterState } from "./types";
import { getReadinessScore } from "./preview-utils";

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function hashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 50%, 40%)`;
}

export function hashGradient(str: string): string {
  const c1 = hashColor(str);
  const c2 = hashColor(str + "_end");
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}

export function formatDuration(firstCommit: string, lastCommit: string): string {
  const start = new Date(firstCommit);
  const end = new Date(lastCommit);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function getTrackPrizeTotal(track: Track): number {
  return track.prizes.reduce((sum, p) => sum + p.amount, 0);
}

export function getVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/
  );
  return match?.[1] ?? null;
}

export function getLoomId(url: string): string | null {
  const match = url.match(/loom\.com\/share\/([\w-]+)/);
  return match?.[1] ?? null;
}

export function getDisplayModel(meta: { model: string }): string {
  return meta.model || "Unknown";
}

export function getDisplayFramework(meta: {
  agentFramework: string;
  agentFrameworkOther?: string;
}): string {
  if (meta.agentFramework === "other" && meta.agentFrameworkOther) {
    return meta.agentFrameworkOther;
  }
  return meta.agentFramework || "Unknown";
}

export function getDisplayHarness(meta: {
  agentHarness: string;
  agentHarnessOther?: string;
}): string {
  if (meta.agentHarness === "other" && meta.agentHarnessOther) {
    return meta.agentHarnessOther;
  }
  return meta.agentHarness || "Unknown";
}

export function getIntentionLabel(intention: string): string {
  switch (intention) {
    case "continuing":
      return "Plans to continue";
    case "exploring":
      return "Exploring";
    case "one-time":
      return "One-time build";
    default:
      return intention;
  }
}

export function filterProjects(
  projects: Project[],
  filters: FilterState
): Project[] {
  let filtered = [...projects];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.team.name.toLowerCase().includes(q)
    );
  }

  if (filters.tracks.length > 0) {
    filtered = filtered.filter((p) =>
      p.tracks.some((t) => filters.tracks.includes(t.slug))
    );
  }

  if (filters.models.length > 0) {
    filtered = filtered.filter((p) =>
      filters.models.includes(p.submissionMetadata.model)
    );
  }

  if (filters.frameworks.length > 0) {
    filtered = filtered.filter((p) =>
      filters.frameworks.includes(
        getDisplayFramework(p.submissionMetadata)
      )
    );
  }

  if (filters.harnesses.length > 0) {
    filtered = filtered.filter((p) =>
      filters.harnesses.includes(
        getDisplayHarness(p.submissionMetadata)
      )
    );
  }

  if (filters.minScore && filters.minScore > 0) {
    filtered = filtered.filter(
      (p) => getReadinessScore(p) >= filters.minScore!
    );
  }

  switch (filters.sort) {
    case "newest":
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "commits":
      filtered.sort(
        (a, b) =>
          (b.submissionMetadata.commitCount ?? 0) -
          (a.submissionMetadata.commitCount ?? 0)
      );
      break;
    case "alphabetical":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return filtered;
}

export function computeStats(projects: Project[]) {
  const models = new Map<string, number>();
  const frameworks = new Map<string, number>();
  const harnesses = new Map<string, number>();
  const tools = new Map<string, number>();
  let totalCommits = 0;

  for (const p of projects) {
    const meta = p.submissionMetadata;

    const model = getDisplayModel(meta);
    models.set(model, (models.get(model) ?? 0) + 1);

    const fw = getDisplayFramework(meta);
    frameworks.set(fw, (frameworks.get(fw) ?? 0) + 1);

    const harness = getDisplayHarness(meta);
    harnesses.set(harness, (harnesses.get(harness) ?? 0) + 1);

    totalCommits += meta.commitCount ?? 0;

    for (const tool of meta.tools) {
      tools.set(tool, (tools.get(tool) ?? 0) + 1);
    }
  }

  const sortMap = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]);

  return {
    totalProjects: projects.length,
    totalCommits,
    models: sortMap(models),
    frameworks: sortMap(frameworks),
    harnesses: sortMap(harnesses),
    tools: sortMap(tools).slice(0, 15),
  };
}
