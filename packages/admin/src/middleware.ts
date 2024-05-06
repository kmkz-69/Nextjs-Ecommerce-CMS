import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/api/:path*"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    return NextResponse.next();
  }
  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  // matcher: [
  //   "/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  // ],
};