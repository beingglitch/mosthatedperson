import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { siteUrl } from "@/lib/format";
import { TrackVisit } from "@/components/TrackVisit";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default:
      "Most Hated — Vote on the world's most hated public figures, politicians, celebrities & CEOs",
    template: "%s — Most Hated",
  },
  description:
    "The people's leaderboard of the most hated public figures in the world — politicians, billionaires, celebrities and influencers. Pick a reaction. One vote per visitor. No comments, no doxxing. Updated live.",
  applicationName: "Most Hated",
  keywords: [
    "most hated person",
    "most hated people",
    "most hated public figures",
    "most hated celebrities",
    "most hated politicians",
    "most hated CEO",
    "most hated person in the world",
    "vote leaderboard",
    "people's leaderboard",
  ],
  authors: [{ name: "Most Hated" }],
  creator: "Most Hated",
  publisher: "Most Hated",
  alternates: { canonical: "/" },
  category: "society",
  openGraph: {
    type: "website",
    siteName: "Most Hated",
    locale: "en_US",
    url: "/",
    title:
      "Most Hated — Vote on the world's most hated public figures",
    description:
      "The people's leaderboard of the most hated public figures in the world. One reaction per visitor. Updated live.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Most Hated — The people's leaderboard",
    description:
      "Vote on the world's most hated public figures. One reaction per visitor.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#f4ede0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        {children}
        <TrackVisit />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
