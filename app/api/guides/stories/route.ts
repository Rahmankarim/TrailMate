import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guideId = searchParams.get("guideId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const client = await clientPromise
    const dbName = process.env.MONGODB_URI?.split('/')[3]?.split('?')[0] || "TrailMate"
    const db = client.db(dbName)

    const filter: any = { isApproved: true }
    if (guideId) {
      filter.guideId = new ObjectId(guideId)
    }

    const stories = await db
      .collection("guide_stories")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection("guide_stories").countDocuments(filter)

    return NextResponse.json({
      stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching stories:", error)
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guideId, authorId, authorName, title, content, images, hikeName, hikeDate, rating, tags } = body

    // Validate required fields
    if (!guideId || !authorId || !authorName || !title || !content || !hikeName || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const dbName = process.env.MONGODB_URI?.split('/')[3]?.split('?')[0] || "TrailMate"
    const db = client.db(dbName)

    const story = {
      guideId: new ObjectId(guideId),
      authorId: new ObjectId(authorId),
      authorName,
      title,
      content,
      images: images || [],
      hikeName,
      hikeDate: new Date(hikeDate),
      rating: Math.max(1, Math.min(5, rating)),
      tags: tags || [],
      isApproved: false, // Stories need approval
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("guide_stories").insertOne(story)

    return NextResponse.json({
      message: "Story submitted successfully and is pending approval",
      storyId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating story:", error)
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 })
  }
}
