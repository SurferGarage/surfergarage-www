"use client";

/**
 * GlowRiver
 *
 * 双层：
 * - **主流**（`.sg-river-layer`）：220vh 高，hero 段强对比 brand-teal/primary，出水线后衰减
 * - **深流**（`.sg-river-deep`）：h-full 贯穿整页，深 navy + 大 blur，不被 ambient-mode 归零；
 *   在 paper 区也保留 0.05 baseline opacity，作为整站背景的「暗流暗纹」打破纯色单调
 */
export function GlowRiver() {
  return (
    <>
      {/* —— 深流 · 贯穿整页 —— */}
      <div
        aria-hidden
        className="sg-river-deep"
        style={{ transform: "translateZ(0)" }}
      >
        <svg
          className="sg-river-deep-svg"
          viewBox="0 0 1440 8000"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="glow-river-deep-gradient" x1="30%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#0A06BE" stopOpacity="0.35" />
              <stop offset="25%" stopColor="#060644" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#0A1F66" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#060644" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0009E2" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* 主深流：S 形多段弯曲，覆盖整页（0-8000） */}
          <path
            className="sg-river-deep-path"
            d="M 880 0 C 1320 900, 220 1700, 760 2700 C 1280 3500, 200 4400, 720 5300 C 1240 6100, 280 6900, 760 7900 L 760 8000"
            stroke="url(#glow-river-deep-gradient)"
            strokeWidth="200"
            fill="none"
            strokeLinecap="round"
          />

          {/* 副支流：稍偏移、更细，形成「双流并行」纹理 */}
          <path
            className="sg-river-deep-path"
            d="M 360 200 C 880 1100, 0 2000, 540 3000 C 1100 3900, 60 4800, 600 5800 C 1080 6700, 120 7400, 580 8000"
            stroke="url(#glow-river-deep-gradient)"
            strokeWidth="120"
            fill="none"
            strokeLinecap="round"
            opacity={0.6}
          />
        </svg>
      </div>

      {/* —— 主流 · hero 段强对比 —— */}
      <div
        aria-hidden
        className="sg-river-layer sg-river-depth pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        style={{ transform: "translateZ(0)" }}
      >
        <svg
          className="sg-river-svg h-[220vh] w-full [filter:blur(90px)]"
          viewBox="0 0 1440 3200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="glow-river-gradient" x1="20%" y1="0%" x2="75%" y2="100%">
              <stop offset="0%" stopColor="#0000E2" />
              <stop offset="48%" stopColor="#0A06BE" />
              <stop offset="100%" stopColor="#22D3C5" />
            </linearGradient>
          </defs>

          <path
            className="sg-river-path"
            d="M1080 80 C 850 360, 980 760, 770 1100 C 560 1460, 830 1830, 670 2230 C 560 2500, 740 2860, 620 3140"
            stroke="url(#glow-river-gradient)"
            strokeWidth="120"
            fill="none"
            strokeLinecap="round"
          />
          <path
            className="sg-river-path-shimmer"
            d="M1080 80 C 850 360, 980 760, 770 1100 C 560 1460, 830 1830, 670 2230 C 560 2500, 740 2860, 620 3140"
            stroke="url(#glow-river-gradient)"
            strokeWidth="76"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
}
