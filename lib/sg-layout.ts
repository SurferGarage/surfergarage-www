/**
 * Surfer Garage 版面体系（单一事实源）
 *
 * - **Editorial**：标题 / 导语 / 说明 — 窄栏，易读即可
 * - **Stage**：画幅、横滑、三栏展台、大卡 — 全视口宽 + gutter，要有张力
 * - **Shell**：页头 / 分节容器 — 略宽于旧 1440，仍留边距
 */

/** Sticky 顶栏高度（与 `scroll-mt` / `scroll-padding-top` 一致） */
export const SG_HEADER_SCROLL_MT = "scroll-mt-[4.5rem]";

/** 页级容器（宣言、片场、触点外壳） */
export const SG_PAGE_SHELL_CLASS =
  "mx-auto w-full max-w-[1680px] px-5 md:px-10 lg:px-12 xl:px-16";

/** 模块标题 + 短导语 */
export const SG_EDITORIAL_CLASS = "max-w-[38rem]";

/** 片场编者按 / 区块引言 */
export const SG_EDITORIAL_WIDE_CLASS = "max-w-[46rem]";

/** 击穿父级 max-width，占满视口 */
export const SG_FULL_BLEED_CLASS =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)]";

/** 全宽展台左右留白 */
export const SG_STAGE_GUTTER_CLASS =
  "px-5 md:px-10 lg:px-12 xl:px-16 2xl:px-20";

/** 全宽展台（击穿 + gutter） */
export const SG_STAGE_CLASS = `${SG_FULL_BLEED_CLASS} ${SG_STAGE_GUTTER_CLASS}`;

/** 微信专栏单卡宽度 — 横滑主视觉；高度受 Founders pin 100dvh 约束，稍微收 */
export const SG_WECHAT_CARD_CLASS =
  "block w-[min(20rem,calc(100vw-2.75rem))] sm:w-[24rem] md:w-[26rem] lg:w-[28rem] xl:w-[30rem]";

/** 微信专栏展台最小高度（紧凑：必须放进 100dvh − header） */
export const SG_WECHAT_STAGE_MIN_H_CLASS =
  "min-h-[min(58vh,32rem)] md:min-h-[min(60vh,34rem)]";
