import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import {
  jsonError,
  jsonOk,
  logAudit,
  parseJsonBody,
  serializeDoc,
  withAdmin,
} from "@/lib/api/utils";
import { Product } from "@/models";
import { productUpdateSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ productId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async () => {
    const { productId } = await context.params;
    const product = await Product.findById(productId).lean();
    if (!product) return jsonError("Product not found", 404);
    return jsonOk({ product: { ...product, id: String(product._id) } });
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { productId } = await context.params;
    const parsed = await parseJsonBody(request, productUpdateSchema);
    if (!parsed.success) return parsed.response;

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: parsed.data },
      { new: true },
    );
    if (!product) return jsonError("Product not found", 404);

    await logAudit({
      action: "update",
      entityType: "Product",
      entityId: productId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Updated product ${product.name}`,
      changes: parsed.data as Record<string, unknown>,
      request,
    });

    revalidatePath("/shop");
    return jsonOk({ product: serializeDoc(product) });
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withAdmin(request, async (session) => {
    const { productId } = await context.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return jsonError("Product not found", 404);

    await logAudit({
      action: "delete",
      entityType: "Product",
      entityId: productId,
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: `Deleted product ${product.name}`,
      request,
    });

    revalidatePath("/shop");
    return jsonOk({ deleted: true, id: productId });
  });
}
