import clientPromise from "@/lib/mongodb"
import type { Destination } from "@/models/Destination"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: Request) {
  const client = await clientPromise
  const db = client.db()
  const destinations = db.collection<Destination>("destinations")

  const user = getAuthUser(req)

  let query = {}
  if (user && user.role === "company") {
    // Companies only see their own destinations
    query = { postedBy: user.userId }
  } else if (user && user.role === "admin") {
    // Admins see all destinations
    query = {}
  } else {
    // Public users see only published destinations
    query = { published: { $ne: false } }
  }

  const all = await destinations.find(query).toArray()
  return new Response(JSON.stringify({ destinations: all }), { status: 200 })
}
