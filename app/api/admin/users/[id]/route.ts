import clientPromise from "@/lib/mongodb"
import { requireRole } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin access
    await requireRole(req, ["admin"])

    const client = await clientPromise
    const db = client.db()

    // Don't allow deleting admin users
    const user = await db.collection("users").findOne({ _id: new ObjectId(params.id) })
    if (user?.role === "admin") {
      return new Response(JSON.stringify({ error: "Cannot delete admin users" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    const result = await db.collection("users").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Delete user error:", error)
    return new Response(JSON.stringify({ error: "Failed to delete user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
