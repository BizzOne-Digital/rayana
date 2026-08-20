import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function getSecret(): string {
  const secret = process.env.AUTH_SECRET ?? process.env.BOOKING_TOKEN_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required for booking tokens");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createRescheduleToken(bookingId: string, expiresAt?: Date): {
  token: string;
  expiresAt: Date;
} {
  const expiry = expiresAt ?? new Date(Date.now() + TOKEN_TTL_MS);
  const payload = `${bookingId}:${expiry.getTime()}`;
  const signature = sign(payload);
  return {
    token: `${payload}:${signature}`,
    expiresAt: expiry,
  };
}

export function verifyRescheduleToken(token: string): {
  valid: boolean;
  bookingId?: string;
  expiresAt?: Date;
  reason?: string;
} {
  const parts = token.split(":");
  if (parts.length !== 3) {
    return { valid: false, reason: "Malformed token" };
  }

  const [bookingId, expiryRaw, signature] = parts;
  const payload = `${bookingId}:${expiryRaw}`;
  const expected = sign(payload);

  const validSignature =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!validSignature) {
    return { valid: false, reason: "Invalid token signature" };
  }

  const expiresAt = new Date(Number(expiryRaw));
  if (Number.isNaN(expiresAt.getTime())) {
    return { valid: false, reason: "Invalid token expiry" };
  }

  if (expiresAt.getTime() < Date.now()) {
    return { valid: false, reason: "Token expired" };
  }

  return { valid: true, bookingId, expiresAt };
}
