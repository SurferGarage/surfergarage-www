# SurferGarage Wiki

三篇文档 + 本索引。改代码：**架构** 定位文件 → **动效** / **排障** 按需。

| 文档 | 何时读 |
|------|--------|
| **[架构.md](./架构.md)** | 目录、路由、片场/联络/触点、B 站、WebGL 分级 |
| **[动效.md](./动效.md)** | GSAP 注册顺序、变量、性能守卫 |
| **[排障.md](./排障.md)** | 报错、发布检查、上线缺口 |

## 维护原则

1. 先流畅与可读，再加特效。  
2. 禁止正文滚动改 `opacity`。  
3. 尊重 `prefers-reduced-motion`。  
4. 新增 ST 前确认不与 `SmoothScroll` 全局 `kill` 冲突。

**技术栈**：Next 16 · React 19 · Tailwind 4 · Lenis + GSAP · WebGL 默认关。

**最后对齐代码**：2026-05-29（`experiment/shader-field`）。历史变更查 Git，不在 wiki 堆日志。
