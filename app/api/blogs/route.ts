import clientPromise from "@/lib/mongodb"
import type { Blog } from "@/models/Blog"

export async function GET(req: Request) {
  try {
    const client = await clientPromise
    const db = client.db()

    // Only return published blogs for public API
    const blogs = await db.collection<Blog>("blogs").find({ published: true }).sort({ publishedAt: -1 }).toArray()

    return new Response(JSON.stringify({ blogs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Blogs API error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch blogs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
