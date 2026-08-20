import type { SectionContext } from "@/lib/sections/registry";
import {
  getPublicBlogPosts,
  getPublicFaqs,
  getPublicGalleryImages,
  getPublicMediaPosts,
  getPublicPricingPlans,
  getPublicServices,
  getPublicSettings,
  getPublicTestimonials,
} from "@/lib/data/public";

export async function buildSectionContext(
  overrides: Partial<SectionContext> = {},
): Promise<SectionContext> {
  const [
    settings,
    services,
    testimonials,
    faqs,
    pricingPlans,
    blogPosts,
    mediaPosts,
    galleryImages,
  ] = await Promise.all([
    getPublicSettings(),
    getPublicServices(),
    getPublicTestimonials(),
    getPublicFaqs(),
    getPublicPricingPlans(),
    getPublicBlogPosts(6),
    getPublicMediaPosts(6),
    getPublicGalleryImages(),
  ]);

  return {
    settings,
    services,
    testimonials,
    faqs,
    pricingPlans,
    blogPosts,
    mediaPosts,
    galleryImages,
    ...overrides,
  };
}
