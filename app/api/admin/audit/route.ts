import type { NextRequest } from "next/server";
import { jsonError, jsonOk, withAdmin } from "@/lib/api/utils";
import { AuditLog } from "@/models";
import { auditQuerySchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const url = new URL(request.url);
    const parsed = auditQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      return jsonError("Invalid query", 422, parsed.error.flatten());
    }

    const { page, limit, action, entityType } = parsed.data;
    const query: Record<string, unknown> = {};
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(query),
    ]);

    return jsonOk({
      items: items.map((item) => ({ ...item, id: String(item._id) })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
}
