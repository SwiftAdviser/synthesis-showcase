import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchAllProjects } from "@/lib/api";
import { getIntentionLabel } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";
import { ProjectHero } from "@/components/project/ProjectHero";
import { TechBadges } from "@/components/project/TechBadges";
import { BuildTimeline } from "@/components/project/BuildTimeline";
import { TeamSpotlight } from "@/components/project/TeamSpotlight";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { MandateCTA } from "@/components/mandate/MandateCTA";

export const revalidate = 1800;

export async function generateStaticParams() {
  const projects = await fetchAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projects = await fetchAllProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not Found" };

  return {
    title: project.name,
    description: project.description.slice(0, 160),
    openGraph: {
      title: project.name,
      description: project.description.slice(0, 160),
      images: [`${SITE_URL}/api/og?slug=${slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.description.slice(0, 160),
      images: [`${SITE_URL}/api/og?slug=${slug}`],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await fetchAllProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const meta = project.submissionMetadata;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Hero */}
          <ProjectHero
            name={project.name}
            videoURL={project.videoURL}
            coverImageURL={project.coverImageURL}
          />

          {/* Title block */}
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              {project.name}
            </h1>
            <p className="text-text-secondary mt-1">{project.team.name}</p>
            <div className="mt-4">
              <TechBadges metadata={meta} />
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Problem Statement */}
          {project.problemStatement && (
            <div className="border-l-2 border-accent pl-5">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-2">
                Problem Statement
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
          )}

          {/* Build Timeline */}
          <BuildTimeline metadata={meta} />

          {/* Team */}
          <TeamSpotlight members={project.members} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          {/* CTA */}
          <MandateCTA trackNames={project.tracks.map((t) => t.name)} />

          {/* Links */}
          <ProjectLinks
            repoURL={project.repoURL}
            deployedURL={project.deployedURL}
            videoURL={project.videoURL}
          />

          {/* Tracks */}
          {project.tracks.length > 0 && (
            <div className="glassmorphic rounded-xl p-4">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-3">
                Tracks
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tracks.map((t) => (
                  <Link
                    key={t.uuid}
                    href={`/tracks/${t.slug}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Intention */}
          <div className="glassmorphic rounded-xl p-4">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-2">
              Intention
            </h3>
            <p className="text-sm text-text-secondary">
              {getIntentionLabel(meta.intention)}
            </p>
            {meta.intentionNotes && (
              <p className="text-xs text-text-dim mt-1">{meta.intentionNotes}</p>
            )}
          </div>

          {/* Helpful Resources */}
          {meta.helpfulResources && meta.helpfulResources.length > 0 && (
            <div className="glassmorphic rounded-xl p-4">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-text-dim mb-2">
                Resources
              </h3>
              <div className="space-y-1">
                {meta.helpfulResources.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-text-secondary hover:text-accent transition-colors truncate"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
