# SurferGarage V2 Wiki

本目录用于沉淀当前官网 V2 的核心工程信息，面向两类读者：

- 维护开发者（快速理解架构、风险、调参入口）
- Agent（避免重复踩坑，按既定策略继续迭代）

## 文档索引

- **`00-Vision-全局架构与设计主旨.md`**：**北极星** — 哲学、三层空间流、动效契约、实现路线图、Deep Research 提示词
- `00-项目总览.md`：目标、技术栈、已知风险、**总体审查结论（工程健康度快照）**、**面向用户文案与术语约定**
- `01-架构与模块说明.md`：目录职责、关键组件、**Lenis 与 ScrollTrigger 生命周期约定**、RAF 说明
- `02-视觉与动效系统.md`：Lenis/GSAP、首屏 Shader/跑马灯、**首页水下氛围（`WaterVolumeFx` + `UnderwaterLightStage`）**、CSS-SVG 氛围层约束
- `03-性能与自动降级策略.md`：Glow/SVG 与 **双 WebGL 路径**（Hero + 首页体积层）的分层守则
- `04-维护与排障手册.md`：常见问题定位、修复步骤、发布前检查（含 ST 全局失效、构建拉字体）
- **`05-站点深度与模块设计草案.md`**：**纵向色彩隐喻（海面→海底）**、站点 IA、社交 / 采访 / 社群、Linear 式语言、**第六轮滚动动效**、落地顺序
- **`06-实施计划与验收清单.md`**：**P0→P5 工序**、依赖顺序、每步验收标准、风险与回滚
- **`07-动画编排与统筹.md`**：**全站动画单一统筹** — L0–L3 语义与模块映射、`HomeScrollChoreography` **注册顺序表**、Lenis / CSS 变量 / WebGL 分工、**微信展台 ST 例外**、新增动效检查清单
- **`08-成熟网站路线图.md`**：**上线清单** — 基建 / 内容 / 气质 / 合规 / 工程；**执行顺序**与验收标准

## 更新日志（维护札记）

- **2026-05-26（V2.0 成熟化交付）**：全站视觉/editorial 升级 — **出水线 `#proof`**、片场四屏 YC 式全宽（`founder-wechat-column` / `founder-video-studio` / `github-playbook-block` / `visual-garage`）、**Blueprint 氛围**（`SgAmbientGrid` + 全页 deep river）、居中顶栏 **`site-header`**、独立 **`site-footer`** + Newsletter + 巨型字标 scroll reveal；动效增补 **`fit-closing-pin`** / **`footer-wordmark`** / **`hero-wordmark-stagger`** / **`magnet-hover`**；文案 **记忆点瘦身**（每区块单行要点）；内容同步 wx-09、徐凯撒人像与 B 站四期；`npm run lint` / `npm run build` 通过。
- **2026-05-26（移动 + 上线基建）**：**移动端适配**（Hero clamp、Founders 节奏、微信列表限高、Header safe-area/44px 触控、Proof 单列、Call/Fit 间距）；**动态 OG**（`opengraph-image`）、**隐私政策**（`/privacy`）、全站 **`useAnchorNav`**、GitHub Actions **CI**；Bento 过滤未上线 X/YouTube；`sitemap` 含 privacy。
- **2026-05-11（维护推送）**：**`wiki/07`** 入库；`README` 索引与阅读顺序；`01`/`02`/`04`/`05`/`06`/`00` 与 **`--depth-t` 排障 §9**、**文案约定**、**动画统筹** 交叉引用同步。
- **2026-05-11（动画统筹）**：新增 **`wiki/07-动画编排与统筹.md`**（L0–L3 映射、`HomeScrollChoreography` 注册顺序、Lenis/CSS/WebGL、**`wechat-feed-scrub-sync`** 例外、`README` 阅读顺序与 `02`/`sg-motion-system`/`home-scroll-choreography` 交叉引用）。
- **2026-05-11（文案）**：全站用户可见文案审查：`home-hero` **纪录→记录**；`metadata.description` 英文口号与片场 **统一为 `Surfing Wave, Build the Great.`**；触点导览 **映像→视频**；X 渠道 **`labelZh`** 与 **`labelEn` 对齐**；`wechat-official-feed` **Citrus** 拼写；`aria-label` 主导航 / 联络区中文；`FounderArticleActions` 复制 **aria** 与「复制链接」一致；`wiki/00` 增补 **「面向用户文案与术语」**。
- **2026-05-11**：代码审查同步 wiki：`#social`↔`#founders` **海沟**（`data-social-founders-trench` / `SOCIAL_FOUNDERS_TRENCH_MIN_H`）；Founders **叠卡呼吸带**（`data-founder-breath` / `register-founder-breath` / `.sg-founder-breath-glow`）；Manifesto **12 列 + 浪前 / SURFERGARAGE** 与对比度修正；**移除**全页 SVG 噪点层；Connect **扁平渠道卡** + **`articles` 单列 `max-w-md` 左齐**；微信展台 **`mapWechatPinProgressToHorizontalScrub`**、**居中横滑 padding**、**`wechat-official-feed` 仅 `titleZh`**；`npm run lint` / `npm run build` 通过。
- **2026-05-14**：Connect 渠道卡玻璃渐变面 + 右上 `SocialChannelMark`（`lib/social-channels.ts` 的 `mark`）；Founders 微信屏标题「Surfing Founders 人物访谈」；`data-founders-intro` 与 `#founders` / `#social` 纵向节奏；顶栏仅 SurferGarage；Manifesto 主标题浪前 + Surfer Garage；移除 Proof 流相关模块；`npm run lint` / `npm run build` 通过。

---

## 推荐阅读顺序

0. **先读 `00-Vision-全局架构与设计主旨.md`**（产品与技术取舍的单一事实来源）
1. **读 `05-站点深度与模块设计草案.md`**（扩展信息架构与新模块，与 Vision 互补）
2. **读 `06-实施计划与验收清单.md`**（**落地执行与验收** — 写代码前对齐本文件）
3. 再读 `00-项目总览.md`（健康度快照）
4. 再读 `01-架构与模块说明.md`（Lenis / ST 约定）
5. **动效统筹**：读 **`07-动画编排与统筹.md`**（改 `register-*` / 调 scrub / 加 ST 前）
6. 然后读 `03-性能与自动降级策略.md`
7. 最后按任务查阅 `02`（观感）与 `04`（排障）

## 当前维护原则（必须遵守）

- 先保证稳定亮度与流畅度，再谈特效强度
- 禁止新增“会改正文亮度”的滚动动画（opacity/autoAlpha 直改正文）
- 所有动效都必须尊重 `prefers-reduced-motion`
- 全站氛围层以 CSS/SVG 为主；首屏 WebGL 为受控增强；**首页第二路轻量 WebGL**（`WaterVolumeFx`）须遵守 `03` 中的护栏与调参顺序
