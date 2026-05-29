/**
 * VIS 扩展图形 · 标签与模块映射（design/brand PDF §04–05）
 */
import type { FounderStackKind } from "@/lib/founder-panels";

export type SgVisPillId = "media" | "youth" | "insight" | "live";

export const SG_VIS_PILL: Record<
  SgVisPillId,
  { label: string; className: string }
> = {
  media: { label: "MEDIA", className: "sg-vis-pill--media" },
  youth: { label: "YOUTH", className: "sg-vis-pill--youth" },
  insight: { label: "INSIGHT", className: "sg-vis-pill--insight" },
  live: { label: "LIVE", className: "sg-vis-pill--live" },
};

/** 片场模块 → VIS Frame/Label 胶囊 */
export function visPillForFounderKind(kind: FounderStackKind): SgVisPillId {
  switch (kind) {
    case "wechat_column":
      return "insight";
    case "video_studio":
      return "media";
    case "github_repo":
      return "youth";
    case "brand_visual":
      return "live";
    default:
      return "insight";
  }
}
