import type { NextRequest } from "next/server";
import { jsonOk, withAdmin } from "@/lib/api/utils";
import {
  BlogPost,
  Booking,
  ContactSubmission,
  FAQ,
  GalleryImage,
  Page,
  ReviewSubmission,
  Service,
  Testimonial,
} from "@/models";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const [
      pages,
      services,
      bookings,
      pendingBookings,
      contactSubmissions,
      reviewSubmissions,
      testimonials,
      blogPosts,
      galleryImages,
      faqs,
    ] = await Promise.all([
      Page.countDocuments(),
      Service.countDocuments({ status: "active" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ["hold", "pending_payment"] } }),
      ContactSubmission.countDocuments({ status: "new" }),
      ReviewSubmission.countDocuments({ status: "pending" }),
      Testimonial.countDocuments({ status: "approved" }),
      BlogPost.countDocuments({ status: "published" }),
      GalleryImage.countDocuments({ status: "published" }),
      FAQ.countDocuments({ status: "published" }),
    ]);

    const upcomingBookings = await Booking.find({
      status: { $in: ["confirmed", "pending_payment"] },
      startUtc: { $gte: new Date() },
    })
      .sort({ startUtc: 1 })
      .limit(5)
      .select("referenceNumber serviceTitle startUtc status client.name")
      .lean();

    return jsonOk({
      stats: {
        pages,
        services,
        bookings,
        pendingBookings,
        contactSubmissions,
        reviewSubmissions,
        testimonials,
        blogPosts,
        galleryImages,
        faqs,
      },
      upcomingBookings: upcomingBookings.map((booking) => ({
        ...booking,
        id: String(booking._id),
      })),
    });
  });
}
