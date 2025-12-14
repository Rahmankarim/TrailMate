import clientPromise from "@/lib/mongodb"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()

    const bookings = await db
      .collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    const sanitizedBookings = bookings.map((booking) => ({
      _id: booking._id.toString(),
      name: booking.name,
      email: booking.email,
      destinationId: booking.destinationId,
      seats: booking.seats,
      details: booking.details,
      status: booking.status || "pending",
      amount: booking.amount || 0,
      createdAt: booking.createdAt || new Date(),
    }))

    return new Response(JSON.stringify({ bookings: sanitizedBookings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch bookings" }), { status: 500 })
  }
}
