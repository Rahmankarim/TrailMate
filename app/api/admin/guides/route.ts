import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"
import { verifyJwt } from "@/lib/jwt"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getAuthUser(request)
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

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      bio,
      profileImage,
      experience,
      specialties,
      languages,
      location,
      dailyRate,
      isVerified,
      isActive,
    } = body

    if (!name || !bio || !location || !experience || !dailyRate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Convert userId to ObjectId for proper storage
    const postedById = typeof payload.userId === 'string' ? new ObjectId(payload.userId) : payload.userId

    const newGuide = {
      name,
      bio,
      profileImage: profileImage || "/placeholder-user.jpg",
      experience: parseInt(experience),
      specialties: Array.isArray(specialties) ? specialties : [],
      languages: Array.isArray(languages) ? languages : [],
      location,
      totalHikes: 0,
      totalClients: 0,
      rating: 0,
      reviewCount: 0,
      dailyRate: parseFloat(dailyRate),
      isActive: isActive !== undefined ? isActive : true,
      isVerified: isVerified !== undefined ? isVerified : false,
      postedBy: postedById,
      joinedDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("guides").insertOne(newGuide)

    return NextResponse.json(
      { message: "Guide created successfully", guideId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating guide:", error)
    return NextResponse.json({ error: "Failed to create guide" }, { status: 500 })
  }
}
