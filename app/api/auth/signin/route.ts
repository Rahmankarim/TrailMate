import clientPromise from "@/lib/mongodb"
import { comparePassword } from "@/lib/bcrypt"
import { signJwt } from "@/lib/jwt"
import type { User } from "@/models/User"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const users = db.collection<User>("users")

    const user = await users.findOne({ email })
    if (!user) return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 })

    const valid = await comparePassword(password, user.password)
    if (!valid) return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 })

    // Convert ObjectId to string for JWT payload
    const token = await signJwt({ 
      userId: user._id?.toString() || user._id, 
      role: user.role,
      email: user.email,
      name: user.name
    })

    const response = new Response(
      JSON.stringify({
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
        },
      }),
      { status: 200 },
    )

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
    )

    return response
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
