"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { DISCORD_INVITE_URL } from "@/lib/site-contact";

const WECHAT_ID = "x3167056428";
const MAX_RESUME_BYTES = 20 * 1024 * 1024;
const ROLE_OPTIONS = ["编辑实习生", "市场营销实习生", "全媒体运营实习生", "创业者生态实习生", "核心正职（面议）"] as const;
const fieldClass = "w-full rounded-none border border-[var(--hairline)] bg-[var(--paper-0)] px-4 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted-soft)] focus:border-[var(--brand-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-teal)]/40 disabled:opacity-60 aria-invalid:border-[var(--brand-primary)]";
const labelClass = "text-[14px] font-medium text-[var(--foreground)]";
const helpClass = "text-[13px] leading-[1.7] text-[var(--muted)]";
const focusClass = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-teal)]";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "not_configured" } | { kind: "error"; message: string };
type RequiredField = "name" | "wechat" | "intro";
type RecruitFormProps = { source?: string | null; sourceCode?: string | null; refCode?: string | null };

export function RecruitForm({ source, sourceCode, refCode }: RecruitFormProps) {
  const prefix = useId();
  const fieldId = (field: string) => `${prefix}-${field}`;
  const feedbackRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const [name, setName] = useState("");
  const [wechat, setWechat] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(ROLE_OPTIONS[0]);
  const [intro, setIntro] = useState("");
  const [link, setLink] = useState("");
  const [extra, setExtra] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const pending = status.kind === "submitting";

  useEffect(() => {
    if (status.kind === "success" || status.kind === "error" || status.kind === "not_configured") feedbackRef.current?.focus();
  }, [status.kind]);

  function clearFieldError(field: RequiredField) {
    setFieldErrors((errors) => ({ ...errors, [field]: undefined }));
  }

  function clearResume() {
    setResume(null);
    setResumeError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleResumeChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_RESUME_BYTES) {
      setResume(null);
      setResumeError("附件超过 20MB，请压缩或更换文件，也可以只提供作品链接。");
      e.target.value = "";
      return;
    }
    setResume(file);
    setResumeError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    const errors: Partial<Record<RequiredField, string>> = {};
    if (!name.trim()) errors.name = "请填写你的姓名。";
    if (!wechat.trim()) errors.wechat = "请填写用于后续联系的微信号。";
    if (!intro.trim()) errors.intro = "请简单介绍你做过的事和想加入的原因。";
    setFieldErrors(errors);
    const firstError = (["name", "wechat", "intro"] as const).find((field) => errors[field]);
    if (firstError) {
      const input = e.currentTarget.elements.namedItem(firstError);
      if (input instanceof HTMLElement) input.focus();
      return;
    }
    if (resumeError) { fileRef.current?.focus(); return; }
    submittingRef.current = true;
    setStatus({ kind: "submitting" });
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("wechat", wechat);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("role", role);
      formData.append("intro", intro);
      formData.append("link", link);
      formData.append("extra", extra);
      formData.append("landing", window.location.pathname + window.location.search);
      if (source) formData.append("source", source);
      if (sourceCode) formData.append("sourceCode", sourceCode);
      if (refCode) formData.append("refCode", refCode);
      if (resume) formData.append("file", resume);
      const res = await fetch("/api/recruit", { method: "POST", body: formData });
      const data = (await res.json()) as { ok: boolean; code?: string; message?: string };
      if (res.ok && data.ok) setStatus({ kind: "success" });
      else if (data.code === "not_configured") setStatus({ kind: "not_configured" });
      else setStatus({ kind: "error", message: data.message ?? "提交失败，请稍后再试。" });
    } catch {
      setStatus({ kind: "error", message: "网络异常，请检查连接后重试。" });
    } finally {
      submittingRef.current = false;
    }
  }

  function resetForm() {
    setName(""); setWechat(""); setPhone(""); setEmail(""); setRole(ROLE_OPTIONS[0]);
    setIntro(""); setLink(""); setExtra(""); setResume(null); setResumeError("");
    setFieldErrors({}); setCopied(false); setStatus({ kind: "idle" });
  }

  return (
    <div className="border border-[var(--hairline)] bg-[var(--paper-1)] p-5 font-[family-name:var(--font-zh)] md:p-8">
      {source && source !== "官网" && source !== "小红书" ? <p className={`mb-5 ${helpClass}`}>来源已记录 · {source}{refCode ? ` / ${refCode}` : ""}</p> : null}
      {status.kind === "success" ? (
        <div ref={feedbackRef} tabIndex={-1} role="status" className="py-4 focus:outline-none">
          <p className="text-[20px] font-medium text-[var(--foreground)]">谢谢你的投递。</p>
          <p className="mt-3 text-[15px] leading-[1.8] text-[var(--muted-strong)]">我们已经收到你的材料，会认真看完，并尽快通过微信与你联系。</p>
          <button type="button" onClick={resetForm} className={`mt-6 min-h-11 text-[14px] text-[var(--brand-teal)] underline underline-offset-4 ${focusClass}`}>再投一份</button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onInvalidCapture={(event) => {
            if (event.target instanceof HTMLElement) {
              const section = event.target.closest("details");
              if (section) section.open = true;
            }
          }}
          aria-labelledby={fieldId("title")}
          aria-busy={pending}
          className="space-y-6"
        >
          <div>
            <p id={fieldId("title")} className="text-[17px] font-medium text-[var(--foreground)]">你的投递信息</p>
            <p className={`mt-2 ${helpClass}`}>标有 * 的为必填。已有简历或作品介绍，可直接粘贴到自我介绍，无需重复整理。</p>
          </div>
          <fieldset disabled={pending} className="grid min-w-0 gap-5 md:grid-cols-2">
            <legend className="sr-only">基本信息与作品</legend>
            <div className="flex flex-col gap-2">
              <label htmlFor={fieldId("name")} className={labelClass}>姓名 <span aria-hidden="true">*</span></label>
              <input id={fieldId("name")} name="name" autoComplete="name" required value={name} onChange={(e) => { setName(e.target.value); clearFieldError("name"); }} aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? fieldId("name-error") : undefined} className={fieldClass} placeholder="怎么称呼你" />
              {fieldErrors.name ? <p id={fieldId("name-error")} className={helpClass}>{fieldErrors.name}</p> : null}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={fieldId("wechat")} className={labelClass}>微信号 <span aria-hidden="true">*</span></label>
              <input id={fieldId("wechat")} name="wechat" autoComplete="off" autoCapitalize="none" spellCheck={false} required value={wechat} onChange={(e) => { setWechat(e.target.value); clearFieldError("wechat"); }} aria-invalid={!!fieldErrors.wechat} aria-describedby={`${fieldId("wechat-help")}${fieldErrors.wechat ? ` ${fieldId("wechat-error")}` : ""}`} className={fieldClass} placeholder="填写微信号" />
              <p id={fieldId("wechat-help")} className={helpClass}>用于后续联系，请确认可通过微信号搜索到你。</p>
              {fieldErrors.wechat ? <p id={fieldId("wechat-error")} className={helpClass}>{fieldErrors.wechat}</p> : null}
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor={fieldId("role")} className={labelClass}>意向岗位 <span aria-hidden="true">*</span></label>
              <select id={fieldId("role")} name="role" required value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass}>
                {ROLE_OPTIONS.map((option) => <option key={option} value={option} className="bg-[var(--paper-1)]">{option}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor={fieldId("intro")} className={labelClass}>自我介绍 <span aria-hidden="true">*</span></label>
              <textarea id={fieldId("intro")} name="intro" required rows={4} value={intro} onChange={(e) => { setIntro(e.target.value); clearFieldError("intro"); }} aria-invalid={!!fieldErrors.intro} aria-describedby={fieldErrors.intro ? fieldId("intro-error") : undefined} className={`${fieldClass} resize-y`} placeholder="你做过什么、想解决什么问题，以及为什么想加入浪前" />
              {fieldErrors.intro ? <p id={fieldId("intro-error")} className={helpClass}>{fieldErrors.intro}</p> : null}
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor={fieldId("link")} className={labelClass}>简历 / 作品链接 <span className="font-normal text-[var(--muted)]">（选填）</span></label>
              <input id={fieldId("link")} name="link" value={link} onChange={(e) => setLink(e.target.value)} className={fieldClass} placeholder="网盘、Notion、个人主页或作品链接" aria-describedby={fieldId("link-help")} />
              <p id={fieldId("link-help")} className={helpClass}>链接和附件任选其一，也可以都不填。分享网盘时请附提取码。</p>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor={fieldId("resume")} className={labelClass}>附件 <span className="font-normal text-[var(--muted)]">（选填）</span></label>
              <input ref={fileRef} id={fieldId("resume")} name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.md,.txt,.zip,.rar,.7z,.jpg,.jpeg,.png,.webp,.gif" onChange={handleResumeChange} aria-invalid={!!resumeError} aria-describedby={`${fieldId("resume-help")}${resumeError ? ` ${fieldId("resume-error")}` : ""}`} className={`${fieldClass} file:mr-4 file:border-0 file:bg-[var(--paper-1)] file:px-3 file:py-1 file:text-[13px] file:text-[var(--foreground)]`} />
              <p id={fieldId("resume-help")} className={helpClass}>{resume ? `已选择：${resume.name}` : "简历、作品集或截图等，单文件不超过 20MB。"}</p>
              {resumeError ? <p id={fieldId("resume-error")} role="alert" className="text-[13px] leading-[1.7] text-[var(--foreground)]">{resumeError}</p> : null}
              {resume || resumeError ? <button type="button" onClick={clearResume} className={`w-fit min-h-9 text-[13px] text-[var(--brand-teal)] underline underline-offset-4 ${focusClass}`}>{resume ? "移除附件" : "不上传附件，继续填写"}</button> : null}
            </div>
          </fieldset>
          <details className="border-y border-[var(--hairline)] py-1">
            <summary className={`cursor-pointer py-4 text-[14px] font-medium text-[var(--muted-strong)] ${focusClass}`}>补充信息（选填）</summary>
            <fieldset disabled={pending} className="grid min-w-0 gap-5 pb-5 pt-1 md:grid-cols-2">
              <legend className="sr-only">其他联系方式与说明</legend>
              <div className="flex flex-col gap-2">
                <label htmlFor={fieldId("phone")} className={labelClass}>手机号</label>
                <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} placeholder="备用联系方式" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={fieldId("email")} className={labelClass}>邮箱</label>
                <input id={fieldId("email")} name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="备用联系方式" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor={fieldId("extra")} className={labelClass}>补充说明</label>
                <textarea id={fieldId("extra")} name="extra" rows={3} value={extra} onChange={(e) => setExtra(e.target.value)} className={`${fieldClass} resize-y`} placeholder="如可到岗时间、每周可投入天数、推荐人等" />
              </div>
            </fieldset>
          </details>
          {status.kind === "error" ? (
            <div ref={feedbackRef} tabIndex={-1} role="alert" className="border-l-2 border-[var(--brand-primary)] pl-4 text-[14px] leading-[1.8] text-[var(--foreground)] focus:outline-none">
              <p className="font-medium">这次投递未完成</p><p>{status.message} 已填写的内容仍保留在此页。</p>
            </div>
          ) : status.kind === "not_configured" ? (
            <div ref={feedbackRef} tabIndex={-1} role="alert" className="border-l-2 border-[var(--brand-primary)] pl-4 text-[14px] leading-[1.8] text-[var(--foreground)] focus:outline-none">
              <p className="font-medium">在线投递暂未接收成功</p><p className="mt-1">填写内容已保留在此页，请通过微信或 Discord 投递。</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(WECHAT_ID); setCopied(true); } catch { window.prompt("复制微信号", WECHAT_ID); } }} className={`min-h-11 text-left text-[var(--brand-teal)] underline underline-offset-4 ${focusClass}`}>微信 {WECHAT_ID}（{copied ? "已复制" : "点击复制"}）</button>
                <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center text-[var(--brand-teal)] underline underline-offset-4 ${focusClass}`}>Discord 社群 ↗</a>
              </div>
              <span role="status" className="sr-only">{copied ? "微信号已复制" : ""}</span>
            </div>
          ) : null}
          <div>
            <button type="submit" disabled={pending} className={`inline-flex min-h-12 w-full items-center justify-center bg-[var(--brand-primary)] px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60 ${focusClass}`}>{pending ? "正在提交，请稍候…" : status.kind === "error" ? "重新提交" : "提交投递"}</button>
            <p role="status" aria-live="polite" className="sr-only">{pending ? "正在提交，请勿重复操作。" : ""}</p>
          </div>
        </form>
      )}
    </div>
  );
}
