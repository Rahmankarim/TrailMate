"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Star,
  ArrowRight,
  Mountain,
  MapPin,
  Filter,
  Search,
  Users,
  Award,
  Languages,
  Shield,
  MessageCircle,
  Camera,
  Compass,
} from "lucide-react"
import Link from "next/link"

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
}

// Professional sample guides data
const sampleGuides: Guide[] = [
  {
    _id: "guide1",
    name: "Pemba Sherpa",
    bio: "Experienced high-altitude guide with over 15 years in the Himalayas. Summited Everest 8 times and led hundreds of successful expeditions to base camps and peaks across Nepal.",
    profileImage: "/images/guide-pemba.jpg",
    experience: 15,
    specialties: ["High-altitude trekking", "Mountaineering", "Cultural tours", "Photography expeditions"],
    languages: ["English", "Nepali", "Tibetan", "Hindi"],
    certifications: ["IFMGA Mountain Guide", "Wilderness First Aid", "High Altitude Medicine"],
    location: "Khumbu Valley, Nepal",
    contactInfo: {
      phone: "+977-9841234567",
      email: "pemba@himalayaguides.com",
      whatsapp: "+977-9841234567",
    },
    totalHikes: 342,
    totalClients: 1247,
    rating: 4.9,
    reviewCount: 156,
    dailyRate: 85,
    currency: "USD",
    isVerified: true,
    joinedDate: "2018-03-15",
  },
  {
    _id: "guide2",
    name: "Sarah Mitchell",
    bio: "Professional trekking guide specializing in Annapurna region with expertise in sustainable tourism and wildlife photography. Passionate about sharing Nepal's natural beauty responsibly.",
    profileImage: "/images/guide-sarah.jpg",
    experience: 8,
    specialties: ["Annapurna treks", "Wildlife photography", "Sustainable tourism", "Solo female travelers"],
    languages: ["English", "Nepali", "French"],
    certifications: ["Nepal Trekking Guide License", "Wildlife Photography Certification", "Leave No Trace Trainer"],
    location: "Pokhara, Nepal",
    contactInfo: {
      phone: "+977-9856789012",
      email: "sarah@annapurnatreks.com",
      website: "www.sarahmitchellguide.com",
    },
    totalHikes: 187,
    totalClients: 623,
    rating: 4.8,
    reviewCount: 89,
    dailyRate: 65,
    currency: "USD",
    isVerified: true,
    joinedDate: "2019-07-22",
  },
  {
    _id: "guide3",
    name: "Ahmed Khan",
    bio: "Expert guide for Pakistan's northern areas including K2, Nanga Parbat, and Hunza Valley. Specializes in technical climbing and extreme altitude expeditions with impeccable safety record.",
    profileImage: "/images/guide-ahmed.jpg",
    experience: 12,
    specialties: ["Technical climbing", "K2 expeditions", "Karakoram range", "Extreme altitude"],
    languages: ["English", "Urdu", "Balti", "Wakhi"],
    certifications: ["Pakistan Alpine Club Guide", "Technical Rescue Certification", "Avalanche Safety"],
    location: "Skardu, Pakistan",
    contactInfo: {
      phone: "+92-3001234567",
      email: "ahmed@karakoramexpeditions.pk",
      whatsapp: "+92-3001234567",
    },
    totalHikes: 98,
    totalClients: 287,
    rating: 4.9,
    reviewCount: 42,
    dailyRate: 95,
    currency: "USD",
    isVerified: true,
    joinedDate: "2020-01-10",
  },
  {
    _id: "guide4",
    name: "Maria Rodriguez",
    bio: "Bilingual guide with expertise in cultural immersion treks and family-friendly adventures. Specializes in making the mountains accessible to all ages and fitness levels.",
    profileImage: "/images/guide-maria.jpg",
    experience: 6,
    specialties: ["Family treks", "Cultural immersion", "Beginner-friendly", "Photography"],
    languages: ["English", "Spanish", "Nepali"],
    certifications: ["International Trekking Guide", "First Aid Certified", "Cultural Heritage Guide"],
    location: "Kathmandu, Nepal",
    contactInfo: {
      phone: "+977-9812345678",
      email: "maria@familytreks.com",
    },
    totalHikes: 124,
    totalClients: 456,
    rating: 4.7,
    reviewCount: 67,
    dailyRate: 55,
    currency: "USD",
    isVerified: true,
    joinedDate: "2021-05-18",
  },
]

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("all")
  const [specialty, setSpecialty] = useState("all")
  const [minRating, setMinRating] = useState("all")
  const [maxRate, setMaxRate] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [filtered, setFiltered] = useState<Guide[]>([])

  useEffect(() => {
    async function loadGuides() {
      try {
        setLoading(true)
        
        // Get token from localStorage for authenticated requests
        const token = localStorage.getItem("token")
        const headers: HeadersInit = {}
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }
        
        const params = new URLSearchParams()
        if (location !== "all") params.set("location", location)
        if (specialty !== "all") params.set("specialty", specialty)
        if (minRating !== "all") params.set("minRating", minRating)
        if (maxRate !== "all") params.set("maxRate", maxRate)

        const res = await fetch(`/api/guides/list?${params.toString()}`, { headers })
        if (!res.ok) throw new Error("Failed to fetch guides")

        const data = await res.json()
        let guidesList = data.guides || []

        // Use sample data if API returns empty
        if (guidesList.length === 0) {
          guidesList = sampleGuides
        }

        setGuides(guidesList)
        setFiltered(guidesList)
      } catch (error) {
        console.error("Error loading guides:", error)
        // Fallback to sample data
        setGuides(sampleGuides)
        setFiltered(sampleGuides)
      } finally {
        setLoading(false)
      }
    }

    loadGuides()
  }, [location, specialty, minRating, maxRate])

  useEffect(() => {
    let result = [...guides]

    if (search) {
      result = result.filter(
        (guide) =>
          guide.name.toLowerCase().includes(search.toLowerCase()) ||
          guide.bio.toLowerCase().includes(search.toLowerCase()) ||
          guide.location.toLowerCase().includes(search.toLowerCase()) ||
          guide.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase())),
      )
    }

    setFiltered(result)
  }, [guides, search])

  const headlineContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }
  const headlineItem = {
    hidden: { y: 18, opacity: 0, scale: 0.98 },
    show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6 } },
  }

  const locations = Array.from(new Set(guides.map((g) => g.location))).slice(0, 10)
  const specialties = Array.from(new Set(guides.flatMap((g) => g.specialties))).slice(0, 10)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
      <section className="relative w-full h-[70vh] flex flex-col justify-center items-center overflow-hidden">
        <img
          src="/images/attabad.jpg"
          alt="Professional Mountain Guides"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.5)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-10" />

        <motion.div
          className="relative z-20 text-center px-6 max-w-5xl"
          variants={headlineContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={headlineItem} className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Meet Our Expert Guides
          </motion.h1>
          <motion.p
            variants={headlineItem}
            className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with professional mountain guides who bring years of experience, local knowledge, and passion for
            adventure to every journey
          </motion.p>

          <motion.div
            variants={headlineItem}
            className="bg-white/98 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto border border-white/20"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search guides by name, location, or specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-14 text-base border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-14 px-6 rounded-xl border-gray-200 hover:bg-gray-50"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {specialties.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Min Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={maxRate} onValueChange={setMaxRate}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Max Rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rate</SelectItem>
                      <SelectItem value="50">Under $50/day</SelectItem>
                      <SelectItem value="75">Under $75/day</SelectItem>
                      <SelectItem value="100">Under $100/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Guides Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Mountain Guides</h2>
              <p className="text-xl text-gray-600">{filtered.length} experienced guides ready to lead your adventure</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-t-xl"></div>
                  <div className="bg-white p-6 rounded-b-xl border border-t-0">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((guide) => (
                <Card
                  key={guide._id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-lg"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={
                        guide.profileImage ||
                        "/placeholder.svg?height=320&width=400&query=professional mountain guide portrait"
                      }
                      alt={guide.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 flex gap-2">
                      {guide.isVerified && (
                        <Badge className="bg-green-500 text-white border-0 shadow-lg">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge className="bg-blue-500 text-white border-0 shadow-lg">{guide.experience}+ Years</Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-semibold">{guide.rating}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-2xl mb-2 drop-shadow-lg">{guide.name}</h3>
                      <div className="flex items-center gap-2 text-white/95 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        {guide.location}
                      </div>
                      <div className="flex items-center gap-4 text-white/90 text-sm">
                        <span className="flex items-center gap-1">
                          <Mountain className="w-4 h-4" />
                          {guide.totalHikes} hikes
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {guide.totalClients} clients
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{guide.bio}</p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {guide.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                            {specialty}
                          </Badge>
                        ))}
                        {guide.specialties.length > 3 && (
                          <Badge variant="secondary" className="bg-gray-50 text-gray-600">
                            +{guide.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Languages className="w-4 h-4" />
                          {guide.languages.length} languages
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {guide.certifications.length} certs
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="text-2xl font-bold text-gray-900">${guide.dailyRate}</div>
                        <div className="text-sm text-gray-500">per day</div>
                      </div>
                      <Link href={`/guides/${guide._id}`}>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl">
                          View Profile
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <Compass className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No guides found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find the perfect guide for your adventure
              </p>
              <Button
                onClick={() => {
                  setSearch("")
                  setLocation("all")
                  setSpecialty("all")
                  setMinRating("all")
                  setMaxRate("all")
                }}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-3"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Connect with our professional guides and discover the mountains like never before. Every journey is
            personalized to your experience level and interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="rounded-xl px-8 py-4">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Camera className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
