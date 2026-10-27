import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";
import { WECHAT_OFFICIAL_FEED } from "@/lib/wechat-official-feed";
import { BILIBILI_SPACE_URL } from "@/lib/surfing-founders-video-season";

export function HomeFounders() {
  const columns = [
    { no: "01", title: "Surfing Founder", type: "人物特稿", description: "从产品与经历出发，理解创业者的判断、选择与转折。", href: WECHAT_OFFICIAL_FEED.at(-1)!.href },
    { no: "02", title: "浪前对话", type: "视频播客", description: "用长对谈，保留语气、分歧，以及判断形成的过程。", href: BILIBILI_SPACE_URL },
    { no: "03", title: "造浪之人", type: "方法论访谈", description: "与塑造技术、产品和生态的人，讨论关键判断。", href: WECHAT_OFFICIAL_FEED.find((article) => article.id === "wx-09")!.href },
  ];
  return (
    <section id="founders" className="sg-ed-formats" aria-label="浪前的三个内容栏目">
      <div className={SG_PAGE_SHELL_CLASS}>
        <ol className="sg-ed-formats-grid">
          {columns.map((column) => (
            <li key={column.no}>
              <a href={column.href} target="_blank" rel="noopener noreferrer" className="sg-ed-format">
                <span className="sg-ed-format-top"><span>{column.no} / {column.type}</span><span aria-hidden>↗</span></span>
                <h3>{column.title}</h3>
                <p>{column.description}</p>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
