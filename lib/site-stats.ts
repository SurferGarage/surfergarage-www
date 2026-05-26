/**
 * 站点级聚合统计：Hero ticker / Proof section / Footer 等共用。
 * 数据 **运行时从既有清单计算**，无需手填；接入 CMS 后从此处导出仍可保持调用方不变。
 */

import { SURFING_FOUNDERS_SEASON_01 } from "@/lib/surfing-founders-video-season";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";

/** 已发布的微信长文条数（与首页横滑展台同源） */
export function getArticleCount(): number {
  return WECHAT_OFFICIAL_FEED.length;
}

/** 已上线的视频集数（跨嘉宾汇总） */
export function getEpisodeCount(): number {
  return SURFING_FOUNDERS_SEASON_01.guests.reduce(
    (acc, g) => acc + g.episodes.length,
    0,
  );
}

/** 本季嘉宾席位总数（含待公布） */
export function getGuestSlotCount(): number {
  return SURFING_FOUNDERS_SEASON_01.guests.length;
}

/** 本季已上线嘉宾数（非 comingSoon） */
export function getLiveGuestCount(): number {
  return SURFING_FOUNDERS_SEASON_01.guests.filter(
    (g) => !g.comingSoon && g.episodes.length > 0,
  ).length;
}

export type SgSiteStats = {
  articles: number;
  episodes: number;
  liveGuests: number;
  guestSlots: number;
  season: string;
};

export function getSiteStats(): SgSiteStats {
  return {
    articles: getArticleCount(),
    episodes: getEpisodeCount(),
    liveGuests: getLiveGuestCount(),
    guestSlots: getGuestSlotCount(),
    season: SURFING_FOUNDERS_SEASON_01.seasonLabelEn,
  };
}

/** Hero 右下 ticker 用：紧凑短串 */
export function formatHeroTicker(stats: SgSiteStats): string {
  return `${stats.articles} 文 · ${stats.episodes} 集 · ${stats.liveGuests}/${stats.guestSlots} 嘉宾`;
}
