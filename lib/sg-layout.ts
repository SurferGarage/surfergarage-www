/**
 * Surfer Garage 版面体系（单一事实源）
 *
 * - **Editorial**：标题 / 导语 / 说明 — 窄栏，易读即可
 * - **Stage**：画幅、横滑、三栏展台、大卡 — 全视口宽 + gutter，要有张力
 * - **Shell**：页头 / 分节容器 — 略宽于旧 1440，仍留边距
 */

/** Sticky 顶栏高度（与 `scroll-mt` / `scroll-padding-top` 一致） */
export const SG_HEADER_SCROLL_MT = "scroll-mt-[4.5rem]";

/** 区块纵向节奏 */
export const SG_SECTION_PY_CLASS = "py-20 md:py-28 lg:py-32";

/** 统一 section 大标题（中文专用，避免 serif + 紧行高裁切） */
export const SG_SECTION_TITLE_CLASS =
  "font-[family-name:var(--font-zh)] text-[clamp(1.85rem,3.8vw,2.85rem)] font-medium leading-[1.28] tracking-tight text-[var(--foreground)]";

/** 中文正文 */
export const SG_BODY_ZH_CLASS =
  "font-[family-name:var(--font-zh)] text-[16px] leading-[1.72] text-[var(--muted-strong)] md:text-[17px] md:leading-[1.68]";

/** 行内行动链接 */
export const SG_INLINE_LINK_CLASS =
  "font-[family-name:var(--font-zh)] text-[15px] text-[var(--brand-teal)] underline decoration-[var(--brand-teal)]/30 underline-offset-[5px] transition-[color,decoration-color] hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]/35 md:text-[16px]";

/** 页级容器（宣言、片场、触点外壳） */
export const SG_PAGE_SHELL_CLASS =
  "mx-auto w-full max-w-[1680px] px-5 md:px-10 lg:px-12 xl:px-16";

/** 阅读 / 决策章节的外层海沟；让相邻满幅舞台在滚动中明确换章 */
export const SG_IMMERSIVE_SECTION_CLASS =
  "sg-immersive-section bg-[#07080b] py-8 md:py-12 lg:py-16";

/**
 * 编辑版心平面：移动端保持满宽，宽屏逐级打开两侧留白。
 * 实际宽度由 globals.css 控制，避免 Tailwind 任意 calc 值分散。
 */
export const SG_IMMERSIVE_PLANE_CLASS =
  "sg-immersive-plane mx-auto w-full max-w-[1600px]";

/** 编辑版心内部 gutter；与页头 / 舞台 gutter 同一比例体系 */
export const SG_IMMERSIVE_INSET_CLASS =
  "px-5 md:px-10 lg:px-12 xl:px-14 2xl:px-16";

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
