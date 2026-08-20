import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { AdminUser } from "@/models/AdminUser";
import { adminLoginSchema } from "@/lib/validation/common";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = adminLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();
        const user = await AdminUser.findOne({
          email: parsed.data.email.toLowerCase(),
          active: true,
        });

        if (!user) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname.startsWith("/admin/login");
      if (isLogin) {
        if (auth?.user) {
          return Response.redirect(new URL("/admin", request.url));
        }
        return true;
      }
      if (pathname.startsWith("/admin")) {
        return Boolean(auth?.user);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        const role = token.role;
        session.user.role =
          role === "super_admin" || role === "editor" ? role : "editor";
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
