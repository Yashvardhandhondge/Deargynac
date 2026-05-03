import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = (session?.user as { role?: string } | undefined)?.role;

  const isProtectedRoute =
    pathname.startsWith("/patient") ||
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/admin");

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/doctor") && session) {
    if (role !== "doctor" && role !== "radiologist") {
      return NextResponse.redirect(new URL("/patient", req.url));
    }
  }

  if (pathname.startsWith("/admin") && session) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/patient", req.url));
    }
  }

  if (pathname === "/auth/login" && session && role) {
    if (role === "doctor" || role === "radiologist") {
      return NextResponse.redirect(new URL("/doctor", req.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/patient", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/patient",
    "/patient/:path*",
    "/doctor",
    "/doctor/:path*",
    "/admin",
    "/admin/:path*",
    "/auth/login",
  ],
};
