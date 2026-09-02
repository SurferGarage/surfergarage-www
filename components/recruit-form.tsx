"use client";

import { useState, type FormEvent } from "react";

import { DISCORD_INVITE_URL, MAIL_HELLO } from "@/lib/site-contact";

const WECHAT_ID = "x3167056428";

const ROLE_OPTIONS = [
  "Surfing Founder 编辑实习生",
  "业务商务实习生",
  "线下渠道 & 活动运营 Intern",
  "Agency Intern",
  "核心正职（面议）",
] as const;

const fieldClass =
  "w-full rounded-none border border-[var(--hairline)] bg-[var(--paper-0)] px-4 py-3 font-[family-name:var(--font-zh)] text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:border-[var(--brand-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-teal)]/40";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "not_configured" }
  | { kind: "error"; message: string };

type RecruitFormProps = {
  source?: string | null;
  sourceCode?: string | null;
  refCode?: string | null;
};

export function RecruitForm({ source, sourceCode, refCode }: RecruitFormProps) {
  const [name, setName] = useState("");
  const [wechat, setWechat] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(ROLE_OPTIONS[0]);
  const [intro, setIntro] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/recruit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, wechat, phone, email, role, intro, link, source, sourceCode, refCode }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string; message?: string };
      if (data.ok) {
        setStatus({ kind: "success" });
      } else if (data.code === "not_configured") {
        setStatus({ kind: "not_configured" });
      } else {
        setStatus({ kind: "error", message: data.message ?? "提交失败，请稍后再试" });
      }
    } catch {
      setStatus({ kind: "error", message: "网络异常，请稍后再试" });
    }
  }

  return (
    <div className="rounded-none border border-[var(--hairline)] bg-[var(--paper-1)] p-6 md:p-8">
      {source && source !== "官网" ? (
        <p className="mb-6 text-[13px] text-[var(--muted)]">
          来源已记录 · {source}
          {refCode ? " / " + refCode : ""}
        </p>
      ) : null}

      {status.kind === "success" ? (
        <div className="font-[family-name:var(--font-zh)] text-[16px] text-[var(--foreground)]">
          <p className="text-[var(--brand-teal)]">已收到投递，我们会尽快联系你。</p>
          <button
            type="button"
            onClick={() => {
              setName("");
              setWechat("");
              setPhone("");
              setEmail("");
              setIntro("");
              setLink("");
              setStatus({ kind: "idle" });
            }}
            className="mt-4 text-[14px] text-[var(--muted-strong)] underline-offset-4 hover:text-[var(--brand-teal)] hover:underline"
          >
            再投一份
          </button>
        </div>
      ) : status.kind === "not_configured" ? (
        <div className="font-[family-name:var(--font-zh)] text-[16px] leading-[1.9] text-[var(--muted-strong)]">
          <p>在线表单暂未接入，请直接通过以下方式投递简历：</p>
          <div className="mt-4 flex flex-col gap-2">
            <a href={`mailto:${MAIL_HELLO}`} className="text-[var(--brand-teal)] underline-offset-4 hover:underline">
              邮箱 {MAIL_HELLO}
            </a>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(WECHAT_ID);
                } catch {
                  window.prompt("复制微信号", WECHAT_ID);
                }
              }}
              className="w-fit text-left text-[var(--brand-teal)] underline-offset-4 hover:underline"
            >
              微信 {WECHAT_ID}（点击复制）
            </button>
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-teal)] underline-offset-4 hover:underline">
              Discord 社群
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)]">姓名 *</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} placeholder="怎么称呼你" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)]">微信号 *</span>
            <input required value={wechat} onChange={(e) => setWechat(e.target.value)} className={fieldClass} placeholder="用于后续联系" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)]">手机号</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} placeholder="选填" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)]">邮箱</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="选填" />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)]">意向岗位 *</span>
            <select required value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}>
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[var(--paper-1)]">
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)]">自我介绍 *</span>
            <textarea
              required
              rows={4}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className={`${fieldClass} resize-y`}
              placeholder="你在做什么 / 做过什么 / 为什么想加入浪前"
            />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="font-[family-name:var(--font-zh)] text-[14px] text-[var(--muted-strong)]">简历 / 作品链接</span>
            <input value={link} onChange={(e) => setLink(e.target.value)} className={fieldClass} placeholder="网盘、Notion、个人主页或作品链接" />
          </label>

          {status.kind === "error" ? (
            <p className="md:col-span-2 font-[family-name:var(--font-zh)] text-[14px] text-[#e6b964]">{status.message}</p>
          ) : null}

          <button
            type="submit"
            disabled={status.kind === "submitting"}
            className="md:col-span-2 mt-2 inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--brand-primary)] px-5 py-3 font-[family-name:var(--font-zh)] text-[15px] font-medium text-white transition-colors hover:bg-[#1420ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.kind === "submitting" ? "提交中…" : "提交投递"}
          </button>
        </form>
      )}
    </div>
  );
}