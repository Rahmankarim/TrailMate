import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[Guide Detail API] Fetching guide with ID:", params.id)
    
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      console.log("[Guide Detail API] Invalid ObjectId:", params.id)
      return NextResponse.json({ error: "Invalid guide ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    console.log("[Guide Detail API] Connected to database")

    const guide = await db
      .collection("guides")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
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
        {
          $project: {
            _id: 1,
            name: 1,
            bio: 1,
            profileImage: 1,
            experience: 1,
            specialties: 1,
            languages: 1,
            certifications: 1,
            location: 1,
            contactInfo: 1,
            totalHikes: 1,
            totalClients: 1,
            rating: 1,
            reviewCount: 1,
            dailyRate: 1,
            currency: 1,
            isVerified: 1,
            isActive: 1,
            postedBy: 1,
            joinedDate: 1,
            createdAt: 1,
            stories: 1,
            hikes: 1,
            companyEmail: "$user.email",
            companyName: "$user.name",
          },
        },
      ])
      .toArray()

    console.log("[Guide Detail API] Query result count:", guide.length)
    
    if (!guide.length) {
      console.log("[Guide Detail API] Guide not found")
      return NextResponse.json({ error: "Guide not found" }, { status: 404 })
    }

    console.log("[Guide Detail API] Successfully found guide:", guide[0].name)
    return NextResponse.json({ guide: guide[0] })
  } catch (error) {
    console.error("[Guide Detail API] Error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch guide",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
