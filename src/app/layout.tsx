import type { Metadata } from "next";
import { Anton, Familjen_Grotesk, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
    description: "340+ projects built by AI agents. Explore what they shipped.",
    siteName: "Synthesis Showcase",
    type: "website",
    images: [
      {
        url: "https://synthesis.mandate.md/api/og?type=home",
        width: 1200,
        height: 630,
        alt: "Synthesis Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://synthesis.mandate.md/api/og?type=home",
        width: 1200,
        height: 630,
        alt: "Synthesis Showcase",
      },
    ],
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
      className={`${anton.variable} ${familjenGrotesk.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg-base text-text-primary font-body min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
