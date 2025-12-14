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

    // Get company's destinations
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

    // Get company's guides
    const guides = await db
      .collection("guides")
      .find({
        $or: [
          { postedBy: userId },
          ...(userIdObj ? [{ postedBy: userIdObj }] : [])
        ]
      })
      .toArray()

    // Get bookings for company's destinations
    const bookings = await db
      .collection("bookings")
      .find({ 
        destinationId: { $in: destinationIds } 
      })
      .toArray()

    // Calculate stats
    const totalDestinations = destinations.length
    const totalGuides = guides.length
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || b.amount || 0), 0)
    const totalSeatsBooked = bookings.reduce((sum, b) => sum + (b.seats || 0), 0)

    // Get recent activity
    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(b => {
        const dest = destinations.find(d => d._id.equals(b.destinationId))
        return {
          _id: b._id.toString(),
          destinationName: dest?.name || "Unknown",
          customerName: b.name,
          seats: b.seats,
          totalPrice: b.totalPrice || b.amount || 0,
          createdAt: b.createdAt,
        }
      })

    const stats = {
      totalDestinations,
      totalGuides,
      totalBookings,
      totalRevenue,
      totalSeatsBooked,
      recentBookings,
      destinations: destinations.map(d => ({
        _id: d._id.toString(),
        name: d.name,
        location: d.location,
        price: d.price,
        availableSeats: d.availableSeats,
        totalSeats: d.totalSeats,
      })),
      guides: guides.map(g => ({
        _id: g._id.toString(),
        name: g.name,
        experience: g.experience,
        rating: g.rating,
        totalClients: g.totalClients,
      })),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching company analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
