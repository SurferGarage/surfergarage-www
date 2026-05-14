# 00-Vision · 全局架构与设计主旨（Master）

> **文档地位**：本站产品与技术决策的「北极星」。工程实现细节以 `01-架构与模块说明.md` 及各专项 wiki 为准；若实现与本文冲突，应**先更新代码或先更新本文**，避免口头约定漂移。  
> **阅读顺序**：先读本篇确立取舍，再读 `00-项目总览.md`（健康度与风险快照），然后按 `wiki/README.md` 索引下钻。

---

## 1. 核心设计哲学（The Core Philosophy）

SurferGarage V2 **不是传统企业官网**，而是 **高信息密度的数字基础设施**：像车库一样能装、像海里一样敢浪、像工程一样可验收。

| 支柱 | 含义 | 在界面上的约束 |
|------|------|----------------|
| **Brutalism（粗野主义）** | 拒绝粉饰：结构、网格、字号对比即美学 | 少圆角堆叠、少装饰性渐变；骨架与分割线清晰可见 |
| **Harmless Engineering（无害工程）** | 再躁也不能伤阅读与信任 | 动效服务**揭示与节奏**，不抢正文；禁止滚动中直改正文 `opacity` 造成「抽白」 |
| **Builder’s Aesthetic（构建者美学）** | 站本身是硬核作品 | 终端/洋流/示波隐喻可出现在**氛围层**；信息层保持冷静、可扫读 |

---

## 2. 全局视觉系统（Global Visual System）

与 `app/globals.css` 中的设计令牌对齐；以下为**语义层**描述，具体 hex 以代码为准。

| 角色 | 语义 | 说明 |
|------|------|------|
| **The Canvas（空间底色）** | 深海黑 / Canvas Black；**纵向可下沉** | 默认主背景深色；全站可引入 **海面浅蓝 → 海底深蓝** 的纵向色彩流（见 **`05-站点深度与模块设计草案.md`**），与滚动深度绑定，避免与 WebGL 双主导 |
| **The Typography（信息骨架）** | 高对比正文 + 英文全大写标签体系 | `body` 默认 **`font-weight: 300`** + **灰度字体平滑**（削弱暗底白字膨胀感）；标题/字标仍用显式 `font-medium` 等覆盖 |
| **The Energy（环境能量）** | 闪电蓝 / 海冲青作为**光**而非正文色 | Glow River、Shader 光带、Bloom 等「暗流」 |
| **The Accent（交互点睛）** | 海冲青用于链接、关键标签、行动点 | 正文不滥用霓虹色块 |

---

## 3. 页面空间流（Spatial Flow）

把整页看作 **Y 轴旅程**：从「深海重击」潜入「证据与克制」，最后在「召唤」点亮一盏灯。

### Layer 1 — The Hook（首屏 / Manifesto）

- **目标**：瞬间建立「冲浪者 / Builder」压迫感与品牌记忆。
- **空间**：约 **100svh** 首屏（见 `components/home-hero.tsx`）。
- **视觉**：
  - 底层：**R3F 全屏海面片**（平滑三角网格 + 顶点色起伏）+ **Bloom**（`HERO_BLOOM_*` 与海面细分/相机基线均以 `hero-wave-canvas.tsx` 顶部常量为准，调参时与本文同步更新）。
  - 前层：无全宽渐变遮罩；正文块 **`text-shadow`** 轻压眩光，整体透出全站 **`sg-main-depth`** 纵深渐变。

### Layer 2 — 内容区（Connect 起）

- **目标**：社交矩阵、创始人内容、转化等 **可扫读信息**。
- **动效**：随滚动 **scrub** 压低首屏 `--wave-distortion` / `--wave-opacity`（ScrollTrigger 触发区为 **`#social`**）。
- **版式**：**12 列网格** + 细线分割 + 留白；动效只做位移/裁切，不改正文透明度。

### Layer 3 — The Call（转化）

- **目标**：加社群、提交作品、邮件合作。
- **视觉**：**Orb / 局部光晕** 作为「黑暗中一盏灯」；复制微信号等交互需有无障碍回退（见 `home-call.tsx`）。

---

## 4. 动效与性能契约（Motion & Performance Contract）

1. **Scroll-driven 优先**：关键节奏用 **ScrollTrigger + scrub** 与滚动位置绑定，避免与阅读无关的「自嗨时间轴」。
2. **渲染隔离（路由级持久化）**：`HeroWaveCanvas` **`variant="global"`** 挂在 `app/layout.tsx` 的 `SmoothScroll` 内，与内容区 **兄弟**、`fixed inset-0 z-0 pointer-events-none`，避免未来子路由切换时反复卸载/重编译 WebGL。`--wave-distortion` / `--wave-opacity` 仍由页面内 **`[data-hero-wave]`**（`HomeHero`）承载；无该节点时 Shader 使用默认强度。`IntersectionObserver` 仍观察 **`[data-hero-wave]`**，离开 Manifesto 视口即 `frameloop="never"`。  
3. **滚动速度 → 流体感**：`LenisContext` 暴露 Lenis 实例；`WaveScrollVelocityBridge` 用 **`gsap.quickTo`**（约 `0.5s` / `power2.out`）平滑 `lenis.velocity`，写入 `:root` 的 **`--wave-scroll-vel`**（0–1），Shader **`uScrollVel`** 每帧读取，增强巨浪「黏性」衰减而非戛然而止。  
4. **数据进 GPU 的路径**：波浪强度优先通过 **CSS 自定义属性** 由 GSAP 驱动，Shader **每帧读 computed style** 更新 uniform（实现简单；若 profiling 有压力再改为 ref 直通，见 `00-项目总览.md` 已知风险）。  
5. **降级底线**：`prefers-reduced-motion: reduce` 下 **不挂载 Hero Canvas**，跑马灯等 CSS 动画关闭；**不挂载首页 `WaterVolumeFx` 与 `UnderwaterLightStage`**；**纯静态网格与排版仍必须成立**。

