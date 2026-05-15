import { ImageResponse } from "next/og";
import { getFigureBySlug } from "@/lib/figures";
import { formatCount } from "@/lib/format";
import { reactionMeta } from "@/lib/reactions";

export const runtime = "nodejs";
export const alt = "Most hated — public figure";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: { slug: string } }) {
  const f = await getFigureBySlug(params.slug);

  const name = f?.name ?? "Public Figure";
  const count = formatCount(f?.hate_count ?? 0);
  const photo = f?.photo_url;
  const top = f?.top_reaction ? reactionMeta(f.top_reaction) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f4ede0",
          display: "flex",
          flexDirection: "row",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* photo */}
        <div
          style={{
            width: 540,
            height: "100%",
            background: "#0a0a0a",
            position: "relative",
            display: "flex",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={name}
              width={540}
              height={630}
              style={{ objectFit: "cover", width: 540, height: 630 }}
            />
          ) : null}
        </div>

        {/* content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 56,
            justifyContent: "space-between",
            borderLeft: "4px solid #0a0a0a",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 20,
                textTransform: "uppercase",
                letterSpacing: 4,
                color: "#0a0a0a",
              }}
            >
              <div style={{ width: 12, height: 12, background: "#c1121f" }} />
              MOST · HATED
            </div>
            <div
              style={{
                marginTop: 18,
                fontWeight: 900,
                fontSize: name.length > 16 ? 84 : 110,
                lineHeight: 0.9,
                letterSpacing: -3,
                color: "#0a0a0a",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {name}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: 140,
                color: "#c1121f",
                lineHeight: 1,
                letterSpacing: -4,
                display: "flex",
                alignItems: "baseline",
                gap: 14,
              }}
            >
              {count}
              <span
                style={{
                  fontSize: 24,
                  color: "#0a0a0a",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                Hate Votes
              </span>
            </div>
            {top ? (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 28,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  color: "#0a0a0a",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 44 }}>{top.emoji}</span>
                Mostly {top.label.toLowerCase()}
              </div>
            ) : (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 24,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  color: "#0a0a0a",
                }}
              >
                Cast your reaction →
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
