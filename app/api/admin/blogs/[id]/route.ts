import clientPromise from "@/lib/mongodb"
import { requireRole } from "@/lib/auth"
import { ObjectId } from "mongodb"
import type { Blog } from "@/models/Blog"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin access
    await requireRole(req, ["admin"])

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection<Blog>("blogs").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Blog post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Delete blog error:", error)
    return new Response(JSON.stringify({ error: "Failed to delete blog post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // Verify admin access
    await requireRole(req, ["admin"])

    const body = await req.json()
    const client = await clientPromise
    const db = client.db()

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await db.collection<Blog>("blogs").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Blog post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Update blog error:", error)
    return new Response(JSON.stringify({ error: "Failed to update blog post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
