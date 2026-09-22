import { revalidatePath } from "next/cache";

/** Header, footer, nav, and settings that use the root layout. */
export function revalidateSiteLayout(): void {
  revalidatePath("/", "layout");
}

export function revalidatePublicPage(route: string, systemKey?: string): void {
  const path = route.startsWith("/") ? route : `/${route}`;
  revalidatePath(path);
  if (path === "/" || systemKey === "home") {
    revalidateSiteLayout();
  }
}

export function revalidateServicePaths(slug: string, previousSlug?: string): void {
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/work-with-me");
  revalidatePath("/booking");
  revalidateSiteLayout();
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/services/${previousSlug}`);
  }
}

export function revalidateShopPaths(productSlug?: string): void {
  revalidatePath("/shop");
  if (productSlug) {
    revalidatePath(`/shop/${productSlug}`);
  }
  revalidateSiteLayout();
}

export function revalidatePricingPaths(): void {
  revalidatePath("/pricing");
  revalidateSiteLayout();
}

export function revalidateContentPaths(): void {
  revalidatePath("/faqs");
  revalidatePath("/testimonials");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidateSiteLayout();
}
