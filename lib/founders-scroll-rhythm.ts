/**
 * Founders 首屏纵向节奏（全局统筹）。
 * 浪前片场（#founders）与触点（#social）之间的「海沟」由 `page.tsx` 内全宽 `data-social-founders-trench` 承担（与叠卡呼吸带同量级）；
 * 此处仅保留区块内侧收边，避免海沟 + 超大 pb/pt 双重叠加。
 * `FOUNDERS_EDITORIAL_MB` 控制导语与「Surfing Founders 人物访谈」大标题之间的空白。
 */
export const FOUNDERS_BRIDGE_SOCIAL_PB = "pb-10 md:pb-14";
export const FOUNDERS_BRIDGE_SECTION_PT = "pt-10 md:pt-14";

export const FOUNDERS_EDITORIAL_MB = "mb-36 md:mb-52";

/** 两屏叠卡之间的呼吸带：至少约半屏～近一屏高（与 `home-founders` 内 `data-founder-breath` 同步）。 */
export const FOUNDER_BREATH_MIN_H =
  "min-h-[min(52svh,34rem)] md:min-h-[min(58vh,40rem)] lg:min-h-[min(62vh,46rem)]";

/** 浪前片场（#founders）与触点（#social）之间海沟高度：与叠卡呼吸带同量级 */
export const SOCIAL_FOUNDERS_TRENCH_MIN_H = FOUNDER_BREATH_MIN_H;
