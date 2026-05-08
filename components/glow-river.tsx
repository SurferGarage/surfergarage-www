"use client";

export function GlowRiver() {
  return (
    <div
      aria-hidden
      className="sg-river-layer pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ willChange: "transform, filter", transform: "translateZ(0)" }}
    >
      <svg
        className="sg-river-svg h-[220vh] w-full opacity-30 [filter:blur(90px)]"
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
  );
}

