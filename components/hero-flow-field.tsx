"use client";

import { useEffect, useRef } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

type FlowPoint = {
  x: number;
  y: number;
};

export function HeroFlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let lastFrame = 0;
    let inView = true;

    const pointer: PointerState = {
      x: 0.76,
      y: 0.48,
      targetX: 0.76,
      targetY: 0.48,
    };

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    const flowPoint = (
      lane: number,
      normalizedX: number,
      time: number,
    ): FlowPoint => {
      const focusX = 0.72 + (pointer.x - 0.5) * 0.09;
      const distanceFromFocus = (normalizedX - focusX) / 0.2;
      const envelope = Math.exp(-(distanceFromFocus * distanceFromFocus));
      const rightGate = Math.max(0, Math.min(1, (normalizedX - 0.2) / 0.38));
      const pointerLift = (pointer.y - 0.5) * height * envelope * 0.16;
      const laneTension = 1 - Math.min(0.72, Math.abs(lane) * 0.58);
      const primaryWave =
        Math.sin(normalizedX * 12.6 + time * 0.00024 + lane * 3.4) *
        height *
        (0.008 + envelope * 0.105 * laneTension);
      const fineWave =
        Math.sin(normalizedX * 31 - time * 0.00017 + lane * 8) *
        height *
        0.0065 *
        rightGate;
      const compressedLane = lane * height * (0.36 - envelope * 0.12);

      return {
        x: normalizedX * width,
        y:
          height * 0.49 +
          compressedLane +
          primaryWave +
          fineWave +
          pointerLift,
      };
    };

    const drawBackdrop = () => {
      context.fillStyle = "#07080b";
      context.fillRect(0, 0, width, height);

      const fieldGlow = context.createRadialGradient(
        width * 0.76,
        height * 0.49,
        0,
        width * 0.76,
        height * 0.49,
        Math.max(width, height) * 0.58,
      );
      fieldGlow.addColorStop(0, "rgba(0, 9, 226, 0.18)");
      fieldGlow.addColorStop(0.34, "rgba(15, 55, 122, 0.10)");
      fieldGlow.addColorStop(0.7, "rgba(7, 8, 11, 0.02)");
      fieldGlow.addColorStop(1, "rgba(7, 8, 11, 0)");
      context.fillStyle = fieldGlow;
      context.fillRect(0, 0, width, height);
    };

    const drawGrid = () => {
      const gridSize = width < 640 ? 44 : 64;
      context.lineWidth = 1;

      for (let x = 0; x <= width; x += gridSize) {
        const major = Math.round(x / gridSize) % 4 === 0;
        context.beginPath();
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, height);
        context.strokeStyle = major
          ? "rgba(177, 191, 214, 0.075)"
          : "rgba(177, 191, 214, 0.035)";
        context.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        const major = Math.round(y / gridSize) % 4 === 0;
        context.beginPath();
        context.moveTo(0, y + 0.5);
        context.lineTo(width, y + 0.5);
        context.strokeStyle = major
          ? "rgba(177, 191, 214, 0.075)"
          : "rgba(177, 191, 214, 0.035)";
        context.stroke();
      }
    };

    const drawMesh = (time: number) => {
      const laneCount = width < 640 ? 26 : 42;

      context.save();
      context.beginPath();
      context.rect(width * (width < 640 ? 0.18 : 0.34), 0, width, height);
      context.clip();

      for (let index = 0; index < laneCount; index += 1) {
        const lane = index / (laneCount - 1) - 0.5;
        const accentTeal = index % 9 === 2;
        const accentBlue = index % 11 === 7;
        const centerLine = Math.abs(lane) < 0.02;

        context.beginPath();
        for (let normalizedX = 0.18; normalizedX <= 1.04; normalizedX += 0.008) {
          const point = flowPoint(lane, normalizedX, time);
          if (normalizedX === 0.18) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }

        context.lineWidth = centerLine ? 1.5 : accentTeal || accentBlue ? 1.15 : 0.72;
        context.strokeStyle = centerLine
          ? "rgba(238, 244, 255, 0.68)"
          : accentTeal
            ? "rgba(39, 215, 199, 0.46)"
            : accentBlue
              ? "rgba(40, 70, 255, 0.58)"
              : "rgba(173, 189, 214, 0.15)";
        context.stroke();
      }

      for (let normalizedX = 0.43; normalizedX <= 1.02; normalizedX += 0.045) {
        context.beginPath();
        for (let index = 0; index < laneCount; index += 2) {
          const lane = index / (laneCount - 1) - 0.5;
          const point = flowPoint(lane, normalizedX, time);
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.lineWidth = 0.65;
        context.strokeStyle = "rgba(87, 119, 170, 0.12)";
        context.stroke();
      }

      context.restore();
    };

    const drawSignal = (time: number) => {
      const lanes = [-0.17, 0.02, 0.21];
      const colors = [
        "rgba(39, 215, 199, 0.82)",
        "rgba(225, 236, 255, 0.78)",
        "rgba(35, 54, 255, 0.78)",
      ];

      lanes.forEach((lane, index) => {
        context.save();
        context.beginPath();
        for (let normalizedX = 0.4; normalizedX <= 1.04; normalizedX += 0.006) {
          const point = flowPoint(lane, normalizedX, time);
          if (normalizedX === 0.4) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.lineWidth = index === 1 ? 1.45 : 1.15;
        context.strokeStyle = colors[index];
        context.shadowBlur = 12;
        context.shadowColor = colors[index];
        context.stroke();
        context.restore();
      });

      const pulseProgress = 0.48 + ((time * 0.000055) % 1) * 0.49;
      const pulsePoint = flowPoint(-0.17, pulseProgress, time);
      context.save();
      context.beginPath();
      context.arc(pulsePoint.x, pulsePoint.y, 2.2, 0, Math.PI * 2);
      context.fillStyle = "rgba(151, 255, 242, 0.96)";
      context.shadowBlur = 18;
      context.shadowColor = "rgba(39, 215, 199, 0.92)";
      context.fill();
      context.restore();
    };

    const drawFieldMarks = (time: number) => {
      const left = width * (width < 640 ? 0.2 : 0.45);
      const right = width * 0.955;
      const top = height * 0.16;
      const bottom = height * 0.82;
      const mark = width < 640 ? 14 : 22;

      context.lineWidth = 1;
      context.strokeStyle = "rgba(39, 215, 199, 0.34)";
      context.beginPath();
      context.moveTo(left + mark, top);
      context.lineTo(left, top);
      context.lineTo(left, top + mark);
      context.moveTo(right - mark, top);
      context.lineTo(right, top);
      context.lineTo(right, top + mark);
      context.moveTo(left, bottom - mark);
      context.lineTo(left, bottom);
      context.lineTo(left + mark, bottom);
      context.moveTo(right, bottom - mark);
      context.lineTo(right, bottom);
      context.lineTo(right - mark, bottom);
      context.stroke();

      const dotCount = width < 640 ? 18 : 30;
      for (let index = 0; index < dotCount; index += 1) {
        const normalizedX = 0.44 + ((index * 0.071 + time * 0.000012) % 0.56);
        const lane = ((index * 13) % 29) / 28 - 0.5;
        const point = flowPoint(lane, normalizedX, time);
        context.beginPath();
        context.arc(point.x, point.y, index % 7 === 0 ? 1.8 : 0.85, 0, Math.PI * 2);
        context.fillStyle =
          index % 7 === 0
            ? "rgba(39, 215, 199, 0.82)"
            : "rgba(213, 225, 245, 0.38)";
        context.fill();
      }
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      drawBackdrop();
      drawGrid();
      drawMesh(time);
      drawSignal(time);
      drawFieldMarks(time);
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
      if (!inView || document.hidden || time - lastFrame < 32) return;
      lastFrame = time;
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      draw(time);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.targetX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      pointer.targetY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    };

    const onPointerLeave = () => {
      pointer.targetX = 0.76;
      pointer.targetY = 0.48;
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
    host.addEventListener("pointerleave", onPointerLeave, { passive: true });
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
    <canvas
      ref={canvasRef}
      data-hero-flow-field
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
