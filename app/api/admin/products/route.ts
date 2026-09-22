import type { NextRequest } from "next/server";
import { revalidateShopPaths } from "@/lib/cache/revalidate-public";
import {
  jsonCreated,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { Product } from "@/models";
import { productSchema } from "@/lib/validation/admin";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const products = await Product.find().sort({ displayOrder: 1 }).lean();
    return jsonOk({
      products: products.map((product) => ({ ...product, id: String(product._id) })),
    });
  });
}

export async function POST(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, productSchema);
    if (!parsed.success) return parsed.response;

    const product = await Product.create(parsed.data);

    await logAudit({
      action: "create",
      entityType: "Product",
      entityId: String(product._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Created product ${product.name}`,
      request,
    });

    revalidateShopPaths(product.slug);
    return jsonCreated({ product: serializeDoc(product) });
  });
}
