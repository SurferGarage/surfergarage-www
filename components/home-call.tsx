"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { DISCORD_INVITE_URL } from "@/lib/site-contact";
import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

const WECHAT_ID = "x3167056428";
const STORY_SIGNALS = ["16–28 岁，正在做科技产品", "已有 demo、真实用户或一次关键复盘", "愿意坦诚讲清判断、风险与代价"];

export function HomeCall() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);
  const copyWeChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("复制微信号", WECHAT_ID);
    }
  }, []);

  return (
    <section id="call" className="sg-ed-section sg-ed-call" aria-labelledby="call-heading">
      <div id="call-join" className={`${SG_PAGE_SHELL_CLASS} sg-ed-call-grid scroll-mt-24`}>
        <div>
          <p className="sg-ed-kicker">你的故事 / NEXT STORY</p>
          <h2 id="call-heading" className="sg-ed-heading">你也正在造浪吗？</h2>
          <p className="sg-ed-call-description">无论在车库、实验室还是学校宿舍，<br className="hidden md:block" />认真做产品的人，值得留下一份真实记录。</p>
          <ul className="sg-ed-story-signals">
            {STORY_SIGNALS.map((signal) => <li key={signal}><span aria-hidden>↗</span>{signal}</li>)}
          </ul>
        </div>
        <aside className="sg-ed-contact-panel" aria-label="添加小浪微信提交故事">
          <Image src="/wechat-assistant-qr.png" alt="小浪微信二维码" width={160} height={200} className="sg-ed-contact-qr" />
          <div className="sg-ed-contact-copy">
            <p className="sg-ed-kicker">微信联系 · 小浪</p>
            <h3>先聊聊你在做什么。</h3>
            <p>发来 demo、产品链接或一段真实复盘。我们先了解项目，再讨论合适的记录方式。</p>
            <button type="button" onClick={copyWeChat} className="sg-ed-copy-button" aria-label={`复制微信号 ${WECHAT_ID}`}>
              <span>{WECHAT_ID}</span><span>{copied ? "已复制 ✓" : "复制微信号"}</span>
            </button>
            <span className="sr-only" role="status">{copied ? "微信号已复制" : ""}</span>
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="sg-ed-contact-discord">也可以加入 Discord 社群 <span aria-hidden>↗</span></a>
          </div>
        </aside>
      </div>
    </section>
  );
}

/** 保留旧入口。 */
export function HomeFit() {
  return <span id="fit" className="sr-only" aria-hidden />;
}
