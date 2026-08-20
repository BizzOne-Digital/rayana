"use client";

import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminField,
  AdminHeader,
  AdminInput,
} from "@/components/admin/AdminHeader";
import { FormSkeleton } from "@/components/admin/LoadingSkeleton";
import { adminFetch } from "@/lib/admin/api";
import { emailSchema } from "@/lib/validation/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z
  .object({
    name: z.string().min(1),
    email: emailSchema,
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).optional().or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.newPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    { message: "Passwords do not match", path: ["confirmPassword"] },
  );

type ProfileForm = z.infer<typeof profileSchema>;

export default function AdminProfilePage() {
  const { data: session, update } = useSession();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [session, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await adminFetch("/api/admin/profile", {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      await update({ name: values.name, email: values.email });
      form.reset({
        ...values,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  });

  if (!session) return <FormSkeleton />;

  return (
    <>
      <AdminHeader
        title="Profile"
        description="Manage your admin account details and password."
        breadcrumbs={[{ label: "Profile" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <AdminCard>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--admin-accent-soft)] text-2xl font-semibold text-[var(--admin-accent)]">
              {(session.user?.name ?? "A").slice(0, 1).toUpperCase()}
            </div>
            <h2 className="text-lg font-semibold">{session.user?.name}</h2>
            <p className="text-sm text-[var(--admin-muted)]">{session.user?.email}</p>
            {session.user?.role && (
              <div className="mt-3">
                <AdminBadge tone="accent">{session.user.role.replace("_", " ")}</AdminBadge>
              </div>
            )}
          </div>
        </AdminCard>

        <form onSubmit={onSubmit} className="space-y-6">
          <AdminCard title="Account details">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Name" error={form.formState.errors.name?.message}>
                <AdminInput {...form.register("name")} />
              </AdminField>
              <AdminField label="Email" error={form.formState.errors.email?.message}>
                <AdminInput type="email" {...form.register("email")} />
              </AdminField>
            </div>
          </AdminCard>

          <AdminCard title="Change password">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <AdminField label="Current password">
                  <AdminInput type="password" {...form.register("currentPassword")} />
                </AdminField>
              </div>
              <AdminField label="New password" error={form.formState.errors.newPassword?.message}>
                <AdminInput type="password" {...form.register("newPassword")} />
              </AdminField>
              <AdminField
                label="Confirm new password"
                error={form.formState.errors.confirmPassword?.message}
              >
                <AdminInput type="password" {...form.register("confirmPassword")} />
              </AdminField>
            </div>
          </AdminCard>

          <div className="flex justify-end">
            <AdminButton type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save profile
            </AdminButton>
          </div>
        </form>
      </div>
    </>
  );
}
