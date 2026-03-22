import { ImageResponse } from "next/og";
import { fetchAllProjects } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  let title = "Synthesis Showcase";
  let subtitle = "338+ projects built by AI agents";
  let trackBadges: string[] = [];

  if (slug) {
    const projects = await fetchAllProjects();
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      title = project.name;
      subtitle = project.team.name;
      trackBadges = project.tracks.map((t) => t.name).slice(0, 3);
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
          padding: "0",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: "6px",
            width: "100%",
            background: "linear-gradient(90deg, #10b981, #065f46)",
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
          {/* Track badges */}
          {trackBadges.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {trackBadges.map((badge) => (
                <span
                  key={badge}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "100px",
                    fontSize: "18px",
                    color: "#10b981",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
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
                backgroundColor: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 700,
                color: "#09090b",
              }}
            >
              M
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
