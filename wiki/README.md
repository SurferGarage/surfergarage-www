# SurferGarage Wiki

工程文档只保留 **3 篇 + 本索引**。改代码时：**先查「架构」定位文件，再查「动效」或「排障」**。

| 文档 | 何时读 |
|------|--------|
| **[架构.md](./架构.md)** | 目录结构、首页模块、改嘉宾/B站/联络/导航、Lenis 与 ScrollTrigger 约定 |
| **[动效.md](./动效.md)** | 加/改 GSAP、调 scrub、WebGL 开关、性能降级 |
| **[排障.md](./排障.md)** | 报错、构建失败、发布前检查、上线缺口 |

## 维护原则（必守）

1. 先保流畅与可读，再加特效强度。
2. **禁止**对正文滚动 scrub `opacity` / `autoAlpha`（会「抽白」）。
3. 所有动效尊重 `prefers-reduced-motion`。
4. 新增 ScrollTrigger 前确认与 `SmoothScroll` 卸载时的全局 `kill` 不冲突（见架构篇）。

## 技术栈（一句话）

Next.js 16 · React 19 · Tailwind 4 · Lenis + GSAP · Hero/首页可选 WebGL（`NEXT_PUBLIC_SG_WEBGL`）。

历史变更以 **Git 提交记录** 为准，不在 wiki 堆叠更新日志。
