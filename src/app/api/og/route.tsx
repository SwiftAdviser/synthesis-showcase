import { ImageResponse } from "next/og";
import { fetchAllProjects, fetchAllTracks } from "@/lib/api";
import { getTrackPrizeTotal, computeStats, formatNumber } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "home";
  const slug = searchParams.get("slug");

  let title = "Synthesis Showcase";
  let subtitle = "340+ projects built by AI agents. Explore what they shipped.";
  let badges: string[] = [];
  let stats: { label: string; value: string }[] = [];

  if (type === "project" && slug) {
    const projects = await fetchAllProjects();
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      title = project.name;
      subtitle = project.team.name;
      badges = project.tracks.map((t) => t.name).slice(0, 3);
    }
  } else if (type === "track" && slug) {
    const tracks = await fetchAllTracks();
    const projects = await fetchAllProjects();
    const track = tracks.find((t) => t.slug === slug);
    if (track) {
      const count = projects.filter((p) => p.tracks.some((t) => t.slug === slug)).length;
      const prize = getTrackPrizeTotal(track);
      title = track.name;
      subtitle = track.company;
      if (prize > 0) stats.push({ label: "Prize Pool", value: `$${formatNumber(prize)}` });
      stats.push({ label: "Projects", value: String(count) });
    }
  } else if (type === "stats") {
    const projects = await fetchAllProjects();
    const s = computeStats(projects);
    title = "Synthesis Stats";
    subtitle = "Numbers from the hackathon";
    stats = [
      { label: "Projects", value: String(s.totalProjects) },
      { label: "Models", value: String(s.models.length) },
      { label: "Commits", value: formatNumber(s.totalCommits) },
    ];
  } else if (type === "preview") {
    title = "Preview Before You Ship";
    subtitle = "See how your project looks before publishing on Devfolio";
  } else {
    // home - use defaults, add stats
    const projects = await fetchAllProjects();
    const tracks = await fetchAllTracks();
    const s = computeStats(projects);
    subtitle = `${s.totalProjects} projects built by AI agents`;
    stats = [
      { label: "Tracks", value: String(tracks.length) },
      { label: "Models", value: String(s.models.length) },
      { label: "Commits", value: formatNumber(s.totalCommits) },
    ];
  }

  // Also support legacy ?slug= without type (for existing project OG links)
  if (type === "home" && slug) {
    const projects = await fetchAllProjects();
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      title = project.name;
      subtitle = project.team.name;
      badges = project.tracks.map((t) => t.name).slice(0, 3);
      stats = [];
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#09090b",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: "6px",
            width: "100%",
            background: "linear-gradient(90deg, #00b73d, #006621)",
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
          }}
        >
          {/* Badges */}
          {badges.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {badges.map((badge) => (
                <span
                  key={badge}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "18px",
                    color: "#00b73d",
                    border: "1px solid rgba(0, 183, 61, 0.3)",
                    backgroundColor: "rgba(0, 183, 61, 0.1)",
                  }}
                >
                  {badge.length > 30 ? badge.slice(0, 30) + "..." : badge}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              marginTop: "16px",
            }}
          >
            {subtitle}
          </div>

          {/* Stats row */}
          {stats.length > 0 && (
            <div style={{ display: "flex", gap: "32px", marginTop: "32px" }}>
              {stats.map((s) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "36px", fontWeight: 700, color: "#00b73d" }}>
                    {s.value}
                  </span>
                  <span style={{ fontSize: "14px", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 80px",
            borderTop: "1px solid #2a2a2e",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                backgroundColor: "#09090b",
                border: "1px solid #2a2a2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
                color: "#00b73d",
              }}
            >
              S
            </div>
            <span style={{ fontSize: "16px", color: "#52525b" }}>
              synthesis.mandate.md
            </span>
          </div>
          <span style={{ fontSize: "14px", color: "#52525b" }}>
            Powered by Mandate
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
