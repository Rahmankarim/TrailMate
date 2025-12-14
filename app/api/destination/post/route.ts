import clientPromise from "@/lib/mongodb"
import { destinationSchema } from "@/lib/joiSchemas"
import type { Destination } from "@/models/Destination"
import { requireAuth } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req)

    const body = await req.json()
    const { error, value } = destinationSchema.validate(body)
    if (error) return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const destinations = db.collection<Destination>("destinations")

    // Convert userId to ObjectId for proper storage and querying
    const postedById = typeof user.userId === 'string' ? new ObjectId(user.userId) : user.userId

    const destination: Destination = {
      ...value,
      postedBy: postedById,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await destinations.insertOne(destination)
    return new Response(JSON.stringify({ destination: { ...destination, _id: result.insertedId } }), { status: 201 })
  } catch (error) {
    console.error("Error creating destination:", error)
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }
}
