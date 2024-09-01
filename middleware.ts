import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token && (req.nextUrl.pathname.startsWith('/user') || 
                 req.nextUrl.pathname.startsWith('/tenant') || 
                 req.nextUrl.pathname.startsWith('/protected'))) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  return NextResponse.next()
}

export const config = { matcher: ['/user', '/tenant', '/protected'] }