export interface Project {
  uuid: string;
  slug: string;
  name: string;
  description: string;
  problemStatement: string | null;
  deployedURL: string | null;
  repoURL: string;
  videoURL: string | null;
  pictures: string | null;
  coverImageURL: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  submissionMetadata: SubmissionMetadata;
  tracks: TrackRef[];
  team: Team;
  members: Member[];
}

export interface SubmissionMetadata {
  model: string;
  agentHarness: string;
  agentFramework: string;
  agentFrameworkOther?: string;
  agentHarnessOther?: string;
  tools: string[];
  skills: string[];
  intention: string;
  intentionNotes?: string;
  commitCount: number | null;
  contributorCount: number | null;
  firstCommitAt: string | null;
  lastCommitAt: string | null;
  helpfulResources?: string[];
}

export interface Track {
  uuid: string;
  slug: string;
  name: string;
  company: string;
  description: string;
  prizes: Prize[];
  createdAt: string;
  updatedAt: string;
}

export interface Prize {
  uuid: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
}

export interface Team {
  uuid: string;
  name: string;
}

export interface Member {
  participantUuid: string;
  participantName: string;
  role: string;
}

export interface TrackRef {
  uuid: string;
  slug: string;
  name: string;
  description: string;
}

export interface TrackWithProjects extends Track {
  projects: Project[];
}

export type SortOption = "newest" | "commits" | "alphabetical";

export interface FilterState {
  tracks: string[];
  models: string[];
  frameworks: string[];
  harnesses: string[];
  search: string;
  sort: SortOption;
  minScore?: number;
}
