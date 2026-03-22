"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { FilterState, SortOption } from "@/lib/types";

export function useFilters(): [FilterState, (update: Partial<FilterState>) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: FilterState = useMemo(
    () => ({
      tracks: searchParams.getAll("track"),
      models: searchParams.getAll("model"),
      frameworks: searchParams.getAll("framework"),
      harnesses: searchParams.getAll("harness"),
      search: searchParams.get("q") ?? "",
      sort: (searchParams.get("sort") as SortOption) ?? "newest",
    }),
    [searchParams]
  );

  const setFilters = useCallback(
    (update: Partial<FilterState>) => {
      const next = { ...filters, ...update };
      const params = new URLSearchParams();

      for (const t of next.tracks) params.append("track", t);
      for (const m of next.models) params.append("model", m);
      for (const f of next.frameworks) params.append("framework", f);
      for (const h of next.harnesses) params.append("harness", h);
      if (next.search) params.set("q", next.search);
      if (next.sort !== "newest") params.set("sort", next.sort);

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, router, pathname]
  );

  return [filters, setFilters];
}
