import Image from "next/image";
import Link from "next/link";
import { BOOK_CONSULTATION_LABEL, SPIRITUAL_DISCLAIMER_TEXT } from "@/lib/data/site-copy";
import type { PublicSettings } from "@/lib/sections/types";

type SiteFooterProps = {
  settings: PublicSettings;
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M14 8.5h2.5L16 12h-2v8h-3v-8H9v-3.5h2V9c0-2.2 1.3-3.5 3.3-3.5H16v3z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M21.8 8.001a2.5 2.5 0 0 0-1.76-1.77C18.36 6 12 6 12 6s-6.36 0-8.04.231A2.5 2.5 0 0 0 2.2 8.001 26 26 0 0 0 2 12a26 26 0 0 0 .2 3.999 2.5 2.5 0 0 0 1.76 1.77C5.64 18 12 18 12 18s6.36 0 8.04-.231a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}

const NAV_LINKS = [
  ["/", "Home"],
  ["/about", "About"],
  ["/testimonials", "Testimonials"],
  ["/pricing", "Pricing"],
  ["/faqs", "FAQ"],
  ["/contact", "Contact"],
] as const;

const SERVICE_LINKS = [
  ["/services/private-consultations", "Private Consultations"],
  ["/services/private-consultations#wisdom-mentoring", "Wisdom Mentoring"],
  ["/services/teachings-courses", "Courses & Teachings"],
  ["/shop", "Shop"],
  ["/services/workshops-retreats", "Workshops & Retreats"],
  ["/pricing", "Pricing"],
  ["/booking", BOOK_CONSULTATION_LABEL],
] as const;

const RESOURCE_LINKS = [
  ["/blog", "Reflections"],
  ["/media", "Media"],
  ["/faqs", "FAQ"],
  ["/write-a-review", "Write a Review"],
] as const;

type SocialLink = {
  href: string;
  label: string;
  Icon: () => React.JSX.Element;
};

function ConnectLinks({ settings }: { settings: PublicSettings }) {
  const socialLinks: SocialLink[] = [
    { href: settings.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.social.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((item) => item.href?.trim()) as SocialLink[];

  if (socialLinks.length) {
    return (
      <ul className="mt-4 space-y-3">
        {socialLinks.map(({ href, label, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mockup-footer-connect-row"
            >
              <span className="mockup-footer-social">
                <Icon />
              </span>
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  const whatsApp = settings.contact.whatsApp?.replace(/\D/g, "");

  return (
    <ul className="mt-4 space-y-2.5 text-sm">
      <li>
        <Link href="/contact" className="mockup-footer-link">
          Contact Rayana
        </Link>
      </li>
      {settings.contact.email ? (
        <li>
          <a href={`mailto:${settings.contact.email}`} className="mockup-footer-link">
            Email
          </a>
        </li>
      ) : null}
      {whatsApp ? (
        <li>
          <a
            href={`https://wa.me/${whatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mockup-footer-link"
          >
            WhatsApp
          </a>
        </li>
      ) : null}
      <li>
        <Link href="/write-a-review" className="mockup-footer-link">
          Write a Review
        </Link>
      </li>
    </ul>
  );
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mockup-footer w-full max-w-full overflow-x-clip">
      <div className="site-container pb-8 pt-16 md:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_repeat(4,minmax(0,1fr))] lg:gap-12">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <div className="relative mb-6 h-16 w-44">
              <Image
                src="/brand/rayana-logo.png"
                alt="Rayana De Silva — Heart Matters"
                fill
                sizes="176px"
                className="object-contain object-left"
              />
            </div>
            <p className="max-w-sm break-words text-sm leading-relaxed text-rose-mist/85">
              {settings.brand.footerStatement}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-rose-mist/90">
              {settings.contact.email ? (
                <li>
                  <a href={`mailto:${settings.contact.email}`} className="break-all hover:text-warm-ivory">
                    {settings.contact.email}
                  </a>
                </li>
              ) : null}
              {settings.contact.displayPhone ? (
                <li>
                  <a
                    href={`tel:${settings.contact.e164Phone || settings.contact.displayPhone}`}
                    className="hover:text-warm-ivory"
                  >
                    {settings.contact.displayPhone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <p className="mockup-footer-heading">Navigate</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="mockup-footer-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mockup-footer-heading">Services</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICE_LINKS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="mockup-footer-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mockup-footer-heading">Resources</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {RESOURCE_LINKS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="mockup-footer-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mockup-footer-heading">Connect</p>
            <ConnectLinks settings={settings} />
          </div>
        </div>

        <div className="mockup-footer-divider my-10" />

        <div className="mx-auto max-w-3xl text-center">
          <div className="relative mx-auto mb-6 h-16 w-44">
            <Image
              src="/brand/rayana-logo.png"
              alt="Rayana De Silva — Heart Matters"
              fill
              sizes="176px"
              className="object-contain object-center"
            />
          </div>
          <p className="mockup-footer-heading">Disclaimer</p>
          <p className="mt-4 text-sm leading-relaxed text-rose-mist/80">{SPIRITUAL_DISCLAIMER_TEXT}</p>
          <Link href="/disclaimer" className="mockup-footer-link mt-4 inline-block text-xs">
            Read full disclaimer
          </Link>
        </div>

        <div className="mockup-footer-divider my-10" />

        <div className="flex flex-col gap-4 text-xs text-rose-mist/70 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>
            © {year} {settings.footer.copyrightName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/disclaimer" className="hover:text-warm-ivory">
              Disclaimer
            </Link>
            <Link href="/privacy" className="hover:text-warm-ivory">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-warm-ivory">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
