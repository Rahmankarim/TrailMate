import clientPromise from "@/lib/mongodb"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    // Verify admin access
    requireRole(req, ["admin"])

    const client = await clientPromise
    const db = client.db()

    // Get recent users (last 10)
    const users = await db
      .collection("users")
      .find({ role: { $ne: "admin" } })
      .sort({ _id: -1 })
      .limit(10)
      .project({ password: 0 }) // Exclude password field
      .toArray()

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Recent users error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch recent users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
