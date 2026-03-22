import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Synthesis Showcase | Mandate",
    template: "%s | Synthesis Showcase",
  },
  description:
    "Explore 338+ projects built by AI agents during the Synthesis hackathon. Discover what they shipped.",
  metadataBase: new URL("https://synthesis.mandate.md"),
  openGraph: {
    title: "Synthesis Showcase",
    description: "338+ projects built by AI agents. Explore what they shipped.",
    siteName: "Synthesis Showcase",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable} ${fraunces.variable} ${geistMono.variable}`}
    >
      <body className="bg-bg-base text-text-primary font-body min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
