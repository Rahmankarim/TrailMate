import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")
    const specialty = searchParams.get("specialty")
    const minRating = searchParams.get("minRating")
    const maxRate = searchParams.get("maxRate")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    const client = await clientPromise
    const db = client.db()

    // Check if user is authenticated for filtering
    const user = getAuthUser(request)

    // Build filter query
    const filter: any = { isActive: true }

    if (user && user.role === "company") {
      filter.postedBy = user.userId
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" }
    }

    if (specialty) {
      filter.specialties = { $in: [specialty] }
    }

    if (minRating) {
      filter.rating = { $gte: Number.parseFloat(minRating) }
    }

    if (maxRate) {
      filter.dailyRate = { $lte: Number.parseFloat(maxRate) }
    }

    // Get guides with user information
    const guides = await db
      .collection("guides")
      .aggregate([
        { $match: filter },
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
            joinedDate: 1,
            "user.email": 1,
          },
        },
        { $sort: { rating: -1, reviewCount: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ])
      .toArray()

    const total = await db.collection("guides").countDocuments(filter)

    return NextResponse.json({
      guides,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching guides:", error)
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 })
  }
}
