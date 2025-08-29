"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, DollarSign, Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface Trip {
  id: string
  title: string
  destination: string
  duration: string
  difficulty: "easy" | "moderate" | "challenging" | "extreme"
  maxParticipants: number
  price: number
  status: "active" | "inactive" | "full"
  bookings: number
  nextDate: string
  description: string
}

export default function GuideTripsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: "TR-001",
      title: "Everest Base Camp Trek",
      destination: "Everest Region",
      duration: "14 days",
      difficulty: "challenging",
      maxParticipants: 8,
      price: 1200,
      status: "active",
      bookings: 6,
      nextDate: "2024-03-15",
      description: "Classic trek to Everest Base Camp with stunning mountain views",
    },
    {
      id: "TR-002",
      title: "Annapurna Circuit",
      destination: "Annapurna Region",
      duration: "16 days",
      difficulty: "moderate",
      maxParticipants: 10,
      price: 900,
      status: "active",
      bookings: 4,
      nextDate: "2024-04-01",
      description: "Complete circuit around the Annapurna massif",
    },
    {
      id: "TR-003",
      title: "Manaslu Circuit Trek",
      destination: "Manaslu Region",
      duration: "18 days",
      difficulty: "challenging",
      maxParticipants: 6,
      price: 1100,
      status: "full",
      bookings: 6,
      nextDate: "2024-05-10",
      description: "Remote trek around the eighth highest mountain in the world",
    },
    {
      id: "TR-004",
      title: "Gokyo Lakes Trek",
      destination: "Everest Region",
      duration: "12 days",
      difficulty: "moderate",
      maxParticipants: 8,
      price: 800,
      status: "inactive",
      bookings: 0,
      nextDate: "2024-06-15",
      description: "Beautiful trek to the pristine Gokyo Lakes",
    },
  ])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.role !== "guide") {
        router.push("/dashboard")
        return
      }
      setUser(payload)
    } catch {
      router.push("/signin")
    }
  }, [router])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "challenging":
        return "bg-orange-100 text-orange-800"
      case "extreme":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "full":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: trips.length,
    active: trips.filter((t) => t.status === "active").length,
    totalBookings: trips.reduce((sum, t) => sum + t.bookings, 0),
    revenue: trips.reduce((sum, t) => sum + t.bookings * t.price, 0),
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-2">Manage your trekking and adventure offerings</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Trip
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Trips</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.totalBookings}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">${stats.revenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search trips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{trip.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {trip.destination}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                    <Badge className={getDifficultyColor(trip.difficulty)}>{trip.difficulty}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{trip.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{trip.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${trip.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Bookings:</span>
                    <span className="font-medium">
                      {trip.bookings}/{trip.maxParticipants}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Next Date:</span>
                    <span className="font-medium">{new Date(trip.nextDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
              <p className="text-gray-600">No trips match your current filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
