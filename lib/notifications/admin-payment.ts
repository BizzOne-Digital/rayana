import { sendEmail } from "@/lib/email";
import {
  adminBookingPaidNotificationEmail,
  adminShopPurchaseNotificationEmail,
} from "@/lib/email/templates";
import { getSiteSettings } from "@/lib/repositories/settings";
import { AuditLog, Booking, Product, type IBooking } from "@/models";
import type Stripe from "stripe";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function resolveAdminNotificationEmail(): Promise<string | null> {
  const settings = await getSiteSettings();
  const fromSettings = settings?.contact?.email?.trim();
  if (fromSettings) return fromSettings;
  const envAdmin = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  if (envAdmin) return envAdmin;
  return process.env.SMTP_FROM?.trim() ?? null;
}

export async function notifyAdminOfPaidBooking(
  referenceNumber: string,
): Promise<{ sent: boolean; skipped?: boolean }> {
  const booking = await Booking.findOne({
    referenceNumber,
    "payment.status": "paid",
  });

  if (!booking) {
    return { sent: false, skipped: true };
  }

  if (booking.payment.adminNotifiedAt) {
    return { sent: false, skipped: true };
  }

  const adminEmail = await resolveAdminNotificationEmail();
  if (!adminEmail) {
    return { sent: false, skipped: true };
  }

  const paidAt = booking.payment.paidAt ?? new Date();
  const template = adminBookingPaidNotificationEmail({
    referenceNumber: booking.referenceNumber,
    serviceTitle: booking.serviceTitle,
    serviceSlug: booking.serviceSlug,
    deliveryMode: booking.deliveryMode,
    clientName: booking.client.name,
    clientEmail: booking.client.email,
    clientPhone: booking.client.phone,
    clientQuestions: booking.client.questions,
    clientNotes: booking.client.notes,
    recordingRequested: booking.client.recordingRequested,
    startLocal: booking.startLocal,
    endLocal: booking.endLocal,
    clientTimeZone: booking.clientTimeZone,
    hostTimeZone: booking.hostTimeZone,
    amount: booking.payment.amount,
    currency: booking.payment.currency,
    paymentMethod: booking.payment.method,
    paidAt,
    adminBookingsUrl: `${siteUrl()}/admin/bookings`,
  });

  const result = await sendEmail({
    to: adminEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: booking.client.email,
  });

  if (result.sent) {
    booking.payment.adminNotifiedAt = new Date();
    await booking.save();
  }

  return { sent: result.sent, skipped: result.skipped };
}

export async function notifyAdminOfShopPurchase(
  session: Stripe.Checkout.Session,
  productSlug: string,
): Promise<{ sent: boolean; skipped?: boolean }> {
  const duplicate = await AuditLog.findOne({
    action: "payment",
    entityType: "ShopPurchase",
    "metadata.stripeSessionId": session.id,
  }).lean();

  if (duplicate) {
    return { sent: false, skipped: true };
  }

  const adminEmail = await resolveAdminNotificationEmail();
  if (!adminEmail) {
    return { sent: false, skipped: true };
  }

  const product = await Product.findOne({ slug: productSlug }).lean();
  const clientEmail =
    session.customer_details?.email ?? session.customer_email ?? "";
  if (!clientEmail) {
    return { sent: false, skipped: true };
  }

  const clientName =
    session.customer_details?.name?.trim() ||
    clientEmail.split("@")[0] ||
    "Customer";

  const amountTotal = session.amount_total ?? 0;
  const currency = (session.currency ?? "cad").toUpperCase();
  const amount =
    currency.toLowerCase() === "jpy"
      ? amountTotal
      : amountTotal / 100;

  const template = adminShopPurchaseNotificationEmail({
    productTitle: product?.name ?? productSlug,
    productSlug,
    clientName,
    clientEmail,
    amount,
    currency,
    paidAt: new Date(),
    stripeSessionId: session.id,
    adminProductsUrl: `${siteUrl()}/admin/products`,
  });

  const result = await sendEmail({
    to: adminEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: clientEmail,
  });

  if (result.sent) {
    await AuditLog.create({
      action: "payment",
      entityType: "ShopPurchase",
      summary: `Admin notified for shop purchase ${productSlug}`,
      metadata: {
        stripeSessionId: session.id,
        productSlug,
        clientEmail,
      },
    });
  }

  return { sent: result.sent, skipped: result.skipped };
}

export async function notifyAdminOfPaidBookingDoc(
  booking: IBooking,
): Promise<{ sent: boolean; skipped?: boolean }> {
  return notifyAdminOfPaidBooking(booking.referenceNumber);
}
