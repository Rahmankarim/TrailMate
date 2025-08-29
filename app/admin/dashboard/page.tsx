"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building, MapPin, Compass, FileText, Shield, Mountain, Calendar, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalGuides: 0,
    totalDestinations: 0,
    totalHikes: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalBlogs: 0,
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      const token = localStorage.getItem("token")

      try {
        // Fetch admin statistics
        const statsRes = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const statsData = await statsRes.json()
        setStats(statsData)

        // Fetch recent users
        const usersRes = await fetch("/api/admin/users/recent", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const usersData = await usersRes.json()
        setRecentUsers(usersData.users || [])

        // Fetch recent bookings
        const bookingsRes = await fetch("/api/admin/bookings/recent", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const bookingsData = await bookingsRes.json()
        setRecentBookings(bookingsData.bookings || [])
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Shield className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Super Admin Dashboard</h1>
                <p className="text-slate-600 text-sm">TrailMate Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("token")
                  window.location.href = "/admin/signin"
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button
              className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => (window.location.href = "/admin/users")}
            >
              <Users className="h-5 w-5" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button
              className="h-auto p-4 flex flex-col items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => (window.location.href = "/admin/companies")}
            >
              <Building className="h-5 w-5" />
              <span className="text-sm">Companies</span>
            </Button>
            <Button
              className="h-auto p-4 flex flex-col items-center gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={() => (window.location.href = "/admin/guides")}
            >
              <Compass className="h-5 w-5" />
              <span className="text-sm">Guides</span>
            </Button>
            <Button
              className="h-auto p-4 flex flex-col items-center gap-2 bg-orange-600 hover:bg-orange-700"
              onClick={() => (window.location.href = "/admin/destinations")}
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Destinations</span>
            </Button>
            <Button
              className="h-auto p-4 flex flex-col items-center gap-2 bg-teal-600 hover:bg-teal-700"
              onClick={() => (window.location.href = "/admin/hikes")}
            >
              <Mountain className="h-5 w-5" />
              <span className="text-sm">Hikes</span>
            </Button>
            <Button
              className="h-auto p-4 flex flex-col items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => (window.location.href = "/admin/blogs")}
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm">Blogs</span>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{stats.totalUsers}</div>
                <div className="text-sm text-slate-600">Total Users</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <Building className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{stats.totalCompanies}</div>
                <div className="text-sm text-slate-600">Companies</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <Compass className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{stats.totalGuides}</div>
                <div className="text-sm text-slate-600">Guides</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{stats.totalDestinations}</div>
                <div className="text-sm text-slate-600">Destinations</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <Mountain className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{stats.totalHikes}</div>
                <div className="text-sm text-slate-600">Hikes</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{stats.totalBookings}</div>
                <div className="text-sm text-slate-600">Bookings</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">${stats.totalRevenue}</div>
                <div className="text-sm text-slate-600">Revenue</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{stats.totalBlogs}</div>
                <div className="text-sm text-slate-600">Blog Posts</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Recent User Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No recent registrations</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800">{user.name}</div>
                        <div className="text-sm text-slate-600">{user.email}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            user.role === "company"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {user.role}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No recent bookings</p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-800">{booking.customerName}</div>
                        <div className="text-sm text-slate-600">{booking.destinationName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">${booking.price}</div>
                        <div className="text-xs text-slate-500">{new Date(booking.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
