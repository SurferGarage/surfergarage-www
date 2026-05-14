/** 叠卡访谈数据（历史结构）。当前首页 Founder Media 已改为五大模块，见 `home-founders.tsx` 与 `lib/founder-media-modules.ts`。 */

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
  githubRepo?: GitHubRepoCardConfig;
};

export type FounderPanelVideo = {
  kind: "video";
  id: string;
  vol: string;
  titleZh: string;
  meta: string;
  leadZh: string;
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

/** 预留：若恢复叠卡或 CMS 注入，在此填充。 */
export const FOUNDER_PANELS: FounderPanel[] = [];
