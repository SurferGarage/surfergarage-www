/**
 * 浪前片场 sticky stack 模块清单。
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
  titleZh: string;
  githubRepo?: GitHubRepoCardConfig;
};

export const FOUNDER_STACK_MODULES: FounderStackModule[] = [
  {
    id: "m-wechat",
    kind: "wechat_column",
    titleZh: "人物访谈",
  },
  {
    id: "m-video",
    kind: "video_studio",
    titleZh: "视频播客",
  },
  {
    id: "m-github",
    kind: "github_repo",
    titleZh: "Startup Playbook",
    githubRepo: {
      owner: "SurferGarage",
      repo: "Startup-playbook",
      description: "创业进攻 · 失败手册 · 学习路径",
      showTelemetry: false,
    },
  },
  {
    id: "m-visual",
    kind: "brand_visual",
    titleZh: "视觉车库",
  },
];
