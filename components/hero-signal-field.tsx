"use client";

import { useEffect, useRef } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export type HeroSignal = {
  id: string;
  href: string;
  label: string;
  title: string;
  detail: string;
};

type Point = {
  x: number;
  y: number;
};

const CURVE_POINTS: readonly Point[] = [
  { x: 0.04, y: 0.72 },
  { x: 0.34, y: 0.82 },
  { x: 0.56, y: 0.26 },
  { x: 0.98, y: 0.34 },
];

const SIGNAL_PROGRESS = [0.18, 0.54, 0.84] as const;

function cubicPoint(points: readonly Point[], progress: number): Point {
  const [p0, p1, p2, p3] = points;
  const inverse = 1 - progress;
  const inverseSquared = inverse * inverse;
  const progressSquared = progress * progress;

  return {
    x:
      inverseSquared * inverse * p0.x +
      3 * inverseSquared * progress * p1.x +
      3 * inverse * progressSquared * p2.x +
      progressSquared * progress * p3.x,
    y:
      inverseSquared * inverse * p0.y +
      3 * inverseSquared * progress * p1.y +
      3 * inverse * progressSquared * p2.y +
      progressSquared * progress * p3.y,
  };
}

export function HeroSignalField({ signals }: { signals: readonly HeroSignal[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let lastFrame = 0;
    let inView = true;

    const pointer = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
    };
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    const fieldPoints = (): readonly Point[] => {
      const offsetX = (pointer.x - 0.5) * 0.025;
      const offsetY = (pointer.y - 0.5) * 0.035;

      return [
        CURVE_POINTS[0],
        {
          x: CURVE_POINTS[1].x + offsetX,
          y: CURVE_POINTS[1].y + offsetY,
        },
        {
          x: CURVE_POINTS[2].x + offsetX * 0.6,
          y: CURVE_POINTS[2].y + offsetY * 0.5,
        },
        CURVE_POINTS[3],
      ];
    };

    const drawBackdrop = () => {
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(
        width * 0.68,
        height * 0.45,
        0,
        width * 0.68,
        height * 0.45,
        Math.max(width, height) * 0.7,
      );
      glow.addColorStop(0, "rgba(0, 9, 226, 0.24)");
      glow.addColorStop(0.38, "rgba(6, 6, 68, 0.15)");
      glow.addColorStop(1, "rgba(7, 8, 11, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    };

    const drawGrid = () => {
      const grid = width < 560 ? 44 : 56;
      context.lineWidth = 1;

      for (let x = 0; x <= width; x += grid) {
        context.beginPath();
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, height);
        context.strokeStyle = "rgba(185, 199, 221, 0.055)";
        context.stroke();
      }

      for (let y = 0; y <= height; y += grid) {
        context.beginPath();
        context.moveTo(0, y + 0.5);
        context.lineTo(width, y + 0.5);
        context.strokeStyle = "rgba(185, 199, 221, 0.055)";
        context.stroke();
      }
    };

    const drawBoundary = () => {
      context.save();
      context.beginPath();
      context.setLineDash([4, 9]);
      context.moveTo(width * 0.82, height * 0.06);
      context.lineTo(width * 0.63, height * 0.94);
      context.strokeStyle = "rgba(75, 95, 255, 0.34)";
      context.lineWidth = 1;
      context.stroke();
      context.restore();
    };

    const drawContours = (points: readonly Point[]) => {
      const colors = [
        "rgba(170, 188, 214, 0.12)",
        "rgba(39, 215, 199, 0.42)",
        "rgba(170, 188, 214, 0.18)",
        "rgba(238, 244, 255, 0.78)",
        "rgba(170, 188, 214, 0.18)",
        "rgba(35, 54, 255, 0.58)",
        "rgba(170, 188, 214, 0.14)",
        "rgba(170, 188, 214, 0.09)",
      ];

      colors.forEach((color, index) => {
        const lane = (index - 3.5) * 0.048;
        context.save();
        context.beginPath();

        for (let progress = 0; progress <= 1.001; progress += 0.012) {
          const point = cubicPoint(points, progress);
          const taper = 0.72 + Math.sin(progress * Math.PI) * 0.28;
          const x = point.x * width;
          const y = (point.y + lane * taper) * height;
          if (progress === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.lineWidth = index === 3 ? 1.5 : index === 1 || index === 5 ? 1.1 : 0.75;
        context.strokeStyle = color;
        if (index === 3) {
          context.shadowBlur = 12;
          context.shadowColor = "rgba(218, 232, 255, 0.34)";
        }
        context.stroke();
        context.restore();
      });
    };

    const drawNodes = (points: readonly Point[]) => {
      SIGNAL_PROGRESS.forEach((progress, index) => {
        const point = cubicPoint(points, progress);
        const x = point.x * width;
        const y = point.y * height;

        context.beginPath();
        context.arc(x, y, index === 1 ? 6 : 5, 0, Math.PI * 2);
        context.strokeStyle = index === 2 ? "rgba(76, 96, 255, 0.8)" : "rgba(39, 215, 199, 0.78)";
        context.lineWidth = 1;
        context.stroke();

        context.beginPath();
        context.arc(x, y, 1.8, 0, Math.PI * 2);
        context.fillStyle = index === 1 ? "rgba(244, 248, 255, 0.96)" : "rgba(39, 215, 199, 0.96)";
        context.fill();
      });
    };

    const drawPulse = (time: number, points: readonly Point[]) => {
      const progress = reducedMotion ? 0.54 : (time * 0.00017) % 1;
      const point = cubicPoint(points, progress);
      context.save();
      context.beginPath();
      context.arc(point.x * width, point.y * height, 2.3, 0, Math.PI * 2);
      context.fillStyle = "rgba(151, 255, 242, 0.98)";
      context.shadowBlur = 18;
      context.shadowColor = "rgba(39, 215, 199, 0.9)";
      context.fill();
      context.restore();
    };

    const draw = (time: number) => {
      const points = fieldPoints();
      drawBackdrop();
      drawGrid();
      drawBoundary();
      drawContours(points);
      drawNodes(points);
      drawPulse(time, points);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    };

    const animate = (time: number) => {
      frame = window.requestAnimationFrame(animate);
      if (!inView || document.hidden || time - lastFrame < 40) return;
      lastFrame = time;
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;
      draw(time);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.targetX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      pointer.targetY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    };

    const onPointerLeave = () => {
      pointer.targetX = 0.5;
      pointer.targetY = 0.5;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true;
      },
      { threshold: [0, 0.08] },
    );

    resizeObserver.observe(canvas);
    intersectionObserver.observe(host);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    resize();

    if (!reducedMotion) frame = window.requestAnimationFrame(animate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={hostRef} className="sg-hero-signal-field">
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

      <span aria-hidden className="sg-hero-signal-corner sg-hero-signal-corner--tl" />
      <span aria-hidden className="sg-hero-signal-corner sg-hero-signal-corner--tr" />
      <span aria-hidden className="sg-hero-signal-corner sg-hero-signal-corner--bl" />
      <span aria-hidden className="sg-hero-signal-corner sg-hero-signal-corner--br" />

      <nav aria-label="浪前正在记录" className="absolute inset-0">
        {signals.slice(0, SIGNAL_PROGRESS.length).map((signal, index) => (
          <a
            key={signal.id}
            href={signal.href}
            className={`sg-hero-signal-node sg-hero-signal-node--${index + 1}`}
          >
            <span aria-hidden className="sg-hero-signal-node-dot" />
            <span className="sg-hero-signal-node-copy">
              <span className="sg-hero-signal-node-label">{signal.label}</span>
              <strong>{signal.title}</strong>
              <span className="sg-hero-signal-node-detail">{signal.detail}</span>
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}
