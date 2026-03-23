import type { Project, Track } from "./types";

const BASE_URL = "https://synthesis-devfolio-proxy.krutovoyroman.workers.dev";

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

// Fetch JSON safely: get text, strip control chars, then parse
async function safeFetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`API error ${res.status}: ${url}`);
  let text = await res.text();
  // Strip control characters that break JSON.parse (0x00-0x1F except tab/lf/cr)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  return JSON.parse(text) as T;
}

export async function fetchAllProjects(): Promise<Project[]> {
  const all: Project[] = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const data = await safeFetchJSON<ProjectsResponse>(
      `${BASE_URL}/projects?page=${page}&limit=${limit}`,
      { next: { revalidate: 1800 } }
    );
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
    const data = await safeFetchJSON<CatalogResponse>(
      `${BASE_URL}/catalog?page=${page}&limit=${limit}`,
      { next: { revalidate: 1800 } }
    );
    all.push(...data.items);
    if (!data.pagination.hasNextPage) break;
    page++;
  }

  return all;
}
