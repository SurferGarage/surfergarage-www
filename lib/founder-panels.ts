/**
 * Founder Media 纵向叠卡：每屏约一整视窗，桌面 pin + scrub 见 `register-desktop-pins`。
 * 模块内容与顺序在此集中配置；微信公众号 / 宣传图等可先占位，后续再接素材或接口。
 */

import type { GitHubRepoCardConfig } from "@/lib/github-repo-card";

export type FounderStackKind =
  | "wechat_oa"
  | "video_channel"
  | "github_repo"
  | "promo_visual"
  | "contact";

export type FounderStackModule = {
  id: string;
  kind: FounderStackKind;
  /** 小标签，如 Module 01 / WECHAT */
  eyebrow: string;
  titleZh: string;
  titleEn: string;
  /** 副文案；微信公众号与宣传图模块刻意留空时可省略 */
  leadZh?: string;
  /** 仅 `github_repo` */
  githubRepo?: GitHubRepoCardConfig;
};

export const FOUNDER_STACK_MODULES: FounderStackModule[] = [
  {
    id: "m-wechat",
    kind: "wechat_oa",
    eyebrow: "WeChat · Module 01",
    titleZh: "微信公众号",
    titleEn: "Official Account",
  },
  {
    id: "m-video",
    kind: "video_channel",
    eyebrow: "Video · Module 02",
    titleZh: "视频号",
    titleEn: "Video Hub",
    leadZh:
      "矩阵级视频内容将统一在此呈现；成片会在各视频平台同步投放，此处作为站内聚合入口（内容接入中）。",
  },
  {
    id: "m-github",
    kind: "github_repo",
    eyebrow: "Open Source · Module 03",
    titleZh: "GitHub 仓库",
    titleEn: "Live Repository",
    leadZh: "开源手册与共建进度；仓库指标接入数据后将显示 Stars / Forks 等实时信息。",
    githubRepo: {
      owner: "SurferGarage",
      repo: "Startup-playbook",
      description:
        "浪前开源创业指南：面向 AI 时代的超级个体与愿景增长手册，含核心认知、工具箱与悬赏贡献机制。",
      showTelemetry: false,
    },
  },
  {
    id: "m-promo",
    kind: "promo_visual",
    eyebrow: "Visual · Module 04",
    titleZh: "宣传图片",
    titleEn: "Campaign Art",
  },
  {
    id: "m-contact",
    kind: "contact",
    eyebrow: "Contact · Module 05",
    titleZh: "联系我",
    titleEn: "Contact Me",
    leadZh:
      "加入社群、联系 Founders 或商务合作：完整入口与助手二维码见页面底部 The Call 区块。",
  },
];
