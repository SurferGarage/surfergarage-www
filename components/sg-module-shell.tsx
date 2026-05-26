import { SG_EDITORIAL_CLASS } from "@/lib/sg-layout";
import type { ReactNode } from "react";

type SgModuleShellProps = {
  /** §0X — 章节编号槽，可选 */
  sectionIndex?: string;
  eyebrow: string;
  titleZh: string;
  titleEn: string;
  leadZh?: string;
  /** Editorial-Serif 大引文，可选；若无则不渲染 */
  pullquote?: string;
  children?: ReactNode;
};

/** 模块标题区：始终落在 Editorial 窄栏内 */
export function SgModuleShell({
  sectionIndex,
  eyebrow,
  titleZh,
  titleEn,
  leadZh,
  pullquote,
  children,
}: SgModuleShellProps) {
  return (
    <div className={SG_EDITORIAL_CLASS}>
      <div className="flex items-baseline gap-3">
        {sectionIndex ? (
          <span className="editorial-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--accent-amber)]">
            § {sectionIndex}
          </span>
        ) : null}
        <p className="editorial-eyebrow text-[var(--brand-teal)]">{eyebrow}</p>
      </div>
      <h2 className="mt-3 editorial-serif text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.06] text-[var(--foreground)]">
        {titleZh}
      </h2>
      <p className="mt-1.5 editorial-eyebrow text-[var(--muted)]">
        {titleEn}
      </p>
      {pullquote ? (
        <p className="mt-5 border-l-2 border-[var(--brand-teal)]/45 pl-5 editorial-serif-italic text-[clamp(1rem,2vw,1.25rem)] leading-snug text-[var(--muted-strong)]">
          {pullquote}
        </p>
      ) : null}
      {leadZh ? (
        <p className="mt-4 font-[family-name:var(--font-zh)] text-[13.5px] leading-relaxed text-[var(--muted-strong)] md:text-[14.5px] md:leading-[1.65]">
          {leadZh}
        </p>
      ) : null}
      {children}
    </div>
  );
}
