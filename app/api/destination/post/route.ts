import clientPromise from "@/lib/mongodb"
import { destinationSchema } from "@/lib/joiSchemas"
import type { Destination } from "@/models/Destination"
import { requireAuth } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const user = requireAuth(req)

    const body = await req.json()
    const { error, value } = destinationSchema.validate(body)
    if (error) return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const destinations = db.collection<Destination>("destinations")

    const destination: Destination = {
      ...value,
      postedBy: user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await destinations.insertOne(destination)
    return new Response(JSON.stringify({ destination: { ...destination, _id: result.insertedId } }), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }
}
