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

export type AdminBookingPaidNotificationInput = {
  referenceNumber: string;
  serviceTitle: string;
  serviceSlug: string;
  deliveryMode: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientQuestions?: string;
  clientNotes?: string;
  recordingRequested: boolean;
  startLocal: string;
  endLocal: string;
  clientTimeZone: string;
  hostTimeZone: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paidAt: Date;
  adminBookingsUrl: string;
};

export type AdminShopPurchaseNotificationInput = {
  productTitle: string;
  productSlug: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  paidAt: Date;
  stripeSessionId: string;
  adminProductsUrl: string;
};

export function adminBookingPaidNotificationEmail(
  input: AdminBookingPaidNotificationInput,
): { subject: string; html: string; text: string } {
  const formattedAmount = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: input.currency,
  }).format(input.amount);
  const paidAtLabel = formatInTimeZone(
    input.paidAt,
    input.hostTimeZone,
    "PPpp zzz",
  );
  const isVideo =
    /video|zoom|online/i.test(input.deliveryMode) ||
    /video|zoom/i.test(input.serviceTitle);

  const subject = `Paid booking — ${input.referenceNumber} (${input.clientName})`;

  const detailLines = [
    `Reference: ${input.referenceNumber}`,
    `Service: ${input.serviceTitle}`,
    `Delivery: ${input.deliveryMode}`,
    `Session: ${input.startLocal} – ${input.endLocal} (${input.clientTimeZone})`,
    `Host time zone: ${input.hostTimeZone}`,
    `Payment: ${input.paymentMethod} — ${formattedAmount}`,
    `Paid at: ${paidAtLabel}`,
    "",
    `Client name: ${input.clientName}`,
    `Client email: ${input.clientEmail}`,
    input.clientPhone ? `Client phone: ${input.clientPhone}` : "",
    input.recordingRequested ? "Recording requested: Yes" : "",
    input.clientQuestions ? `Client questions:\n${input.clientQuestions}` : "",
    input.clientNotes ? `Client notes:\n${input.clientNotes}` : "",
    "",
    `Admin bookings: ${input.adminBookingsUrl}`,
    "",
    isVideo
      ? "This is a video/online session. Reply to this email to send the client your video link, meeting details, or recording access."
      : "Reply to this email to contact the client with any session details or follow-up.",
  ].filter(Boolean);

  const text = detailLines.join("\n");

  const html = `
    <p><strong>New paid booking</strong></p>
    <ul>
      <li><strong>Reference:</strong> ${escapeHtml(input.referenceNumber)}</li>
      <li><strong>Service:</strong> ${escapeHtml(input.serviceTitle)}</li>
      <li><strong>Delivery:</strong> ${escapeHtml(input.deliveryMode)}</li>
      <li><strong>Session:</strong> ${escapeHtml(input.startLocal)} – ${escapeHtml(input.endLocal)} (${escapeHtml(input.clientTimeZone)})</li>
      <li><strong>Payment:</strong> ${escapeHtml(input.paymentMethod)} — ${escapeHtml(formattedAmount)}</li>
    </ul>
    <p><strong>Client</strong></p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(input.clientName)}</li>
      <li><strong>Email:</strong> ${escapeHtml(input.clientEmail)}</li>
      ${input.clientPhone ? `<li><strong>Phone:</strong> ${escapeHtml(input.clientPhone)}</li>` : ""}
      ${input.recordingRequested ? "<li><strong>Recording requested:</strong> Yes</li>" : ""}
    </ul>
    ${
      input.clientQuestions
        ? `<p><strong>Questions</strong><br/>${escapeHtml(input.clientQuestions).replace(/\n/g, "<br/>")}</p>`
        : ""
    }
    ${
      input.clientNotes
        ? `<p><strong>Notes</strong><br/>${escapeHtml(input.clientNotes).replace(/\n/g, "<br/>")}</p>`
        : ""
    }
    <p><a href="${escapeHtml(input.adminBookingsUrl)}">Open bookings in admin</a></p>
    <p><em>${
      isVideo
        ? "Reply to this email to send the client your video link or meeting details."
        : "Reply to this email to reach the client directly."
    }</em></p>
  `;

  return { subject, html, text };
}

export function adminShopPurchaseNotificationEmail(
  input: AdminShopPurchaseNotificationInput,
): { subject: string; html: string; text: string } {
  const formattedAmount = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: input.currency,
  }).format(input.amount);
  const paidAtLabel = formatInTimeZone(input.paidAt, "America/Vancouver", "PPpp zzz");

  const subject = `Shop purchase — ${input.productTitle} (${input.clientEmail})`;

  const text = [
    `Product: ${input.productTitle}`,
    `Slug: ${input.productSlug}`,
    `Amount: ${formattedAmount}`,
    `Paid at: ${paidAtLabel}`,
    `Stripe session: ${input.stripeSessionId}`,
    "",
    `Client name: ${input.clientName}`,
    `Client email: ${input.clientEmail}`,
    "",
    `Admin products: ${input.adminProductsUrl}`,
    "",
    "Reply to this email to send the client their recorded video / module access link.",
  ].join("\n");

  const html = `
    <p><strong>New shop purchase (recorded module)</strong></p>
    <ul>
      <li><strong>Product:</strong> ${escapeHtml(input.productTitle)}</li>
      <li><strong>Amount:</strong> ${escapeHtml(formattedAmount)}</li>
      <li><strong>Paid at:</strong> ${escapeHtml(paidAtLabel)}</li>
    </ul>
    <p><strong>Client</strong></p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(input.clientName)}</li>
      <li><strong>Email:</strong> ${escapeHtml(input.clientEmail)}</li>
    </ul>
    <p><a href="${escapeHtml(input.adminProductsUrl)}">Open products in admin</a></p>
    <p><em>Reply to this email to send the client their video or download link.</em></p>
  `;

  return { subject, html, text };
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
