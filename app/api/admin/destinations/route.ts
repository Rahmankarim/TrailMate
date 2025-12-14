import clientPromise from "@/lib/mongodb"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()

    const destinations = await db
      .collection("destinations")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    const sanitizedDestinations = destinations.map((dest) => ({
      _id: dest._id.toString(),
      name: dest.name,
      companyName: dest.companyName,
      location: dest.location,
      price: dest.price,
      availableSeats: dest.availableSeats,
      date: dest.date,
      featured: dest.featured,
      createdAt: dest.createdAt || new Date(),
    }))

    return new Response(JSON.stringify({ destinations: sanitizedDestinations }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch destinations" }), { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const destId = searchParams.get("id")

    if (!destId) {
      return new Response(JSON.stringify({ error: "Destination ID required" }), { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const { ObjectId } = require("mongodb")

    await db.collection("destinations").deleteOne({ _id: new ObjectId(destId) })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error("Error deleting destination:", error)
    return new Response(JSON.stringify({ error: "Failed to delete destination" }), { status: 500 })
  }
}
