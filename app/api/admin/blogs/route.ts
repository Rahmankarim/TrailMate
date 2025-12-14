import clientPromise from "@/lib/mongodb"
import { requireRole } from "@/lib/auth"
import type { Blog } from "@/models/Blog"

export async function GET(req: Request) {
  try {
    // Verify admin access
    await requireRole(req, ["admin"])

    const client = await clientPromise
    const db = client.db()

    const blogs = await db.collection<Blog>("blogs").find({}).sort({ createdAt: -1 }).toArray()

    return new Response(JSON.stringify({ blogs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Admin blogs list error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch blogs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function POST(req: Request) {
  try {
    // Verify admin access
    const user = await requireRole(req, ["admin"])

    const body = await req.json()
    const { title, slug, excerpt, content, category, tags, image, featured, published, readTime } = body

    if (!title || !excerpt || !content || !category) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if slug already exists
    const existingBlog = await db.collection<Blog>("blogs").findOne({ slug })
    if (existingBlog) {
      return new Response(JSON.stringify({ error: "A blog post with this title already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      })
    }

    const blog: Blog = {
      title,
      slug,
      excerpt,
      content,
      author: {
        name: "TrailMate Admin",
        role: "Admin",
      },
      category,
      tags: tags || [],
      image,
      featured: featured || false,
      published: published || false,
      publishedAt: published ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      readTime: readTime || "5 min read",
    }

    const result = await db.collection<Blog>("blogs").insertOne(blog)

    return new Response(JSON.stringify({ success: true, id: result.insertedId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Create blog error:", error)
    return new Response(JSON.stringify({ error: "Failed to create blog post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
