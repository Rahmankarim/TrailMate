import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyJwt } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 })
    }

    // Verify JWT token
    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 })
    }

    // Get request body
    const body = await req.json()
    const { destinationId, name, email, seats, details } = body

    // Validate required fields
    if (!destinationId || !name || !email || !seats) {
      return NextResponse.json(
        { error: "Missing required fields: destinationId, name, email, seats" },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()

    // Get destination details for price calculation
    const { ObjectId } = require("mongodb")
    const destination = await db.collection("destinations").findOne({ _id: new ObjectId(destinationId) })
    
    const amount = destination?.price ? destination.price * seats : 0

    // Create booking object
    const booking = {
      userId: (payload as any).userId,
      userName: name,
      name,
      email,
      destinationId,
      destinationName: destination?.name || "Unknown Destination",
      seats: Number(seats),
      details: details || "",
      status: "pending",
      amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert booking into database
    const result = await db.collection("bookings").insertOne(booking)

    // Update destination available seats
    if (destination?.availableSeats) {
      await db.collection("destinations").updateOne(
        { _id: new ObjectId(destinationId) },
        { 
          $inc: { availableSeats: -Number(seats) },
          $set: { updatedAt: new Date() }
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        booking: {
          ...booking,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
