/**
 * 站点版本元信息：Footer / 调试用。
 *
 * - `SG_SITE_VERSION` 跟随 package.json 主版本手填（避免运行时反序列化 package.json）
 * - `SG_BUILD_DATE_ISO` 在构建时由 Next.js / Vercel 注入，本地 dev 时回退到当前日期
 */

export const SG_SITE_VERSION = "2.0";

const BUILD_TIME =
  process.env.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString();

export const SG_BUILD_DATE_ISO = BUILD_TIME;

export function formatBuildDate(iso = SG_BUILD_DATE_ISO): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
