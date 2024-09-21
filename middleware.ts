import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

interface CustomJWT {
  token: string; // JWT token as a string
  scope?: string;
  exp?: number;  // Expiration time for session validation
}

export async function middleware(req: NextRequest) {
  // Get the token from next-auth/jwt
  const tokenData = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as CustomJWT | null;

  // If no token data, redirect to home page
  if (!tokenData) {
    return handleRedirect(req);
  } else {
    // Extract the token string and decode the JWT token
    const decodedToken = jwt.decode(tokenData.token); // Decodes the token string
    const scope = (decodedToken as any)?.scope;
    const exp = (decodedToken as any)?.exp;

    // Check if the token has expired
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    if (exp && exp < now) {
      // Token is expired, so clear the session and redirect to the home page
      return handleExpiredSession(req);
    }

    // Role-based redirection
    if (req.nextUrl.pathname.startsWith("/user") && scope !== "ROLE_USER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/tenant") && scope !== "ROLE_TENANT") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // If everything is okay, continue to the requested page
  return NextResponse.next();
}

// Helper function to handle expired session
function handleExpiredSession(req: NextRequest) {
  // Create a response to redirect the user to the home page
  const response = NextResponse.redirect(new URL("/", req.url));

  // Clear the session cookie by setting it to expire immediately
  response.cookies.set("next-auth.session-token", "", { maxAge: -1 });
  response.cookies.set("next-auth.csrf-token", "", { maxAge: -1 });

  return response;
}

// Helper function for handling redirection for unauthenticated users
function handleRedirect(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith("/user") ||
    req.nextUrl.pathname.startsWith("/tenant") ||
    req.nextUrl.pathname.startsWith("/protected")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/user/:path*", "/tenant/:path*", "/protected/:path*"] };