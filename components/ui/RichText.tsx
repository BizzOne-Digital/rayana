import { sanitizeRichText } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

type RichTextProps = {
  html?: string;
  className?: string;
};

export function RichText({ html, className }: RichTextProps) {
  if (!html) return null;
  return (
    <div
      className={cn("prose-editorial", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
    />
  );
}
