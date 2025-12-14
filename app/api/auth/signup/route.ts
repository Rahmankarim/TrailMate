import clientPromise from "@/lib/mongodb"
import { hashPassword } from "@/lib/bcrypt"
import { userSchema } from "@/lib/joiSchemas"
import type { User } from "@/models/User"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { error, value } = userSchema.validate(body)
    if (error) return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const users = db.collection<User>("users")

    const existing = await users.findOne({ email: value.email })
    if (existing) return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 })

    const hashed = await hashPassword(value.password)
    const user: User = { ...value, password: hashed }
    const result = await users.insertOne(user)

    const { signJwt } = require("@/lib/jwt")
    const token = await signJwt({ userId: result.insertedId, role: user.role })

    const response = new Response(
      JSON.stringify({
        token,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
        },
        message: "User registered successfully",
      }),
      { status: 201 },
    )

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
    )

    return response
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
