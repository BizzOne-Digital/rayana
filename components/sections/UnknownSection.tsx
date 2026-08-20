import type { SectionProps } from "@/lib/sections/registry";

export function UnknownSection({ section }: SectionProps) {
  if (process.env.NODE_ENV === "development") {
    return (
      <section className="section-padding border-y border-dashed border-heart-wine/30 bg-rose-mist/20">
        <div className="site-container text-sm text-heart-wine">
          Unknown section type: <code>{section.type}</code>
        </div>
      </section>
    );
  }
  return null;
}
