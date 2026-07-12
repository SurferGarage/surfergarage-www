/**
 * 出站渠道清单。`href` 非 http(s) 时在 UI 中渲染为信息卡（见 `home-social`）。
 * 触点区按 **文章 / 视频与播客 / 开源** 分块展示；Discord 不在此区（入口见「联络」）。
 */
import { LATEST_WECHAT_FEED_ITEM } from "@/lib/wechat-official-feed";

export type SocialChannelKind =
  | "article"
  | "video"
  | "code"
  | "audio"
  | "community";

/** Connect 卡片右上角线标：统一框体 + 各平台可辨几何图形（非官方商标素材）。 */
export type SocialChannelMarkId =
  | "wechat"
  | "xiaohongshu"
  | "bilibili"
  | "twitter"
  | "youtube"
  | "xiaoyuzhou"
  | "github";

export type SocialChannel = {
  id: string;
  kind: SocialChannelKind;
  /** 与 `SocialChannelMark` 一一对应 */
  mark: SocialChannelMarkId;
  labelEn: string;
  labelZh: string;
  href: string;
  descriptionZh: string;
  /** 关注数 / 订阅数：手填字符串（"1.2K" / "—" 等），无则留空 */
  followerLabel?: string;
  /** 最近一条更新摘要：标题或一句话 */
  latest?: string;
  /** 卡片预览图（视频封面等） */
  coverSrc?: string;
};

const wechatArticle: SocialChannel = {
  id: "wechat-articles",
  kind: "article",
  mark: "wechat",
  labelEn: "WeChat",
  labelZh: "微信公众号",
  href: LATEST_WECHAT_FEED_ITEM.href,
  descriptionZh: "",
  followerLabel: undefined,
  latest: `${LATEST_WECHAT_FEED_ITEM.stageTitleZh} · ${LATEST_WECHAT_FEED_ITEM.stageMetaZh}`,
};

const videoChannels: SocialChannel[] = [
  {
    id: "xiaohongshu",
    kind: "video",
    mark: "xiaohongshu",
    labelEn: "Xiaohongshu",
    labelZh: "小红书",
    href: "https://www.xiaohongshu.com/user/profile/66c1db2d000000001d030d6e?xsec_token=ABSe1GVdniK6h9xUrt52iMEnugcyIWsAnbWnCKOfgbgxA%3D&xsec_source=pc_search",
    descriptionZh: "创始人对谈 · 短视频切片",
    followerLabel: undefined,
    latest: "创始人对谈 · 短视频切片同步更新",
  },
  {
    id: "bilibili",
    kind: "video",
    mark: "bilibili",
    labelEn: "Bilibili",
    labelZh: "哔哩哔哩",
    href: "https://space.bilibili.com/3546759022250564",
    descriptionZh: "",
    followerLabel: undefined,
    latest: "第二期 · AI 时代，请保持你珍贵的活人感！| 对话 Seede.AI 杨沐锦",
    coverSrc:
      "https://i2.hdslb.com/bfs/archive/b6d85f1249911607824f2eaf84b3948aaf8c705e.jpg",
  },
  {
    id: "twitter",
    kind: "video",
    mark: "twitter",
    labelEn: "X (Twitter)",
    labelZh: "X",
    href: "#",
    descriptionZh: "",
    followerLabel: "Coming soon",
    latest: "英文版筹备中",
  },
  {
    id: "youtube",
    kind: "video",
    mark: "youtube",
    labelEn: "YouTube",
    labelZh: "YouTube · 视频",
    href: "#",
    descriptionZh: "",
    followerLabel: "Coming soon",
    latest: "海外频道筹备中",
  },
  {
    id: "xiaoyuzhou",
    kind: "audio",
    mark: "xiaoyuzhou",
    labelEn: "Xiaoyuzhou",
    labelZh: "小宇宙 · 播客",
    href: "https://www.xiaoyuzhoufm.com/podcast/66dc991838220204ac72fe31",
    descriptionZh: "播客音频",
    followerLabel: "—",
    latest: "音频版同步上线",
  },
];

const githubOrg: SocialChannel = {
  id: "github-org",
  kind: "code",
  mark: "github",
  labelEn: "GitHub",
  labelZh: "组织仓库 · 开源",
  href: "https://github.com/SurferGarage",
  descriptionZh: "仓库 · 手册 · 源码",
  followerLabel: "Public org",
  latest: "Playbook v1 · 失败手册 · 学习路径已开源",
};

/** Connect 首页：按产品逻辑分三块（与 `home-social` 一致）。 */
export const SOCIAL_CONNECT_SECTIONS: readonly {
  id: string;
  titleZh: string;
  channels: readonly SocialChannel[];
}[] = [
  {
    id: "articles",
    titleZh: "文章",
    channels: [wechatArticle],
  },
  {
    id: "video",
    titleZh: "视频与播客",
    channels: videoChannels,
  },
  {
    id: "open-source",
    titleZh: "GitHub",
    channels: [githubOrg],
  },
];

/** 扁平清单（测试 / 脚本用）；不含已从 Connect 撤下的 Discord。 */
export const SOCIAL_CHANNELS: SocialChannel[] = SOCIAL_CONNECT_SECTIONS.flatMap(
  (s) => [...s.channels],
);

/** 渠道是否已有可点击外链（排除 `#` 占位） */
export function isSocialChannelLive(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
