import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  themeVariant?: string;
  layoutVariant?: string;
  className?: string;
  children?: React.ReactNode;
  headerClassName?: string;
  containerClassName?: string;
};

export function SectionShell({
  id,
  eyebrow,
  heading,
  body,
  themeVariant = "default",
  layoutVariant = "default",
  className,
  children,
  headerClassName,
  containerClassName,
}: SectionShellProps) {
  const themeClass =
    themeVariant === "burgundy"
      ? "theme-burgundy texture-velvet texture-grain"
      : themeVariant === "parchment"
        ? "theme-parchment texture-grain"
        : themeVariant === "ivory"
          ? "theme-ivory"
          : "";

  return (
    <section
      id={id}
      data-layout={layoutVariant}
      className={cn("section-padding", themeClass, className)}
    >
      <div className={cn("site-container", containerClassName)}>
        {(eyebrow || heading || body) && (
          <header className={cn("mb-10 md:mb-14 max-w-3xl", headerClassName)}>
            {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
            {heading ? (
              <h2 className="display-heading text-3xl md:text-4xl lg:text-5xl text-balance">
                {heading}
              </h2>
            ) : null}
            {body ? <RichText html={body} className="mt-5" /> : null}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
