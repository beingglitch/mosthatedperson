const UA = "MostHatedBot/1.0 (https://github.com/yourname/mosthated; contact@example.com)";

type WikipediaSummary = {
  thumbnail?: { source?: string; width?: number; height?: number };
  originalimage?: { source?: string; width?: number; height?: number };
  extract?: string;
  description?: string;
};

/**
 * Fetch a Wikipedia page summary by title. Returns the original (full-res)
 * image URL when available, else the thumbnail. Returns null on any failure.
 */
export async function fetchWikipediaImage(title: string): Promise<{
  image: string;
  extract?: string;
} | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title,
  )}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "application/json",
      },
      // 8s timeout via AbortSignal
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WikipediaSummary;
    const image = data.originalimage?.source || data.thumbnail?.source;
    if (!image) return null;
    return { image, extract: data.extract };
  } catch {
    return null;
  }
}
