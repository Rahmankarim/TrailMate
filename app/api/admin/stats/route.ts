import clientPromise from "@/lib/mongodb"
import { requireRole } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    // Verify admin access
    requireRole(req, ["admin"])

    const client = await clientPromise
    const db = client.db()

    // Get collection counts
    const [totalUsers, totalDestinations, totalGuides, totalBookings, totalBlogs] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("destinations").countDocuments(),
      db.collection("guides").countDocuments(),
      db.collection("bookings").countDocuments(),
      db.collection("blogs").countDocuments(),
    ])

    // Count companies and regular guides
    const totalCompanies = await db.collection("users").countDocuments({ role: "company" })
    const totalGuidesUsers = await db.collection("users").countDocuments({ role: "guide" })

    // Calculate total revenue
    const bookings = await db.collection("bookings").find({}).toArray()
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0)

    // Count hikes
    const totalHikes = await db.collection("hikes").countDocuments()

    return new Response(
      JSON.stringify({
        totalUsers,
        totalCompanies,
        totalGuides: totalGuides + totalGuidesUsers,
        totalDestinations,
        totalHikes,
        totalBookings,
        totalRevenue,
        totalBlogs,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Admin stats error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch statistics" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
