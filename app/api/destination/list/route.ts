import clientPromise from "@/lib/mongodb"
import type { Destination } from "@/models/Destination"
import { getAuthUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  try {
    const client = await clientPromise
    const db = client.db()
    const destinations = db.collection<Destination>("destinations")

    const user = await getAuthUser(req)
    console.log("[Destinations API] User:", user)

    let query: any = {}
    
    if (user && user.role === "admin") {
      // Admins see ALL destinations
      console.log("[Destinations API] Admin user - showing all destinations")
      query = {}
    } else if (user && user.role === "company") {
      // Companies only see their own destinations
      console.log("[Destinations API] Company user - filtering by userId:", user.userId)
      // Handle both string and ObjectId
      const userObjectId = ObjectId.isValid(user.userId) ? new ObjectId(user.userId) : user.userId
      query = { 
        $or: [
          { postedBy: user.userId },
          { postedBy: userObjectId }
        ]
      }
    } else {
      // Normal users and unauthenticated users see ONLY admin-created destinations
      console.log("[Destinations API] Regular/Guest user - showing only admin destinations")
      const adminUsers = await db.collection("users").find({ role: "admin" }).toArray()
      console.log("[Destinations API] Found", adminUsers.length, "admin users")
      console.log("[Destinations API] Admin IDs:", adminUsers.map(a => a._id.toString()))
      
      const adminIds = adminUsers.map(admin => admin._id)
      const adminIdsStrings = adminUsers.map(admin => admin._id.toString())
      
      // Query with both ObjectId and string representations
      query = { 
        $or: [
          { postedBy: { $in: adminIds } },
          { postedBy: { $in: adminIdsStrings } }
        ]
      }
      
      // Debug: Check what postedBy values exist
      const allDests = await destinations.find({}).toArray()
      console.log("[Destinations API] Total destinations in DB:", allDests.length)
      console.log("[Destinations API] PostedBy values:", allDests.map(d => ({ name: d.name, postedBy: d.postedBy, type: typeof d.postedBy })))
    }

    console.log("[Destinations API] Query:", JSON.stringify(query, null, 2))
    const all = await destinations.find(query).toArray()
    console.log("[Destinations API] Found", all.length, "destinations")
    
    return new Response(JSON.stringify({ destinations: all }), { status: 200 })
  } catch (error) {
    console.error("[Destinations API] Error:", error)
    return new Response(JSON.stringify({ destinations: [] }), { status: 200 })
  }
}
