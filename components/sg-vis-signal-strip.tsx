/** VIS · Signal line / 均衡器条（纯 CSS，装饰用） */
export function SgVisSignalStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`sg-vis-signal-strip ${className}`.trim()}
      aria-hidden
    />
  );
}
