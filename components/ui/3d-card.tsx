"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/** 指针目标 → 当前角度的插值系数（越大越快，越小越丝滑） */
const TILT_LERP = 0.14;
const SETTLE_EPS = 0.04;

type CardMotion = {
  rx: number;
  ry: number;
  /** 指针在卡片内归一化位置 0–1，供光斑 */
  px: number;
  py: number;
  hovering: boolean;
  maxTilt: number;
};

const CardMotionContext = createContext<CardMotion>({
  rx: 0,
  ry: 0,
  px: 0.5,
  py: 0.5,
  hovering: false,
  maxTilt: 12,
});

export type CardContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** 指针倾斜最大角度（单侧） */
  maxTilt?: number;
};

/**
 * 透视容器：指针在区域内时驱动子级 `CardBody` 的 rotateX / rotateY。
 * 使用 rAF 插值，避免 mousemove 直写 transform 的「跟手发涩 / 抖」。
 */
export function CardContainer({
  children,
  className = "",
  maxTilt = 12,
}: CardContainerProps) {
  const [motion, setMotion] = useState<CardMotion>({
    rx: 0,
    ry: 0,
    px: 0.5,
    py: 0.5,
    hovering: false,
    maxTilt,
  });
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const maxTiltRef = useRef(maxTilt);
  const hoveringRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ rx: 0, ry: 0, px: 0.5, py: 0.5 });
  const currentRef = useRef({ rx: 0, ry: 0, px: 0.5, py: 0.5 });

  useEffect(() => {
    maxTiltRef.current = maxTilt;
  }, [maxTilt]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const scheduleTick = useCallback(() => {
    if (rafRef.current != null) return;

    const frame = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      const mt = maxTiltRef.current;

      c.rx += (t.rx - c.rx) * TILT_LERP;
      c.ry += (t.ry - c.ry) * TILT_LERP;
      c.px += (t.px - c.px) * TILT_LERP;
      c.py += (t.py - c.py) * TILT_LERP;

      const settled =
        Math.abs(t.rx - c.rx) < SETTLE_EPS &&
        Math.abs(t.ry - c.ry) < SETTLE_EPS &&
        Math.abs(t.px - c.px) < 0.002 &&
        Math.abs(t.py - c.py) < 0.002;

      setMotion({
        rx: c.rx,
        ry: c.ry,
        px: c.px,
        py: c.py,
        hovering: hoveringRef.current,
        maxTilt: mt,
      });

      if (hoveringRef.current || !settled) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || maxTiltRef.current <= 0) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / Math.max(1, r.width);
      const py = (e.clientY - r.top) / Math.max(1, r.height);
      const nx = px - 0.5;
      const ny = py - 0.5;
      const mt = maxTiltRef.current;

      targetRef.current = {
        rx: -ny * mt * 2,
        ry: nx * mt * 2,
        px: Math.max(0, Math.min(1, px)),
        py: Math.max(0, Math.min(1, py)),
      };
      hoveringRef.current = true;
      scheduleTick();
    },
    [reduced, scheduleTick],
  );

  const onLeave = useCallback(() => {
    hoveringRef.current = false;
    targetRef.current = { rx: 0, ry: 0, px: 0.5, py: 0.5 };
    scheduleTick();
  }, [scheduleTick]);

  const ctx = useMemo(() => motion, [motion]);

  return (
    <CardMotionContext.Provider value={ctx}>
      <div
        ref={ref}
        className={className}
        style={{ perspective: "min(1400px, 120vw)" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </div>
    </CardMotionContext.Provider>
  );
}

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 随指针移动的高光层（`mix-blend-mode: screen`） */
  showGlare?: boolean;
};

export function CardBody({
  className = "",
  style,
  children,
  showGlare = false,
  ...rest
}: CardBodyProps) {
  const { rx, ry, px, py, hovering } = useContext(CardMotionContext);
  return (
    <div
      className={className}
      {...rest}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        willChange: hovering ? "transform" : undefined,
        transition: hovering
          ? "box-shadow 160ms ease-out"
          : "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms ease-out",
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
      }}
    >
      {showGlare ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] rounded-[inherit] transition-opacity duration-200"
          style={{
            opacity: hovering ? 0.85 : 0,
            mixBlendMode: "screen",
            background: `radial-gradient(ellipse 90% 70% at ${px * 100}% ${py * 100}%, rgba(39,215,199,0.35), rgba(0,9,226,0.12) 42%, transparent 68%)`,
          }}
        />
      ) : null}
      {children}
    </div>
  );
}

export type CardItemProps = {
  as?: React.ElementType;
  translateZ?: string | number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & Record<string, unknown>;

export function CardItem({
  as: Comp = "div",
  translateZ = 0,
  className = "",
  style,
  children,
  ...rest
}: CardItemProps) {
  const { hovering } = useContext(CardMotionContext);
  const tz =
    typeof translateZ === "string"
      ? Number.parseFloat(translateZ) || 0
      : translateZ;
  return React.createElement(
    Comp,
    {
      className,
      style: {
        ...style,
        transform: `translateZ(${tz}px)`,
        transformStyle: "preserve-3d" as const,
        transition: hovering
          ? "transform 120ms ease-out"
          : "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
      ...rest,
    },
    children,
  );
}
