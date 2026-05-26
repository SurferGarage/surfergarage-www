/**
 * Blueprint Magazine — 全站 ambient 层（dot grid + film grain）
 *
 * 渲染两个 fixed 全屏装饰层：
 * - `.sg-grid-base`：极细工程图纸点阵，vignette mask，水下区透明、出水后渐现
 * - `.sg-grain`：印刷感噪点，全站微叠加（混合模式 overlay）
 *
 * 两层都仅靠 CSS 变量 `--surface-mode` 自动门控；不需要 JS。
 * 在 reduced-motion 下保留（视觉装饰而非动效）。
 */

export function SgAmbientGrid() {
  return (
    <>
      <div aria-hidden className="sg-grid-base" />
      <div aria-hidden className="sg-grain" />
    </>
  );
}
