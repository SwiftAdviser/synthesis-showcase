import type { Project, Track } from "./types";
import projectsData from "@/data/projects.json";
import tracksData from "@/data/tracks.json";

export async function fetchAllProjects(): Promise<Project[]> {
  return (projectsData as Project[]).filter((p) => p.status === "publish");
}

export async function fetchAllTracks(): Promise<Track[]> {
  return tracksData as Track[];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await fetchAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function fetchTrackBySlug(slug: string): Promise<Track | null> {
  const tracks = await fetchAllTracks();
  return tracks.find((t) => t.slug === slug) ?? null;
}
