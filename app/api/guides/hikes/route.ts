import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guideId = searchParams.get("guideId")
    const location = searchParams.get("location")
    const difficulty = searchParams.get("difficulty")
    const maxPrice = searchParams.get("maxPrice")

    const client = await clientPromise
    const dbName = process.env.MONGODB_URI?.split('/')[3]?.split('?')[0] || "TrailMate"
    const db = client.db(dbName)

    const filter: any = { isActive: true }

    if (guideId) {
      filter.guideId = new ObjectId(guideId)
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" }
    }

    if (difficulty) {
      filter.difficulty = difficulty
    }

    if (maxPrice) {
      filter.price = { $lte: Number.parseFloat(maxPrice) }
    }

    const hikes = await db
      .collection("guide_hikes")
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "guides",
            localField: "guideId",
            foreignField: "_id",
            as: "guide",
          },
        },
        { $unwind: "$guide" },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            location: 1,
            difficulty: 1,
            duration: 1,
            distance: 1,
            elevation: 1,
            maxGroupSize: 1,
            price: 1,
            images: 1,
            bestSeason: 1,
            createdAt: 1,
            "guide.name": 1,
            "guide.rating": 1,
            "guide.profileImage": 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({ hikes })
  } catch (error) {
    console.error("Error fetching hikes:", error)
    return NextResponse.json({ error: "Failed to fetch hikes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      guideId,
      name,
      description,
      location,
      difficulty,
      duration,
      distance,
      elevation,
      maxGroupSize,
      price,
      images,
      itinerary,
      includedServices,
      excludedServices,
      requirements,
      bestSeason,
    } = body

    // Validate required fields
    if (!guideId || !name || !description || !location || !difficulty || !duration || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const dbName = process.env.MONGODB_URI?.split('/')[3]?.split('?')[0] || "TrailMate"
    const db = client.db(dbName)

    const hike = {
      guideId: new ObjectId(guideId),
      name,
      description,
      location,
      difficulty,
      duration,
      distance: Number.parseFloat(distance) || 0,
      elevation: Number.parseFloat(elevation) || 0,
      maxGroupSize: Number.parseInt(maxGroupSize) || 10,
      price: Number.parseFloat(price),
      images: images || [],
      itinerary: itinerary || [],
      includedServices: includedServices || [],
      excludedServices: excludedServices || [],
      requirements: requirements || [],
      bestSeason: bestSeason || "Year-round",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("guide_hikes").insertOne(hike)

    // Update guide's total hikes count
    await db.collection("guides").updateOne(
      { _id: new ObjectId(guideId) },
      {
        $inc: { totalHikes: 1 },
        $set: { lastActive: new Date() },
      },
    )

    return NextResponse.json({
      message: "Hike created successfully",
      hikeId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating hike:", error)
    return NextResponse.json({ error: "Failed to create hike" }, { status: 500 })
  }
}
