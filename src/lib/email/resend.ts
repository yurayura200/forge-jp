// Email sending via SendGrid (replaces Resend in scaffold; same export interface).
// Memory: WCH株式会社 already has SendGrid contracted (komugi-outreach key, 2026-04-23 setup).

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@forge.komugi-ai.jp";
export const INTERNAL_EMAIL = process.env.INTERNAL_NOTIFY_EMAIL || "";

export type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  if (!SENDGRID_API_KEY) {
    console.warn("[email] SENDGRID_API_KEY not set. Skipping send.", payload.subject);
    return { success: false, error: "SendGrid not configured" };
  }

  const recipients = Array.isArray(payload.to) ? payload.to : [payload.to];

  try {
    const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: recipients.map((email) => ({ email })) }],
        from: { email: FROM_EMAIL, name: "Forge" },
        subject: payload.subject,
        content: [{ type: "text/html", value: payload.html }],
        reply_to: payload.replyTo ? { email: payload.replyTo } : undefined,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("[email] SendGrid error:", r.status, text.slice(0, 500));
      return { success: false, error: `SendGrid ${r.status}` };
    }
    return { success: true };
  } catch (err) {
    console.error("[email] Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Compatibility export so any leftover `import { resend }` still resolves.
export const resend = null;
