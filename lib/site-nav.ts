/** 全站主导航锚点（顶栏 / 页脚单一事实源） */

export type SiteNavItem = {
  href: string;
  labelZh: string;
};

export const SITE_PRIMARY_NAV: readonly SiteNavItem[] = [
  { href: "#manifesto", labelZh: "宣言" },
  { href: "#founders", labelZh: "片场" },
  { href: "#social", labelZh: "触点" },
  { href: "#call", labelZh: "联络" },
] as const;
