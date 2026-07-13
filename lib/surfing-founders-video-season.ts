/**
 * 浪前视频播客 · 季数据（单一事实源）。
 * 每季约 6 位嘉宾，每位 4 期中短视频；B 站 `bvid` 用于 `BilibiliEmbedPlayer`。
 * 封面图落盘 `public/video-covers/{episode.id}.jpg`（与 `coverPic` 同步维护）。
 */

export const BILIBILI_SPACE_URL =
  "https://space.bilibili.com/3546759022250564";

export type VideoEpisodeRole = "origin" | "spotlight" | "method" | "finale";

export type SurfingFoundersEpisode = {
  id: string;
  bvid: string;
  /** B 站 aid / cid — 站外播放器必需，与 bvid 同步维护 */
  aid: number;
  cid: number;
  titleZh: string;
  /** 列表短标，如 Vol.01 */
  volLabel: string;
  role: VideoEpisodeRole;
  publishedAt?: string;
  /** 本地封面 `public/video-covers/{id}.jpg`（由 B 站 pic 同步，勿用外链） */
  coverPic: string;
  /**
   * 左栏封面锚点：`center` 与 Vol.01 一致（16:9 完整 `contain`）。
   * `bottom` 仅在画框比图更高时把图贴底（仍不裁切）。
   */
  coverFocus?: "bottom" | "center";
};

export type SurfingFoundersGuest = {
  id: string;
  nameZh: string;
  nameEn: string;
  /** 选中时左侧「录制现场」说明 */
  duringCaptionZh: string;
  /** 选中时右侧默认集说明（通常指向最新一期） */
  nowCaptionZh: string;
  episodes: readonly SurfingFoundersEpisode[];
  /** 未上线席位：无 episodes */
  comingSoon?: boolean;
};

export type SurfingFoundersSeason = {
  id: string;
  seasonLabel: string;
  seasonLabelEn: string;
  guests: readonly SurfingFoundersGuest[];
};

const XU_KAISER_EPISODES: readonly SurfingFoundersEpisode[] = [
  {
    id: "xu-vol-01",
    bvid: "BV18a5e6JEM4",
    aid: 116578146327901,
    cid: 38348589287,
    volLabel: "Vol.01",
    titleZh: "20 岁辍学创业，我选择了中国最不赚钱的行业｜对话许凯撒",
    role: "origin",
    publishedAt: "2026-05-15",
    coverPic: "/video-covers/xu-vol-01.jpg",
    coverFocus: "center",
  },
  {
    id: "xu-vol-02",
    bvid: "BV1MSLA6hE8V",
    aid: 116596014125396,
    cid: 38428869815,
    volLabel: "Vol.02",
    titleZh: "1 亿美金估值背后：为什么 99% 的创业者不懂规模效应？｜对话许凯撒",
    role: "spotlight",
    publishedAt: "2026-05-18",
    coverPic: "/video-covers/xu-vol-02.jpg",
    coverFocus: "center",
  },
  {
    id: "xu-vol-03",
    bvid: "BV1LdGb6rEeS",
    aid: 116618579481789,
    cid: 38533073326,
    volLabel: "Vol.03",
    titleZh: "被校园霸凌的不幸，却促使我认知觉醒｜对话许凯撒",
    role: "method",
    publishedAt: "2026-05-22",
    coverPic: "/video-covers/xu-vol-03.jpg",
    coverFocus: "center",
  },
  {
    id: "xu-vol-04",
    bvid: "BV1A6Gb6QExD",
    aid: 116619082733148,
    cid: 38536283800,
    volLabel: "Vol.04",
    titleZh: "财富方法论：如何从零赚到第一桶金，再到财富自由｜对话许凯撒",
    role: "finale",
    publishedAt: "2026-05-25",
    coverPic: "/video-covers/xu-vol-04.jpg",
    coverFocus: "center",
  },
] as const;

/** 左栏封面锚点：未标注时与 Vol.01 一致 */
export function episodeCoverFocus(
  episode: SurfingFoundersEpisode,
): "bottom" | "center" {
  return episode.coverFocus ?? "center";
}

