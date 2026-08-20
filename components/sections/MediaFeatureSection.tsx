import Link from "next/link";
import { ClipReveal } from "@/components/animations/ClipReveal";
import { StaggerReveal } from "@/components/animations/StaggerReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { SectionShell } from "@/components/ui/SectionShell";
import type { SectionProps } from "@/lib/sections/registry";

export function MediaFeatureSection({ section, context }: SectionProps) {
  const settings = section.settings ?? {};
  const contentType = settings.contentType ?? "blog";
  const posts =
    contentType === "media" ? (context?.mediaPosts ?? []) : (context?.blogPosts ?? []);
  const accent = section.images?.[0];
  const isEditorial =
    section.layoutVariant === "editorial" || section.id?.startsWith("home-");

  if (settings.emptyState && posts.length === 0) {
    return (
      <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
        <p className="text-muted-stone">New offerings arriving soon.</p>
      </SectionShell>
    );
  }

  if (isEditorial) {
    return (
      <section id={section.id} className="home-journal section-padding texture-parchment texture-grain">
        <div className="site-container">
          {section.eyebrow ? <p className="home-eyebrow-dark mb-5">{section.eyebrow}</p> : null}
          <TextReveal text={section.heading ?? ""} as="h2" className="home-section-heading mb-4" />
          <RichText html={section.body} className="home-body mb-10 max-w-2xl" />

          <StaggerReveal className="grid gap-6 md:grid-cols-2" stagger={0.1}>
            {posts.map((post) => {
              const href = contentType === "media" ? `/media#${post.slug}` : `/blog/${post.slug}`;
              const image =
                contentType === "blog"
                  ? (post as { heroImage?: { url: string; alt?: string } }).heroImage
                  : (post as { thumbnail?: { url: string; alt?: string } }).thumbnail;

              return (
                <Link
                  key={post.slug}
                  href={href}
                  className="home-journal-card group block overflow-hidden rounded-[1.5rem] border border-border/70 bg-warm-ivory transition-all duration-500 hover:-translate-y-1 hover:border-champagne-gold/30 hover:shadow-soft"
                >
                  {image ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <MediaImage
                        image={{
                          url: image.url,
                          alt: image.alt ?? post.title,
                          width: 1200,
                          height: 750,
                        }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        imageClassName="transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="p-6 md:p-7">
                    <p className="home-eyebrow-dark mb-2 text-[0.55rem]">Journal</p>
                    <h3 className="font-display text-2xl text-velvet-night transition-colors group-hover:text-heart-wine md:text-3xl">
                      {post.title}
                    </h3>
                    {"excerpt" in post && post.excerpt ? (
                      <p className="mt-3 text-sm leading-relaxed text-muted-stone">{post.excerpt}</p>
                    ) : null}
                    <span className="mt-5 inline-block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-heart-wine">
                      Read →
                    </span>
                  </div>
                </Link>
              );
            })}
          </StaggerReveal>

          {accent ? (
            <ClipReveal direction="up" className="relative mt-10 aspect-[21/8] overflow-hidden rounded-[1.5rem]">
              <MediaImage image={accent} sizes="100vw" />
            </ClipReveal>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <SectionShell id={section.id} heading={section.heading} eyebrow={section.eyebrow}>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="editorial-card block p-6">
            <h3 className="font-display text-2xl">{post.title}</h3>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}
