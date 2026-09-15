import type { NextRequest } from "next/server";
import { subDays, format } from "date-fns";
import { jsonOk, withAdmin } from "@/lib/api/utils";
import { isDbConfigured } from "@/lib/db/connect";
import type { DashboardStats, IntegrationHealthItem } from "@/lib/admin/types";
import {
  BlogPost,
  Booking,
  ContactSubmission,
  GalleryImage,
  Page,
  Product,
  ReviewSubmission,
  Service,
  Testimonial,
} from "@/models";

function buildIntegrations(): IntegrationHealthItem[] {
  const mongoOk = isDbConfigured();
  const smtpOk = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
  const stripeOk = Boolean(process.env.STRIPE_SECRET_KEY);

  return [
    {
      key: "mongodb",
      label: "MongoDB",
      status: mongoOk ? "healthy" : "offline",
      message: mongoOk ? "Connected" : "MONGODB_URI is not configured",
    },
    {
      key: "smtp",
      label: "Email (SMTP)",
      status: smtpOk ? "healthy" : "degraded",
      message: smtpOk ? "SMTP configured" : "SMTP not configured — contact emails may fail",
    },
    {
      key: "stripe",
      label: "Stripe",
      status: stripeOk ? "healthy" : "degraded",
      message: stripeOk ? "Stripe secret key present" : "Stripe not configured",
    },
    {
      key: "uploads",
      label: "Image storage",
      status: mongoOk ? "healthy" : "offline",
      message: mongoOk
        ? "Uploads stored in MongoDB (serverless-safe)"
        : "Database required for image uploads",
    },
  ];
}

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const [
      pages,
      services,
      bookingsTotal,
      pendingBookings,
      upcomingBookings,
      contactSubmissions,
      reviewSubmissions,
      testimonialsPending,
      blogPosts,
      galleryImages,
      products,
    ] = await Promise.all([
      Page.countDocuments(),
      Service.countDocuments({ status: "active" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ["hold", "pending_payment"] } }),
      Booking.countDocuments({
        status: { $in: ["confirmed", "pending_payment"] },
        startUtc: { $gte: new Date() },
      }),
      ContactSubmission.countDocuments({ status: "new" }),
      ReviewSubmission.countDocuments({ status: "pending" }),
      Testimonial.countDocuments({ status: "pending" }),
      BlogPost.countDocuments({ status: "published" }),
      GalleryImage.countDocuments({ status: "published" }),
      Product.countDocuments({ visibility: "published" }),
    ]);

    const paidBookings = await Booking.find({
      "payment.status": "paid",
    })
      .select("payment.amount payment.currency createdAt")
      .lean();

    const revenue = paidBookings.reduce(
      (sum, booking) => sum + Number(booking.payment?.amount ?? 0),
      0,
    );

    const since = subDays(new Date(), 29);
    const recentBookings = await Booking.find({
      createdAt: { $gte: since },
    })
      .select("createdAt payment.amount payment.status")
      .lean();

    const chartMap = new Map<string, { date: string; count: number; revenue: number }>();
    for (let i = 0; i < 30; i += 1) {
      const day = format(subDays(new Date(), 29 - i), "MMM d");
      chartMap.set(day, { date: day, count: 0, revenue: 0 });
    }

    for (const booking of recentBookings) {
      const day = format(new Date(booking.createdAt), "MMM d");
      const entry = chartMap.get(day);
      if (!entry) continue;
      entry.count += 1;
      if (booking.payment?.status === "paid") {
        entry.revenue += Number(booking.payment.amount ?? 0);
      }
    }

    const stats: DashboardStats = {
      pages,
      services,
      bookings: {
        total: bookingsTotal,
        pending: pendingBookings,
        upcoming: upcomingBookings,
        revenue,
      },
      submissions: {
        contact: contactSubmissions,
        reviews: reviewSubmissions,
        testimonialsPending,
      },
      content: {
        blogPosts,
        galleryImages,
        products,
      },
      integrations: buildIntegrations(),
      bookingChart: Array.from(chartMap.values()),
    };

    return jsonOk(stats);
  });
}
