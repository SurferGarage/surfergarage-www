export const LENIS_SCROLL_EVENT = "lenis-scroll" as const;

export type LenisScrollDetail = {
  scroll: number;
  velocity: number;
};

declare global {
  interface WindowEventMap {
    "lenis-scroll": CustomEvent<LenisScrollDetail>;
  }
}
