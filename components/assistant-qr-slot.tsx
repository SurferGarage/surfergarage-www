"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ASSISTANT_WECHAT_QR_SRC } from "@/lib/community-assets";
import { SG_BP, sgMediaMaxWidth } from "@/lib/sg-breakpoints";

/** 外框略大于常见微信名片二维码，内层 object-contain 保留上下文案与角标 */
const BOX_W = 228;
const BOX_H = 292;

/**
 * 助手二维码：若 `public` 下无对应文件，则显示占位（不阻塞布局）。
 */
export function AssistantQrSlot() {
  const [imageBroken, setImageBroken] = useState(false);

  const onError = useCallback(() => {
    setImageBroken(true);
  }, []);

  if (imageBroken) {
    return (
      <div
        className="flex shrink-0 flex-col items-center justify-center rounded-sm border border-dashed border-[var(--hairline)] bg-[rgba(19,19,19,0.45)] px-3 text-center"
        style={{ width: BOX_W, minHeight: BOX_H }}
        role="img"
        aria-label="助手二维码待配置"
      >
        <span className="font-[family-name:var(--font-zh)] text-xs leading-snug text-[var(--muted)]">
          将二维码保存为
          <br />
          <span className="font-[family-name:var(--font-en)] text-[10px] text-[var(--muted-strong)]">
            public{ASSISTANT_WECHAT_QR_SRC}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-[var(--hairline)] bg-[var(--background)] p-2"
      style={{ width: BOX_W, minHeight: BOX_H }}
    >
      <Image
        src={ASSISTANT_WECHAT_QR_SRC}
        alt="小浪 SurferGarage 微信加好友二维码"
        width={720}
        height={960}
        className="h-auto max-h-[280px] w-full object-contain"
        sizes={`${sgMediaMaxWidth(SG_BP.md)} 60vw, 228px`}
        unoptimized
        onError={onError}
      />
    </div>
  );
}
