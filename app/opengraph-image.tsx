import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Most Hated — the people's leaderboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f4ede0",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 22,
            textTransform: "uppercase",
            letterSpacing: 4,
            color: "#0a0a0a",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              background: "#c1121f",
            }}
          />
          The people's leaderboard
        </div>

        <div
          style={{
            marginTop: 24,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 900,
            fontSize: 180,
            lineHeight: 0.85,
            color: "#0a0a0a",
            letterSpacing: -6,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>MOST</span>
          <span style={{ color: "#c1121f" }}>HATED</span>
        </div>

        <div
          style={{
            position: "absolute",
            right: 64,
            bottom: 56,
            display: "flex",
            gap: 16,
            fontSize: 64,
          }}
        >
          <span>😡</span>
          <span>🤡</span>
          <span>🤮</span>
          <span>💀</span>
          <span>🥱</span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 56,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 22,
            textTransform: "uppercase",
            letterSpacing: 4,
            color: "#0a0a0a",
          }}
        >
          One reaction per person. No comments.
        </div>
      </div>
    ),
    { ...size },
  );
}
