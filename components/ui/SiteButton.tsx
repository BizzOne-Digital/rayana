import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Button as ButtonType } from "@/models/shared";

type SiteButtonProps = {
  button: ButtonType;
  className?: string;
  variant?: "default" | "hero";
};

export function SiteButton({ button, className, variant = "default" }: SiteButtonProps) {
  const variantClass =
    variant === "hero"
      ? button.variant === "secondary"
        ? "btn-hero-secondary"
        : "btn-hero-primary"
      : button.variant === "secondary"
        ? "btn-secondary"
        : button.variant === "ghost"
          ? "btn-ghost"
          : button.variant === "link"
            ? "btn-link"
            : "btn-primary";

  return (
    <Link
      href={button.href}
      className={cn("btn", variantClass, className)}
      target={button.openInNewTab ? "_blank" : undefined}
      rel={button.openInNewTab ? "noopener noreferrer" : undefined}
    >
      {button.label}
    </Link>
  );
}

type SiteButtonsProps = {
  buttons?: ButtonType[];
  className?: string;
  variant?: "default" | "hero";
};

export function SiteButtons({ buttons, className, variant = "default" }: SiteButtonsProps) {
  if (!buttons?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-3", variant === "hero" && "justify-start", className)}>
      {buttons.map((button) => (
        <SiteButton
          key={`${button.href}-${button.label}`}
          button={button}
          variant={variant}
        />
      ))}
    </div>
  );
}
