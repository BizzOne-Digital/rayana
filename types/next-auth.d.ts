import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "super_admin" | "editor";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "super_admin" | "editor";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "super_admin" | "editor";
  }
}

export {};
