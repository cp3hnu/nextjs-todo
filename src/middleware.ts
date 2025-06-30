import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/utils/session";
import { cookies } from "next/headers";

const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  // 1. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = !isPublicRoute;

  // 2. Get the session cookie
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    // If no session cookie is found, treat it as not authenticated
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Decrypt the session from the cookie
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
