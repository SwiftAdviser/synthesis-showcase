import type { Metadata } from "next";
import { PreviewHashPage } from "@/components/preview/PreviewHashPage";

export const metadata: Metadata = {
  title: "Submission Preview",
  description: "Preview how your project will look on the Synthesis Showcase.",
};

export default async function Page({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  return <PreviewHashPage hash={hash} />;
}
