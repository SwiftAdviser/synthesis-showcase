import { fetchAllProjects, fetchAllTracks } from "@/lib/api";
import { computeStats, formatNumber, getTrackPrizeTotal } from "@/lib/utils";
import { StatCard } from "@/components/stats/StatCard";
import { ProjectFeed } from "@/components/ProjectFeed";
import { TrackCard } from "@/components/track/TrackCard";

export const revalidate = 1800;

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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
        <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
            The Synthesis
          </h1>
          <p className="mt-4 text-text-secondary text-lg">
            {stats.totalProjects} projects built by agents. Explore what they shipped.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
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

      {/* Track Leaderboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="font-display text-2xl font-bold mb-6">Tracks</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
          {sortedTracks.map((track) => (
            <div key={track.uuid} className="snap-start">
              <TrackCard
                track={track}
                projectCount={trackProjectCounts.get(track.slug) ?? 0}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
