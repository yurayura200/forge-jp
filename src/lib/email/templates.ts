import {
  PROJECT_TYPE_LABELS,
  BUDGET_LABELS,
  DURATION_LABELS,
  type InquiryInput,
} from "@/lib/validations/inquiry";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forge.jp";
const COMPANY = process.env.NEXT_PUBLIC_COMPANY_NAME || "Forge運営事務局";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nl2br(input: string): string {
  return escapeHtml(input).replace(/\n/g, "<br>");
}

const baseStyles = `font-family: -apple-system, "Helvetica Neue", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif; line-height: 1.7; color: #0A0A0A;`;
const containerStyles = `max-width: 600px; margin: 0 auto; padding: 24px;`;
const dividerStyles = `border: none; border-top: 1px solid #E7E5E4; margin: 24px 0;`;
const footerStyles = `font-size: 12px; color: #57534E; margin-top: 32px;`;

export function inquiryReceivedTemplate(input: InquiryInput): { subject: string; html: string } {
  const subject = "【Forge】お問い合わせを受け付けました";
  const html = `
<div style="${baseStyles}">
  <div style="${containerStyles}">
    <p>${escapeHtml(input.contactName)} 様</p>
    <p>このたびはForgeへお問い合わせいただきありがとうございます。<br>以下の内容で受け付けました。</p>
    <hr style="${dividerStyles}">
    <p>
      <strong>案件タイプ:</strong> ${escapeHtml(PROJECT_TYPE_LABELS[input.projectType])}<br>
      <strong>予算感:</strong> ${escapeHtml(BUDGET_LABELS[input.budgetRange])}<br>
      <strong>期間:</strong> ${escapeHtml(DURATION_LABELS[input.duration])}<br>
      <strong>運用希望:</strong> ${input.needsOperate ? "あり" : "なし"}
    </p>
    <p><strong>ご相談内容:</strong></p>
    <p>${nl2br(input.message)}</p>
    <hr style="${dividerStyles}">
    <p>担当者より24時間以内（営業日）に返信いたします。<br>お急ぎの場合はこのメールに返信ください。</p>
    <p style="${footerStyles}">
      Forge — AIを、動かし続ける。<br>
      ${escapeHtml(COMPANY)}<br>
      <a href="${SITE_URL}" style="color: #FF6B35;">${SITE_URL}</a>
    </p>
  </div>
</div>`;
  return { subject, html };
}

export function inquiryInternalTemplate(input: InquiryInput, inquiryId: string): {
  subject: string;
  html: string;
} {
  const subject = `【Forge内部】新規問い合わせ: ${input.companyName} / ${PROJECT_TYPE_LABELS[input.projectType]}`;
  const adminUrl = `${SITE_URL}/admin/inquiries/${inquiryId}`;
  const html = `
<div style="${baseStyles}">
  <div style="${containerStyles}">
    <h2 style="margin: 0 0 16px;">新規の問い合わせが入りました</h2>
    <p>
      <strong>会社:</strong> ${escapeHtml(input.companyName)}<br>
      <strong>担当:</strong> ${escapeHtml(input.contactName)} &lt;${escapeHtml(input.contactEmail)}&gt;<br>
      <strong>電話:</strong> ${escapeHtml(input.contactPhone || "-")}<br>
      <strong>業界:</strong> ${escapeHtml(input.industry || "-")}<br>
      <strong>規模:</strong> ${escapeHtml(input.companySize || "-")}
    </p>
    <hr style="${dividerStyles}">
    <p>
      <strong>案件タイプ:</strong> ${escapeHtml(PROJECT_TYPE_LABELS[input.projectType])}<br>
      <strong>予算:</strong> ${escapeHtml(BUDGET_LABELS[input.budgetRange])}<br>
      <strong>期間:</strong> ${escapeHtml(DURATION_LABELS[input.duration])}<br>
      <strong>運用希望:</strong> ${input.needsOperate ? "あり" : "なし"}<br>
      <strong>開始希望:</strong> ${escapeHtml(input.startDate || "-")}
    </p>
    <p><strong>内容:</strong></p>
    <p>${nl2br(input.message)}</p>
    <hr style="${dividerStyles}">
    <p>
      管理画面で確認:<br>
      <a href="${adminUrl}" style="color: #FF6B35;">${adminUrl}</a>
    </p>
  </div>
</div>`;
  return { subject, html };
}

export type EngineerInternalNotice = {
  displayName: string;
  githubUsername: string;
  email: string;
  skills: string[];
  aiSpecialties: string[];
  monthlyRateMin?: number | null;
  monthlyRateMax?: number | null;
  hoursPerWeek: number;
  engineerId: string;
};

export function engineerAppliedInternalTemplate(input: EngineerInternalNotice): {
  subject: string;
  html: string;
} {
  const subject = `【Forge内部】新規エンジニア登録: ${input.githubUsername}`;
  const adminUrl = `${SITE_URL}/admin/engineers/${input.engineerId}`;
  const rate =
    input.monthlyRateMin && input.monthlyRateMax
      ? `月額 ${input.monthlyRateMin.toLocaleString()}〜${input.monthlyRateMax.toLocaleString()}円`
      : "-";
  const html = `
<div style="${baseStyles}">
  <div style="${containerStyles}">
    <h2 style="margin: 0 0 16px;">新規のエンジニア登録があります</h2>
    <p>
      <strong>名前:</strong> ${escapeHtml(input.displayName)}<br>
      <strong>GitHub:</strong> <a href="https://github.com/${escapeHtml(input.githubUsername)}" style="color: #FF6B35;">@${escapeHtml(input.githubUsername)}</a><br>
      <strong>メール:</strong> ${escapeHtml(input.email)}<br>
      <strong>スキル:</strong> ${escapeHtml(input.skills.join(", "))}<br>
      <strong>AI特化:</strong> ${escapeHtml(input.aiSpecialties.join(", "))}<br>
      <strong>単価:</strong> ${escapeHtml(rate)}<br>
      <strong>稼働:</strong> ${input.hoursPerWeek}時間/週
    </p>
    <hr style="${dividerStyles}">
    <p>
      管理画面で確認:<br>
      <a href="${adminUrl}" style="color: #FF6B35;">${adminUrl}</a>
    </p>
  </div>
</div>`;
  return { subject, html };
}

export function engineerAppliedTemplate(displayName: string): { subject: string; html: string } {
  const subject = "【Forge】登録ありがとうございます（審査中）";
  const html = `
<div style="${baseStyles}">
  <div style="${containerStyles}">
    <p>${escapeHtml(displayName)} さん</p>
    <p>Forgeへのご登録ありがとうございます。<br>GitHubアカウントとプロフィール内容を運営チームで確認いたします。<br>通常2〜5営業日以内に審査結果をご連絡します。</p>
    <p>審査通過後、案件のご紹介を順次お送りします。</p>
    <p style="${footerStyles}">
      Forge — AIを、動かし続ける。<br>
      ${escapeHtml(COMPANY)}<br>
      <a href="${SITE_URL}" style="color: #FF6B35;">${SITE_URL}</a>
    </p>
  </div>
</div>`;
  return { subject, html };
}
