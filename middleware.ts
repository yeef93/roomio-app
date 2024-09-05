import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { JWT } from "next-auth/jwt";

interface CustomJWT extends JWT {
  scope?: string;
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as CustomJWT | null;

  if (!token) {
    if (
      req.nextUrl.pathname.startsWith("/user") ||
      req.nextUrl.pathname.startsWith("/tenant") ||
      req.nextUrl.pathname.startsWith("/protected")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    const scope = token.scope;

    if (req.nextUrl.pathname.startsWith("/user") && scope !== "ROLE_USER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/tenant") && scope !== "ROLE_TENANT") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/user/:path*", "/tenant/:path*", "/protected/:path*"] };