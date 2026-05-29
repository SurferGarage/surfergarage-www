import { SgVisPill } from "@/components/sg-vis-pill";
import { SgVisSignalStrip } from "@/components/sg-vis-signal-strip";
import { SgVisWaveRule } from "@/components/sg-vis-wave-rule";
import { SG_SECTION_TITLE_CLASS } from "@/lib/sg-layout";
import type { SgVisPillId } from "@/lib/sg-vis";

type SgVisSectionHeaderProps = {
  titleZh: string;
  pill: SgVisPillId;
  /** 英文骨牌副标（可选） */
  titleEn?: string;
};

/** VIS Frame/Label + Signal + 章节标题 */
export function SgVisSectionHeader({
  titleZh,
  pill,
  titleEn,
}: SgVisSectionHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <SgVisPill id={pill} />
        <SgVisSignalStrip className="h-5 min-w-[5rem] flex-1 max-w-[10rem] sm:max-w-[14rem]" />
        {titleEn ? (
          <span className="editorial-mono ml-auto hidden text-[11px] tracking-[0.14em] text-[var(--muted-soft)] sm:inline">
            {titleEn}
          </span>
        ) : null}
      </div>
      <h2 className={SG_SECTION_TITLE_CLASS}>{titleZh}</h2>
      <SgVisWaveRule className="h-2.5 w-full max-w-[12rem] text-[var(--brand-teal)]/55" />
    </header>
  );
}
