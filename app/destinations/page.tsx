"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowRight, Mountain, Clock, TrendingUp, MapPin, Filter, Search } from "lucide-react"
import { placeholderImages, slugify } from "@/lib/utils"
import Link from "next/link"

interface HikingDestination {
  _id: string
  name: string
  description?: string
  image?: string
  location?: string
  companyName?: string
  rating?: number
  reviews?: number
  images?: string[]
  difficulty?: "Easy" | "Moderate" | "Challenging" | "Expert"
  duration?: string
  elevation?: number
  distance?: number
  bestSeason?: string
  activities?: string[]
  price?: number
  featured?: boolean
}

const professionalHikingDestinations: HikingDestination[] = [
  {
    _id: "dest1",
    name: "Everest Base Camp Trek",
    description:
      "The ultimate high-altitude adventure to the base of the world's highest peak. Experience Sherpa culture, stunning mountain vistas, and the thrill of reaching 5,364m elevation.",
    image: "/images/everest-basecamp.jpg",
    location: "Khumbu, Nepal",
    rating: 4.9,
    reviews: 1247,
    difficulty: "Challenging",
    duration: "14-16 days",
    elevation: 5364,
    distance: 130,
    bestSeason: "March-May, September-November",
    activities: ["High-altitude trekking", "Cultural immersion", "Photography", "Mountaineering preparation"],
    price: 2499,
    featured: true,
  },
  {
    _id: "dest2",
    name: "Annapurna Circuit",
    description:
      "Classic Himalayan circuit trek offering diverse landscapes from subtropical forests to high alpine desert. Cross the challenging Thorong La Pass at 5,416m.",
    image: "/images/annapurna-circuit.jpg",
    location: "Annapurna Region, Nepal",
    rating: 4.8,
    reviews: 892,
    difficulty: "Challenging",
    duration: "12-18 days",
    elevation: 5416,
    distance: 230,
    bestSeason: "March-May, October-December",
    activities: ["Circuit trekking", "Pass crossing", "Village stays", "Hot springs"],
    price: 1899,
    featured: true,
  },
  {
    _id: "dest3",
    name: "Hunza Valley Explorer",
    description:
      "Discover the hidden gem of northern Pakistan with stunning views of Rakaposhi, Ultar Sar, and traditional Hunza culture in terraced valleys.",
    image: "/images/hunza-valley.jpg",
    location: "Gilgit-Baltistan, Pakistan",
    rating: 4.7,
    reviews: 634,
    difficulty: "Moderate",
    duration: "8-10 days",
    elevation: 3100,
    distance: 85,
    bestSeason: "April-October",
    activities: ["Cultural trekking", "Photography", "Fruit orchards", "Ancient forts"],
    price: 1299,
    featured: false,
  },
  {
    _id: "dest4",
    name: "K2 Base Camp Expedition",
    description:
      "The ultimate mountaineering challenge to the base of the world's second highest and most technical peak. For experienced trekkers only.",
    image: "/images/k2-basecamp.jpg",
    location: "Karakoram, Pakistan",
    rating: 4.9,
    reviews: 156,
    difficulty: "Expert",
    duration: "20-25 days",
    elevation: 5150,
    distance: 180,
    bestSeason: "June-August",
    activities: ["Extreme trekking", "Glacier crossing", "Technical climbing", "Expedition support"],
    price: 4999,
    featured: true,
  },
  {
    _id: "dest5",
    name: "Skardu Lakes Circuit",
    description:
      "Explore the pristine alpine lakes of Skardu including Satpara, Kachura, and Sheosar Lakes surrounded by dramatic peaks.",
    image: "/images/skardu-lakes.jpg",
    location: "Skardu, Pakistan",
    rating: 4.6,
    reviews: 423,
    difficulty: "Easy",
    duration: "5-7 days",
    elevation: 2500,
    distance: 45,
    bestSeason: "May-September",
    activities: ["Lake trekking", "Camping", "Fishing", "Photography"],
    price: 899,
    featured: false,
  },
  {
    _id: "dest6",
    name: "Nanga Parbat Base Camp",
    description:
      'Trek to the base of the "Killer Mountain" through fairy meadows and witness the massive south face of the 9th highest peak.',
    image: "/images/nanga-parbat.jpg",
    location: "Gilgit-Baltistan, Pakistan",
    rating: 4.8,
    reviews: 287,
    difficulty: "Challenging",
    duration: "10-12 days",
    elevation: 4200,
    distance: 95,
    bestSeason: "June-September",
    activities: ["High-altitude trekking", "Fairy meadows", "Base camp", "Alpine photography"],
    price: 1799,
    featured: false,
  },
]

const difficultyOptions = [
  { label: "Easy", value: "Easy" },
  { label: "Moderate", value: "Moderate" },
  { label: "Challenging", value: "Challenging" },
  { label: "Expert", value: "Expert" },
];

const durationOptions = [
  { label: "1-7 days", value: "short" },
  { label: "8-14 days", value: "medium" },
  { label: "15+ days", value: "long" },
];

