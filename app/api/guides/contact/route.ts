import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyJwt } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guideId, clientName, clientEmail, clientPhone, message, preferredDate, groupSize, hikeInterest } = body

    // Validate required fields
    if (!guideId || !clientName || !clientEmail || !message || !groupSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const dbName = process.env.MONGODB_URI?.split('/')[3]?.split('?')[0] || "TrailMate"
    const db = client.db(dbName)

    const contact = {
      guideId: new ObjectId(guideId),
      clientName,
      clientEmail,
      clientPhone: clientPhone || null,
      message,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      groupSize: Number.parseInt(groupSize),
      hikeInterest: hikeInterest || null,
      status: "pending",
      createdAt: new Date(),
    }

    const result = await db.collection("guide_contacts").insertOne(contact)

    // Update guide's last active date
    await db.collection("guides").updateOne({ _id: new ObjectId(guideId) }, { $set: { lastActive: new Date() } })

    return NextResponse.json({
      message: "Contact request sent successfully",
      contactId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ error: "Failed to send contact request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const guideId = searchParams.get("guideId")
    const status = searchParams.get("status")

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    const client = await clientPromise
    const dbName = process.env.MONGODB_URI?.split('/')[3]?.split('?')[0] || "TrailMate"
    const db = client.db(dbName)

    let filter: any = {}

    // If guideId is provided, filter by that guide
    if (guideId) {
      filter.guideId = new ObjectId(guideId)
    } else if (token) {
      // If no guideId but token is provided, get contacts for company's guides
      try {
        const user = await verifyJwt(token)
        if (user && user.userId) {
          const userId = user.userId
          
          // Find all guides posted by this company
          const guides = await db
            .collection("guides")
            .find({
              $or: [
                { postedBy: userId },
                { postedBy: new ObjectId(userId) }
              ]
            })
            .toArray()

          const guideIds = guides.map(g => g._id)
          
          if (guideIds.length > 0) {
            filter.guideId = { $in: guideIds }
          }
        }
      } catch (authError) {
        console.error("Auth error:", authError)
      }
    }

    if (status) {
      filter.status = status
    }

    const contacts = await db
      .collection("guide_contacts")
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "guides",
            localField: "guideId",
            foreignField: "_id",
            as: "guide"
          }
        },
        {
          $unwind: {
            path: "$guide",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            guideId: 1,
            guideName: "$guide.name",
            clientName: 1,
            clientEmail: 1,
            clientPhone: 1,
            message: 1,
            preferredDate: 1,
            groupSize: 1,
            hikeInterest: 1,
            status: 1,
            createdAt: 1
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray()

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}
