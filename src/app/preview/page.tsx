import type { Metadata } from "next";
import { PreviewPage } from "@/components/preview/PreviewPage";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Preview Your Submission",
  description:
    "See how your Synthesis hackathon project will look on the showcase before you publish. Preview first, ship with confidence.",
  openGraph: {
    title: "Preview Your Submission | Synthesis Showcase",
    description:
      "See how your project will look before you publish. Built by Mandate.",
    images: [`${SITE_URL}/api/og?type=preview`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preview Your Submission | Synthesis Showcase",
    description:
      "See how your project will look before you publish. Built by Mandate.",
    images: [`${SITE_URL}/api/og?type=preview`],
  },
};

export default function Page() {
  return <PreviewPage />;
}
