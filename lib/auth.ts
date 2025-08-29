import { verifyJwt } from "./jwt"

export interface AuthUser {
  userId: string
  role: "guide" | "company" | "admin"
  email?: string
  name?: string
}

export function getAuthUser(request: Request): AuthUser | null {
  // Try to get user from headers (set by middleware)
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")

  if (userId && role) {
    return { userId, role: role as AuthUser["role"] }
  }

  // Fallback to token verification
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) return null

  const payload = verifyJwt(token)
  if (!payload || typeof payload !== "object") return null

  return {
    userId: (payload as any).userId,
    role: (payload as any).role,
    email: (payload as any).email,
    name: (payload as any).name,
  }
}

export function requireAuth(request: Request): AuthUser {
  const user = getAuthUser(request)
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export function requireRole(request: Request, allowedRoles: string[]): AuthUser {
  const user = requireAuth(request)
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden")
  }
  return user
}
