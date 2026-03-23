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

// Strip control characters (0x00-0x1F except tab/newline/cr) from all strings
function sanitize(obj: unknown): unknown {
  if (typeof obj === "string") {
    return obj.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  }
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = sanitize(v);
    return out;
  }
  return obj;
}

export async function fetchAllProjects(): Promise<Project[]> {
  const all: Project[] = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await fetch(`${BASE_URL}/projects?page=${page}&limit=${limit}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) throw new Error(`Projects API error: ${res.status}`);
    const data: ProjectsResponse = await res.json();
    all.push(...data.data);
    if (page >= data.pagination.totalPages) break;
    page++;
  }

  return (sanitize(all) as Project[]).filter((p) => p.status === "publish");
}

export async function fetchAllTracks(): Promise<Track[]> {
  const all: Track[] = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await fetch(`${BASE_URL}/catalog?page=${page}&limit=${limit}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) throw new Error(`Catalog API error: ${res.status}`);
    const data: CatalogResponse = await res.json();
    all.push(...data.items);
    if (!data.pagination.hasNextPage) break;
    page++;
  }

  return all;
}
