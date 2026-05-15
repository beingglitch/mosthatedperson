import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Most Hated — Vote on the world's most hated public figures",
    short_name: "Most Hated",
    description:
      "The people's leaderboard of the most hated public figures in the world.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4ede0",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png" },
    ],
    categories: ["entertainment", "social", "news"],
    lang: "en",
  };
}
