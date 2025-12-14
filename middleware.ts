export const runtime = "nodejs";
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwt } from "@/lib/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

    console.log('--- Middleware Debug ---')
    console.log('Requested Path:', request.nextUrl.pathname)
  
  // Public routes that should not be protected
  const publicRoutes = ["/signin", "/signup", "/admin/signin"]
  
  // Check if current path is public
  if (publicRoutes.some((route) => pathname === route)) {
    console.log('Public route, allowing access')
    return NextResponse.next()
  }
  
  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"]
  const adminRoutes = ["/admin", "/dashboard/admin"]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute || isAdminRoute) {
      console.log('Protected/Admin Route:', pathname)
    const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")
      console.log('Token from cookie/header:', token)

    if (!token) {
        console.log('No token found, redirecting to sign in')
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/signin", request.url))
      }
      return NextResponse.redirect(new URL("/signin", request.url))
    }

  const payload = await verifyJwt(token)
      console.log('JWT payload:', payload)
    if (!payload || typeof payload !== "object") {
        console.log('Invalid token, redirecting to sign in')
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/signin", request.url))
      }
      return NextResponse.redirect(new URL("/signin", request.url))
    }

    // Check admin access
    if (isAdminRoute && (payload as any).role !== "admin") {
        console.log('Admin route but user is not admin, role:', (payload as any).role)
      const userRole = (payload as any).role
      if (userRole === "company") {
        return NextResponse.redirect(new URL("/dashboard/company", request.url))
      } else if (userRole === "user") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url))
      }
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Add user info to headers for API routes
    const response = NextResponse.next()
    response.headers.set("x-user-id", (payload as any).userId)
    response.headers.set("x-user-role", (payload as any).role)
      console.log('Authentication successful, proceeding to route')
    return response
  }

    console.log('Route not protected, proceeding')
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/destination/:path*",
    "/api/guides/:path*",
    "/api/booking/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
}
