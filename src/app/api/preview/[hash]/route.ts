import { NextResponse } from "next/server";
import { getPreview } from "@/lib/preview-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;
  const project = getPreview(hash);

  if (!project) {
    return NextResponse.json(
      { error: "Preview not found or expired" },
      { status: 404 }
    );
  }

  return NextResponse.json(project);
}
