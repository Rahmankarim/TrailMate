import clientPromise from "@/lib/mongodb"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    // Verify admin access
    await requireRole(req, ["admin"])

    const client = await clientPromise
    const db = client.db()

    const users = await db
      .collection("users")
      .find({})
      .sort({ _id: -1 })
      .project({ password: 0 }) // Exclude password field
      .toArray()

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Admin users list error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
