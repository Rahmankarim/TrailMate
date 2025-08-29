import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || ""

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guideId, clientName, clientEmail, clientPhone, message, preferredDate, groupSize, hikeInterest } = body

    // Validate required fields
    if (!guideId || !clientName || !clientEmail || !message || !groupSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db("trailmate")

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

    await client.close()

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

    if (!guideId) {
      return NextResponse.json({ error: "Guide ID is required" }, { status: 400 })
    }

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db("trailmate")

    const filter: any = { guideId: new ObjectId(guideId) }
    if (status) {
      filter.status = status
    }

    const contacts = await db.collection("guide_contacts").find(filter).sort({ createdAt: -1 }).toArray()

    await client.close()

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}
