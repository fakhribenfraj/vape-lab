import { auth } from "@/lib/auth"; // Import your auth instance
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get the session using Better Auth's internal logic
  // This is more reliable than checking for a specific cookie name manually
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthPage = ["/login", "/register"].includes(pathname);
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isPublicFile = pathname.includes("."); // Static files

  // 2. Allow API Auth routes and static files to pass through immediately
  if (isApiAuthRoute || isPublicFile) {
    return NextResponse.next();
  }

  // 3. Redirect logic
  if (!session) {
    // If not logged in and NOT on an auth page -> go to login
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    // If logged in and TRYING to access login/register -> go home
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Better matcher to avoid intercepting static assets or internal Next.js files
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
