/** 招聘渠道归因：裸 `/join` = 小红书；官网入口必须带 `?src=site`。 */

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
  key: "xiaohongshu",
  label: "小红书",
  code: "XHS",
};

export const SITE_JOIN_HREF = "/join?src=site";

export type ResolvedRecruitSource = RecruitSource & { refCode: string | null };

export function resolveRecruitSource(
  rawSrc?: string | null,
  refCode?: string | null,
): ResolvedRecruitSource {
  const src = (rawSrc ?? "").trim().toLowerCase();
  const ref = (refCode ?? "").trim();

  const matched = RECRUIT_SOURCES.find(
    (s) => s.aliases.includes(src) || s.code.toLowerCase() === src || s.key === src,
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
  }

  return { ...DEFAULT_RECRUIT_SOURCE, refCode: ref || null };
}
