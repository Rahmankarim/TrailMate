import { verifyJwt } from "./jwt"

export interface AuthUser {
  userId: string
  role: "user" | "guide" | "company" | "admin"
  email?: string
  name?: string
}

export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  // Try to get user from headers (set by middleware)
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")

  if (userId && role) {
    console.log("[Auth] User from headers:", { userId, role })
    return { userId, role: role as AuthUser["role"] }
  }

  // Try Authorization header first
  const authHeader = request.headers.get("authorization")
  let token = authHeader?.replace("Bearer ", "")

  // Fallback to cookie if no Authorization header
  if (!token) {
    const cookieHeader = request.headers.get("cookie")
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim())
      const tokenCookie = cookies.find(c => c.startsWith('token='))
      if (tokenCookie) {
        token = tokenCookie.split('=')[1]
      }
    }
  }

  if (!token) {
    console.log("[Auth] No token found")
    return null
  }

  const payload = await verifyJwt(token)
  if (!payload || typeof payload !== "object") {
    console.log("[Auth] Invalid token payload")
    return null
  }

  const authUser = {
    userId: (payload as any).userId,
    role: (payload as any).role,
    email: (payload as any).email,
    name: (payload as any).name,
  }
  
  console.log("[Auth] User from token:", authUser)
  return authUser
}

export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await getAuthUser(request)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireRole(request: Request, allowedRoles: string[]): Promise<AuthUser> {
  const user = await requireAuth(request)
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden")
  }
  return user
}