const MUJI_EPISODES: readonly SurfingFoundersEpisode[] = [
  {
    id: "muji-vol-01",
    bvid: "BV1XjVY6mEzy",
    aid: 116657771124536,
    cid: 38700846843,
    volLabel: "Vol.01",
    titleZh: "真正的冒险，是勇于对别人负责｜对话 Seede.AI 杨沐锦",
    role: "origin",
    publishedAt: "2026-05-29",
    coverPic: "/video-covers/muji-vol-01.jpg",
    coverFocus: "center",
  },
  {
    id: "muji-vol-02",
    bvid: "BV1ZfVz6GE5U",
    aid: 116679480710384,
    cid: 38795870878,
    volLabel: "Vol.02",
    titleZh: "你的 AI 在抽卡？还是在稳定持续地工作？｜对话 Seede.AI 杨沐锦",
    role: "spotlight",
    publishedAt: "2026-06-02",
    coverPic: "/video-covers/muji-vol-02.jpg",
    coverFocus: "center",
  },
  {
    id: "muji-vol-03",
    bvid: "BV1t77k6kEFb",
    aid: 116697415553307,
    cid: 38883822255,
    volLabel: "Vol.03",
    titleZh: "3 个月 10 万用户，我只花了 0 元｜对话 Seede.AI 杨沐锦",
    role: "method",
    publishedAt: "2026-06-05",
    coverPic: "/video-covers/muji-vol-03.jpg",
    coverFocus: "center",
  },
  {
    id: "muji-vol-04",
    bvid: "BV16CE367Erk",
    aid: 116714998077446,
    cid: 38964105167,
    volLabel: "Vol.04",
    titleZh: "AI 时代，请保持你珍贵的活人感！｜对话 Seede.AI 杨沐锦",
    role: "finale",
    publishedAt: "2026-06-08",
    coverPic: "/video-covers/muji-vol-04.jpg",
    coverFocus: "center",
  },
] as const;

/** 第一季：已上线嘉宾 + 待公布席位（保持 6 人网格感，与 YC 名单长度接近） */
export const SURFING_FOUNDERS_SEASON_01: SurfingFoundersSeason = {
  id: "season-01",
  seasonLabel: "第一季",
  seasonLabelEn: "Season 01",
  guests: [
    {
      id: "xu-kaiser",
      nameZh: "许凯撒",
      nameEn: "Xu Kaisar",
      duringCaptionZh:
        "00 后连续创业者；福布斯亚太菁英 100。做过中国最不赚钱的行业，也经历过一年零收入的纯研究阶段，最终在结构性机会上下注获胜。",
      nowCaptionZh:
        "最新一期谈财富路径：第一桶金、规模效应与长期自由——在 B 站完播后也可跳转专栏长文。",
      episodes: XU_KAISER_EPISODES,
    },
    {
      id: "yang-muji",
      nameZh: "杨沐锦",
      nameEn: "Muji",
      duringCaptionZh:
        "Seede.AI 联合创始人。南开毕业后经奥美、Founder Park，亲历一代中国早期创业者；0 营销投入，3 个月内做到 10 万用户。",
      nowCaptionZh:
        "最新一期谈 AI 时代的「活人感」：当工具越来越像人，创作者最该守住的是什么。",
      episodes: MUJI_EPISODES,
    },
    {
      id: "guest-slot-03",
      nameZh: "嘉宾 03",
      nameEn: "Founder 03",
      duringCaptionZh: "第一季席位 · 录制排期中。",
      nowCaptionZh: "上线后将在此呈现四期短视频目录。",
      episodes: [],
      comingSoon: true,
    },
    {
      id: "guest-slot-04",
      nameZh: "嘉宾 04",
      nameEn: "Founder 04",
      duringCaptionZh: "第一季席位 · 录制排期中。",
      nowCaptionZh: "上线后将在此呈现四期短视频目录。",
      episodes: [],
      comingSoon: true,
    },
    {
      id: "guest-slot-05",
      nameZh: "嘉宾 05",
      nameEn: "Founder 05",
      duringCaptionZh: "第一季席位 · 录制排期中。",
      nowCaptionZh: "上线后将在此呈现四期短视频目录。",
      episodes: [],
      comingSoon: true,
    },
    {
      id: "guest-slot-06",
      nameZh: "嘉宾 06",
      nameEn: "Founder 06",
      duringCaptionZh: "第一季席位 · 录制排期中。",
      nowCaptionZh: "上线后将在此呈现四期短视频目录。",
      episodes: [],
      comingSoon: true,
    },
  ],
};

export function getEpisodeByRole(
  guest: SurfingFoundersGuest,
  role: VideoEpisodeRole,
): SurfingFoundersEpisode | undefined {
  return guest.episodes.find((e) => e.role === role);
}

export function getDefaultEpisode(
  guest: SurfingFoundersGuest,
): SurfingFoundersEpisode | undefined {
  if (!guest.episodes.length) return undefined;
  return (
    getEpisodeByRole(guest, "finale") ??
    guest.episodes[guest.episodes.length - 1]
  );
}

export function getOriginEpisode(
  guest: SurfingFoundersGuest,
): SurfingFoundersEpisode | undefined {
  return (
    getEpisodeByRole(guest, "origin") ?? guest.episodes[0]
  );
}
