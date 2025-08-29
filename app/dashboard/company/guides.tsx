"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mountain, Plus, Edit, Trash2, Users, Star, MapPin, Clock, Eye, TrendingUp, Award } from "lucide-react"

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
}

interface Hike {
  _id: string
  name: string
  description: string
  location: string
  difficulty: "Easy" | "Moderate" | "Challenging" | "Expert"
  duration: string
  distance: number
  elevation: number
  maxGroupSize: number
  price: number
  images: string[]
  bestSeason: string
  isActive: boolean
  createdAt: string
}

export default function CompanyGuides() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [hikes, setHikes] = useState<Hike[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("guides")
  const [showAddGuideDialog, setShowAddGuideDialog] = useState(false)
  const [showAddHikeDialog, setShowAddHikeDialog] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState<string>("")

  const [guideForm, setGuideForm] = useState({
    name: "",
    bio: "",
    experience: "",
    specialties: "",
    languages: "",
    location: "",
    dailyRate: "",
    contactPhone: "",
    contactEmail: "",
  })

  const [hikeForm, setHikeForm] = useState({
    name: "",
    description: "",
    location: "",
    difficulty: "Easy" as const,
    duration: "",
    distance: "",
    elevation: "",
    maxGroupSize: "",
    price: "",
    bestSeason: "",
    includedServices: "",
    requirements: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      // Fetch guides
      const resGuides = await fetch("/api/guides/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const dataGuides = await resGuides.json()
      setGuides(dataGuides.guides || [])

      // Fetch hikes
      const resHikes = await fetch("/api/guides/hikes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const dataHikes = await resHikes.json()
      setHikes(dataHikes.hikes || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddGuide(e: React.FormEvent) {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...guideForm,
          experience: Number.parseInt(guideForm.experience),
          dailyRate: Number.parseFloat(guideForm.dailyRate),
          specialties: guideForm.specialties.split(",").map((s) => s.trim()),
          languages: guideForm.languages.split(",").map((l) => l.trim()),
          contactInfo: {
            phone: guideForm.contactPhone,
            email: guideForm.contactEmail,
          },
        }),
      })

      if (res.ok) {
        alert("Guide added successfully!")
        setShowAddGuideDialog(false)
        setGuideForm({
          name: "",
          bio: "",
          experience: "",
          specialties: "",
          languages: "",
          location: "",
          dailyRate: "",
          contactPhone: "",
          contactEmail: "",
        })
        fetchData()
      } else {
        alert("Failed to add guide")
      }
    } catch (error) {
      console.error("Error adding guide:", error)
      alert("Failed to add guide")
    }
  }

  async function handleAddHike(e: React.FormEvent) {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/guides/hikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...hikeForm,
          guideId: selectedGuide,
          distance: Number.parseFloat(hikeForm.distance),
          elevation: Number.parseFloat(hikeForm.elevation),
          maxGroupSize: Number.parseInt(hikeForm.maxGroupSize),
          price: Number.parseFloat(hikeForm.price),
          includedServices: hikeForm.includedServices.split(",").map((s) => s.trim()),
          requirements: hikeForm.requirements.split(",").map((r) => r.trim()),
        }),
      })

      if (res.ok) {
        alert("Hike added successfully!")
        setShowAddHikeDialog(false)
        setHikeForm({
          name: "",
          description: "",
          location: "",
          difficulty: "Easy",
          duration: "",
          distance: "",
          elevation: "",
          maxGroupSize: "",
          price: "",
          bestSeason: "",
          includedServices: "",
          requirements: "",
        })
        fetchData()
      } else {
        alert("Failed to add hike")
      }
    } catch (error) {
      console.error("Error adding hike:", error)
      alert("Failed to add hike")
    }
  }

  async function handleDeleteGuide(id: string) {
    if (!confirm("Are you sure you want to delete this guide?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/guides/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setGuides(guides.filter((g) => g._id !== id))
      } else {
        alert("Failed to delete guide")
      }
    } catch (error) {
      console.error("Error deleting guide:", error)
      alert("Failed to delete guide")
    }
  }

  async function handleDeleteHike(id: string) {
    if (!confirm("Are you sure you want to delete this hike?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/guides/hikes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setHikes(hikes.filter((h) => h._id !== id))
      } else {
        alert("Failed to delete hike")
      }
    } catch (error) {
      console.error("Error deleting hike:", error)
      alert("Failed to delete hike")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Challenging":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Guides & Hikes Management</h1>
            <p className="text-gray-600">Manage your professional guides and hiking experiences</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/dashboard/company"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700"
            >
              Back to Dashboard
            </a>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Guides ({guides.length})
            </TabsTrigger>
            <TabsTrigger value="hikes" className="flex items-center gap-2">
              <Mountain className="w-4 h-4" />
              Hikes & Treks ({hikes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Professional Guides</h2>
              <Dialog open={showAddGuideDialog} onOpenChange={setShowAddGuideDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4" />
                    Add Guide
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Guide</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddGuide} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Guide Name</Label>
                        <Input
                          id="name"
                          value={guideForm.name}
                          onChange={(e) => setGuideForm({ ...guideForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={guideForm.experience}
                          onChange={(e) => setGuideForm({ ...guideForm, experience: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={guideForm.bio}
                        onChange={(e) => setGuideForm({ ...guideForm, bio: e.target.value })}
                        placeholder="Tell us about the guide's experience and expertise..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={guideForm.location}
                          onChange={(e) => setGuideForm({ ...guideForm, location: e.target.value })}
                          placeholder="e.g., Kathmandu, Nepal"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dailyRate">Daily Rate (USD)</Label>
                        <Input
                          id="dailyRate"
                          type="number"
                          value={guideForm.dailyRate}
                          onChange={(e) => setGuideForm({ ...guideForm, dailyRate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                        <Input
                          id="specialties"
                          value={guideForm.specialties}
                          onChange={(e) => setGuideForm({ ...guideForm, specialties: e.target.value })}
                          placeholder="High-altitude trekking, Photography, Cultural tours"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="languages">Languages (comma-separated)</Label>
                        <Input
                          id="languages"
                          value={guideForm.languages}
                          onChange={(e) => setGuideForm({ ...guideForm, languages: e.target.value })}
                          placeholder="English, Nepali, Hindi"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input
                          id="contactPhone"
                          value={guideForm.contactPhone}
                          onChange={(e) => setGuideForm({ ...guideForm, contactPhone: e.target.value })}
                          placeholder="+977-9841234567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={guideForm.contactEmail}
                          onChange={(e) => setGuideForm({ ...guideForm, contactEmail: e.target.value })}
                          placeholder="guide@example.com"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Guide
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                    <div className="bg-white p-6 rounded-b-xl border border-t-0">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <Card key={guide._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                      <img
                        src={
                          guide.profileImage ||
                          "/placeholder.svg?height=200&width=300&query=professional guide portrait"
                        }
                        alt={guide.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        {guide.isVerified && <Badge className="bg-green-500 text-white">Verified</Badge>}
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

                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-2">{guide.bio}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
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

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">${guide.dailyRate}/day</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => handleDeleteGuide(guide._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!loading && guides.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
                <p className="text-gray-600 mb-6">Start by adding your first professional guide</p>
                <Dialog open={showAddGuideDialog} onOpenChange={setShowAddGuideDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First Guide
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </TabsContent>

          <TabsContent value="hikes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Hikes & Trekking Experiences</h2>
              <Dialog open={showAddHikeDialog} onOpenChange={setShowAddHikeDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4" />
                    Add Hike/Trek
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add New Hike/Trek</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddHike} className="space-y-4">
                    <div>
                      <Label htmlFor="guideSelect">Select Guide</Label>
                      <select
                        id="guideSelect"
                        value={selectedGuide}
                        onChange={(e) => setSelectedGuide(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Choose a guide...</option>
                        {guides.map((guide) => (
                          <option key={guide._id} value={guide._id}>
                            {guide.name} - {guide.location}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hikeName">Hike/Trek Name</Label>
                        <Input
                          id="hikeName"
                          value={hikeForm.name}
                          onChange={(e) => setHikeForm({ ...hikeForm, name: e.target.value })}
                          placeholder="Everest Base Camp Trek"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="hikeLocation">Location</Label>
                        <Input
                          id="hikeLocation"
                          value={hikeForm.location}
                          onChange={(e) => setHikeForm({ ...hikeForm, location: e.target.value })}
                          placeholder="Khumbu Valley, Nepal"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={hikeForm.description}
                        onChange={(e) => setHikeForm({ ...hikeForm, description: e.target.value })}
                        placeholder="Describe the hiking experience, what makes it special..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <select
                          id="difficulty"
                          value={hikeForm.difficulty}
                          onChange={(e) => setHikeForm({ ...hikeForm, difficulty: e.target.value as any })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Challenging">Challenging</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={hikeForm.duration}
                          onChange={(e) => setHikeForm({ ...hikeForm, duration: e.target.value })}
                          placeholder="14-16 days"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="distance">Distance (km)</Label>
                        <Input
                          id="distance"
                          type="number"
                          value={hikeForm.distance}
                          onChange={(e) => setHikeForm({ ...hikeForm, distance: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="elevation">Max Elevation (m)</Label>
                        <Input
                          id="elevation"
                          type="number"
                          value={hikeForm.elevation}
                          onChange={(e) => setHikeForm({ ...hikeForm, elevation: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxGroupSize">Max Group Size</Label>
                        <Input
                          id="maxGroupSize"
                          type="number"
                          value={hikeForm.maxGroupSize}
                          onChange={(e) => setHikeForm({ ...hikeForm, maxGroupSize: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (USD)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={hikeForm.price}
                          onChange={(e) => setHikeForm({ ...hikeForm, price: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bestSeason">Best Season</Label>
                        <Input
                          id="bestSeason"
                          value={hikeForm.bestSeason}
                          onChange={(e) => setHikeForm({ ...hikeForm, bestSeason: e.target.value })}
                          placeholder="March-May, September-November"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="includedServices">Included Services (comma-separated)</Label>
                      <Input
                        id="includedServices"
                        value={hikeForm.includedServices}
                        onChange={(e) => setHikeForm({ ...hikeForm, includedServices: e.target.value })}
                        placeholder="Guide, Permits, Accommodation, Meals"
                      />
                    </div>
                    <div>
                      <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                      <Input
                        id="requirements"
                        value={hikeForm.requirements}
                        onChange={(e) => setHikeForm({ ...hikeForm, requirements: e.target.value })}
                        placeholder="Good fitness level, Previous trekking experience, Travel insurance"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Add Hike/Trek
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                    <div className="bg-white p-6 rounded-b-xl border border-t-0">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hikes.map((hike) => (
                  <Card key={hike._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={hike.images[0] || "/placeholder.svg?height=200&width=400&query=mountain hiking trail"}
                        alt={hike.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge className={getDifficultyColor(hike.difficulty)}>{hike.difficulty}</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-xl mb-1">{hike.name}</h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                          <MapPin className="w-3 h-3" />
                          {hike.location}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-2">{hike.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {hike.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mountain className="w-4 h-4" />
                          {hike.elevation}m
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {hike.distance}km
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Max {hike.maxGroupSize}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">${hike.price}</span>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          {hike.bestSeason}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Added {new Date(hike.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => handleDeleteHike(hike._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!loading && hikes.length === 0 && (
              <div className="text-center py-16">
                <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hikes found</h3>
                <p className="text-gray-600 mb-6">Start by adding your first hiking experience</p>
                <Dialog open={showAddHikeDialog} onOpenChange={setShowAddHikeDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" disabled={guides.length === 0}>
                      <Plus className="w-4 h-4" />
                      {guides.length === 0 ? "Add guides first" : "Add Your First Hike"}
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
