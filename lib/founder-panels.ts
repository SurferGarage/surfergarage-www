/** Founder Media 面板数据（访谈区）。`bvid` 为空时仅展示灰盒，不发起 B 站请求。 */

import type { GitHubRepoCardConfig } from "@/lib/github-repo-card";

export type FounderPanelArticle = {
  kind: "article";
  id: string;
  vol: string;
  titleZh: string;
  meta: string;
  leadZh: string;
  articleHref: string;
  articleLabel: string;
  /** 可选：嵌入式 GitHub 仓库卡片（与 `github-repo-card` 组件对齐） */
  githubRepo?: GitHubRepoCardConfig;
};

export type FounderPanelVideo = {
  kind: "video";
  id: string;
  vol: string;
  titleZh: string;
  meta: string;
  leadZh: string;
  /** 例如 BV1xx411c7mu；空字符串表示尚未接入 */
  bvid: string;
};

export type FounderPanelText = {
  kind: "text";
  id: string;
  vol: string;
  titleZh: string;
  meta: string;
  leadZh: string;
};

export type FounderPanel = FounderPanelArticle | FounderPanelVideo | FounderPanelText;

export const FOUNDER_PANELS: FounderPanel[] = [
  {
    kind: "article",
    id: "001",
    vol: "Vol.001",
    titleZh: "真正值得听的建议，来自海里的人",
    meta: "Founder Talk · 发刊词",
    leadZh:
      "长文入口与公众号阅读体验以微信侧为准；此处提供站外归档或延伸阅读链接。",
    articleHref: "https://github.com/SurferGarage/Startup-playbook",
    articleLabel: "在 GitHub 打开 Startup Playbook",
    githubRepo: {
      owner: "SurferGarage",
      repo: "Startup-playbook",
      description:
        "浪前开源创业指南：面向 AI 时代的超级个体与愿景增长手册，含核心认知、工具箱与悬赏贡献机制。",
      showTelemetry: false,
    },
  },
  {
    kind: "video",
    id: "002",
    vol: "Vol.002",
    titleZh: "从想法到上手：代价账本与验证步",
    meta: "Founder Talk · 视频占位",
    leadZh:
      "播放器仅在进入视口后挂载，避免首屏拉取 iframe。填入 `bvid` 后即显示 B 站内嵌播放器。",
    bvid: "",
  },
  {
    kind: "text",
    id: "003",
    vol: "Vol.003",
    titleZh: "非共识下的节奏、杠杆与止损",
    meta: "Founder Talk · 纪要向",
    leadZh:
      "纯文稿卡：后续可接 Markdown、PDF 或微信文章摘要。含视频的卡片在离开视口后会卸载播放器以节省资源。",
  },
];
