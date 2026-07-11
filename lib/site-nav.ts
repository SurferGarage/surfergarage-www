/** 全站主导航锚点（顶栏 / 页脚单一事实源） */

export type SiteNavItem = {
  href: string;
  labelZh: string;
};

export const SITE_PRIMARY_NAV: readonly SiteNavItem[] = [
  { href: "#proof", labelZh: "最新" },
  { href: "#founders", labelZh: "记录" },
  { href: "#events", labelZh: "活动" },
  { href: "#social", labelZh: "连接" },
] as const;
