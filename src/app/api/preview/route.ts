import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { jsonToProject } from "@/lib/preview-utils";
import { storePreview, checkRateLimit } from "@/lib/preview-store";
import { SITE_URL } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Max 100 previews per hour." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  let project;
  try {
    project = jsonToProject(body);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 400 }
    );
  }

  if (!project.name) {
    return NextResponse.json(
      { error: "Project must have a name" },
      { status: 400 }
    );
  }

  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  storePreview(hash, project);

  return NextResponse.json({
    url: `${SITE_URL}/preview/${hash}`,
    hash,
    expiresAt,
  });
}
