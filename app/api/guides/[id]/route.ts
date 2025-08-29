import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || ""

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db("trailmate")

    const guide = await db
      .collection("guides")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "guide_stories",
            localField: "_id",
            foreignField: "guideId",
            as: "stories",
            pipeline: [{ $match: { isApproved: true } }, { $sort: { createdAt: -1 } }, { $limit: 10 }],
          },
        },
        {
          $lookup: {
            from: "guide_hikes",
            localField: "_id",
            foreignField: "guideId",
            as: "hikes",
            pipeline: [{ $match: { isActive: true } }, { $sort: { createdAt: -1 } }],
          },
        },
      ])
      .toArray()

    if (!guide.length) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 })
    }

    await client.close()
    return NextResponse.json({ guide: guide[0] })
  } catch (error) {
    console.error("Error fetching guide:", error)
    return NextResponse.json({ error: "Failed to fetch guide" }, { status: 500 })
  }
}
