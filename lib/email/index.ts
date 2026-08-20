import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

let transporter: Transporter | null | undefined;

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function getTransporter(): Transporter | null {
  if (transporter !== undefined) {
    return transporter;
  }

  if (!isSmtpConfigured()) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
  });

  return transporter;
}

export async function sendEmail(input: SendEmailInput): Promise<{
  sent: boolean;
  skipped?: boolean;
  messageId?: string;
}> {
  const mailer = getTransporter();

  if (!mailer) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email] SMTP not configured — skipped:", input.subject);
    }
    return { sent: false, skipped: true };
  }

  const fromName =
    process.env.SMTP_FROM_NAME ?? "Rayana De Silva — Heart Matters";
  const fromAddress = process.env.SMTP_FROM as string;

  const info = await mailer.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });

  return { sent: true, messageId: info.messageId };
}

export { isSmtpConfigured };
