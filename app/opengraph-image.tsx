import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-metadata";

export const runtime = "edge";
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 社交分享预览图 1200×630 — 自动生成，无需手填静态 PNG */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(145deg, #060644 0%, #0b0c10 42%, #0f1116 100%)",
          color: "#f3f4f6",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p
            style={{
              fontSize: 28,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#27d7c7",
              margin: 0,
            }}
          >
            浪前 · Surfer Garage
          </p>
          <p
            style={{
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 900,
            }}
          >
            记录 Surfing Founders.
          </p>
          <p
            style={{
              fontSize: 30,
              color: "#d1d5db",
              margin: 0,
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            16–28 岁极早期科技创业者的高信任媒体与社区基础设施
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <p
            style={{
              fontSize: 22,
              color: "#8b93a8",
              margin: 0,
              letterSpacing: "0.08em",
            }}
          >
            {SITE_TAGLINE}
          </p>
          <p
            style={{
              fontSize: 120,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              color: "rgba(243,244,246,0.08)",
              margin: 0,
              lineHeight: 1,
            }}
          >
            SG
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
