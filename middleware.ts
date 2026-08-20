import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginRoute =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  if (isLoginRoute) {
    if (req.auth) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!req.auth) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
