"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mountain, Plus, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminHikes() {
  const router = useRouter()
  const [hikes, setHikes] = useState<any[]>([])
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
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
    guideId: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const token = localStorage.getItem("token")
    try {
      const [hikesRes, guidesRes] = await Promise.all([
        fetch("/api/guides/hikes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/guides", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (hikesRes.ok) {
        const hikesData = await hikesRes.json()
        setHikes(hikesData.hikes || [])
      }

      if (guidesRes.ok) {
        const guidesData = await guidesRes.json()
        setGuides(guidesData.guides || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem("token")

    try {
      const res = await fetch("/api/guides/hikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          distance: parseFloat(formData.distance),
          elevation: parseFloat(formData.elevation),
          maxGroupSize: parseInt(formData.maxGroupSize),
          price: parseFloat(formData.price),
        }),
      })

      if (res.ok) {
        alert("Hike created successfully!")
        setShowAddForm(false)
        setFormData({
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
          guideId: "",
        })
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to create hike")
      }
    } catch (error) {
      console.error("Error creating hike:", error)
      alert("Error creating hike")
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
                <Mountain className="h-8 w-8 text-emerald-400" />
                Manage Hikes & Treks
              </h1>
              <p className="text-slate-400">Create and manage all hiking experiences</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hike
          </Button>
        </div>

        {showAddForm && (
          <Card className="bg-slate-800 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Create New Hike</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Hike Name *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Location *</Label>
                    <Input
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Difficulty *</Label>
                    <select
                      required
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option>Easy</option>
                      <option>Moderate</option>
                      <option>Hard</option>
                      <option>Expert</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-slate-300">Duration *</Label>
                    <Input
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 3 days"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Distance (km) *</Label>
                    <Input
                      required
                      type="number"
                      step="0.1"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Elevation (m) *</Label>
                    <Input
                      required
                      type="number"
                      step="0.1"
                      value={formData.elevation}
                      onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Max Group Size *</Label>
                    <Input
                      required
                      type="number"
                      value={formData.maxGroupSize}
                      onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Price (USD) *</Label>
                    <Input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Best Season</Label>
                    <Input
                      value={formData.bestSeason}
                      onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                      placeholder="e.g. Spring, Summer"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Assign Guide</Label>
                    <select
                      value={formData.guideId}
                      onChange={(e) => setFormData({ ...formData, guideId: e.target.value })}
                      className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Select a guide (optional)</option>
                      {guides.map((guide) => (
                        <option key={guide._id} value={guide._id}>
                          {guide.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Description *</Label>
                  <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Create Hike
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
          {hikes.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-slate-400">No hikes found. Create your first hike!</p>
              </CardContent>
            </Card>
          ) : (
            hikes.map((hike: any) => (
              <Card key={hike._id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{hike.name}</h3>
                      <p className="text-slate-400 mb-4">{hike.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Location:</span>
                          <p className="text-white">{hike.location}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Difficulty:</span>
                          <p className="text-white">{hike.difficulty}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Duration:</span>
                          <p className="text-white">{hike.duration}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Price:</span>
                          <p className="text-white">${hike.price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          // Add delete functionality here
                        }}
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
