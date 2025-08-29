import clientPromise from "@/lib/mongodb"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    // Verify admin access
    requireRole(req, ["admin"])

    const client = await clientPromise
    const db = client.db()

    // Get recent bookings with destination names
    const bookings = await db
      .collection("bookings")
      .aggregate([
        { $sort: { _id: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "destinations",
            localField: "destinationId",
            foreignField: "_id",
            as: "destination",
          },
        },
        {
          $addFields: {
            destinationName: { $arrayElemAt: ["$destination.name", 0] },
            customerName: "$name",
          },
        },
        {
          $project: {
            customerName: 1,
            destinationName: 1,
            price: 1,
            createdAt: "$_id",
          },
        },
      ])
      .toArray()

    return new Response(JSON.stringify({ bookings }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Recent bookings error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch recent bookings" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
