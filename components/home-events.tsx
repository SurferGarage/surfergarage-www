import Image from "next/image";

import { SiteAnchorLink } from "@/components/site-anchor-link";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { SITE_EVENTS, type SiteEvent } from "@/lib/site-events";

function EventAction({
  event,
  className,
}: {
  event: SiteEvent;
  className: string;
}) {
  const content = (
    <>
      {event.linkLabel}
      <span aria-hidden>↗</span>
    </>
  );

  if (!event.external) {
    return (
      <SiteAnchorLink href={event.href} className={className}>
        {content}
      </SiteAnchorLink>
    );
  }

  return (
    <a
      href={event.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  );
}

export function HomeEvents() {
  const [builderUp, adventureX, rebuildZ] = SITE_EVENTS;

  return (
    <section
      id="events"
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)]"
      aria-labelledby="events-heading"
    >
      <header className="bg-[var(--paper-0)]">
        <div
          className={`${SG_PAGE_SHELL_CLASS} flex min-h-[58svh] flex-col justify-between py-20 md:py-28 lg:py-32`}
        >
          <p className="border-b border-[var(--hairline)] pb-5 font-[family-name:var(--font-zh)] text-[14px] text-[var(--accent-amber)] md:text-[15px]">
            近期活动 · {SITE_EVENTS.length} 场
          </p>

          <div className="grid gap-9 pt-20 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2
              id="events-heading"
              className="font-[family-name:var(--font-serif-zh)] text-[2.8rem] font-semibold leading-[1.16] text-[var(--foreground)] md:text-[4.5rem] lg:col-span-8 lg:text-[5.25rem]"
            >
              <span className="block">不只记录。</span>
              <span className="block text-[var(--accent-amber)]">我们进入现场。</span>
            </h2>
            <p className="max-w-[34rem] font-[family-name:var(--font-zh)] text-[16px] leading-[1.8] text-[var(--muted-strong)] md:text-[17px] lg:col-span-4">
              媒体的信任不能只在屏幕上建立。我们把采访中建立的连接，带回城市、社区和共同创造的现场。
            </p>
          </div>
        </div>
      </header>

      {builderUp ? (
        <article
          className="border-t border-[#09111d]/15 bg-[#dceafa] text-[#08111e]"
          aria-labelledby="builderup-heading"
        >
          <div
            className={`${SG_PAGE_SHELL_CLASS} grid min-h-[calc(100svh-4.5rem)] items-center gap-14 py-20 md:py-24 lg:grid-cols-12 lg:gap-16 lg:py-28`}
          >
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between gap-6 border-b border-[#08111e]/18 pb-5 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[#43536a] md:text-[11px]">
                <span>{builderUp.role}</span>
                <span>苏州 · 已举办</span>
              </div>

              <p className="mt-10 font-[family-name:var(--font-serif)] text-[5rem] leading-none text-[var(--brand-primary)] md:text-[7rem] lg:text-[8rem]">
                {builderUp.dateShort}
              </p>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] uppercase text-[#536178] md:text-[11px]">
                {builderUp.dateDisplay}
              </p>
              <h3
                id="builderup-heading"
                className="mt-10 font-[family-name:var(--font-serif-zh)] text-[2.4rem] font-semibold leading-[1.2] md:text-[3.5rem]"
              >
                {builderUp.title}
              </h3>
              <p className="mt-6 font-[family-name:var(--font-zh)] text-[15px] leading-[1.85] text-[#344257] md:text-[17px]">
                {builderUp.description}
              </p>
              <p className="mt-6 font-[family-name:var(--font-zh)] text-[14px] leading-[1.7] text-[#536178] md:text-[15px]">
                {builderUp.location}
              </p>
              <EventAction
                event={builderUp}
                className="mt-9 inline-flex items-center gap-4 border-b border-[var(--brand-primary)] pb-2 font-[family-name:var(--font-zh)] text-[15px] font-medium text-[var(--brand-primary)] transition-opacity hover:opacity-65 md:text-[16px]"
              />
            </div>

            <SiteAnchorLink
              href={builderUp.href}
              className="group lg:col-span-7"
              aria-label={`${builderUp.title}，${builderUp.linkLabel}`}
            >
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[36rem] overflow-hidden bg-[#b8d5f2]">
                <Image
                  src={builderUp.imageSrc}
                  alt={builderUp.imageAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.018]"
                />
              </div>
            </SiteAnchorLink>
          </div>
        </article>
      ) : null}

      <div className="grid lg:grid-cols-2">
        {adventureX ? (
          <article
            className="border-t border-white/12 bg-[#17100d] text-white lg:border-r"
            aria-labelledby="adventurex-heading"
          >
            <div className="mx-auto flex h-full max-w-[48rem] flex-col px-5 py-16 md:px-10 md:py-20 lg:px-10 lg:py-20 xl:px-12">
              <a
                href={adventureX.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label={`${adventureX.title}，${adventureX.linkLabel}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#3a2416]">
                  <Image
                    src={adventureX.imageSrc}
                    alt={adventureX.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-[50%_43%] transition-transform duration-700 group-hover:scale-[1.018]"
                  />
                </div>
              </a>

              <div className="mt-9 flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-6 font-[family-name:var(--font-mono)] text-[10px] text-white/62 md:text-[11px]">
                  <span>{adventureX.role}</span>
                  <span className="text-[var(--accent-amber)]">{adventureX.dateShort}</span>
                </div>
                <p className="mt-6 font-[family-name:var(--font-mono)] text-[10px] text-white/62 md:text-[11px]">
                  {adventureX.titleEn} · {adventureX.dateDisplay}
                </p>
                <h3
                  id="adventurex-heading"
                  className="mt-4 font-[family-name:var(--font-serif-zh)] text-[2.15rem] font-semibold leading-[1.25] md:text-[2.75rem]"
                >
                  {adventureX.title}
                </h3>
                <p className="mt-5 max-w-[38rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.8] text-white/74 md:text-[16px]">
                  {adventureX.description}
                </p>
                <p className="mt-4 font-[family-name:var(--font-zh)] text-[14px] text-white/52 md:text-[15px]">
                  {adventureX.location}
                </p>
                <EventAction
                  event={adventureX}
                  className="mt-8 inline-flex w-fit items-center gap-4 border-b border-[var(--accent-amber)] pb-2 font-[family-name:var(--font-zh)] text-[15px] text-[var(--accent-amber)] transition-opacity hover:opacity-65 md:text-[16px]"
                />
              </div>
            </div>
          </article>
        ) : null}

        {rebuildZ ? (
          <article
            className="border-t border-[#241d18]/15 bg-[#d8d3ca] text-[#211b17]"
            aria-labelledby="rebuild-heading"
          >
            <div className="mx-auto flex h-full max-w-[48rem] flex-col px-5 py-16 md:px-10 md:py-20 lg:px-10 lg:py-20 xl:px-12">
              <a
                href={rebuildZ.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                aria-label={`${rebuildZ.title}，${rebuildZ.linkLabel}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#b9b1a4]">
                  <Image
                    src={rebuildZ.imageSrc}
                    alt={rebuildZ.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-[50%_42%] transition-transform duration-700 group-hover:scale-[1.018]"
                  />
                </div>
              </a>

              <div className="mt-9 flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-6 font-[family-name:var(--font-mono)] text-[10px] text-[#655b52] md:text-[11px]">
                  <span>{rebuildZ.role}</span>
                  <span className="text-[var(--brand-primary)]">{rebuildZ.dateShort}</span>
                </div>
                <p className="mt-6 font-[family-name:var(--font-mono)] text-[10px] text-[#655b52] md:text-[11px]">
                  {rebuildZ.titleEn} · {rebuildZ.dateDisplay}
                </p>
                <h3
                  id="rebuild-heading"
                  className="mt-4 font-[family-name:var(--font-serif-zh)] text-[2.15rem] font-semibold leading-[1.25] md:text-[2.75rem]"
                >
                  {rebuildZ.title}
                </h3>
                <p className="mt-5 max-w-[38rem] font-[family-name:var(--font-zh)] text-[15px] leading-[1.8] text-[#50463f] md:text-[16px]">
                  {rebuildZ.description}
                </p>
                <p className="mt-4 font-[family-name:var(--font-zh)] text-[14px] text-[#655b52] md:text-[15px]">
                  {rebuildZ.location}
                </p>
                <EventAction
                  event={rebuildZ}
                  className="mt-8 inline-flex w-fit items-center gap-4 border-b border-[var(--brand-primary)] pb-2 font-[family-name:var(--font-zh)] text-[15px] text-[var(--brand-primary)] transition-opacity hover:opacity-65 md:text-[16px]"
                />
              </div>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
