"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Star,
  ArrowLeft,
  Mountain,
  MapPin,
  Users,
  Calendar,
  Languages,
  Shield,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Camera,
  Heart,
  Share2,
  Clock,
  DollarSign,
  CheckCircle,
  Send,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Guide {
  _id: string
  name: string
  bio: string
  profileImage?: string
  experience: number
  specialties: string[]
  languages: string[]
  certifications: string[]
  location: string
  contactInfo: {
    phone?: string
    email?: string
    whatsapp?: string
    website?: string
  }
  totalHikes: number
  totalClients: number
  rating: number
  reviewCount: number
  dailyRate: number
  currency: string
  isVerified: boolean
  joinedDate: string
  stories?: GuideStory[]
  hikes?: GuideHike[]
}

interface GuideStory {
  _id: string
  authorName: string
  title: string
  content: string
  images?: string[]
  hikeName: string
  hikeDate: string
  rating: number
  tags: string[]
  createdAt: string
}

interface GuideHike {
  _id: string
  name: string
  description: string
  location: string
  difficulty: string
  duration: string
  distance: number
  elevation: number
  price: number
  images: string[]
  bestSeason: string
}

// Sample guide data
const sampleGuide: Guide = {
  _id: "guide1",
  name: "Pemba Sherpa",
  bio: "Experienced high-altitude guide with over 15 years in the Himalayas. Summited Everest 8 times and led hundreds of successful expeditions to base camps and peaks across Nepal. Known for exceptional safety record and deep cultural knowledge of the Khumbu region.",
  profileImage: "/images/guide-pemba.jpg",
  experience: 15,
  specialties: ["High-altitude trekking", "Mountaineering", "Cultural tours", "Photography expeditions"],
  languages: ["English", "Nepali", "Tibetan", "Hindi"],
  certifications: [
    "IFMGA Mountain Guide",
    "Wilderness First Aid",
    "High Altitude Medicine",
    "Avalanche Safety Level 2",
  ],
  location: "Khumbu Valley, Nepal",
  contactInfo: {
    phone: "+977-9841234567",
    email: "pemba@himalayaguides.com",
    whatsapp: "+977-9841234567",
    website: "www.pembaguide.com",
  },
  totalHikes: 342,
  totalClients: 1247,
  rating: 4.9,
  reviewCount: 156,
  dailyRate: 85,
  currency: "USD",
  isVerified: true,
  joinedDate: "2018-03-15",
  stories: [
    {
      _id: "story1",
      authorName: "John Smith",
      title: "Life-changing Everest Base Camp Trek",
      content:
        "Pemba made our EBC trek absolutely incredible. His knowledge of the mountains, culture, and safety protocols is unmatched. He shared fascinating stories about Sherpa culture and helped us acclimatize perfectly. The sunrise from Kala Patthar was magical, and Pemba's photography tips helped us capture memories that will last forever.",
      images: ["/images/story1-1.jpg", "/images/story1-2.jpg"],
      hikeName: "Everest Base Camp Trek",
      hikeDate: "2023-10-15",
      rating: 5,
      tags: ["Everest", "Base Camp", "Cultural", "Photography"],
      createdAt: "2023-11-01",
    },
    {
      _id: "story2",
      authorName: "Maria Garcia",
      title: "Amazing Gokyo Lakes Adventure",
      content:
        "What an incredible experience with Pemba! The Gokyo Lakes trek was challenging but so rewarding. Pemba's expertise in high-altitude trekking kept us safe and comfortable throughout. His stories about the region's history and his own climbing experiences made every day fascinating. Highly recommend!",
      images: ["/images/story2-1.jpg"],
      hikeName: "Gokyo Lakes Trek",
      hikeDate: "2023-09-20",
      rating: 5,
      tags: ["Gokyo", "Lakes", "High-altitude", "Adventure"],
      createdAt: "2023-10-05",
    },
  ],
  hikes: [
    {
      _id: "hike1",
      name: "Everest Base Camp Classic Trek",
      description: "The ultimate Himalayan adventure to the base of the world's highest peak",
      location: "Khumbu Valley, Nepal",
      difficulty: "Challenging",
      duration: "14-16 days",
      distance: 130,
      elevation: 5364,
      price: 2499,
      images: ["/images/ebc-trek.jpg"],
      bestSeason: "March-May, September-November",
    },
    {
      _id: "hike2",
      name: "Gokyo Lakes & Ri Trek",
      description: "Stunning alpine lakes with panoramic mountain views",
      location: "Khumbu Valley, Nepal",
      difficulty: "Challenging",
      duration: "12-14 days",
      distance: 95,
      elevation: 5357,
      price: 1899,
      images: ["/images/gokyo-trek.jpg"],
      bestSeason: "March-May, October-November",
    },
  ],
}

