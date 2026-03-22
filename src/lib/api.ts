import type { Project, Track } from "./types";

const BASE_URL = "https://synthesis.devfolio.co";

interface ProjectsResponse {
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CatalogResponse {
  items: Track[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function fetchAllProjects(): Promise<Project[]> {
  const all: Project[] = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await fetch(`${BASE_URL}/projects?page=${page}&limit=${limit}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Projects API error: ${res.status}`);
    const data: ProjectsResponse = await res.json();
    all.push(...data.data);
    if (page >= data.pagination.totalPages) break;
    page++;
  }

  return all.filter((p) => p.status === "publish");
}

export async function fetchAllTracks(): Promise<Track[]> {
  const all: Track[] = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await fetch(`${BASE_URL}/catalog?page=${page}&limit=${limit}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Catalog API error: ${res.status}`);
    const data: CatalogResponse = await res.json();
    all.push(...data.items);
    if (!data.pagination.hasNextPage) break;
    page++;
  }

  return all;
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await fetchAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function fetchTrackBySlug(slug: string): Promise<Track | null> {
  const tracks = await fetchAllTracks();
  return tracks.find((t) => t.slug === slug) ?? null;
}
