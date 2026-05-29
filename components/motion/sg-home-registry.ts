/**
 * 首页 GSAP 编排 — **唯一注册顺序入口**（L0→L3）。
 * 实现细节：`register-*` + `sg-motion-primitives`；常量：`lib/sg-motion-system.ts`。
 */
import { registerCallReveal } from "@/components/motion/register-call-reveal";
import { registerDesktopPins } from "@/components/motion/register-desktop-pins";
import type { DesktopPinsRefs } from "@/components/motion/register-desktop-pins";
import {
  registerFitClosingPin,
  registerFitReveal,
} from "@/components/motion/register-fit-closing";
import { registerFooterWordmarkReveal } from "@/components/motion/register-footer-wordmark-reveal";
import { registerGlobalDepthScrub } from "@/components/motion/register-global-depth-scrub";
import { registerFounderBreath } from "@/components/motion/register-founder-breath";
import { registerFoundersIntro } from "@/components/motion/register-founders-intro";
import { registerGithubRepoCards } from "@/components/motion/register-github-repo-cards";
import { registerHeroChoreography } from "@/components/motion/register-hero-choreography";
import type { HeroChoreographyRefs } from "@/components/motion/register-hero-choreography";
import { registerHeroWordmarkStagger } from "@/components/motion/register-hero-wordmark-stagger";
import { registerMagnetHover } from "@/components/motion/register-magnet-hover";
import { registerManifestoScroll } from "@/components/motion/register-manifesto-scroll";
import { registerSocialExpand } from "@/components/motion/register-social-expand";
import type { MotionMarkers } from "@/components/motion/sg-motion-primitives";
import { SG_LAYER, SG_SECTION, SG_SELECTORS } from "@/lib/sg-motion-system";

export type { MotionMarkers, DesktopPinsRefs, HeroChoreographyRefs };

export type HomeMotionRefs = HeroChoreographyRefs & {
  callSection: HTMLElement | null;
};

export type HomeMotionDomRefs = HomeMotionRefs & DesktopPinsRefs;

/** 编排表（与 `wiki/动效.md` 一致，供文档与调试对照） */
export const SG_HOME_MOTION_PIPELINE = [
  { layer: SG_LAYER.L0, id: "global-depth-t", fn: "registerGlobalDepthScrub" },
  { layer: SG_LAYER.L1, id: "manifesto-*", fn: "registerManifestoScroll" },
  { layer: SG_LAYER.L1, id: "hero-wordmark-stagger", fn: "registerHeroWordmarkStagger" },
  { layer: SG_LAYER.L1, id: "hero-*", fn: "registerHeroChoreography" },
  { layer: SG_LAYER.L2, id: "founders-intro", fn: "registerFoundersIntro" },
  { layer: SG_LAYER.L2, id: "founder-breath-*", fn: "registerFounderBreath" },
  { layer: SG_LAYER.L2, id: "github-repo-card-*", fn: "registerGithubRepoCards" },
  { layer: SG_LAYER.L2, id: "social-expand", fn: "registerSocialExpand" },
  { layer: SG_LAYER.L2, id: "call-reveal", fn: "registerCallReveal" },
  { layer: SG_LAYER.L2, id: "fit-reveal", fn: "registerFitReveal" },
  { layer: SG_LAYER.L2, id: "footer-wordmark", fn: "registerFooterWordmarkReveal" },
] as const;

export const SG_HOME_DESKTOP_PIPELINE = [
  { layer: SG_LAYER.L3, id: "manifesto-pin / founder-stack-*", fn: "registerDesktopPins" },
  { layer: SG_LAYER.L3, id: "fit-closing-pin", fn: "registerFitClosingPin" },
  { layer: SG_LAYER.L1_5, id: "magnet-hover", fn: "registerMagnetHover" },
] as const;

export function collectHomeMotionDomRefs(): HomeMotionDomRefs {
  return {
    manifestoPin: document.querySelector<HTMLElement>(SG_SELECTORS.manifestoPin),
    manifestoRight: document.querySelector<HTMLElement>(
      SG_SELECTORS.manifestoRight,
    ),
    heroScrub: document.querySelector<HTMLElement>(SG_SELECTORS.heroScrub),
    heroWave: document.querySelector<HTMLElement>(SG_SELECTORS.heroWave),
    waveCalmTrigger: document.querySelector<HTMLElement>(SG_SECTION.founders),
    callSection: document.querySelector<HTMLElement>(SG_SECTION.call),
  };
}

/** `gsap.context` 内：L0→L2（不含 md+ pin） */
export function registerHomeScrollMotion(
  markers: MotionMarkers,
  refs: HomeMotionRefs,
): void {
  registerGlobalDepthScrub(markers);
  registerManifestoScroll(markers);
  registerHeroWordmarkStagger();
  registerHeroChoreography(markers, refs); // load stagger 与字标 stagger 已解耦（字标不在 data-hero-reveal 父级上）
  registerFoundersIntro(markers);
  registerFounderBreath(markers);
  registerGithubRepoCards(markers);
  registerSocialExpand(markers);
  registerCallReveal(markers, refs.callSection);
  registerFooterWordmarkReveal(markers);
}

/** `< md`：Fit toggle 揭示（桌面由 pin 接管，避免双注册） */
export function registerHomeMobileMotion(markers: MotionMarkers): void {
  registerFitReveal(markers);
}

/** `gsap.matchMedia(md+)` 内：L3 */
export function registerHomeDesktopMotion(
  markers: MotionMarkers,
  refs: DesktopPinsRefs,
): void {
  registerDesktopPins(markers, refs);
  registerFitClosingPin(markers);
  registerMagnetHover();
}
