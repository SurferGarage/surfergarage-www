/**
 * 出站渠道清单。`href` 非 http(s) 时在 UI 中渲染为信息卡（见 `home-social`）。
 * 触点区按 **文章 / 视频与播客 / 开源** 分块展示；Discord 不在此区（入口见「联络」）。
 */
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
};

const wechatArticle: SocialChannel = {
  id: "wechat-articles",
  kind: "article",
  mark: "wechat",
  labelEn: "WeChat",
  labelZh: "公众号专栏",
  href: "#founders",
  descriptionZh: "微信长文 · 片场选篇",
  followerLabel: "持续更新",
  latest:
    "从小玩硝糖火箭的少年，现在想把世界永存进树脂里 · 对话「稀树科技」曹瑞翔",
};

const videoChannels: SocialChannel[] = [
  {
    id: "xiaohongshu",
    kind: "video",
    mark: "xiaohongshu",
    labelEn: "Xiaohongshu",
    labelZh: "小红书 · 视频",
    href: "https://www.xiaohongshu.com/user/profile/66c1db2d000000001d030d6e?xsec_token=ABSe1GVdniK6h9xUrt52iMEnugcyIWsAnbWnCKOfgbgxA%3D&xsec_source=pc_search",
    descriptionZh: "短视频 · 图文",
    followerLabel: "—",
    latest: "按平台节奏更新",
  },
  {
    id: "bilibili",
    kind: "video",
    mark: "bilibili",
    labelEn: "Bilibili",
    labelZh: "哔哩哔哩 · 视频",
    href: "https://space.bilibili.com/3546759022250564",
    descriptionZh: "S01 播客 · 片场连映",
    followerLabel: "Season 01",
    latest: "Vol.04 · 财富方法论：如何从零赚到第一桶金，再到财富自由",
  },
  {
    id: "twitter",
    kind: "video",
    mark: "twitter",
    labelEn: "X (Twitter)",
    labelZh: "X（Twitter）· 视频",
    href: "#",
    descriptionZh: "筹备中",
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
    descriptionZh: "筹备中",
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
  latest: "Startup Playbook · 新增章节「非共识与可核对的样本」",
};

/** Connect 首页：按产品逻辑分三块（与 `home-social` 一致）。 */
export const SOCIAL_CONNECT_SECTIONS: readonly {
  id: string;
  index: string;
  eyebrowEn: string;
  titleZh: string;
  titleEn: string;
  leadZh: string;
  channels: readonly SocialChannel[];
}[] = [
  {
    id: "articles",
    index: "01",
    eyebrowEn: "Articles",
    titleZh: "文章",
    titleEn: "Long-form",
    leadZh: "",
    channels: [wechatArticle],
  },
  {
    id: "video",
    index: "02",
    eyebrowEn: "Video & audio",
    titleZh: "视频与播客",
    titleEn: "Motion & spoken",
    leadZh: "",
    channels: videoChannels,
  },
  {
    id: "open-source",
    index: "03",
    eyebrowEn: "Open source",
    titleZh: "GitHub 仓库",
    titleEn: "Repositories",
    leadZh: "",
    channels: [githubOrg],
  },
];

/** 扁平清单（测试 / 脚本用）；不含已从 Connect 撤下的 Discord。 */
export const SOCIAL_CHANNELS: SocialChannel[] = SOCIAL_CONNECT_SECTIONS.flatMap(
  (s) => [...s.channels],
);
