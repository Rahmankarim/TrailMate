import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = getAuthUser(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get all guides with company information
    const guides = await db
      .collection("guides")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "company",
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
            location: 1,
            totalHikes: 1,
            totalClients: 1,
            rating: 1,
            reviewCount: 1,
            dailyRate: 1,
            isActive: 1,
            isVerified: 1,
            postedBy: 1,
            joinedDate: 1,
            companyName: { $arrayElemAt: ["$company.name", 0] },
          },
        },
        { $sort: { joinedDate: -1 } },
      ])
      .toArray()

    return NextResponse.json({ guides })
  } catch (error) {
    console.error("Error fetching guides for admin:", error)
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 })
  }
}
