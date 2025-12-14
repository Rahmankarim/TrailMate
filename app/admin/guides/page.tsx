"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Shield, CheckCircle, XCircle, Search, Filter, Eye, Star, MapPin, Award, Mountain, Plus, ArrowLeft, UserCheck, UserX } from "lucide-react"

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
  const router = useRouter()
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
    experience: "",
    specialties: "",
    languages: "",
    location: "",
    dailyRate: "",
    isVerified: true,
    isActive: true,
  })
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

      const res = await fetch("/api/admin/guides", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setGuides(data.guides || [])

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

  async function handleCreateGuide(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem("token")

    try {
      const res = await fetch("/api/admin/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience),
          dailyRate: parseFloat(formData.dailyRate),
          specialties: formData.specialties.split(",").map((s) => s.trim()),
          languages: formData.languages.split(",").map((l) => l.trim()),
        }),
      })

      if (res.ok) {
        alert("Guide created successfully!")
        setShowAddForm(false)
        setFormData({
          name: "",
          bio: "",
          profileImage: "",
          experience: "",
          specialties: "",
          languages: "",
          location: "",
          dailyRate: "",
          isVerified: true,
          isActive: true,
        })
        fetchGuides()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to create guide")
      }
    } catch (error) {
      console.error("Error creating guide:", error)
      alert("Error creating guide")
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
        setGuides(guides.map((guide) => (guide._id === guideId ? { ...guide, [field]: value } : guide)))

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading guides...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Guide Management</h1>
          <p className="text-muted-foreground mt-1">Manage trail guides and their profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Guide
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateGuide} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years) *</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate ($) *</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    step="0.01"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image URL</Label>
                  <Input
                    id="profileImage"
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma-separated) *</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="Hiking, Camping, Rock Climbing"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">Languages (comma-separated) *</Label>
                  <Input
                    id="languages"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    placeholder="English, Spanish, French"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex items-center space-x-4 md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    />
                    <span>Verified</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Guide</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{stats.verified}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unverified</p>
                <p className="text-2xl font-bold">{stats.unverified}</p>
              </div>
              <XCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Guides</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredGuides.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuides.map((guide) => (
            <Card key={guide._id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    {guide.profileImage ? (
                      <img src={guide.profileImage} alt={guide.name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <Users className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{guide.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {guide.location}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {guide.isVerified && (
                        <Badge variant="outline" className="text-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant={guide.isActive ? "default" : "secondary"}>
                        {guide.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{guide.bio}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">{guide.experience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Rate:</span>
                    <span className="font-medium">${guide.dailyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {(guide.rating || 0).toFixed(1)} ({guide.reviewCount || 0})
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {(guide.specialties || []).slice(0, 3).map((specialty, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {(guide.specialties || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(guide.specialties || []).length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={guide.isVerified ? "outline" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => updateGuideStatus(guide._id, "isVerified", !guide.isVerified)}
                  >
                    {guide.isVerified ? (
                      <>
                        <UserX className="h-4 w-4 mr-1" />
                        Unverify
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Verify
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => updateGuideStatus(guide._id, "isActive", !guide.isActive)}
                  >
                    {guide.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/guides/${guide._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
