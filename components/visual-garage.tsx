"use client";

import { useId } from "react";

type VisualSlot = {
  id: string;
  labelZh: string;
  motif: "wave" | "sun" | "spark";
  ratio: "1/1" | "4/5" | "16/9";
};

const SLOTS: VisualSlot[] = [
  { id: "logo", labelZh: "品牌字标", motif: "wave", ratio: "4/5" },
  { id: "logo-square", labelZh: "方形头像", motif: "sun", ratio: "1/1" },
  { id: "keyvisual", labelZh: "主视觉", motif: "spark", ratio: "16/9" },
];

function MotifSurface({ motif }: { motif: VisualSlot["motif"] }) {
  const common = "absolute inset-0";
  switch (motif) {
    case "wave":
      return (
        <div
          className={common}
          style={{
            background:
              "radial-gradient(120% 80% at 50% 110%, rgba(39,215,199,0.32) 0%, rgba(0,9,226,0.14) 36%, transparent 64%), linear-gradient(180deg, rgba(11,12,16,0.55) 0%, rgba(15,17,22,0.95) 100%)",
          }}
        />
      );
    case "sun":
      return (
        <div
          className={common}
          style={{
            background:
              "radial-gradient(90% 90% at 50% 50%, rgba(230,185,100,0.32) 0%, rgba(0,9,226,0.16) 38%, transparent 72%), linear-gradient(180deg, rgba(15,17,22,0.55) 0%, rgba(11,12,16,0.95) 100%)",
          }}
        />
      );
    case "spark":
    default:
      return (
        <div
          className={common}
          style={{
            background:
              "radial-gradient(60% 40% at 30% 30%, rgba(39,215,199,0.26) 0%, transparent 60%), radial-gradient(60% 40% at 80% 70%, rgba(230,185,100,0.18) 0%, transparent 60%), linear-gradient(155deg, rgba(15,17,22,0.85) 0%, rgba(11,12,16,1) 100%)",
          }}
        />
      );
  }
}

function SlotCard({ slot }: { slot: VisualSlot }) {
  const id = useId();
  const ratioClass = {
    "1/1": "aspect-square",
    "4/5": "aspect-[4/5]",
    "16/9": "aspect-[16/9]",
  }[slot.ratio];

  return (
    <figure
      aria-labelledby={`${id}-cap`}
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--paper-1)] transition-[border-color,background-color] duration-300 hover:border-[var(--hairline-strong)] hover:bg-[var(--paper-2)]"
    >
      <div className={`relative w-full overflow-hidden ${ratioClass}`}>
        <MotifSurface motif={slot.motif} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.45)_100%)]"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
          <p className="editorial-serif text-[clamp(1.25rem,2.8vw,1.85rem)] leading-[0.98] text-[var(--foreground)]">
            {slot.labelZh}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function VisualGarage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 md:gap-5" data-visual-garage>
      <div className="grid flex-1 grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12">
        <div className="col-span-1 lg:col-span-4">
          <SlotCard slot={SLOTS[0]!} />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <SlotCard slot={SLOTS[1]!} />
        </div>
        <div className="col-span-2 lg:col-span-5">
          <SlotCard slot={SLOTS[2]!} />
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-sm border border-dashed border-[var(--hairline)] bg-[rgba(15,17,22,0.45)] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)] md:text-[15px]">
          媒体合作 ·{" "}
          <a
            href="mailto:partners@surfergarage.com?subject=SurferGarage%20Brand%20Kit"
            className="text-[var(--brand-teal)] underline-offset-4 hover:underline"
          >
            partners@surfergarage.com
          </a>
        </p>
      </div>
    </div>
  );
}
