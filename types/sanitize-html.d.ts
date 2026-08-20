declare module "sanitize-html" {
  export interface IOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowedSchemes?: string[];
    allowedSchemesByTag?: Record<string, string[]>;
    [key: string]: unknown;
  }

  const sanitizeHtml: {
    (dirty: string, options?: IOptions): string;
    defaults: {
      allowedTags: string[];
      allowedAttributes: Record<string, string[]>;
    };
  };

  export default sanitizeHtml;
}
