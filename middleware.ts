import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

interface CustomJWT {
  token: any;
  scope?: string;
}

export async function middleware(req: NextRequest) {
  // Get the token from next-auth/jwt
  const tokenData = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as CustomJWT | null;

  if (!tokenData) {
    // If token is missing, redirect for protected routes
    if (
      req.nextUrl.pathname.startsWith("/user") ||
      req.nextUrl.pathname.startsWith("/tenant") ||
      req.nextUrl.pathname.startsWith("/protected")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    // Extract the token string from the tokenData object
    const tokenString = tokenData.token; // tokenData contains the JWT string in `token` field
    // Manually decode the JWT token using jsonwebtoken
    const decodedToken = jwt.decode(tokenString); // Decodes the token string
    // Check if scope exists in the decoded token payload
    const scope = (decodedToken as any)?.scope;

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
