"use client";

import { SurfingFoundersVideoStage } from "@/components/surfing-founders-video-stage";
import { WeChatOfficialFeed } from "@/components/wechat-official-feed";
import { SG_STAGE_CLASS } from "@/lib/sg-layout";
import { useId, useState } from "react";

type Track = "wechat" | "video";

const TRACKS: { id: Track; labelZh: string; labelEn: string; metaZh: string }[] = [
  {
    id: "wechat",
    labelZh: "文字 · 微信专栏",
    labelEn: "Writing · WeChat",
    metaZh: "横滑长文",
  },
  {
    id: "video",
    labelZh: "视频 · B 站播客",
    labelEn: "Video · Bilibili",
    metaZh: "本季 6 位嘉宾",
  },
];

/** Block A — 文字 / 视频 tab 切换，紧凑高度（一屏内） */
export function FounderStudioStage() {
  const [track, setTrack] = useState<Track>("wechat");
  const tabsId = useId();

  return (
    <div className="flex w-full flex-col gap-5 md:gap-6" data-founder-studio>
      {/* Tab 切换条 + 当前轨道 meta */}
      <div
        role="tablist"
        aria-label="访谈轨道切换"
        id={tabsId}
        className="flex w-full flex-col gap-3 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex flex-wrap gap-2 md:gap-3">
          {TRACKS.map((t) => {
            const active = t.id === track;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${tabsId}-${t.id}-panel`}
                id={`${tabsId}-${t.id}-tab`}
                onClick={() => setTrack(t.id)}
                className={`group inline-flex items-center gap-2.5 rounded-sm border px-3.5 py-2 text-left transition-[border-color,background-color,color] duration-200 md:px-4 md:py-2.5 ${
                  active
                    ? "border-[var(--brand-teal)]/55 bg-[color-mix(in_oklch,var(--brand-teal)_10%,transparent)] text-[var(--foreground)]"
                    : "border-[var(--hairline)] bg-transparent text-[var(--muted-strong)] hover:border-[var(--hairline-strong)] hover:text-[var(--foreground)]"
                }`}
              >
                <span className="flex flex-col leading-none">
                  <span className="font-[family-name:var(--font-zh)] text-[13px] font-medium md:text-[14px]">
                    {t.labelZh}
                  </span>
                  <span className="mt-1 editorial-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {t.labelEn}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="editorial-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] md:text-right">
          Surfing wave, build the great · {TRACKS.find((t) => t.id === track)?.metaZh}
        </p>
      </div>

      {/* Stage — 全宽展台 */}
      <div className={`${SG_STAGE_CLASS} flex-1 min-h-0`}>
        <div
          role="tabpanel"
          id={`${tabsId}-wechat-panel`}
          aria-labelledby={`${tabsId}-wechat-tab`}
          hidden={track !== "wechat"}
          className="h-full"
        >
          {track === "wechat" ? <WeChatOfficialFeed /> : null}
        </div>
        <div
          role="tabpanel"
          id={`${tabsId}-video-panel`}
          aria-labelledby={`${tabsId}-video-tab`}
          hidden={track !== "video"}
          className="h-full"
        >
          {track === "video" ? <SurfingFoundersVideoStage /> : null}
        </div>
      </div>
    </div>
  );
}
