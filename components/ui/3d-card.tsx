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

type CardMotion = {
  rx: number;
  ry: number;
  hovering: boolean;
  maxTilt: number;
};

const CardMotionContext = createContext<CardMotion>({
  rx: 0,
  ry: 0,
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
 * 与外层滚动弧 transform 可叠加（子级在父 preserve-3d 空间内）。
 */
export function CardContainer({
  children,
  className = "",
  maxTilt = 12,
}: CardContainerProps) {
  const [motion, setMotion] = useState<CardMotion>({
    rx: 0,
    ry: 0,
    hovering: false,
    maxTilt,
  });
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
      const py = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
      setMotion({
        rx: -py * maxTilt * 2,
        ry: px * maxTilt * 2,
        hovering: true,
        maxTilt,
      });
    },
    [maxTilt, reduced],
  );

  const onLeave = useCallback(() => {
    setMotion((m) => ({ ...m, rx: 0, ry: 0, hovering: false }));
  }, []);

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

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

export function CardBody({ className = "", style, children, ...rest }: CardBodyProps) {
  const { rx, ry, hovering } = useContext(CardMotionContext);
  return (
    <div
      className={className}
      {...rest}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        transition: hovering
          ? "transform 100ms ease-out, box-shadow 200ms ease-out"
          : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 320ms ease-out",
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
      }}
    >
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
      },
      ...rest,
    },
    children,
  );
}