---

## 5. 落地开发编排（Implementation Roadmap）

建议按流水线推进，避免并行扯皮：

1. **[基建]** 锁定全局 CSS 变量、字体、12 列栅格与 hairline 分割语言。  
2. **[首屏]** `HeroWaveCanvas` **layout 单例** + `HomeHero` 控制面（`data-hero-wave`）+ 跑马灯 + Hero 遮罩层级；Shader 参数以 **Layer 1 表格** 为单一事实来源。  
3. **[骨架]** Social / Founders / The Call 静态网格与占位数据。  
4. **[编排]** `home-scroll-choreography.tsx`：首屏 → `#social` 浪面收束 scrub、各区块 pin、`ScrollTrigger.refresh` 策略。  
5. **[内容]** CMS / MDX 注入访谈与列表（与工程解耦，可最后接）。

---

## 6. 当前仓库映射 vs 长期演进（诚实对齐）

| 主题 | 当前落地（experiment 分支） | 可选长期方向（非承诺） |
|------|------------------------------|-------------------------|
| WebGL 生命周期 | **`HeroWaveCanvas variant="global"`** 在 **`app/layout.tsx`**，全视口固定层；**控制量（`--wave-*`）** 仍挂在 **`HomeHero` 的 `[data-hero-wave]`**；**首页 `page.tsx`** 另叠 **`WaterVolumeFx`**（轻量全屏体积 Shader，无 Composer）+ **`UnderwaterLightStage`**（CSS 光氛），与 Hero **分工**：海面几何 vs 体积光感。详情页若需无波，可在该路由不渲染 `data-hero-wave` 或显式将 `--wave-opacity` 置 0 | 可按路由切多 Canvas / 多场景 FBO；须评估双 Canvas 与 CWV |
| Lenis / ST | `SmoothScroll` 内 `LenisContext` + `scrollerProxy` + teardown 时 `ScrollTrigger.getAll().kill()` | 若引入第三方 ST，需收窄 kill 范围（见 `01`） |
| Next 版本 | App Router + **Next.js 16**（以 `package.json` 为准） | 升级时重跑 CWV 与字体策略 |

---

## 7. 附录 A · Wiki 内导航

- `00-项目总览.md` — 技术栈、风险快照、审查结论  
- **`05-站点深度与模块设计草案.md`** — 纵向色彩、IA、社交/采访/社群、Linear 语言、落地顺序  
- `01-架构与模块说明.md` — 模块边界、Lenis/ST 生命周期  
- `02-视觉与动效系统.md` — 排版与动效边界  
- `03-性能与自动降级策略.md` — WebGL 与 Glow 调参顺序  
- `04-维护与排障手册.md` — 常见问题与发布检查  

---

## 8. 附录 B · Deep Research 用 Prompt（可复制到外部研究工具）

将下方整段粘贴到 Claude / Perplexity / ChatGPT 等，用于**文献级**调研（输出请自行甄别版本号与 API 变迁）：

```text
You are a senior frontend architect. Research and synthesize (with citations where possible):

1) Next.js App Router (React 19): mixing WebGL (R3F) with scrolling HTML — stacking contexts, z-index, pointer-events, and when to mount Canvas at route layout vs page section. Tradeoffs for GPU memory and shader recompile on navigation.

2) Lenis + GSAP ScrollTrigger: single ticker integration, lagSmoothing(0), mobile syncTouch tradeoffs, and patterns to drive shader uniforms without React re-renders (refs, onUpdate, CSS variables).

3) Brutalist / neo-Swiss web typography: 12-column grids, clamp() fluid type, dark mode optical compensation (irradiation), and tracking rules for all-caps meta lines. WCAG considerations when mixing vw and rem.

4) Postprocessing Bloom in WebGL: threshold/smoothing/mipmapBlur impact on performance and banding; practical defaults for dark UIs with cyan accents.

Deliver: a concise engineering checklist + anti-patterns list, not marketing prose. Assume the product is a single-page marketing site with one hero WebGL field and longform sections below (social, founders, call).
```

---

## 9. 附录 C · 与你提供的「长文研究稿」的关系

你提供的《现代前端架构深度解析…》类材料适合作为 **灵感与术语表**；**本 wiki 篇为执行层单一事实来源**：版本号、文件路径、参数表以仓库为准。研究稿中 **`z-index: -1` 全屏底图** 在根层叠上下文中易踩坑，本仓库采用 **`fixed` + `z-0` + 内容 `z-[1]`** 的显式栈序替代。
