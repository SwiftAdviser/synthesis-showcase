import type { Project } from "./types";

export interface ChecklistItem {
  label: string;
  status: "pass" | "fail" | "warn";
  detail?: string;
}

/**
 * Parse pasted JSON into a Project object.
 * Handles raw Project JSON, { data: Project } wrapper, and
 * Devfolio API response with nested fields.
 */
export function jsonToProject(raw: unknown): Project {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid JSON: expected an object");
  }

  const obj = raw as Record<string, unknown>;

  // Unwrap { data: ... } wrapper if present
  const source = (obj.data && typeof obj.data === "object" ? obj.data : obj) as Record<string, unknown>;

  const now = new Date().toISOString();

  const meta = (source.submissionMetadata ?? {}) as Record<string, unknown>;

  return {
    uuid: (source.uuid as string) || `preview-${Date.now()}`,
    slug: (source.slug as string) || "",
    name: (source.name as string) || "",
    description: (source.description as string) || "",
    problemStatement: (source.problemStatement as string) || null,
    deployedURL: (source.deployedURL as string) || null,
    repoURL: (source.repoURL as string) || "",
    videoURL: (source.videoURL as string) || null,
    pictures: (source.pictures as string) || null,
    coverImageURL: (source.coverImageURL as string) || null,
    status: "preview",
    createdAt: (source.createdAt as string) || now,
    updatedAt: (source.updatedAt as string) || now,
    submissionMetadata: {
      model: (meta.model as string) || "",
      agentHarness: (meta.agentHarness as string) || "",
      agentFramework: (meta.agentFramework as string) || "",
      agentFrameworkOther: (meta.agentFrameworkOther as string) || undefined,
      agentHarnessOther: (meta.agentHarnessOther as string) || undefined,
      tools: Array.isArray(meta.tools) ? meta.tools : [],
      skills: Array.isArray(meta.skills) ? meta.skills : [],
      intention: (meta.intention as string) || "",
      intentionNotes: (meta.intentionNotes as string) || undefined,
      commitCount: (meta.commitCount as number) ?? null,
      contributorCount: (meta.contributorCount as number) ?? null,
      firstCommitAt: (meta.firstCommitAt as string) || null,
      lastCommitAt: (meta.lastCommitAt as string) || null,
      helpfulResources: Array.isArray(meta.helpfulResources) ? meta.helpfulResources : undefined,
    },
    tracks: Array.isArray(source.tracks) ? source.tracks : [],
    team: (source.team as Project["team"]) || { uuid: "", name: "" },
    members: Array.isArray(source.members) ? source.members : [],
  };
}


export function getReadinessChecklist(project: Project): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const meta = project.submissionMetadata;

  // Required
  items.push({
    label: "Project name",
    status: project.name ? "pass" : "fail",
  });
  items.push({
    label: "Description",
    status: project.description ? "pass" : "fail",
  });
  items.push({
    label: "GitHub repo URL",
    status: project.repoURL ? "pass" : "fail",
  });
  items.push({
    label: "At least 1 track",
    status: project.tracks.length > 0 ? "pass" : "fail",
  });
  items.push({
    label: "Agent model specified",
    status: meta.model ? "pass" : "fail",
  });
  items.push({
    label: "Agent framework",
    status: meta.agentFramework ? "pass" : "fail",
  });
  items.push({
    label: "Agent harness",
    status: meta.agentHarness ? "pass" : "fail",
  });
  items.push({
    label: "Demo video",
    status: project.videoURL ? "pass" : "fail",
  });
  items.push({
    label: "Screenshots or cover image",
    status: project.coverImageURL || project.pictures ? "pass" : "fail",
  });

  // Recommended
  items.push({
    label: "Problem statement",
    status: project.problemStatement ? "pass" : "warn",
    detail: "Recommended",
  });
  items.push({
    label: "Live deployment URL",
    status: project.deployedURL ? "pass" : "warn",
    detail: "Judges interact with live deployments",
  });
  items.push({
    label: "Tools listed",
    status: meta.tools.length > 0 ? "pass" : "warn",
    detail: "Recommended",
  });
  items.push({
    label: "Skills listed",
    status: meta.skills.length > 0 ? "pass" : "warn",
    detail: "Recommended",
  });

  return items;
}

/**
 * Compute a 1-5 star readiness score.
 * Required items (9) are worth more than recommended (4).
 * Required: 70% weight, Recommended: 30% weight.
 */
export function getReadinessScore(project: Project): number {
  const checklist = getReadinessChecklist(project);
  const required = checklist.filter((c) => !c.detail);
  const recommended = checklist.filter((c) => !!c.detail);

  const requiredPassed = required.filter((c) => c.status === "pass").length;
  const recommendedPassed = recommended.filter((c) => c.status === "pass").length;

  const score =
    (requiredPassed / required.length) * 0.7 +
    (recommendedPassed / recommended.length) * 0.3;

  // Map 0-1 to 1-5 stars (minimum 1 star)
  return Math.max(1, Math.round(score * 5));
}
