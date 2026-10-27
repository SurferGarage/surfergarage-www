"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";

const ARTICLES = [...WECHAT_OFFICIAL_FEED].reverse();

function ordinal(id: string) {
  return `Vol.${String(WECHAT_OFFICIAL_FEED.findIndex((article) => article.id === id) + 1).padStart(2, "0")}`;
}

export function HomeProof() {
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [query, setQuery] = useState("");
  const directoryId = useId();
  const searchId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const filtered = ARTICLES.filter((article) =>
    `${article.titleZh} ${article.stageMetaZh}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  return (
    <section id="proof" className="sg-ed-section sg-ed-proof" aria-labelledby="proof-heading">
      <div className={SG_PAGE_SHELL_CLASS}>
        <div className="sg-ed-section-topline">
          <p className="sg-ed-kicker"><span>01</span> 人物特稿 / SURFING FOUNDERS</p>
          <button ref={triggerRef} type="button" aria-expanded={directoryOpen} aria-controls={directoryId}
            onClick={() => setDirectoryOpen((open) => !open)} className="sg-ed-index-toggle">
            {directoryOpen ? "收起目录" : "全部文章"}
            <span className="sg-ed-count">{ARTICLES.length}</span>
            <span aria-hidden>{directoryOpen ? "−" : "+"}</span>
          </button>
        </div>
        <header className="sg-ed-section-heading">
          <h2 id="proof-heading" className="sg-ed-heading">故事还在发生。</h2>
          <p className="sg-ed-description">从一个产品、一次选择开始，<br className="hidden md:block" />看见年轻创业者如何走到今天。</p>
        </header>

        {directoryOpen && (
          <div id={directoryId} className="sg-ed-archive" onKeyDown={(event) => {
            if (event.key === "Escape") {
              setDirectoryOpen(false);
              triggerRef.current?.focus();
            }
          }}>
            <div className="sg-ed-archive-toolbar">
              <label htmlFor={searchId} className="sr-only">搜索人物、项目或文章</label>
              <div className="sg-ed-search-wrap">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.3" /><path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.3" /></svg>
                <input id={searchId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索人物、项目或文章" autoComplete="off" />
              </div>
              <span className="sg-ed-archive-count" role="status">{filtered.length} 篇 · 最新在前</span>
            </div>
            <ol className="sg-ed-archive-list">
              {filtered.map((article) => (
                <li key={article.id}>
                  <a href={article.href} target="_blank" rel="noopener noreferrer" className="sg-ed-archive-link">
                    <span className="sg-ed-archive-thumb"><Image src={article.imageSrc} alt="" fill sizes="(max-width: 640px) 64px, 104px" className="object-cover" /></span>
                    <span className="sg-ed-archive-content">
                      <span className="sg-ed-archive-meta">{ordinal(article.id)} · {article.stageMetaZh}</span>
                      <span className="sg-ed-archive-title">{article.stageTitleZh}</span>
                    </span>
                    <span className="sg-ed-archive-date">{article.publishedAt?.replaceAll("-", ".")}</span>
                    <span className="sg-ed-archive-arrow" aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ol>
            {filtered.length === 0 && <p className="sg-ed-empty">暂时没有匹配的文章，试试人物姓名或项目名。</p>}
          </div>
        )}

        <div className="sg-ed-feature-grid">
          {ARTICLES.slice(0, 2).map((article, index) => (
            <article key={article.id} className="sg-ed-feature">
              <a href={article.href} target="_blank" rel="noopener noreferrer" className="sg-ed-feature-link">
                <div className="sg-ed-feature-image">
                  <Image src={article.imageSrc} alt={article.imageAlt} fill sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 720px" className="object-cover" />
                  <span className="sg-ed-feature-tag">{index === 0 ? "最新特稿" : "人物特稿"}</span>
                </div>
                <div className="sg-ed-feature-meta">
                  <span>{ordinal(article.id)} · {article.stageMetaZh}</span>
                  {article.publishedAt && <time dateTime={article.publishedAt}>{article.publishedAt.replaceAll("-", ".")}</time>}
                </div>
                <h3>{article.stageTitleZh}</h3>
                <span className="sg-ed-read-link">阅读全文 <span aria-hidden>↗</span></span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
