import { resolveRecruitSource } from "@/lib/recruit-source";

const FEISHU_BASE = "https://open.feishu.cn/open-apis";
const MAX_RESUME_BYTES = 20 * 1024 * 1024;

function isConfigured(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function formText(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formTextOrNull(form: FormData, key: string): string | null {
  const value = formText(form, key);
  return value.length > 0 ? value : null;
}

async function feishuTenantToken(appId: string, appSecret: string): Promise<string> {
  const res = await fetch(`${FEISHU_BASE}/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    cache: "no-store",
  });
  const data = (await res.json()) as {
    code: number;
    tenant_access_token?: string;
    msg?: string;
  };
  if (data.code !== 0 || !data.tenant_access_token) {
    throw new Error(data.msg ?? `Feishu token error (code=${data.code})`);
  }
  return data.tenant_access_token;
}

async function uploadResume(token: string, appToken: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("file_name", file.name);
  form.append("parent_type", "bitable_file");
  form.append("parent_node", appToken);
  form.append("size", String(file.size));
  form.append("file", file);

  const res = await fetch(`${FEISHU_BASE}/drive/v1/medias/upload_all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    cache: "no-store",
  });
  const data = (await res.json()) as {
    code: number;
    data?: { file_token?: string };
    msg?: string;
  };
  if (data.code !== 0 || !data.data?.file_token) {
    throw new Error(data.msg ?? `Feishu upload error (code=${data.code})`);
  }
  return data.data.file_token;
}

type RecruitFields = {
  name: string;
  role: string;
  intro: string;
  wechat: string;
  phone: string;
  email: string;
  link: string;
  extra: string;
  source: string | null;
  sourceCode: string | null;
  refCode: string | null;
  landing: string | null;
  resume: File | null;
};

function textFromUnknown(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function parseRecruitPayload(request: Request): Promise<RecruitFields | null> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const payload = (await request.json()) as Record<string, unknown>;
      return {
        name: textFromUnknown(payload.name),
        role: textFromUnknown(payload.role),
        intro: textFromUnknown(payload.intro),
        wechat: textFromUnknown(payload.wechat),
        phone: textFromUnknown(payload.phone),
        email: textFromUnknown(payload.email),
        link: textFromUnknown(payload.link),
        extra: textFromUnknown(payload.extra),
        source: textFromUnknown(payload.source) || null,
        sourceCode: textFromUnknown(payload.sourceCode) || null,
        refCode: textFromUnknown(payload.refCode) || null,
        landing: textFromUnknown(payload.landing) || null,
        resume: null,
      };
    } catch {
      return null;
    }
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    return {
      name: formText(form, "name"),
      role: formText(form, "role"),
      intro: formText(form, "intro"),
      wechat: formText(form, "wechat"),
      phone: formText(form, "phone"),
      email: formText(form, "email"),
      link: formText(form, "link"),
      extra: formText(form, "extra"),
      source: formTextOrNull(form, "source"),
      sourceCode: formTextOrNull(form, "sourceCode"),
      refCode: formTextOrNull(form, "refCode"),
      landing: formTextOrNull(form, "landing"),
      resume: file instanceof File && file.size > 0 ? file : null,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const payload = await parseRecruitPayload(request);
  if (!payload) {
    return json({ ok: false, code: "bad_request", message: "提交内容无法解析" }, 400);
  }

  const { name, role, intro, wechat, phone, email, link, extra, resume } = payload;

  if (!name || !role || !intro || !wechat) {
    return json(
      { ok: false, code: "missing_fields", message: "请至少填写姓名、意向岗位、自我介绍和微信号" },
      400,
    );
  }

  if (resume && resume.size > MAX_RESUME_BYTES) {
    return json({ ok: false, code: "file_too_large", message: "附件不能超过 20MB" }, 400);
  }

  const resolved = resolveRecruitSource(payload.sourceCode, payload.refCode);
  const sourceLabel = payload.source && payload.source !== "官网" ? payload.source : resolved.label;
  const sourceDisplay = resolved.refCode
    ? `${sourceLabel} · ${resolved.refCode}`
    : sourceLabel;

  const appId = process.env.FEISHU_APP_ID?.trim();
  const appSecret = process.env.FEISHU_APP_SECRET?.trim();
  const appToken = process.env.FEISHU_APP_TOKEN?.trim();
  const tableId = process.env.FEISHU_TABLE_ID?.trim();

  if (!isConfigured(appId) || !isConfigured(appSecret) || !isConfigured(appToken) || !isConfigured(tableId)) {
    return json({ ok: false, code: "not_configured", message: "在线投递暂未配置" }, 200);
  }

  try {
    const token = await feishuTenantToken(appId!, appSecret!);
    const fields: Record<string, unknown> = {
      姓名: name,
      微信: wechat,
      意向岗位: role,
      自我介绍: intro,
      来源: sourceDisplay,
      渠道代码: resolved.code,
      落地页: payload.landing || "/join",
      投递时间: new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
    };
    if (phone) fields["手机号"] = phone;
    if (email) fields["邮箱"] = email;
    if (link) fields["简历链接"] = link;
    if (extra) fields["补充说明"] = extra;
    if (resolved.refCode) fields["归因码"] = resolved.refCode;
    if (resume) {
      const fileToken = await uploadResume(token, appToken!, resume);
      fields["简历附件"] = [{ file_token: fileToken }];
    }
    const res = await fetch(`${FEISHU_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ fields }),
      cache: "no-store",
    });
    const data = (await res.json()) as {
      code: number;
      msg?: string;
      error?: unknown;
      data?: unknown;
    };
    if (data.code !== 0) {
      const detail =
        typeof data.error === "string"
          ? data.error
          : data.msg ?? "写入失败";
      return json({ ok: false, code: "feishu_error", message: detail, feishuCode: data.code }, 502);
    }
    return json({ ok: true }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "提交失败";
    return json({ ok: false, code: "error", message }, 500);
  }
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
