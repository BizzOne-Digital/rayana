import type { NextRequest } from "next/server";
import { jsonOk, paginated, withAdmin } from "@/lib/api/utils";
import { MediaAsset } from "@/models";

export async function GET(request: NextRequest) {
  return withAdmin(request, async () => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 24)));
    const q = url.searchParams.get("q")?.trim();

    const query: Record<string, unknown> = { status: "active" };
    if (q) {
      query.$or = [
        { filename: { $regex: q, $options: "i" } },
        { originalFilename: { $regex: q, $options: "i" } },
        { alt: { $regex: q, $options: "i" } },
        { tags: q },
      ];
    }

    const total = await MediaAsset.countDocuments(query);
    const skip = (page - 1) * limit;
    const assets = await MediaAsset.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const items = assets.map((asset) => ({
      ...asset,
      _id: String(asset._id),
      id: String(asset._id),
    }));

    return jsonOk({
      ...paginated(items, page, limit),
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      assets: items,
    });
  });
}
