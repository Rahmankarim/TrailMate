export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "rahmankarim2468@gmail.com"
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "Superadmin12345"

    if (email !== SUPER_ADMIN_EMAIL || password !== SUPER_ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Invalid super admin credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { signJwt } = require("@/lib/jwt")
    const token = signJwt({
      userId: "super-admin-001",
      role: "admin",
      email: SUPER_ADMIN_EMAIL,
      name: "Super Administrator",
    })

    const response = new Response(
      JSON.stringify({
        token,
        user: {
          name: "Super Administrator",
          email: SUPER_ADMIN_EMAIL,
          role: "admin",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
    )

    return response
  } catch (err) {
    console.error("Super admin signin error:", err)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
