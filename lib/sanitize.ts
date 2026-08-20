import sanitizeHtml from "sanitize-html";

type SanitizeOptions = {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedSchemes?: string[];
  allowedSchemesByTag?: Record<string, string[]>;
  [key: string]: unknown;
};

const DEFAULT_ALLOWED_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  "img",
  "h1",
  "h2",
  "h3",
  "figure",
  "figcaption",
  "blockquote",
  "iframe",
];

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  ...sanitizeHtml.defaults.allowedAttributes,
  a: ["href", "name", "target", "rel", "class"],
  img: ["src", "alt", "title", "width", "height", "loading", "class"],
  iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
  "*": ["class", "id"],
};

export type { SanitizeOptions };

export function sanitizeRichText(
  html: string,
  options: SanitizeOptions = {},
): string {
  return sanitizeHtml(html, {
    allowedTags: DEFAULT_ALLOWED_TAGS,
    allowedAttributes: DEFAULT_ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      iframe: ["https"],
    },
    ...options,
  });
}

export function sanitizePlainText(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}
