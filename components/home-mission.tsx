import { SG_PAGE_SHELL_CLASS } from "@/lib/sg-layout";

export function HomeMission() {
  return (
    <section id="mission" className="sg-ed-section sg-ed-mission" aria-labelledby="mission-heading">
      <div className={`${SG_PAGE_SHELL_CLASS} sg-ed-mission-grid`}>
        <p className="sg-ed-kicker"><span>03</span> 关于浪前 / OUR BELIEF</p>
        <h2 id="mission-heading" className="sg-ed-heading">
          不等故事尘埃落定，<br />在创业进行时，<br /><span className="text-[var(--brand-teal)]">开始记录。</span>
        </h2>
        <div className="sg-ed-mission-copy">
          <p>我们从人物深访开始，持续记录极早期科技创业者。</p>
          <p>当产品还粗粝、方向仍在变化、外界尚未形成共识，真实记录才最有价值。</p>
          <p className="sg-ed-mission-signature">Ride the wave. Build what matters.</p>
        </div>
      </div>
    </section>
  );
}
