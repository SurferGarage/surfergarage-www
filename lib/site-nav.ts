/** 全站主导航锚点（顶栏 / 页脚单一事实源） */

import { homeSectionHref } from "@/lib/nav-hash";

export type SiteNavItem = {
  href: string;
  labelZh: string;
};

export const SITE_PRIMARY_NAV: readonly SiteNavItem[] = [
  { href: homeSectionHref("proof"), labelZh: "特稿" },
  { href: homeSectionHref("dialogue"), labelZh: "视频" },
  { href: homeSectionHref("events"), labelZh: "活动" },
  { href: homeSectionHref("mission"), labelZh: "关于" },
] as const;

export const SITE_HOME_HREF = homeSectionHref("manifesto");
export const SITE_STORY_HREF = homeSectionHref("call-join");
