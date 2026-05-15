import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/format";

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
    default: "Most Hated — Vote on the world's most hated public figures",
    template: "%s — Most Hated",
  },
  description:
    "A people's leaderboard of the most hated public figures in the world. Pick your reaction. One vote per person. No comments, no drama — just receipts.",
  applicationName: "Most Hated",
  openGraph: {
    type: "website",
    siteName: "Most Hated",
    title: "Most Hated — Vote on the world's most hated public figures",
    description:
      "A people's leaderboard of the most hated public figures. One reaction per person.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Most Hated",
    description: "Vote on the world's most hated public figures.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f4ede0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
