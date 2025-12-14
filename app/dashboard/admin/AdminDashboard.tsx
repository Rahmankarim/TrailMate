"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Users,
  Building,
  MapPin,
  Calendar,
  MessageCircle,
  BarChart3,
  Settings,
  Shield,
  Trash2,
  Eye,
  AlertTriangle,
  Activity,
} from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [destinations, setDestinations] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [guides, setGuides] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalGuides: 0,
    totalDestinations: 0,
    totalBookings: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      const token = localStorage.getItem("token")

      try {
        // Fetch real stats from API
        const statsRes = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        // Fetch real users
        const usersRes = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (usersRes.ok) {
          const usersData = await usersRes.json()
          setUsers(usersData.users || [])
        }

        // Fetch real destinations
        const destsRes = await fetch("/api/admin/destinations", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (destsRes.ok) {
          const destsData = await destsRes.json()
          setDestinations(destsData.destinations || [])
        }

        // Fetch real bookings
        const bookingsRes = await fetch("/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setBookings(bookingsData.bookings || [])
        }

        // Fetch guides
        const guidesRes = await fetch("/api/guides", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (guidesRes.ok) {
          const guidesData = await guidesRes.json()
          setGuides(guidesData.guides || [])
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
      }
      setLoading(false)
    }
    fetchAdminData()
  }, [])

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId))
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Error deleting user")
    }
  }

  const handleDeleteDestination = async (destId: string) => {
    if (!confirm("Are you sure you want to delete this destination?")) return
    
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`/api/admin/destinations?id=${destId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setDestinations(destinations.filter((d) => d._id !== destId))
      } else {
        alert("Failed to delete destination")
      }
    } catch (error) {
      console.error("Error deleting destination:", error)
      alert("Error deleting destination")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">Super Admin Control Panel</h1>
              <p className="text-sm text-slate-400">TrailMate System Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-red-900/20 text-red-400 border-red-700/30">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Admin Access
            </Badge>
            <Button
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("token")
                window.location.href = "/admin/signin"
              }}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 flex items-center">
                <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalUsers}</p>
                  <p className="text-slate-400">Total Users</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 flex items-center">
                <div className="w-12 h-12 bg-emerald-900/20 rounded-full flex items-center justify-center mr-4">
                  <Building className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">{stats.totalCompanies}</p>
                  <p className="text-slate-400">Companies</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 flex items-center">
                <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{stats.totalBookings}</p>
                  <p className="text-slate-400">Total Bookings</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 flex items-center">
                <div className="w-12 h-12 bg-amber-900/20 rounded-full flex items-center justify-center mr-4">
                  <BarChart3 className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-slate-400">Total Revenue</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 flex items-center">
                <div className="w-12 h-12 bg-cyan-900/20 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-400">{stats.totalGuides || 0}</p>
                  <p className="text-slate-400">Total Guides</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Button
            onClick={() => window.location.href = "/admin/users"}
            className="bg-blue-600 hover:bg-blue-700 text-white h-auto py-4 flex flex-col gap-2"
          >
            <Users className="h-6 w-6" />
            Manage Users
          </Button>
          <Button
            onClick={() => window.location.href = "/admin/destinations"}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-auto py-4 flex flex-col gap-2"
          >
            <MapPin className="h-6 w-6" />
            Manage Destinations
          </Button>
          <Button
            onClick={() => window.location.href = "/admin/hikes"}
            className="bg-purple-600 hover:bg-purple-700 text-white h-auto py-4 flex flex-col gap-2"
          >
            <Activity className="h-6 w-6" />
            Manage Hikes
          </Button>
          <Button
            onClick={() => window.location.href = "/admin/guides"}
            className="bg-cyan-600 hover:bg-cyan-700 text-white h-auto py-4 flex flex-col gap-2"
          >
            <Building className="h-6 w-6" />
            Manage Guides
          </Button>
          <Button
            onClick={() => window.location.href = "/admin/blogs"}
            className="bg-orange-600 hover:bg-orange-700 text-white h-auto py-4 flex flex-col gap-2"
          >
            <MessageCircle className="h-6 w-6" />
            Manage Blogs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Users className="h-5 w-5 text-blue-400" />
                User Management ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No users found</p>
                ) : (
                  users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100">{user.name}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className="text-xs bg-blue-900/30 text-blue-300">{user.role}</Badge>
                          {user.companyName && <Badge className="text-xs bg-emerald-900/30 text-emerald-300">{user.companyName}</Badge>}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user._id)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Destinations Management */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <MapPin className="h-5 w-5 text-emerald-400" />
                Destinations ({destinations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {destinations.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No destinations found</p>
                ) : (
                  destinations.map((dest) => (
                    <div key={dest._id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100">{dest.name}</p>
                        <p className="text-sm text-slate-400">{dest.companyName}</p>
                        <div className="flex gap-2 mt-1">
                          {dest.price && <Badge className="text-xs bg-emerald-900/30 text-emerald-300">${dest.price}</Badge>}
                          {dest.location && <Badge className="text-xs bg-blue-900/30 text-blue-300">{dest.location}</Badge>}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteDestination(dest._id)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bookings */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Calendar className="h-5 w-5 text-purple-400" />
                Recent Bookings ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bookings.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No bookings found</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking._id} className="p-3 bg-slate-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-100">{booking.name}</p>
                          <p className="text-sm text-slate-400">{booking.email}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge className="text-xs bg-purple-900/30 text-purple-300">{booking.seats} seats</Badge>
                            {booking.status && <Badge className="text-xs bg-amber-900/30 text-amber-300">{booking.status}</Badge>}
                          </div>
                        </div>
                        {booking.amount > 0 && (
                          <p className="text-emerald-400 font-bold">${booking.amount}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Guides */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Shield className="h-5 w-5 text-cyan-400" />
                Guides ({guides.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {guides.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No guides found</p>
                ) : (
                  guides.map((guide: any) => (
                    <div key={guide._id} className="p-3 bg-slate-700 rounded-lg">
                      <p className="font-semibold text-slate-100">{guide.name}</p>
                      <p className="text-sm text-slate-400">{guide.email}</p>
                      <div className="flex gap-2 mt-1">
                        {guide.location && <Badge className="text-xs bg-cyan-900/30 text-cyan-300">{guide.location}</Badge>}
                        {guide.experience && <Badge className="text-xs bg-blue-900/30 text-blue-300">{guide.experience}</Badge>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
