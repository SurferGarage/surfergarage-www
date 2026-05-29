import { SgVisSectionHeader } from "@/components/sg-vis-section-header";
import { SG_EDITORIAL_CLASS } from "@/lib/sg-layout";
import type { SgVisPillId } from "@/lib/sg-vis";
import type { ReactNode } from "react";

type SgModuleShellProps = {
  titleZh: string;
  leadZh?: string;
  pullquote?: string;
  visPill?: SgVisPillId;
  titleEn?: string;
  children?: ReactNode;
};

/** 模块标题区 */
export function SgModuleShell({
  titleZh,
  leadZh,
  pullquote,
  visPill,
  titleEn,
  children,
}: SgModuleShellProps) {
  return (
    <div className={SG_EDITORIAL_CLASS}>
      {visPill ? (
        <SgVisSectionHeader
          titleZh={titleZh}
          pill={visPill}
          titleEn={titleEn}
        />
      ) : (
        <h2 className="sg-section-title">{titleZh}</h2>
      )}
      {pullquote ? (
        <p className="mt-6 border-l-2 border-[var(--brand-teal)]/45 pl-5 editorial-serif-zh italic text-[clamp(1.05rem,2vw,1.3rem)] leading-snug text-[var(--muted-strong)]">
          {pullquote}
        </p>
      ) : null}
      {leadZh ? (
        <p className="mt-5 font-[family-name:var(--font-zh)] text-[16px] leading-relaxed text-[var(--muted-strong)] md:text-[17px]">
          {leadZh}
        </p>
      ) : null}
      {children}
    </div>
  );
}
