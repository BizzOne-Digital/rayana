import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import type { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/models";
import type { AUDIT_ACTIONS } from "@/lib/constants";
import {
  ForbiddenError,
  UnauthorizedError,
  requireAdmin,
} from "@/lib/auth/session";

type AuditAction = (typeof AUDIT_ACTIONS)[number];

export type ApiErrorBody = {
  error: string;
  details?: unknown;
};

export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonCreated<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

export function jsonError(
  message: string,
  status = 400,
  details?: unknown,
): NextResponse {
  const body: ApiErrorBody = { error: message };
  if (details !== undefined) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

export function getClientIp(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined
  );
}

export async function parseJsonBody<T extends z.ZodType>(
  request: NextRequest,
  schema: T,
): Promise<
  | { success: true; data: z.infer<T> }
  | { success: false; response: NextResponse }
> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { success: false, response: jsonError("Invalid JSON body", 400) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      response: jsonError("Validation failed", 422, parsed.error.flatten()),
    };
  }

  return { success: true, data: parsed.data };
}

export async function withAdmin<T>(
  request: NextRequest,
  handler: (session: Session) => Promise<NextResponse>,
  options?: { roles?: Array<"super_admin" | "editor"> },
): Promise<NextResponse> {
  try {
    await connectDB();
    const session = await requireAdmin(options);
    return await handler(session);
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return jsonError(error.message, 401);
    }
    if (error instanceof ForbiddenError) {
      return jsonError(error.message, 403);
    }
    console.error("[api]", error);
    return jsonError("Internal server error", 500);
  }
}

export async function withPublicHandler(
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    await connectDB();
    return await handler();
  } catch (error) {
    console.error("[api]", error);
    return jsonError("Internal server error", 500);
  }
}

export async function logAudit(input: {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  actorId?: string;
  actorEmail?: string | null;
  summary: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  request?: NextRequest;
}): Promise<void> {
  await AuditLog.create({
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    actorId: input.actorId,
    actorEmail: input.actorEmail ?? undefined,
    summary: input.summary,
    changes: input.changes,
    metadata: input.metadata,
    ipAddress: input.request ? getClientIp(input.request) : undefined,
    userAgent: input.request?.headers.get("user-agent") ?? undefined,
  });
}

export async function createOne<T>(
  model: { create: (doc: unknown) => Promise<unknown> },
  doc: unknown,
): Promise<T> {
  return (await model.create(doc)) as T;
}

export function serializeDoc(doc: unknown): Record<string, unknown> {
  const value = doc as {
    _id?: unknown;
    toObject?: () => Record<string, unknown>;
  };

  const plain =
    typeof value?.toObject === "function"
      ? value.toObject()
      : ({ ...(value as Record<string, unknown>) } as Record<string, unknown>);

  if (plain._id) {
    plain.id = String(plain._id);
    delete plain._id;
  }

  delete plain.__v;
  return plain;
}
