/** 招聘渠道归因单一事实源（`?src=` + 内推码 `?ref=`）。 */

export type RecruitSourceKey =
  | "site"
  | "wechat-group"
  | "wechat-oa"
  | "xiaohongshu"
  | "bilibili"
  | "other";

export type RecruitSource = {
  key: RecruitSourceKey;
  label: string;
  code: string;
};

type RecruitSourceDef = RecruitSource & { aliases: readonly string[] };

export const RECRUIT_SOURCES: readonly RecruitSourceDef[] = [
  { key: "site", label: "官网", code: "SITE", aliases: ["site", "www", "official", "langqian"] },
  { key: "wechat-group", label: "微信群", code: "WX-GROUP", aliases: ["wechat-group", "wechatgroup", "wx-group"] },
  { key: "wechat-oa", label: "公众号", code: "WX-OA", aliases: ["wechat-oa", "wechatoa", "wx-oa"] },
  { key: "xiaohongshu", label: "小红书", code: "XHS", aliases: ["xiaohongshu", "xhs", "rednote"] },
  { key: "bilibili", label: "B站", code: "BILI", aliases: ["bilibili", "bili", "bstation"] },
] as const;

export const DEFAULT_RECRUIT_SOURCE: RecruitSource = {
  key: "site",
  label: "官网",
  code: "SITE",
};

export type ResolvedRecruitSource = RecruitSource & { refCode: string | null };

/**
 * 从落地 URL 参数解析来源：优先 `src`，其次内推码前缀（如 `XHS-XXXX`）。
 * 均缺失时按官网处理。
 */
export function resolveRecruitSource(
  rawSrc?: string | null,
  refCode?: string | null,
): ResolvedRecruitSource {
  const src = (rawSrc ?? "").trim().toLowerCase();
  const ref = (refCode ?? "").trim();

  const matched = RECRUIT_SOURCES.find((s) =>
    s.aliases.includes(src),
  );
  if (matched) {
    return { key: matched.key, label: matched.label, code: matched.code, refCode: ref || null };
  }

  if (ref) {
    const upper = ref.toUpperCase();
    const byPrefix = RECRUIT_SOURCES.find((s) => upper.startsWith(`${s.code}-`));
    if (byPrefix) {
      return { key: byPrefix.key, label: byPrefix.label, code: byPrefix.code, refCode: ref };
    }
    return { ...DEFAULT_RECRUIT_SOURCE, refCode: ref };
  }

  return { ...DEFAULT_RECRUIT_SOURCE, refCode: null };
}