import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchAllProjects, fetchAllTracks } from "@/lib/api";
import { getTrackPrizeTotal, formatNumber } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { PrizeTable } from "@/components/track/PrizeTable";
import { ProjectCard } from "@/components/project/ProjectCard";

export const revalidate = 300;

export async function generateStaticParams() {
  const tracks = await fetchAllTracks();
  return tracks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tracks = await fetchAllTracks();
  const track = tracks.find((t) => t.slug === slug);
  if (!track) return { title: "Not Found" };

  return {
    title: `${track.name} | ${track.company}`,
    description: track.description.slice(0, 160),
    openGraph: {
      title: `${track.name} | ${track.company}`,
      description: track.description.slice(0, 160),
    },
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tracks, projects] = await Promise.all([
    fetchAllTracks(),
    fetchAllProjects(),
  ]);

  const track = tracks.find((t) => t.slug === slug);
  if (!track) notFound();

  const trackProjects = projects.filter((p) =>
    p.tracks.some((t) => t.slug === slug)
  );
  const prizeTotal = getTrackPrizeTotal(track);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <div className="max-w-3xl animate-fade-in-up">
        <p className="text-[11px] font-mono uppercase tracking-widest text-accent mb-2">
          {track.company}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          {track.name}
        </h1>
        <div className="flex items-center gap-4 mt-3 text-sm text-text-dim font-mono">
          {prizeTotal > 0 && (
            <span className="text-accent">${formatNumber(prizeTotal)} prize pool</span>
          )}
          <span>
            {trackProjects.length} {trackProjects.length === 1 ? "project" : "projects"}
          </span>
        </div>
        <p className="mt-4 text-text-secondary leading-relaxed whitespace-pre-line text-sm">
          {track.description}
        </p>
      </div>

      {/* Prizes */}
      {track.prizes.length > 0 && (
        <div className="mt-8 max-w-2xl">
          <PrizeTable prizes={track.prizes} />
        </div>
      )}

      {/* Projects */}
      <div className="mt-12">
        <h2 className="font-display text-xl font-bold mb-4">
          Projects ({trackProjects.length})
        </h2>
        <div className="space-y-3">
          {trackProjects.map((p, i) => (
            <ProjectCard key={p.uuid} project={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
