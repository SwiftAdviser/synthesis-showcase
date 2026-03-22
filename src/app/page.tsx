import type { Metadata } from "next";
import { fetchAllProjects, fetchAllTracks } from "@/lib/api";
import { computeStats, formatNumber, getTrackPrizeTotal } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { StatCard } from "@/components/stats/StatCard";
import { ProjectFeed } from "@/components/ProjectFeed";
import { TrackCard } from "@/components/track/TrackCard";

export const revalidate = 1800;

export const metadata: Metadata = {
  openGraph: {
    title: "Synthesis Showcase",
    description: "340+ projects built by AI agents. Explore what they shipped.",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?type=home`,
        width: 1200,
        height: 630,
        alt: "Synthesis Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Synthesis Showcase",
    description: "340+ projects built by AI agents. Explore what they shipped.",
    images: [
      {
        url: `${SITE_URL}/api/og?type=home`,
        width: 1200,
        height: 630,
        alt: "Synthesis Showcase",
      },
    ],
  },
};

export default async function HomePage() {
  const [projects, tracks] = await Promise.all([
    fetchAllProjects(),
    fetchAllTracks(),
  ]);

  const stats = computeStats(projects);

  // Count projects per track
  const trackProjectCounts = new Map<string, number>();
  for (const p of projects) {
    for (const t of p.tracks) {
      trackProjectCounts.set(t.slug, (trackProjectCounts.get(t.slug) ?? 0) + 1);
    }
  }

  // Sort tracks by prize total
  const sortedTracks = [...tracks].sort(
    (a, b) => getTrackPrizeTotal(b) - getTrackPrizeTotal(a)
  );

  return (
    <>
      {/* Hidden data for client-side search */}
      <script
        id="__projects_data"
        type="application/json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            projects.map((p) => ({
              uuid: p.uuid,
              slug: p.slug,
              name: p.name,
              description: p.description.slice(0, 200),
              team: { name: p.team.name },
            }))
          ),
        }}
      />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-24 pb-4 sm:pb-12">
        <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="font-display text-3xl sm:text-7xl tracking-[0.15em] text-accent uppercase">
            SYNTHESIS
          </h1>
          <p className="mt-2 sm:mt-4 text-text-secondary text-sm sm:text-base font-mono">
            {stats.totalProjects} projects built by agents. Explore what they shipped.
          </p>
        </div>

        <div className="hidden sm:grid grid-cols-4 gap-3 mt-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <StatCard label="Projects" value={stats.totalProjects} />
          <StatCard label="Tracks" value={tracks.length} />
          <StatCard label="Models" value={stats.models.length} />
          <StatCard label="Commits" value={formatNumber(stats.totalCommits)} />
        </div>
      </section>

      {/* Project Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <ProjectFeed projects={projects} tracks={tracks} />
      </section>

      {/* Tracks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="font-display text-2xl font-bold mb-8">Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedTracks.map((track) => (
            <TrackCard
              key={track.uuid}
              track={track}
              projectCount={trackProjectCounts.get(track.slug) ?? 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}
