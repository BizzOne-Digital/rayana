import type { Metadata } from "next";
import Link from "next/link";
import { PageRenderer } from "@/components/sections/PageRenderer";
import { MediaImage } from "@/components/site/MediaImage";
import { buildSectionContext } from "@/lib/data/page-context";
import { getPublicBlogPosts, getPublicPage, getPublicSettings } from "@/lib/data/public";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPage("blog"),
    getPublicSettings(),
  ]);
  return buildMetadata({ title: page?.title, seo: page?.seo, settings, path: "/blog" });
}

export default async function BlogPage() {
  const [page, context, posts] = await Promise.all([
    getPublicPage("blog"),
    buildSectionContext(),
    getPublicBlogPosts(12),
  ]);

  if (!page) return null;

  return (
    <>
      <PageRenderer sections={page.sections} context={context} />
      <section className="section-padding pt-0">
        <div className="site-container grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <article key={post.slug} className="editorial-card overflow-hidden">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <MediaImage
                    image={post.heroImage ?? SEED_IMAGES.nature}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index < 3}
                  />
                </div>
                <div className="p-6">
                  <p className="eyebrow mb-2">{post.categories[0] ?? "Journal"}</p>
                  <h2 className="font-display text-2xl text-velvet-night">{post.title}</h2>
                  <p className="mt-2 text-sm text-muted-stone">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
