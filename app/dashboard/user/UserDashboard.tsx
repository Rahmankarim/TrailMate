"use client"
import Topbar from "@/components/dashboard/Topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Calendar, MapPin, MessageCircle, Search, User, Clock, CheckCircle, Package } from "lucide-react"
import Link from "next/link"

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [pastBookings, setPastBookings] = useState<any[]>([])
  const [ongoingBookings, setOngoingBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        // Fetch user profile
        const resUser = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const dataUser = await resUser.json()
        setUser(dataUser.user || { name: "User" })

        // Fetch user bookings
        const resBookings = await fetch("/api/booking/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const dataBookings = await resBookings.json()
        const bookings = dataBookings.bookings || []

        // Separate past and ongoing bookings
        const now = new Date()
        const past = bookings.filter((b: any) => new Date(b.date) < now)
        const ongoing = bookings.filter((b: any) => new Date(b.date) >= now)

        setPastBookings(past)
        setOngoingBookings(ongoing)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUser({ name: "User" })
      }
      setLoading(false)
    }
    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="flex-1 flex flex-col">
        <Topbar user={{ name: user?.name || "User" }} />
        <main className="p-8 pt-28">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h1>
              <p className="text-lg text-gray-700 dark:text-gray-200">Ready for your next adventure?</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/destinations">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Packages
                </Button>
              </Link>
              <Link href="/dashboard/user/profile">
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-6 flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">{pastBookings.length}</p>
                    <p className="text-gray-600 dark:text-gray-300">Completed Trips</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-6 flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{ongoingBookings.length}</p>
                    <p className="text-gray-600 dark:text-gray-300">Upcoming Trips</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-6 flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{pastBookings.length + ongoingBookings.length}</p>
                    <p className="text-gray-600 dark:text-gray-300">Total Bookings</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ongoing Bookings */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <Card className="bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Upcoming Adventures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ongoingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No upcoming trips planned</p>
                      <Link href="/destinations">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Book Your Next Adventure</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ongoingBookings.slice(0, 3).map((booking, idx) => (
                        <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{booking.destinationName || booking.name}</h4>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Upcoming
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {booking.date || "Date TBD"}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {booking.location || "Location TBD"}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-gray-500">{booking.seats || 1} seat(s) booked</span>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Chat with Guide
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Past Bookings */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <Card className="bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Past Adventures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No past adventures yet</p>
                      <p className="text-sm text-gray-400">Start your journey today!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastBookings.slice(0, 3).map((booking, idx) => (
                        <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{booking.destinationName || booking.name}</h4>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                              Completed
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {booking.date || "Date TBD"}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {booking.location || "Location TBD"}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-sm text-gray-500">{booking.seats || 1} seat(s) booked</span>
                            <Button size="sm" variant="outline">
                              Leave Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-8"
          >
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/destinations">
                    <Button className="w-full h-20 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700">
                      <Search className="h-6 w-6 mb-2" />
                      Browse New Packages
                    </Button>
                  </Link>
                  <Button
                    className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                    variant="outline"
                  >
                    <MessageCircle className="h-6 w-6 mb-2" />
                    Chat with Companies
                  </Button>
                  <Link href="/dashboard/user/profile">
                    <Button
                      className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                      variant="outline"
                    >
                      <User className="h-6 w-6 mb-2" />
                      Update Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
