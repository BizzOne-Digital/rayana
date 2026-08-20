"use client";

import { AdminButton, AdminCard, AdminField, AdminInput } from "@/components/admin/AdminHeader";
import { adminLoginSchema } from "@/lib/validation/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type LoginForm = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Unable to sign in right now");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--admin-accent)] text-white shadow-lg">
            <Heart className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--admin-text)]">Admin sign in</h1>
          <p className="mt-2 text-sm text-[var(--admin-muted)]">
            Sign in to manage Rayana De Silva — Heart Matters.
          </p>
        </div>

        <AdminCard title="Credentials">
          <form onSubmit={onSubmit} className="space-y-4">
            <AdminField label="Email" error={errors.email?.message} required>
              <AdminInput type="email" autoComplete="email" {...register("email")} />
            </AdminField>
            <AdminField label="Password" error={errors.password?.message} required>
              <AdminInput
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
            </AdminField>
            <AdminButton type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </AdminButton>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
