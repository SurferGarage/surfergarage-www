"use client";

import { useCallback, useId, useState } from "react";

const WECHAT_ID = "x3167056428";

export function HomeCall() {
  const toastId = useId();
  const [showToast, setShowToast] = useState(false);

  const copyWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 2600);
    } catch {
      window.prompt("复制微信号", WECHAT_ID);
    }
  }, []);

  return (
    <section
      id="call"
      className="scroll-mt-[4.5rem] border-b border-[var(--hairline)] py-24 md:py-36 relative overflow-hidden"
      aria-labelledby="call-heading"
    >
      <div
        aria-hidden
        className="sg-call-orb pointer-events-none absolute -right-28 top-[38%] h-[25rem] w-[25rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(12,2,194,0.46)_0%,rgba(39,215,199,0.18)_36%,rgba(0,6,68,0)_72%)] blur-2xl"
      >
        <div className="sg-call-orb-core absolute inset-[24%] rounded-full bg-[radial-gradient(circle,rgba(39,215,199,0.2)_0%,rgba(12,2,194,0.05)_62%,rgba(0,6,68,0)_100%)]" />
      </div>
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-12 gap-x-4 px-5 md:gap-x-6 lg:px-12">
        <div className="col-span-12 md:col-span-4 md:self-end md:pb-3">
          <p
            id="call-heading"
            className="font-[family-name:var(--font-en)] text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--brand-primary)]"
          >
            The Call
          </p>
        </div>

        <div className="col-span-12 md:col-span-8 md:col-start-5">
          <nav aria-label="Primary actions">
            <ul className="flex flex-col">
              <li className="border-t border-[var(--hairline)]" data-call-item>
                <a href="#" className="group block py-8 md:py-10">
                  <span className="font-[family-name:var(--font-en)] text-[clamp(2.25rem,6.5vw,5rem)] font-medium leading-[0.95] tracking-[-0.04em] transition-opacity group-hover:opacity-65">
                    Join the Garage
                  </span>
                  <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--muted-strong)] md:text-lg">
                    加入社群 · 审核制
                  </span>
                </a>
              </li>
              <li className="border-t border-[var(--hairline)]" data-call-item>
                <button
                  type="button"
                  onClick={copyWeChat}
                  className="group block w-full py-8 text-left md:py-10"
                >
                  <span className="font-[family-name:var(--font-en)] text-[clamp(2rem,5.5vw,4rem)] font-medium leading-[0.95] tracking-[-0.035em] transition-opacity group-hover:opacity-65">
                    Submit Your Build
                  </span>
                  <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--brand-teal)] md:text-lg">
                    提交你正在手搓的东西 · 微信 {WECHAT_ID}（点击复制）
                  </span>
                </button>
              </li>
              <li
                className="border-t border-b border-[var(--hairline)]"
                data-call-item
              >
                <a
                  href="mailto:edisonxu0909@gmail.com"
                  className="group block py-8 md:py-10"
                >
                  <span className="break-all font-[family-name:var(--font-en)] text-[clamp(1.65rem,4.5vw,3.25rem)] font-medium leading-[0.95] tracking-[-0.03em] transition-opacity group-hover:opacity-65 md:text-[clamp(2rem,5.5vw,4rem)] md:tracking-[-0.035em]">
                    edisonxu0909@gmail.com
                  </span>
                  <span className="mt-3 block font-[family-name:var(--font-zh)] text-base text-[var(--muted-strong)] md:text-lg">
                    合作 · 演讲 · 媒体
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div
        id={toastId}
        role="status"
        aria-live="polite"
        className={`fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 rounded-sm border border-[var(--hairline)] bg-[var(--background)] px-5 py-3 font-[family-name:var(--font-zh)] text-sm text-[var(--foreground)] shadow-lg transition-opacity duration-300 ${
          showToast ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        已复制微信号
      </div>
    </section>
  );
}