const priceRanges = [
  { label: "Under $1000", value: "under1000" },
  { label: "$1000 - $2500", value: "1000to2500" },
  { label: "$2500+", value: "over2500" },
];

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<HikingDestination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [duration, setDuration] = useState("")
  const [price, setPrice] = useState("")
  const [location, setLocation] = useState("")
  const [filtered, setFiltered] = useState<HikingDestination[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/destination/list", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch destinations")
        const data = await res.json()
        let list = data.destinations || []
        if (!Array.isArray(list)) list = []

        // Use professional hiking data if API returns empty
        if (list.length === 0) {
          list = professionalHikingDestinations
        }

        setDestinations(list)
        setFiltered(list)
      } catch (e: any) {
        setError(e.message)
        // Fallback to professional data on error
        setDestinations(professionalHikingDestinations)
        setFiltered(professionalHikingDestinations)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let result = [...destinations]

    if (search) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.description?.toLowerCase().includes(search.toLowerCase()) ||
          d.location?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (difficulty) {
      result = result.filter((d) => d.difficulty === difficulty)
    }

    if (duration) {
      result = result.filter((d) => {
        const days = Number.parseInt(d.duration?.split("-")[0] || "0")
        if (duration === "short") return days <= 7
        if (duration === "medium") return days >= 8 && days <= 14
        if (duration === "long") return days >= 15
        return true
      })
    }

    if (price) {
      result = result.filter((d) => {
        const destPrice = d.price || 0
        if (price === "under1000") return destPrice < 1000
        if (price === "1000to2500") return destPrice >= 1000 && destPrice <= 2500
        if (price === "over2500") return destPrice > 2500
        return true
      })
    }

    if (location) {
      result = result.filter((d) => d.location?.toLowerCase().includes(location.toLowerCase()))
    }

    setFiltered(result)
  }, [destinations, search, difficulty, duration, price, location])

  const featuredDestinations = filtered.filter((d) => d.featured)
  const regularDestinations = filtered.filter((d) => !d.featured)

  const headlineContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }
  const headlineItem = {
    hidden: { y: 18, opacity: 0, scale: 0.98 },
    show: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6 } },
  }

  const getDifficultyColor = (difficulty?: string) => {
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
    <main className="min-h-screen bg-white text-gray-900">
      <section className="relative w-full h-[70vh] flex flex-col justify-center items-center overflow-hidden">
        <img
          src="/images/mount.jpg"
          alt="Mountain Adventure Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.6)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 z-10" />

        <motion.div
          className="relative z-20 text-center px-6 max-w-4xl"
          variants={headlineContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={headlineItem} className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Epic Hiking Adventures Await
          </motion.h1>
          <motion.p variants={headlineItem} className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            From Everest Base Camp to hidden alpine lakes, discover world-class trekking destinations with expert guides
          </motion.p>

          <motion.div
            variants={headlineItem}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search destinations, locations, or activities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {featuredDestinations.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Adventures</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our most popular and highly-rated trekking experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations.map((destination) => (
                <Card
                  key={destination._id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.image || placeholderImages[0]}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-amber-500 text-white">Featured</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={getDifficultyColor(destination.difficulty)}>{destination.difficulty}</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-xl mb-2">{destination.name}</h3>
                      <div className="flex items-center gap-4 text-white/90 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {destination.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {destination.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{destination.rating}</span>
                        <span className="text-gray-500 text-sm">({Array.isArray(destination.reviews) ? destination.reviews.length : 0} reviews)</span>
                      </div>
                      <span className="text-2xl font-bold text-gray-900">${destination.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mountain className="w-4 h-4" />
                          {destination.elevation}m
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {destination.distance}km
                        </span>
                      </div>
                      <Link href={`/eco-adventure/${slugify(destination.name)}`}>
                        <Button size="sm" className="gap-2">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                  
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Destinations</h2>
              <p className="text-xl text-gray-600">{filtered.length} amazing trekking destinations to explore</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-t-lg"></div>
                  <div className="bg-white p-6 rounded-b-lg border border-t-0">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((destination) => (
                <Card
                  key={destination._id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={destination.image || placeholderImages[0]}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className={getDifficultyColor(destination.difficulty)}>{destination.difficulty}</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg mb-1">{destination.name}</h3>
                      <div className="flex items-center gap-3 text-white/90 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {destination.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {destination.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{destination.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium text-sm">{destination.rating}</span>
                        <span className="text-gray-500 text-xs">({Array.isArray(destination.reviews) ? destination.reviews.length : 0})</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${destination.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mountain className="w-3 h-3" />
                          {destination.elevation}m
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {destination.distance}km
                        </span>
                      </div>
                      <Link href={`/eco-adventure/${slugify(destination.name)}`}>
                        <Button size="sm" variant="outline" className="gap-1 text-xs bg-transparent">
                          Details
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
              <Button
                onClick={() => {
                  setSearch("")
                  setDifficulty("")
                  setDuration("")
                  setPrice("")
                  setLocation("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}