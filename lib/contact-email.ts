type ContactEmailPayload = {
  name: string
  email: string
  serviceInterest?: string
  message: string
  language?: "en" | "fr"
}

const SERVICE_LABELS: Record<string, { en: string; fr: string }> = {
  website: { en: "Website development", fr: "Création de sites web" },
  webapp: { en: "Web application", fr: "Applications web" },
  ai: { en: "AI solutions", fr: "Solutions IA" },
  ecommerce: { en: "Ecommerce", fr: "E-commerce / boutique en ligne" },
  other: { en: "Not sure yet", fr: "Pas encore défini" },
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function getInboxEmail(): string {
  return process.env.CONTACT_INBOX_EMAIL?.trim() || "hamza@codinou.ma"
}

function getFromEmail(): string {
  return process.env.CONTACT_FROM_EMAIL?.trim() || "Codinou <noreply@codinou.ma>"
}

function serviceLabel(serviceInterest: string | undefined, language: "en" | "fr"): string {
  if (!serviceInterest) {
    return language === "fr" ? "Non précisé" : "Not specified"
  }
  return SERVICE_LABELS[serviceInterest]?.[language] ?? serviceInterest
}

async function sendResendEmail(payload: {
  from: string
  to: string[]
  subject: string
  html: string
  replyTo?: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not configured" }
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      reply_to: payload.replyTo,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    return { ok: false, error: body || `Resend error ${response.status}` }
  }

  return { ok: true }
}

function buildTeamNotificationEmail(data: ContactEmailPayload): { subject: string; html: string } {
  const service = serviceLabel(data.serviceInterest, "fr")
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />")

  return {
    subject: `Nouveau contact — ${data.name}`,
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#1a2236;max-width:560px">
        <h2 style="margin:0 0 16px;color:#2d3a5c">Nouveau message depuis codinou.ma</h2>
        <p><strong>Nom :</strong> ${safeName}</p>
        <p><strong>Email :</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>Service :</strong> ${escapeHtml(service)}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space:pre-wrap;background:#f4f1ea;padding:16px;border-radius:12px">${safeMessage}</p>
      </div>
    `,
  }
}

function buildCustomerAutoReply(data: ContactEmailPayload): { subject: string; html: string } {
  const language = data.language === "en" ? "en" : "fr"
  const safeName = escapeHtml(data.name)

  if (language === "en") {
    return {
      subject: "We received your message — Codinou",
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#1a2236;max-width:560px">
          <h2 style="margin:0 0 16px;color:#2d3a5c">Thank you for contacting Codinou</h2>
          <p>Hi ${safeName},</p>
          <p>We have received your message and will get back to you shortly.</p>
          <p style="color:#5c6478">This is an automated confirmation — please do not reply to this email.</p>
          <p style="margin-top:24px">— The Codinou team<br /><a href="https://codinou.ma">codinou.ma</a></p>
        </div>
      `,
    }
  }

  return {
    subject: "Nous avons bien reçu votre message — Codinou",
    html: `
      <div style="font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#1a2236;max-width:560px">
        <h2 style="margin:0 0 16px;color:#2d3a5c">Merci de nous avoir contactés</h2>
        <p>Bonjour ${safeName},</p>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <p style="color:#5c6478">Ceci est une confirmation automatique — merci de ne pas répondre à cet e-mail.</p>
        <p style="margin-top:24px">— L'équipe Codinou<br /><a href="https://codinou.ma">codinou.ma</a></p>
      </div>
    `,
  }
}

export async function sendContactEmails(
  data: ContactEmailPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const from = getFromEmail()
  const inbox = getInboxEmail()
  const teamEmail = buildTeamNotificationEmail(data)
  const customerEmail = buildCustomerAutoReply(data)

  const teamResult = await sendResendEmail({
    from,
    to: [inbox],
    subject: teamEmail.subject,
    html: teamEmail.html,
    replyTo: data.email,
  })

  if (!teamResult.ok) {
    return teamResult
  }

  const customerResult = await sendResendEmail({
    from,
    to: [data.email],
    subject: customerEmail.subject,
    html: customerEmail.html,
  })

  if (!customerResult.ok) {
    return customerResult
  }

  return { ok: true }
}

export function isContactEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}
