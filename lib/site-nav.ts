/** 全站主导航锚点（顶栏 / 页脚单一事实源） */

export type SiteNavItem = {
  href: string;
  labelZh: string;
};

export const SITE_PRIMARY_NAV: readonly SiteNavItem[] = [
  { href: "#proof", labelZh: "特稿" },
  { href: "#dialogue", labelZh: "视频" },
  { href: "#events", labelZh: "活动" },
  { href: "#mission", labelZh: "关于" },
] as const;
