import type { SocialChannelMarkId } from "@/lib/social-channels";

const markFrame =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[color-mix(in_oklch,var(--brand-teal)_42%,transparent)] bg-[linear-gradient(160deg,rgba(255,255,255,0.12)_0%,rgba(6,14,40,0.72)_55%,rgba(4,8,22,0.88)_100%)] text-[var(--brand-teal)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_6px_20px_-8px_rgba(0,9,226,0.35)] transition-[border-color,box-shadow,color] duration-200 group-hover:border-[color-mix(in_oklch,var(--brand-teal)_62%,transparent)] group-hover:text-[color-mix(in_oklch,var(--brand-teal)_88%,white)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_26px_-6px_rgba(0,9,226,0.42)]";

function Icon({ id }: { id: SocialChannelMarkId }) {
  const stroke = "currentColor";
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke,
    strokeWidth: 1.55,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (id) {
    case "wechat":
      return (
        <svg {...common} aria-hidden>
          <path d="M6.5 9.5c0-1.9 2-3.5 4.5-3.5h2c2.5 0 4.5 1.6 4.5 3.5v3.5c0 1.9-2 3.5-4.5 3.5h-1.8L8.5 19v-2.5H9c-2.5 0-4.5-1.6-4.5-3.5V9.5z" />
          <path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth={2} />
        </svg>
      );
    case "xiaohongshu":
      return (
        <svg {...common} aria-hidden>
          <path d="M7 5.5h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z" />
          <path d="M9 9h6M9 12.5h6M9 16h4" />
        </svg>
      );
    case "bilibili":
      return (
        <svg {...common} aria-hidden>
          <path d="M7 7.5h10a2 2 0 0 1 2 2v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17V9.5a2 2 0 0 1 2-2z" />
          <path d="M9 5.5v2M15 5.5v2" />
          <path
            d="M11 11.2l3.5 2-3.5 2v-4z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "twitter":
      return (
        <svg {...common} aria-hidden>
          <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} aria-hidden>
          <path d="M6.5 8h11a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
          <path
            d="M10.5 10.8v2.4l2.8-1.2-2.8-1.2z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "xiaoyuzhou":
      return (
        <svg {...common} aria-hidden>
          <path d="M4.5 10.5c3-3.8 12-3.8 15 0" />
          <path d="M6.5 14c2.2-2.4 9.3-2.4 11.5 0" />
          <path d="M9 17.2c1.4-1.1 4.6-1.1 6 0" />
        </svg>
      );
    case "github":
      return (
        <svg {...common} aria-hidden>
          <circle cx="6.5" cy="6" r="2" />
          <circle cx="6.5" cy="18" r="2" />
          <circle cx="17.5" cy="12" r="2" />
          <path d="M6.5 8v8M6.5 12h9M17.5 12V9.5a2.5 2.5 0 0 0-2.5-2.5h-2" />
        </svg>
      );
  }
}

export function SocialChannelMark({
  id,
  className,
}: {
  id: SocialChannelMarkId;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={[markFrame, className].filter(Boolean).join(" ")}
    >
      <Icon id={id} />
    </div>
  );
}
