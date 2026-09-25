import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import {
  jsonError,
  jsonOk,
  logAudit,
  parseJsonBody,
  withAdmin,
} from "@/lib/api/utils";
import { AdminUser } from "@/models";
import { adminProfileUpdateSchema } from "@/lib/validation/admin";

export async function PATCH(request: NextRequest) {
  return withAdmin(request, async (session) => {
    const parsed = await parseJsonBody(request, adminProfileUpdateSchema);
    if (!parsed.success) return parsed.response;

    const user = await AdminUser.findById(session.user.id);
    if (!user || !user.active) {
      return jsonError("User not found", 404);
    }

    const { name, email, currentPassword, newPassword } = parsed.data;
    const trimmedPassword = newPassword?.trim() ?? "";

    if (trimmedPassword) {
      const current = currentPassword?.trim() ?? "";
      if (!current) {
        return jsonError("Current password is required to set a new password", 400);
      }

      const valid = await bcrypt.compare(current, user.passwordHash);
      if (!valid) {
        return jsonError("Current password is incorrect", 400);
      }

      user.passwordHash = await bcrypt.hash(trimmedPassword, 12);
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail !== user.email) {
      const existing = await AdminUser.findOne({ email: normalizedEmail });
      if (existing && String(existing._id) !== String(user._id)) {
        return jsonError("That email is already in use", 409);
      }
      user.email = normalizedEmail;
    }

    user.name = name.trim();
    await user.save();

    await logAudit({
      action: "update",
      entityType: "AdminUser",
      entityId: String(user._id),
      actorId: session.user.id,
      actorEmail: session.user.email,
      summary: trimmedPassword
        ? "Updated admin profile and password"
        : "Updated admin profile",
      request,
    });

    return jsonOk({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
}
