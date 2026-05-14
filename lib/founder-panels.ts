/**
 * Founder Media 纵向叠卡：每屏约一整视窗，桌面 pin + scrub 见 `register-desktop-pins`。
 * 模块内容与顺序在此集中配置；Surfing Founders 微信专栏 / 宣传图等可先占位，后续再接素材或接口。
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
  /** 小标签 */
  eyebrow: string;
  titleZh: string;
  titleEn: string;
  /** 副文案；宣传图模块可省略 */
  leadZh?: string;
  /** 仅 `github_repo` */
  githubRepo?: GitHubRepoCardConfig;
};

export const FOUNDER_STACK_MODULES: FounderStackModule[] = [
  {
    id: "m-wechat",
    kind: "wechat_oa",
    eyebrow: "Founders · WeChat",
    titleZh: "Surfing Founders 人物访谈",
    titleEn: "Column · conversations",
  },
  {
    id: "m-video",
    kind: "video_channel",
    eyebrow: "Video · Matrix",
    titleZh: "视频矩阵",
    titleEn: "Bilibili & syndication",
    leadZh: "各平台成片与回放在此聚合；外链与栏目随投放节奏接入。",
  },
  {
    id: "m-github",
    kind: "github_repo",
    eyebrow: "Handbook · Open Source",
    titleZh: "GitHub 手册",
    titleEn: "Startup Playbook repo",
    leadZh: "开源共建与悬赏贡献；遥测接入后展示 Stars/Forks。",
    githubRepo: {
      owner: "SurferGarage",
      repo: "Startup-playbook",
      description:
        "面向超级个体与愿景增长的开源手册：核心认知、工具箱与贡献机制。",
      showTelemetry: false,
    },
  },
  {
    id: "m-promo",
    kind: "promo_visual",
    eyebrow: "Brand · Visual",
    titleZh: "视觉物料",
    titleEn: "Campaign art",
    leadZh: "活动主视觉与海报位；素材定稿后替换虚线占位。",
  },
  {
    id: "m-contact",
    kind: "contact",
    eyebrow: "Routing · Contact",
    titleZh: "联络路由",
    titleEn: "Where to go next",
    leadZh: "社群、二维码与邮箱集中在页面底部 The Call。",
  },
];
