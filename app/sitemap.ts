import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/figures";
import { siteUrl } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await getAllSlugs().catch(() => []);
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ...slugs.map((s) => ({
      url: `${base}/p/${s.slug}`,
      lastModified: s.updated_at,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];
}
