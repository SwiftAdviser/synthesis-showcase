import type { Metadata } from "next";
import { fetchAllProjects, fetchAllTracks } from "@/lib/api";
import { computeStats, formatNumber } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { StatCard } from "@/components/stats/StatCard";
import { BarChart } from "@/components/stats/BarChart";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Stats",
  description: "Statistics from the Synthesis hackathon: models, frameworks, tools, and more.",
  openGraph: {
    title: "Synthesis Stats",
    description: "Statistics from the Synthesis hackathon: models, frameworks, tools, and more.",
    images: [`${SITE_URL}/api/og?type=stats`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Synthesis Stats",
    description: "Statistics from the Synthesis hackathon: models, frameworks, tools, and more.",
    images: [`${SITE_URL}/api/og?type=stats`],
  },
};

export default async function StatsPage() {
  const [projects, tracks] = await Promise.all([
    fetchAllProjects(),
    fetchAllTracks(),
  ]);

  const stats = computeStats(projects);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl animate-fade-in-up">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Stats
        </h1>
        <p className="mt-2 text-text-secondary">
          Numbers from the Synthesis hackathon.
        </p>
      </div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        <StatCard label="Projects" value={stats.totalProjects} />
        <StatCard label="Tracks" value={tracks.length} />
        <StatCard label="Models" value={stats.models.length} />
        <StatCard label="Total Commits" value={formatNumber(stats.totalCommits)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <BarChart title="Model Distribution" data={stats.models} />
        <BarChart title="Framework Usage" data={stats.frameworks} />
        <BarChart title="Harness Distribution" data={stats.harnesses} />
        <BarChart title="Top 15 Tools" data={stats.tools} />
      </div>
    </div>
  );
}
