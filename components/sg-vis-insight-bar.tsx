/** VIS · 斜切信息条（/// SURFER GARAGE | INSIGHT） */
export function SgVisInsightBar() {
  return (
    <div className="sg-vis-insight-bar" aria-hidden>
      <span className="sg-vis-insight-bar-slash" aria-hidden>
        {"///"}
      </span>
      <span className="sg-vis-insight-bar-text editorial-mono">
        SURFER GARAGE <span className="text-[var(--brand-teal)]">|</span>{" "}
        INSIGHT
      </span>
      <span className="sg-vis-insight-bar-node" aria-hidden />
    </div>
  );
}
