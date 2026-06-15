# 浪前 SurferGarage · 官网

Official site for **浪前 SurferGarage** — [surfergarage.com](https://www.surfergarage.com)

高信任科技媒体与 builder 社区。开源教材见 GitHub 组织：[SurferGarage](https://github.com/SurferGarage)

## 开源生态

| 仓库 | 说明 |
|------|------|
| [Startup-playbook](https://github.com/SurferGarage/Startup-playbook) | 创业进攻手册 |
| [failure-manual](https://github.com/SurferGarage/failure-manual) | 失败复盘防守手册 |
| [.github](https://github.com/SurferGarage/.github) | 学习路径与贡献指南 |
| **本仓库** | 官网 Next.js 源码 |

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger · Lenis · Three.js (motion-gated)

## Local Development

```bash
npm install
cp .env.local.example .env.local   # 默认 WEBGL=off
npm run dev
```

Open `http://localhost:3000`.

**省内存：** `npm run dev:preview`（build + start）  
**品牌 VIS：** `design/brand/` · 对照 `wiki/视觉系统.md`

## Quality

```bash
npm run lint
npm run build
```

## Docs

- `CONTRIBUTING.md` · `wiki/README.md` · `SECURITY.md` · `SUPPORT.md`
