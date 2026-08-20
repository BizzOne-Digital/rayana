import type { TypedPageSection } from "@/lib/sections/types";
import type {
  PublicBlogPost,
  PublicFAQ,
  PublicGalleryImage,
  PublicMediaPost,
  PublicPricingPlan,
  PublicService,
  PublicSettings,
  PublicTestimonial,
} from "@/lib/sections/types";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { SplitStorySection } from "@/components/sections/SplitStorySection";
import { RichTextSection } from "@/components/sections/RichTextSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { EditorialQuoteSection } from "@/components/sections/EditorialQuoteSection";
import { ImagePairSection } from "@/components/sections/ImagePairSection";
import { ImageMarqueeSection } from "@/components/sections/ImageMarqueeSection";
import { ImageMosaicSection } from "@/components/sections/ImageMosaicSection";
import { NumberedStepsSection } from "@/components/sections/NumberedStepsSection";
import { IconListSection } from "@/components/sections/IconListSection";
import { ServiceShowcaseSection } from "@/components/sections/ServiceShowcaseSection";
import { PricingSpotlightSection } from "@/components/sections/PricingSpotlightSection";
import { TestimonialSliderSection } from "@/components/sections/TestimonialSliderSection";
import { FaqPreviewSection } from "@/components/sections/FaqPreviewSection";
import { GalleryStripSection } from "@/components/sections/GalleryStripSection";
import { MediaFeatureSection } from "@/components/sections/MediaFeatureSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ContactPanelSection } from "@/components/sections/ContactPanelSection";
import { BookingCTASection } from "@/components/sections/BookingCTASection";
import { UnknownSection } from "@/components/sections/UnknownSection";

export type SectionContext = {
  services?: PublicService[];
  testimonials?: PublicTestimonial[];
  faqs?: PublicFAQ[];
  pricingPlans?: PublicPricingPlan[];
  blogPosts?: PublicBlogPost[];
  mediaPosts?: PublicMediaPost[];
  galleryImages?: PublicGalleryImage[];
  settings?: PublicSettings;
};

export type SectionProps = {
  section: TypedPageSection;
  context?: SectionContext;
};

export type SectionComponent = React.ComponentType<SectionProps>;

export const sectionRegistry: Record<string, SectionComponent> = {
  hero: HeroSection,
  intro: IntroSection,
  splitStory: SplitStorySection,
  richText: RichTextSection,
  manifesto: ManifestoSection,
  editorialQuote: EditorialQuoteSection,
  imagePair: ImagePairSection,
  imageMarquee: ImageMarqueeSection,
  imageMosaic: ImageMosaicSection,
  numberedSteps: NumberedStepsSection,
  iconList: IconListSection,
  serviceShowcase: ServiceShowcaseSection,
  pricingSpotlight: PricingSpotlightSection,
  testimonialSlider: TestimonialSliderSection,
  faqPreview: FaqPreviewSection,
  galleryStrip: GalleryStripSection,
  mediaFeature: MediaFeatureSection,
  newsletter: NewsletterSection,
  contactPanel: ContactPanelSection,
  bookingCTA: BookingCTASection,
};

export function resolveSectionComponent(type: string): SectionComponent {
  return sectionRegistry[type] ?? UnknownSection;
}
