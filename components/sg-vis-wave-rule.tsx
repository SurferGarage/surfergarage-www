/** VIS · Wave line 分隔（SVG） */
export function SgVisWaveRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`sg-vis-wave-rule ${className}`.trim()}
      aria-hidden
    >
      <svg
        viewBox="0 0 240 12"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          d="M0 6 C40 2, 80 10, 120 6 S200 2, 240 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
