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
  const [companies, setCompanies] = useState<any[]>([])
  const [destinations, setDestinations] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [chats, setChats] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeChats: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      const token = localStorage.getItem("token")

      try {
        // For demo purposes, using mock data - replace with actual API calls
        setUsers([
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            joinDate: "2024-01-15",
            status: "active",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
            joinDate: "2024-02-20",
            status: "active",
          },
          {
            id: 3,
            name: "EcoTours Ltd",
            email: "info@ecotours.com",
            role: "company",
            joinDate: "2024-01-10",
            status: "active",
          },
        ])

        setCompanies([
          { id: 1, name: "EcoTours Ltd", email: "info@ecotours.com", destinations: 5, bookings: 23, revenue: 15000 },
          { id: 2, name: "Adventure Co", email: "hello@adventure.com", destinations: 3, bookings: 12, revenue: 8500 },
        ])

        setDestinations([
          { id: 1, name: "Hunza Valley Trek", company: "EcoTours Ltd", price: 299, bookings: 15, status: "active" },
          { id: 2, name: "Skardu Lakes Tour", company: "Adventure Co", price: 199, bookings: 8, status: "active" },
        ])

        setBookings([
          {
            id: 1,
            user: "John Doe",
            destination: "Hunza Valley Trek",
            date: "2024-03-15",
            status: "confirmed",
            amount: 299,
          },
          {
            id: 2,
            user: "Jane Smith",
            destination: "Skardu Lakes Tour",
            date: "2024-03-20",
            status: "pending",
            amount: 199,
          },
        ])

        setChats([
          {
            id: 1,
            user: "John Doe",
            company: "EcoTours Ltd",
            lastMessage: "When does the trek start?",
            status: "active",
          },
          {
            id: 2,
            user: "Jane Smith",
            company: "Adventure Co",
            lastMessage: "Can I modify my booking?",
            status: "pending",
          },
        ])

        setStats({
          totalUsers: 156,
          totalCompanies: 23,
          totalBookings: 89,
          totalRevenue: 45600,
          activeChats: 12,
        })
      } catch (error) {
        console.error("Error fetching admin data:", error)
      }
      setLoading(false)
    }
    fetchAdminData()
  }, [])

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const handleDeleteBooking = (bookingId: number) => {
    setBookings(bookings.filter((b) => b.id !== bookingId))
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
        <div className="flex items-center justify-between">
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

      <main className="p-6">
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
                <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                  <MessageCircle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">{stats.activeChats}</p>
                  <p className="text-slate-400">Active Chats</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Users className="h-5 w-5 text-blue-400" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-100">{user.name}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs bg-slate-600 text-slate-300">
                          {user.role}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-emerald-900/20 text-emerald-400">
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-600 bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Booking Management */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Calendar className="h-5 w-5 text-purple-400" />
                Booking Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-100">{booking.destination}</p>
                      <p className="text-sm text-slate-400">
                        {booking.user} • {booking.date}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            booking.status === "confirmed"
                              ? "bg-emerald-900/20 text-emerald-400"
                              : "bg-amber-900/20 text-amber-400"
                          }`}
                        >
                          {booking.status}
                        </Badge>
                        <span className="text-xs text-slate-400">${booking.amount}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-600 bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Monitoring */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <MessageCircle className="h-5 w-5 text-red-400" />
                Chat Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {chats.map((chat) => (
                  <div key={chat.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-100">
                        {chat.user} ↔ {chat.company}
                      </p>
                      <p className="text-sm text-slate-400 truncate max-w-48">{chat.lastMessage}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs mt-1 ${
                          chat.status === "active"
                            ? "bg-emerald-900/20 text-emerald-400"
                            : "bg-amber-900/20 text-amber-400"
                        }`}
                      >
                        {chat.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-600 bg-transparent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Site Analytics */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Activity className="h-5 w-5 text-amber-400" />
                Site Analytics & Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-700 rounded-lg text-center">
                    <p className="text-lg font-bold text-slate-100">1,247</p>
                    <p className="text-xs text-slate-400">Daily Visitors</p>
                  </div>
                  <div className="p-3 bg-slate-700 rounded-lg text-center">
                    <p className="text-lg font-bold text-slate-100">89%</p>
                    <p className="text-xs text-slate-400">Uptime</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Full Analytics
                  </Button>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    Manage Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
