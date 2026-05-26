"use client";

/**
 * @deprecated 使用 `sg-webgl-policy` 的 `SgWebglTier`。
 * 保留类型别名以免旧引用断裂。
 */
export type SgVisualQuality = "full" | "lite";

export {
  detectSgWebglTier as detectSgVisualQuality,
  useSgWebglTier as useSgVisualQuality,
  type SgWebglTier,
} from "@/lib/sg-webgl-policy";
