import { getSiteBaseUrl } from "@/lib/seo/metadata";
import { SITE_DEFAULT_DESCRIPTION } from "@/lib/seo/site-seo";
import type { PublicSettings } from "@/lib/sections/types";

type SiteJsonLdProps = {
  settings: PublicSettings;
};

export function SiteJsonLd({ settings }: SiteJsonLdProps) {
  const base = getSiteBaseUrl();
  const name = settings.brand.name;
  const description = settings.brand.tagline || SITE_DEFAULT_DESCRIPTION;

  const graph = [
    {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name,
      url: base,
      logo: `${base}${settings.seo.defaultOgImage?.url ?? "/images/seed/portrait-1.svg"}`,
      description,
      email: settings.contact.email,
      telephone: settings.contact.e164Phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Richmond",
        addressRegion: "BC",
        addressCountry: "CA",
      },
      sameAs: [
        settings.social.facebook,
        settings.social.instagram,
        settings.social.youtube,
        settings.social.linktree,
      ].filter(Boolean),
    },
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: base,
      name,
      description,
      publisher: { "@id": `${base}/#organization` },
      inLanguage: "en-CA",
    },
    {
      "@type": "Person",
      "@id": `${base}/#person`,
      name: "Rayana De Silva",
      jobTitle: "Spiritual mentor & consultant",
      worksFor: { "@id": `${base}/#organization` },
      url: `${base}/about`,
      image: `${base}${settings.seo.defaultOgImage?.url ?? "/images/seed/portrait-1.svg"}`,
    },
  ];

  const payload = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
