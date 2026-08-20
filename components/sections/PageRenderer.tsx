import { resolveSectionComponent } from "@/lib/sections/registry";
import type { SectionContext } from "@/lib/sections/registry";
import type { TypedPageSection } from "@/lib/sections/types";

type PageRendererProps = {
  sections: TypedPageSection[];
  context?: SectionContext;
};

export function PageRenderer({ sections, context }: PageRendererProps) {
  const enabled = sections
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      {enabled.map((section) => {
        const Component = resolveSectionComponent(section.type);
        return <Component key={section.id} section={section} context={context} />;
      })}
    </>
  );
}
