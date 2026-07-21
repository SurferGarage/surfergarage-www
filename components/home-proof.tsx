"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";

const ARTICLE_DIRECTORY = [...WECHAT_OFFICIAL_FEED].reverse();
const DEFAULT_ARTICLE_ID = "wx-13";

function getOrdinal(id: string) {
  const index = WECHAT_OFFICIAL_FEED.findIndex((article) => article.id === id);
  return `Vol.${String(index + 1).padStart(2, "0")}`;
}

export function HomeProof() {
  const [selectedId, setSelectedId] = useState(DEFAULT_ARTICLE_ID);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const directoryId = useId();
  const directoryRef = useRef<HTMLElement>(null);
  const directoryTriggerRef = useRef<HTMLButtonElement>(null);

  const selectedIndex = Math.max(
    0,
    ARTICLE_DIRECTORY.findIndex((article) => article.id === selectedId),
  );
  const selectedArticle = ARTICLE_DIRECTORY[selectedIndex]!;
  const olderArticle = ARTICLE_DIRECTORY[selectedIndex + 1];
  const companionArticle = olderArticle ?? ARTICLE_DIRECTORY[selectedIndex - 1];
  const companionLabel = olderArticle ? "上一篇" : "下一篇";

  useEffect(() => {
    if (!directoryOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const node = event.target as Node;
      if (
        directoryRef.current?.contains(node) ||
        directoryTriggerRef.current?.contains(node)
      ) {
        return;
      }
      setDirectoryOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDirectoryOpen(false);
      directoryTriggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [directoryOpen]);

  const selectArticle = (id: string) => {
    setSelectedId(id);
    setDirectoryOpen(false);
    directoryTriggerRef.current?.focus();
  };

  return (
    <section
      id="proof"
      className="scroll-mt-[4.5rem] border-b border-white/20 bg-[var(--brand-primary)] text-white"
      aria-labelledby="proof-heading"
    >
      <div className={`${SG_PAGE_SHELL_CLASS} py-20 md:py-28 lg:py-32`}>
        <header className="relative flex min-h-[42svh] flex-col justify-between">
          <div className="flex items-center justify-between gap-6 border-b border-white/25 pb-4">
            <p className="font-[family-name:var(--font-zh)] text-[14px] text-white/82 md:text-[15px]">
              人物特稿
            </p>
            <button
              ref={directoryTriggerRef}
              type="button"
              aria-expanded={directoryOpen}
              aria-controls={directoryId}
              onClick={() => setDirectoryOpen((open) => !open)}
              className="group inline-flex min-h-11 items-center gap-4 border-l border-white/28 pl-5 font-[family-name:var(--font-zh)] text-[14px] font-medium text-white transition-colors hover:text-white/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:text-[15px]"
            >
              <span>文章目录</span>
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-white/62 md:text-[11px]">
                {String(ARTICLE_DIRECTORY.length).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="w-4 text-center font-[family-name:var(--font-en)] text-[18px] font-normal transition-transform duration-200 group-hover:translate-x-0.5"
              >
                {directoryOpen ? "−" : "+"}
              </span>
            </button>
          </div>

          {directoryOpen ? (
            <aside
              id={directoryId}
              ref={directoryRef}
              data-lenis-prevent
              className="absolute inset-x-0 top-[4.75rem] z-20 max-h-[min(72svh,46rem)] overflow-y-auto overscroll-contain border border-white/24 bg-[#08090d] text-white shadow-[0_30px_80px_rgba(0,0,0,0.34)] md:left-auto md:w-[min(38rem,74vw)]"
              aria-label="文章目录，最新发布在前"
            >
              <div className="sticky top-0 z-10 flex items-end justify-between gap-6 border-b border-white/16 bg-[#08090d]/95 px-5 py-5 backdrop-blur-md md:px-7">
                <p className="font-[family-name:var(--font-serif-zh)] text-[1.55rem] font-semibold">
                  文章目录
                </p>
                <p className="font-[family-name:var(--font-zh)] text-[12px] text-white/58">
                  最新发布在前
                </p>
              </div>
              <ol>
                {ARTICLE_DIRECTORY.map((article) => {
                  const isSelected = article.id === selectedArticle.id;
                  return (
                    <li
                      key={article.id}
                      className="grid grid-cols-[1fr_3.25rem] border-b border-white/12 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => selectArticle(article.id)}
                        aria-pressed={isSelected}
                        className={`grid min-h-[5.25rem] grid-cols-[3.75rem_1fr] items-center gap-3 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 md:grid-cols-[4.25rem_1fr] md:px-7 ${
                          isSelected
                            ? "bg-white text-[#08090d]"
                            : "text-white hover:bg-white/8"
                        }`}
                      >
                        <span
                          className={`font-[family-name:var(--font-mono)] text-[10px] md:text-[11px] ${
                            isSelected ? "text-[#141cff]" : "text-white/48"
                          }`}
                        >
                          {getOrdinal(article.id)}
                        </span>
                        <span className="font-[family-name:var(--font-zh)] text-[14px] leading-[1.55] md:text-[15px]">
                          {article.stageTitleZh}
                        </span>
                      </button>
                      <a
                        href={article.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`直接阅读：${article.stageTitleZh}`}
                        className={`inline-flex items-center justify-center border-l transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 ${
                          isSelected
                            ? "border-[#08090d]/12 bg-white text-[#141cff] hover:bg-[#e9eaff]"
                            : "border-white/12 text-white/62 hover:bg-white/8 hover:text-white"
                        }`}
                      >
                        <span aria-hidden>↗</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </aside>
          ) : null}

          <div className="grid gap-8 pt-20 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2
              id="proof-heading"
              className="font-[family-name:var(--font-serif-zh)] text-[2.8rem] font-semibold leading-[1.16] text-white md:text-[4.5rem] lg:col-span-8 lg:text-[5.25rem]"
            >
              刚刚发生的，
              <br />
              先被留下。
            </h2>
            <p className="max-w-[34rem] font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-white/80 md:text-[17px] lg:col-span-4">
              人还在变化，产品尚未定型，判断尚未成为共识。此刻，记录最有价值。
            </p>
          </div>
        </header>

        <div
          className="mt-16 grid items-end gap-14 border-t border-white/25 pt-10 md:mt-20 md:pt-14 lg:grid-cols-12 lg:gap-0"
          aria-live="polite"
        >
          <a
            key={selectedArticle.id}
            href={selectedArticle.href}
            target="_blank"
            rel="noopener noreferrer"
            className="sg-proof-swap group lg:col-span-7 lg:pr-12"
          >
            <div className="relative aspect-video overflow-hidden bg-white/10">
              <Image
                src={selectedArticle.imageSrc}
                alt={selectedArticle.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.018]"
              />
            </div>
            <div className="mt-5 flex items-center justify-between gap-6 font-[family-name:var(--font-mono)] text-[10px] text-white/72 md:text-[11px]">
              <span>当前文章 · {getOrdinal(selectedArticle.id)}</span>
              <span className="text-white">阅读全文 ↗</span>
            </div>
            <h3 className="mt-4 max-w-[48rem] font-[family-name:var(--font-serif-zh)] text-[1.8rem] font-semibold leading-[1.45] text-white transition-opacity group-hover:opacity-80 md:text-[2.45rem]">
              {selectedArticle.stageTitleZh}
            </h3>
            <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] text-white/68 md:text-[11px]">
              {selectedArticle.stageMetaZh}
            </p>
          </a>

          {companionArticle ? (
            <a
              key={companionArticle.id}
              href={companionArticle.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sg-proof-swap group border-t border-white/25 pt-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
            >
              <div className="relative aspect-video overflow-hidden bg-white/10">
                <Image
                  src={companionArticle.imageSrc}
                  alt={companionArticle.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.018]"
                />
              </div>
              <div className="mt-5 flex items-center justify-between gap-6 font-[family-name:var(--font-mono)] text-[10px] text-white/72 md:text-[11px]">
                <span>
                  {companionLabel} · {getOrdinal(companionArticle.id)}
                </span>
                <span className="text-white">阅读全文 ↗</span>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-serif-zh)] text-[1.55rem] font-semibold leading-[1.5] text-white transition-opacity group-hover:opacity-80 md:text-[2rem]">
                {companionArticle.stageTitleZh}
              </h3>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] text-white/68 md:text-[11px]">
                {companionArticle.stageMetaZh}
              </p>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