export default function GuideProfilePage() {
  const params = useParams()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showStoryDialog, setShowStoryDialog] = useState(false)
  const [contactForm, setContactForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    message: "",
    preferredDate: "",
    groupSize: "1",
    hikeInterest: "",
  })
  const [storyForm, setStoryForm] = useState({
    title: "",
    content: "",
    hikeName: "",
    hikeDate: "",
    rating: 5,
    tags: "",
  })

  useEffect(() => {
    async function loadGuide() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/guides/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch guide")

        const data = await res.json()
        if (data.guide) {
          setGuide(data.guide)
        } else {
          setError("Guide not found")
        }
      } catch (error) {
        console.error("Error loading guide:", error)
        setError("Failed to load guide information")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadGuide()
    }
  }, [params.id])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/guides/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guideId: guide?._id,
          ...contactForm,
        }),
      })

      if (res.ok) {
        alert("Contact request sent successfully!")
        setShowContactDialog(false)
        setContactForm({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          message: "",
          preferredDate: "",
          groupSize: "1",
          hikeInterest: "",
        })
      }
    } catch (error) {
      console.error("Error sending contact:", error)
      alert("Failed to send contact request")
    }
  }

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/guides/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guideId: guide?._id,
          authorId: "user123", // This would come from auth
          authorName: "Current User", // This would come from auth
          ...storyForm,
          tags: storyForm.tags.split(",").map((tag) => tag.trim()),
        }),
      })

      if (res.ok) {
        alert("Story submitted successfully and is pending approval!")
        setShowStoryDialog(false)
        setStoryForm({
          title: "",
          content: "",
          hikeName: "",
          hikeDate: "",
          rating: 5,
          tags: "",
        })
      }
    } catch (error) {
      console.error("Error submitting story:", error)
      alert("Failed to submit story")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Guide not found"}</h1>
          <p className="text-gray-600 mb-6">
            {error === "Failed to load guide information"
              ? "There was an issue loading the guide's profile. Please try again later."
              : "The guide you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/guides">
            <Button>Back to Guides</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/guides">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Guides
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Heart className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={guide.profileImage || "/placeholder.svg?height=400&width=1200&query=mountain guide hero background"}
          alt={guide.name}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.7)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src={guide.profileImage || "/placeholder.svg?height=128&width=128&query=professional guide portrait"}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">{guide.name}</h1>
                  {guide.isVerified && (
                    <Badge className="bg-green-500 text-white">
                      <Shield className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-white/90 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {guide.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {guide.experience} years experience
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{guide.rating}</span>
                    <span className="text-white/70">({guide.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-white/90">
                  <span className="flex items-center gap-1">
                    <Mountain className="w-4 h-4" />
                    {guide.totalHikes} hikes completed
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {guide.totalClients} happy clients
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />${guide.dailyRate}/day
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Contact Guide
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Contact {guide.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="clientName">Your Name</Label>
                        <Input
                          id="clientName"
                          value={contactForm.clientName}
                          onChange={(e) => setContactForm({ ...contactForm, clientName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientEmail">Email</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={contactForm.clientEmail}
                          onChange={(e) => setContactForm({ ...contactForm, clientEmail: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPhone">Phone (Optional)</Label>
                        <Input
                          id="clientPhone"
                          value={contactForm.clientPhone}
                          onChange={(e) => setContactForm({ ...contactForm, clientPhone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="groupSize">Group Size</Label>
                        <Input
                          id="groupSize"
                          type="number"
                          min="1"
                          value={contactForm.groupSize}
                          onChange={(e) => setContactForm({ ...contactForm, groupSize: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="preferredDate">Preferred Date</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={contactForm.preferredDate}
                          onChange={(e) => setContactForm({ ...contactForm, preferredDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Tell us about your hiking plans..."
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-gray-900 gap-2 bg-transparent"
                    >
                      <Camera className="w-5 h-5" />
                      Write Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Share Your Experience with {guide.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleStorySubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="storyTitle">Story Title</Label>
                        <Input
                          id="storyTitle"
                          value={storyForm.title}
                          onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                          placeholder="Amazing adventure with..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="hikeName">Hike/Trek Name</Label>
                        <Input
                          id="hikeName"
                          value={storyForm.hikeName}
                          onChange={(e) => setStoryForm({ ...storyForm, hikeName: e.target.value })}
                          placeholder="Everest Base Camp Trek"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="hikeDate">Date of Hike</Label>
                        <Input
                          id="hikeDate"
                          type="date"
                          value={storyForm.hikeDate}
                          onChange={(e) => setStoryForm({ ...storyForm, hikeDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <select
                          id="rating"
                          value={storyForm.rating}
                          onChange={(e) => setStoryForm({ ...storyForm, rating: Number.parseInt(e.target.value) })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {[5, 4, 3, 2, 1].map((num) => (
                            <option key={num} value={num}>
                              {num} Star{num !== 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="storyContent">Your Story</Label>
                        <Textarea
                          id="storyContent"
                          value={storyForm.content}
                          onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                          placeholder="Share your experience, what made it special, and how the guide helped make your adventure memorable..."
                          rows={6}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={storyForm.tags}
                          onChange={(e) => setStoryForm({ ...storyForm, tags: e.target.value })}
                          placeholder="adventure, mountains, culture, photography"
                        />
                      </div>
                      <Button type="submit" className="w-full gap-2">
                        <Send className="w-4 h-4" />
                        Submit Story
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stories">Stories ({guide.stories?.length || 0})</TabsTrigger>
              <TabsTrigger value="hikes">Hikes ({guide.hikes?.length || 0})</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4">About {guide.name}</h2>
                    <p className="text-gray-600 leading-relaxed">{guide.bio}</p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties && guide.specialties.length > 0 ? (
                        guide.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                            {specialty}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No specialties listed</p>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-semibold">{guide.experience} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Hikes</span>
                        <span className="font-semibold">{guide.totalHikes}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Happy Clients</span>
                        <span className="font-semibold">{guide.totalClients}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{guide.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.languages && guide.languages.length > 0 ? (
                        guide.languages.map((language, index) => (
                          <Badge key={index} variant="outline">
                            <Languages className="w-3 h-3 mr-1" />
                            {language}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No languages listed</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Certifications</h3>
                    <div className="space-y-2">
                      {guide.certifications && guide.certifications.length > 0 ? (
                        guide.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No certifications listed</p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stories" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Client Stories</h2>
                <Dialog open={showStoryDialog} onOpenChange={setShowStoryDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Camera className="w-4 h-4" />
                      Write Your Story
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.stories?.map((story) => (
                  <Card key={story._id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{story.title}</h3>
                        <p className="text-sm text-gray-600">by {story.authorName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-4">{story.content}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{story.hikeName}</span>
                      <span>{new Date(story.hikeDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {story.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hikes" className="space-y-6">
              <h2 className="text-2xl font-bold">Available Hikes & Treks</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.hikes?.map((hike) => (
                  <Card key={hike._id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={hike.images?.[0] || "/placeholder.svg?height=200&width=400&query=mountain hiking trail"}
                        alt={hike.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-black/50 text-white">{hike.difficulty}</Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2">{hike.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{hike.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {hike.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {hike.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mountain className="w-4 h-4" />
                          {hike.elevation}m
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {hike.bestSeason}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${hike.price}</span>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                  <div className="space-y-4">
                    {guide.contactInfo?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-gray-600">{guide.contactInfo.email}</div>
                        </div>
                      </div>
                    )}

                    {guide.contactInfo?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">Phone</div>
                          <div className="text-gray-600">{guide.contactInfo.phone}</div>
                        </div>
                      </div>
                    )}

                    {guide.contactInfo?.whatsapp && (
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">WhatsApp</div>
                          <div className="text-gray-600">{guide.contactInfo.whatsapp}</div>
                        </div>
                      </div>
                    )}

                    {guide.contactInfo?.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium">Website</div>
                          <div className="text-gray-600">{guide.contactInfo.website}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={contactForm.clientName}
                        onChange={(e) => setContactForm({ ...contactForm, clientName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.clientEmail}
                        onChange={(e) => setContactForm({ ...contactForm, clientEmail: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="groupSize">Group Size</Label>
                        <Input
                          id="groupSize"
                          type="number"
                          min="1"
                          value={contactForm.groupSize}
                          onChange={(e) => setContactForm({ ...contactForm, groupSize: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={contactForm.preferredDate}
                          onChange={(e) => setContactForm({ ...contactForm, preferredDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell us about your hiking plans and any specific requirements..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
