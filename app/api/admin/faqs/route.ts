import type { NextRequest } from "next/server";
import { revalidateContentPaths } from "@/lib/cache/revalidate-public";
import {
  jsonCreated,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { FAQ } from "@/models";
import { faqSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const faqs = await FAQ.find().sort({ displayOrder: 1 }).lean();
    return jsonOk({ faqs: faqs.map((faq) => ({ ...faq, id: String(faq._id) })) });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, faqSchema);
    if (!parsed.success) return parsed.response;

    const faq = await FAQ.create(parsed.data);

    await logAudit({
      action: "create",
      entityType: "FAQ",
      entityId: String(faq._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created FAQ ${faq.question}`,
      request,
    });

    revalidateContentPaths();
    return jsonCreated({ faq: serializeDoc(faq) });
  });
}
