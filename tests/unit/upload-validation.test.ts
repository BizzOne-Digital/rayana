import { describe, expect, it } from "vitest";
import { validateMimeType } from "@/lib/storage/local";

describe("upload MIME validation", () => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];

  it.each(allowed)("accepts %s", (mimeType) => {
    expect(() => validateMimeType(mimeType)).not.toThrow();
  });

  it("rejects unsupported MIME types", () => {
    const rejected = [
      "application/pdf",
      "text/plain",
      "image/svg+xml",
      "application/octet-stream",
      "video/mp4",
    ];

    for (const mimeType of rejected) {
      expect(() => validateMimeType(mimeType)).toThrow(
        `Unsupported file type: ${mimeType}`,
      );
    }
  });

  it("rejects empty or spoofed MIME strings", () => {
    expect(() => validateMimeType("")).toThrow("Unsupported file type: ");
    expect(() => validateMimeType("IMAGE/JPEG")).toThrow(
      "Unsupported file type: IMAGE/JPEG",
    );
  });
});
