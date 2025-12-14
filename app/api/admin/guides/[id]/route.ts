import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin authentication
    const user = await getAuthUser(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { isVerified, isActive } = body

    if (typeof isVerified !== "boolean" && typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid update data" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const updateData: any = { updatedAt: new Date() }
    if (typeof isVerified === "boolean") updateData.isVerified = isVerified
    if (typeof isActive === "boolean") updateData.isActive = isActive

    const result = await db.collection("guides").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Guide updated successfully" })
  } catch (error) {
    console.error("Error updating guide:", error)
    return NextResponse.json({ error: "Failed to update guide" }, { status: 500 })
  }
}
