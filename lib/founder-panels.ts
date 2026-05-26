/**
 * 浪前片场 sticky stack（V3 拆分版）：
 *
 * - **wechat_column**：微信专栏（文字 · 长文访谈）独立成屏，YC 式左右大画幅
 * - **video_studio**：B 站播客（视频 · 嘉宾对谈）独立成屏，YC 式三栏全宽
 * - **github_repo**：Startup Playbook 开源 + contributors + recent activity
 *
 * Visual Garage 已从 sticky stack 移出，作为独立非 pin section 自由舒展。
 */

import type { GitHubRepoCardConfig } from "@/lib/github-repo-card";

export type FounderStackKind =
  | "wechat_column"
  | "video_studio"
  | "github_repo"
  | "brand_visual";

export type FounderStackModule = {
  id: string;
  kind: FounderStackKind;
  /** 章节子编号 */
  index: string;
  /** 小标签 */
  eyebrow: string;
  titleZh: string;
  titleEn: string;
  /** 副文案 */
  leadZh?: string;
  /** 仅 `github_repo` */
  githubRepo?: GitHubRepoCardConfig;
};

export const FOUNDER_STACK_MODULES: FounderStackModule[] = [
  {
    id: "m-wechat",
    kind: "wechat_column",
    index: "03.a",
    eyebrow: "Founders · WeChat",
    titleZh: "人物访谈",
    titleEn: "WeChat · long-form",
  },
  {
    id: "m-video",
    kind: "video_studio",
    index: "03.b",
    eyebrow: "Founders · Video",
    titleZh: "视频播客",
    titleEn: "Bilibili · S01",
    leadZh: "6 席 · 每人 4 期",
  },
  {
    id: "m-github",
    kind: "github_repo",
    index: "03.c",
    eyebrow: "Handbook · Open Source",
    titleZh: "Startup Playbook",
    titleEn: "Open source handbook",
    leadZh: "超级个体开源手册",
    githubRepo: {
      owner: "SurferGarage",
      repo: "Startup-playbook",
      description: "超级个体 · 认知与工具箱",
      showTelemetry: false,
    },
  },
  {
    id: "m-visual",
    kind: "brand_visual",
    index: "03.d",
    eyebrow: "Brand · Visual Garage",
    titleZh: "视觉车库",
    titleEn: "Brand assets",
    leadZh: "字标与主视觉 · 媒体可自取",
  },
];
