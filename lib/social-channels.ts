import { DISCORD_INVITE_URL } from "@/lib/site-contact";

/**
 * 出站渠道清单。`href` 非 http(s) 时在 UI 中渲染为信息卡（见 `home-social`）。
 */
export type SocialChannelKind =
  | "article"
  | "video"
  | "code"
  | "audio"
  | "community";

export type SocialChannel = {
  id: string;
  kind: SocialChannelKind;
  labelEn: string;
  labelZh: string;
  href: string;
  descriptionZh: string;
};

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: "wechat-articles",
    kind: "article",
    labelEn: "WeChat",
    labelZh: "微信公众号 · 文章",
    href: "#",
    descriptionZh:
      "长文与发刊词主阵地。公众号二维码可放入站点 public 目录（如 qrcode_wechat.png）以便后续在页内展示；当前无单一可点外链。",
  },
  {
    id: "xiaohongshu",
    kind: "video",
    labelEn: "Xiaohongshu",
    labelZh: "小红书 · 视频",
    href: "https://www.xiaohongshu.com/user/profile/66c1db2d000000001d030d6e?xsec_token=ABSe1GVdniK6h9xUrt52iMEnugcyIWsAnbWnCKOfgbgxA%3D&xsec_source=pc_search",
    descriptionZh: "官方主页：视频与图文分发。",
  },
  {
    id: "bilibili",
    kind: "video",
    labelEn: "Bilibili",
    labelZh: "哔哩哔哩 · 视频",
    href: "#",
    descriptionZh: "频道主页链接即将更新。",
  },
  {
    id: "twitter",
    kind: "video",
    labelEn: "X (Twitter)",
    labelZh: "Twitter · 视频",
    href: "#",
    descriptionZh: "X 主页即将更新。",
  },
  {
    id: "youtube",
    kind: "video",
    labelEn: "YouTube",
    labelZh: "YouTube · 视频",
    href: "#",
    descriptionZh: "YouTube 频道即将更新。",
  },
  {
    id: "xiaoyuzhou",
    kind: "audio",
    labelEn: "Xiaoyuzhou",
    labelZh: "小宇宙 · 播客",
    href: "https://www.xiaoyuzhoufm.com/podcast/66dc991838220204ac72fe31",
    descriptionZh: "播客节目页：音频加长内容。",
  },
  {
    id: "discord",
    kind: "community",
    labelEn: "Discord",
    labelZh: "Discord · 社区",
    href: DISCORD_INVITE_URL,
    descriptionZh: "实时讨论、活动与组队入口。",
  },
  {
    id: "github-org",
    kind: "code",
    labelEn: "GitHub",
    labelZh: "组织仓库 · 开源",
    href: "https://github.com/SurferGarage",
    descriptionZh:
      "数据与志愿者记录、浪前创业者手册（小白创业）、本站源码开源入口。",
  },
];
