"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Plus, Trash2, Edit, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDestinations() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    detailedDescription: "",
    image: "",
    companyName: "",
    date: "",
    time: "",
    availableSeats: "",
    location: "",
    difficulty: "",
    duration: "",
    price: "",
    featured: false,
  })

  useEffect(() => {
    fetchDestinations()
  }, [])

  async function fetchDestinations() {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("/api/admin/destinations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setDestinations(data.destinations || [])
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem("token")

    try {
      const res = await fetch("/api/destination/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          availableSeats: parseInt(formData.availableSeats),
          price: parseFloat(formData.price),
        }),
      })

      if (res.ok) {
        alert("Destination created successfully!")
        setShowAddForm(false)
        setFormData({
          name: "",
          description: "",
          detailedDescription: "",
          image: "",
          companyName: "",
          date: "",
          time: "",
          availableSeats: "",
          location: "",
          difficulty: "",
          duration: "",
          price: "",
          featured: false,
        })
        fetchDestinations()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to create destination")
      }
    } catch (error) {
      console.error("Error creating destination:", error)
      alert("Error creating destination")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this destination?")) return

    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`/api/admin/destinations?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setDestinations(destinations.filter((d) => d._id !== id))
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/admin")}
              className="border-slate-600 text-slate-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <MapPin className="h-8 w-8 text-blue-400" />
                Manage Destinations
              </h1>
              <p className="text-slate-400">Create, edit, and manage all destinations</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Destination
          </Button>
        </div>

        {showAddForm && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Create New Destination</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Name *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Company Name *</Label>
                    <Input
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Difficulty</Label>
                    <Input
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Date *</Label>
                    <Input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Time *</Label>
                    <Input
                      required
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Available Seats *</Label>
                    <Input
                      required
                      type="number"
                      value={formData.availableSeats}
                      onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Price</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Duration</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g. 5 days"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Image URL *</Label>
                    <Input
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Description *</Label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Detailed Description</Label>
                  <Textarea
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={5}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label className="text-slate-300">Featured Destination</Label>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Destination
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {destinations.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-slate-400">No destinations found. Create your first destination!</p>
              </CardContent>
            </Card>
          ) : (
            destinations.map((dest) => (
              <Card key={dest._id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{dest.name}</h3>
                      <p className="text-slate-400 mb-4">{dest.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Company:</span>
                          <p className="text-white">{dest.companyName}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Location:</span>
                          <p className="text-white">{dest.location || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Price:</span>
                          <p className="text-white">${dest.price || 0}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Seats:</span>
                          <p className="text-white">{dest.availableSeats}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(dest._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
