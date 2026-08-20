import type { Session } from "next-auth";
import { auth } from "@/lib/auth/auth";
import type { ADMIN_ROLES } from "@/lib/constants";

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Insufficient permissions") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function getSession(): Promise<Session | null> {
  return auth();
}

type AdminRole = (typeof ADMIN_ROLES)[number];

export async function requireAdmin(options?: {
  roles?: AdminRole[];
}): Promise<Session> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  if (
    options?.roles?.length &&
    (!session.user.role || !options.roles.includes(session.user.role as AdminRole))
  ) {
    throw new ForbiddenError();
  }

  return session;
}
