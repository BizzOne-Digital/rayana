import type { NextAuthConfig } from "next-auth";

/** Edge-safe Auth.js config (no DB, bcrypt, or Node-only APIs). */
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  providers: [],
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
