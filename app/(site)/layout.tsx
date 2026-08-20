import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { IntroWrapper } from "@/components/animations/IntroWrapper";
import { PageTransitionProvider } from "@/components/animations/PageTransitionProvider";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteMain } from "@/components/site/SiteMain";
import { SiteHeader } from "@/components/site/SiteHeader";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicSettings } from "@/lib/data/public";
import { buildMetadata } from "@/lib/seo/metadata";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return buildMetadata({ settings, path: "/" });
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();

  // Warm shared context cache for nested server components
  await buildSectionContext();

  return (
    <div
      className={`${cinzel.variable} ${cormorant.variable} ${manrope.variable} flex min-h-dvh w-full max-w-full flex-col overflow-x-clip bg-background text-foreground`}
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SmoothScroll>
        <IntroWrapper enabled={settings.header.showIntroOnFirstVisit} brandName={settings.brand.name}>
          <SiteHeader settings={settings} />
          <PageTransitionProvider>
            <SiteMain>{children}</SiteMain>
          </PageTransitionProvider>
          <SiteFooter settings={settings} />
        </IntroWrapper>
      </SmoothScroll>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
