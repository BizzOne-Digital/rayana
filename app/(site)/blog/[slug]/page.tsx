import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/site/MediaImage";
import { RichText } from "@/components/ui/RichText";
import { getPublicBlogPost, getPublicBlogPosts, getPublicSettings } from "@/lib/data/public";
import { SEED_IMAGES } from "@/lib/data/seed-images";
import { buildMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getPublicBlogPost(slug),
    getPublicSettings(),
  ]);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    seo: post.seo,
    settings,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);
  if (!post) notFound();

  const extras = [
    SEED_IMAGES.teaching,
    SEED_IMAGES.landscape,
    SEED_IMAGES.hands,
    SEED_IMAGES.session,
    SEED_IMAGES.workshop,
  ];

  return (
    <article>
      <section className="section-padding texture-parchment">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="eyebrow mb-4">{post.categories.join(" · ") || "Reflections"}</p>
            <h1 className="display-heading text-4xl md:text-5xl text-balance">{post.title}</h1>
            <p className="mt-4 text-sm text-muted-stone">
              {post.author} · {post.readingTimeMinutes} min read
            </p>
          </div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] shadow-soft">
            <MediaImage image={post.heroImage ?? SEED_IMAGES.nature} priority sizes="(max-width: 1024px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_0.35fr]">
          <RichText html={post.body} className="max-w-none" />
          <aside className="space-y-4">
            {extras.map((image) => (
              <div key={image.url} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
                <MediaImage image={image} sizes="320px" />
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="site-container">
          <Link href="/blog" className="btn btn-secondary">
            Back to Reflections
          </Link>
        </div>
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await getPublicBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
