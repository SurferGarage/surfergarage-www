import {
  motionGlobalDepthScrub,
  type MotionMarkers,
} from "@/components/motion/sg-motion-primitives";
import { SG_SELECTORS, SG_ST_ID } from "@/lib/sg-motion-system";

export function registerGlobalDepthScrub(markers: MotionMarkers): void {
  const scrollRoot = document.querySelector<HTMLElement>(
    SG_SELECTORS.scrollDepthRoot,
  );
  if (!scrollRoot) return;
  motionGlobalDepthScrub(markers, scrollRoot, SG_ST_ID.globalDepth);
}
