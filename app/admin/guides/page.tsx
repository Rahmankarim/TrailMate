"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Shield, CheckCircle, XCircle, Search, Filter, Eye, Star, MapPin, Award, Mountain } from "lucide-react"

interface Guide {
  _id: string
  name: string
  bio: string
  profileImage?: string
  experience: number
  specialties: string[]
  languages: string[]
  location: string
  totalHikes: number
  totalClients: number
  rating: number
  reviewCount: number
  dailyRate: number
  isActive: boolean
  isVerified: boolean
  postedBy: string
  companyName?: string
  joinedDate: string
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // all, verified, unverified, active, inactive
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    active: 0,
    inactive: 0,
  })

  useEffect(() => {
    fetchGuides()
  }, [])

  async function fetchGuides() {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      // Fetch all guides (admin can see all)
      const res = await fetch("/api/admin/guides", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setGuides(data.guides || [])

        // Calculate stats
        const total = data.guides.length
        const verified = data.guides.filter((g: Guide) => g.isVerified).length
        const active = data.guides.filter((g: Guide) => g.isActive).length

        setStats({
          total,
          verified,
          unverified: total - verified,
          active,
          inactive: total - active,
        })
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateGuideStatus(guideId: string, field: "isVerified" | "isActive", value: boolean) {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/admin/guides/${guideId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      })

      if (res.ok) {
        // Update local state
        setGuides(guides.map((guide) => (guide._id === guideId ? { ...guide, [field]: value } : guide)))

        // Recalculate stats
        const updatedGuides = guides.map((guide) => (guide._id === guideId ? { ...guide, [field]: value } : guide))

        const total = updatedGuides.length
        const verified = updatedGuides.filter((g) => g.isVerified).length
        const active = updatedGuides.filter((g) => g.isActive).length

        setStats({
          total,
          verified,
          unverified: total - verified,
          active,
          inactive: total - active,
        })
      }
    } catch (error) {
      console.error("Error updating guide status:", error)
    }
  }

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "verified" && guide.isVerified) ||
      (filterStatus === "unverified" && !guide.isVerified) ||
      (filterStatus === "active" && guide.isActive) ||
      (filterStatus === "inactive" && !guide.isActive)

    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading guides...</p>
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
                <Users className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Guide Management</h1>
                <p className="text-slate-600 text-sm">Manage and oversee all platform guides</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => (window.location.href = "/admin/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Guides</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.verified}</div>
              <div className="text-sm text-slate-600">Verified</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.unverified}</div>
              <div className="text-sm text-slate-600">Unverified</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.active}</div>
              <div className="text-sm text-slate-600">Active</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <XCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{stats.inactive}</div>
              <div className="text-sm text-slate-600">Inactive</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search guides by name, location, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="all">All Guides</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Card key={guide._id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <img
                  src={guide.profileImage || "/placeholder.svg?height=200&width=300&query=professional guide portrait"}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge className={guide.isVerified ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                    {guide.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                  <Badge className={guide.isActive ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}>
                    {guide.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl mb-1">{guide.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-3 h-3" />
                    {guide.location}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-slate-600 mb-4 line-clamp-2">{guide.bio}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {guide.experience} years
                  </div>
                  <div className="flex items-center gap-1">
                    <Mountain className="w-4 h-4" />
                    {guide.totalHikes} hikes
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {guide.totalClients} clients
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {guide.rating} ({guide.reviewCount})
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {guide.specialties.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{guide.specialties.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-slate-900">${guide.dailyRate}/day</span>
                  <span className="text-sm text-slate-500">
                    Joined {new Date(guide.joinedDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={guide.isVerified ? "destructive" : "default"}
                      className="flex-1"
                      onClick={() => updateGuideStatus(guide._id, "isVerified", !guide.isVerified)}
                    >
                      {guide.isVerified ? (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Unverify
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verify
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={guide.isActive ? "destructive" : "default"}
                      className="flex-1"
                      onClick={() => updateGuideStatus(guide._id, "isActive", !guide.isActive)}
                    >
                      {guide.isActive ? (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => (window.location.href = `/guides/${guide._id}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && !loading && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No guides found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
