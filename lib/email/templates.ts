import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export type BookingConfirmationTemplateInput = {
  clientName: string;
  serviceTitle: string;
  referenceNumber: string;
  startLocal: string;
  endLocal: string;
  clientTimeZone: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  rescheduleUrl?: string;
};

export type ContactNotificationTemplateInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  submittedAt: Date;
};

export function bookingConfirmationEmail(
  input: BookingConfirmationTemplateInput,
): { subject: string; html: string; text: string } {
  const subject = `Booking confirmation — ${input.referenceNumber}`;
  const formattedAmount = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: input.currency,
  }).format(input.amount);

  const text = [
    `Dear ${input.clientName},`,
    "",
    `Your session with Rayana De Silva — Heart Matters is reserved.`,
    "",
    `Reference: ${input.referenceNumber}`,
    `Service: ${input.serviceTitle}`,
    `When: ${input.startLocal} – ${input.endLocal} (${input.clientTimeZone})`,
    `Payment: ${input.paymentMethod} — ${formattedAmount}`,
    input.rescheduleUrl ? `Manage booking: ${input.rescheduleUrl}` : "",
    "",
    "With warmth,",
    "Rayana De Silva — Heart Matters",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <p>Dear ${escapeHtml(input.clientName)},</p>
    <p>Your session with <strong>Rayana De Silva — Heart Matters</strong> is reserved.</p>
    <ul>
      <li><strong>Reference:</strong> ${escapeHtml(input.referenceNumber)}</li>
      <li><strong>Service:</strong> ${escapeHtml(input.serviceTitle)}</li>
      <li><strong>When:</strong> ${escapeHtml(input.startLocal)} – ${escapeHtml(input.endLocal)} (${escapeHtml(input.clientTimeZone)})</li>
      <li><strong>Payment:</strong> ${escapeHtml(input.paymentMethod)} — ${escapeHtml(formattedAmount)}</li>
    </ul>
    ${
      input.rescheduleUrl
        ? `<p><a href="${escapeHtml(input.rescheduleUrl)}">Manage your booking</a></p>`
        : ""
    }
    <p>With warmth,<br/>Rayana De Silva — Heart Matters</p>
  `;

  return { subject, html, text };
}

export function contactNotificationEmail(
  input: ContactNotificationTemplateInput,
): { subject: string; html: string; text: string } {
  const subject = input.subject
    ? `Contact form: ${input.subject}`
    : "New contact form submission";

  const submitted = formatInTimeZone(
    input.submittedAt,
    "America/Vancouver",
    "PPpp zzz",
  );

  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : "",
    input.subject ? `Subject: ${input.subject}` : "",
    `Submitted: ${submitted}`,
    "",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    ${input.phone ? `<p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>` : ""}
    ${input.subject ? `<p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>` : ""}
    <p><strong>Submitted:</strong> ${escapeHtml(submitted)}</p>
    <hr/>
    <p>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>
  `;

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatBookingLocalTime(
  date: Date,
  timeZone: string,
  pattern = "EEEE, MMMM d, yyyy 'at' h:mm a",
): string {
  return formatInTimeZone(date, timeZone, pattern);
}

export function formatAuditTimestamp(date: Date): string {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}
