/**
 * 规范站点根 URL（无环境变量时使用默认域名，供 sitemap/robots 等绝对地址）。
 * 部署到非默认域名时务必设置 `NEXT_PUBLIC_SITE_URL`。
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return raw ? raw.replace(/\/$/, "") : "https://www.surfergarage.com";
}
