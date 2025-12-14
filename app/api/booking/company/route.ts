import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyJwt } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await verifyJwt(token)
    if (!user || typeof user !== 'object' || !('userId' in user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = String((user as any).userId)
    const client = await clientPromise
    const dbName = process.env.MONGODB_URI?.split('/')[3]?.split('?')[0] || "TrailMate"
    const db = client.db(dbName)

    // Find destinations posted by this company
    const userIdObj = ObjectId.isValid(userId) ? new ObjectId(userId) : null
    const destinations = await db
      .collection("destinations")
      .find({
        $or: [
          { postedBy: userId },
          ...(userIdObj ? [{ postedBy: userIdObj }] : [])
        ]
      })
      .toArray()

    const destinationIds = destinations.map(d => d._id)

    // Find bookings for these destinations
    const bookings = await db
      .collection("bookings")
      .find({ 
        destinationId: { $in: destinationIds } 
      })
      .sort({ createdAt: -1 })
      .toArray()

    // Attach destination name to each booking
    const bookingsWithNames = bookings.map(b => {
      const dest = destinations.find(d => d._id.equals(b.destinationId))
      return {
        _id: b._id.toString(),
        name: b.name,
        email: b.email,
        phone: b.phone,
        destinationId: b.destinationId.toString(),
        destinationName: dest ? dest.name : "Unknown",
        seats: b.seats,
        totalPrice: b.totalPrice || 0,
        status: b.status || "pending",
        createdAt: b.createdAt,
      }
    })

    return NextResponse.json({ bookings: bookingsWithNames })
  } catch (error) {
    console.error("Error fetching company bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
