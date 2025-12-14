"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowRight, Mountain, Clock, TrendingUp, MapPin, Filter, Search, Award, Compass } from "lucide-react"

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
  type?: "destination" | "hike" | "trek"
  guideId?: string
  guideName?: string
  maxGroupSize?: number
  includedServices?: string[]
  requirements?: string[]
  createdAt?: string

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
    type: "trek",
  },
  {
    _id: "hike1",
    name: "Annapurna Sunrise Hike",
    description:
      "Early morning hike to witness spectacular sunrise over Annapurna range. Perfect for photography enthusiasts and nature lovers.",
    image: "/images/annapurna-sunrise.jpg",
    location: "Pokhara, Nepal",
    rating: 4.7,
    reviews: 523,
    difficulty: "Easy",
    duration: "4-5 hours",
    elevation: 1600,
    distance: 8,
    bestSeason: "October-March",
    activities: ["Sunrise viewing", "Photography", "Nature walk"],
    price: 45,
    featured: false,
    type: "hike",
  },
  {
    _id: "trek1",

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
    type: "trek",
  },
  {
    _id: "hike2",
    name: "Sarangkot Hill Hike",
    description:
      "Popular viewpoint hike offering panoramic views of Pokhara valley and Annapurna range. Great for beginners and families.",
    image: "/images/sarangkot.jpg",
    location: "Pokhara, Nepal",
    rating: 4.5,
    reviews: 342,
    difficulty: "Easy",
    duration: "2-3 hours",
    elevation: 1592,
    distance: 5,
    bestSeason: "Year-round",
    activities: ["Viewpoint hiking", "Paragliding launch", "Cultural sites"],
    price: 25,
    featured: false,
    type: "hike",
  },
  {
    _id: "dest2",

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
    type: "destination",
  },
  {
    _id: "trek2",

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
    type: "trek",
  },
  {
    _id: "hike3",
    name: "Fairy Meadows Day Hike",
    description:
      "Spectacular day hike through alpine meadows with close-up views of Nanga Parbat's north face. Perfect for acclimatization.",
    image: "/images/fairy-meadows.jpg",
    location: "Gilgit-Baltistan, Pakistan",
    rating: 4.6,
    reviews: 287,
    difficulty: "Moderate",
    duration: "6-8 hours",
    elevation: 3300,
    distance: 12,
    bestSeason: "May-September",
    activities: ["Alpine hiking", "Photography", "Wildflower viewing"],
    price: 85,
    featured: false,
    type: "hike",
  },
  {
    _id: "dest3",
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
    type: "destination",

  },
]

const difficultyOptions = [
  { label: "Easy", value: "Easy" },
  { label: "Moderate", value: "Moderate" },
  { label: "Challenging", value: "Challenging" },
  { label: "Expert", value: "Expert" },
]


const durationOptions = [
  { label: "1-7 days", value: "short" },
  { label: "8-14 days", value: "medium" },
  { label: "15+ days", value: "long" },
]

const priceRanges = [
  { label: "Under $100", value: "under100" },
  { label: "$100 - $1000", value: "100to1000" },
  { label: "$1000 - $2500", value: "1000to2500" },
  { label: "$2500+", value: "over2500" },
]

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Destinations", value: "destination" },
  { label: "Day Hikes", value: "hike" },
  { label: "Multi-day Treks", value: "trek" },
]


export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<HikingDestination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState("all")
  const [duration, setDuration] = useState("all")
  const [price, setPrice] = useState("all")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("all")
  const [filtered, setFiltered] = useState<HikingDestination[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")


  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)

        // Get token from localStorage for authenticated requests
        const token = localStorage.getItem("token")
        const headers: HeadersInit = {}
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const [destinationsRes, hikesRes] = await Promise.all([
          fetch("/api/destination/list", { cache: "no-store", headers }),
          fetch("/api/guides/hikes", { cache: "no-store", headers }),
        ])

        let destinationsList = []
        let hikesList = []

        if (destinationsRes.ok) {
          const destinationsData = await destinationsRes.json()
          destinationsList = destinationsData.destinations || []
          console.log('[Destinations Page] Loaded destinations from API:', destinationsList.length)
        } else {
          console.log('[Destinations Page] Failed to load destinations:', destinationsRes.status)
        }

        if (hikesRes.ok) {
          const hikesData = await hikesRes.json()
          hikesList = hikesData.hikes || []
          console.log('[Destinations Page] Loaded hikes from API:', hikesList.length)
        } else {
          console.log('[Destinations Page] Failed to load hikes:', hikesRes.status)
        }

        let combinedList = [...destinationsList, ...hikesList]
        console.log('[Destinations Page] Total combined items:', combinedList.length)

        setDestinations(combinedList)
        setFiltered(combinedList)
      } catch (e: any) {
        setError(e.message)
        console.error('[Destinations Page] Error loading data:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let result = [...destinations]

    if (activeTab !== "all") {
      if (activeTab === "hikes") result = result.filter((d) => d.type === "hike")
      if (activeTab === "treks") result = result.filter((d) => d.type === "trek")
      if (activeTab === "destinations") result = result.filter((d) => d.type === "destination")
    }

    if (search) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.description?.toLowerCase().includes(search.toLowerCase()) ||
          d.location?.toLowerCase().includes(search.toLowerCase()) ||
          d.activities?.some((activity) => activity.toLowerCase().includes(search.toLowerCase())),
      )
    }

    if (difficulty !== "all") {
      result = result.filter((d) => d.difficulty === difficulty)
    }

    if (duration !== "all") {
      result = result.filter((d) => {
        const days = Number.parseInt(d.duration?.split("-")[0] || "0")
        if (duration === "short") return days <= 7
        if (duration === "medium") return days >= 8 && days <= 14
        if (duration === "long") return days >= 15
        return true
      })
    }

    if (price !== "all") {
      result = result.filter((d) => {
        const destPrice = d.price || 0
        if (price === "under100") return destPrice < 100
        if (price === "100to1000") return destPrice >= 100 && destPrice <= 1000
        if (price === "1000to2500") return destPrice >= 1000 && destPrice <= 2500
        if (price === "over2500") return destPrice > 2500
        return true
      })
    }

    if (location) {
      result = result.filter((d) => d.location?.toLowerCase().includes(location.toLowerCase()))
    }

    if (type !== "all") {
      result = result.filter((d) => d.type === type)
    }

    setFiltered(result)
  }, [destinations, search, difficulty, duration, price, location, type, activeTab])

  const featuredDestinations = filtered.filter((d) => d.featured)
  const regularDestinations = filtered.filter((d) => !d.featured)
  const hikes = filtered.filter((d) => d.type === "hike")
  const treks = filtered.filter((d) => d.type === "trek")

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
        return "bg-green-100 text-green-800 border-green-200"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Challenging":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Expert":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "hike":
        return <Compass className="w-4 h-4" />
      case "trek":
        return <Mountain className="w-4 h-4" />
      case "destination":
        return <MapPin className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "hike":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "trek":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "destination":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
      <section className="relative w-full h-[75vh] flex flex-col justify-center items-center overflow-hidden">
        <img
          src="/images/mount.jpg"
          alt="Mountain Adventure Hero"
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
            Discover Epic Adventures
          </motion.h1>
          <motion.p
            variants={headlineItem}
            className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            From challenging treks to scenic day hikes, explore world-class destinations with professional guides and
            unforgettable experiences
          </motion.p>

          <motion.div
            variants={headlineItem}
            className="bg-white/98 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto border border-white/20"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search destinations, hikes, treks, or activities..."
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
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={price} onValueChange={setPrice}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>

      <section className="py-8 px-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: "all", label: "All Adventures", count: filtered.length },
              {
                id: "destinations",
                label: "Destinations",
                count: filtered.filter((d) => d.type === "destination").length,
              },
              { id: "hikes", label: "Day Hikes", count: filtered.filter((d) => d.type === "hike").length },
              { id: "treks", label: "Multi-day Treks", count: filtered.filter((d) => d.type === "trek").length },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-6 py-3 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Adventures */}
      {featuredDestinations.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <Award className="w-4 h-4 mr-2" />
                Featured Adventures
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Most Popular Experiences</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Handpicked adventures that offer the perfect blend of challenge, beauty, and unforgettable memories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations.map((destination) => (
                <Card
                  key={destination._id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-lg"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={destination.image || placeholderImages[0]}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                      <Badge className={`${getTypeColor(destination.type)} border shadow-lg`}>
                        {getTypeIcon(destination.type)}
                        <span className="ml-1 capitalize">{destination.type}</span>
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4">
                      <Badge className={`${getDifficultyColor(destination.difficulty)} border shadow-lg`}>
                        {destination.difficulty}
                      </Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-xl mb-3 drop-shadow-lg">{destination.name}</h3>
                      <div className="flex items-center gap-4 text-white/95 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {destination.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {destination.duration}
                        </span>
                      </div>
                      {destination.guideName && (
                        <div className="mt-2">
                          <Badge className="bg-white/20 text-white border-white/30">
                            Guide: {destination.guideName}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{destination.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{destination.rating}</span>
                        <span className="text-gray-500 text-sm">
                          ({Array.isArray(destination.reviews) ? destination.reviews.length : destination.reviews || 0}{" "}
                          reviews)
                        </span>
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
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl">
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

      {(hikes.length > 0 || treks.length > 0) &&
        (activeTab === "all" || activeTab === "hikes" || activeTab === "treks") && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Hikes & Trekking Adventures</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  From scenic day hikes to challenging multi-day treks, find your perfect mountain adventure
                </p>
              </div>

              {/* Day Hikes */}
              {hikes.length > 0 && (activeTab === "all" || activeTab === "hikes") && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <Compass className="w-6 h-6 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Day Hikes</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {hikes.length} available
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {hikes.map((hike) => (
                      <Card
                        key={hike._id}
                        className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={hike.image || placeholderImages[0]}
                            alt={hike.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute top-3 right-3">
                            <Badge className={getDifficultyColor(hike.difficulty)}>{hike.difficulty}</Badge>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-white font-semibold text-lg mb-1">{hike.name}</h4>
                            <div className="flex items-center gap-2 text-white/90 text-xs">
                              <MapPin className="w-3 h-3" />
                              {hike.location}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1 text-amber-500 text-sm">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{hike.rating}</span>
                            </div>
                            <span className="font-bold text-gray-900">${hike.price}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {hike.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mountain className="w-3 h-3" />
                              {hike.elevation}m
                            </span>
                          </div>
                          <Link href={`/eco-adventure/${slugify(hike.name)}`}>
                            <Button size="sm" variant="outline" className="w-full gap-1 text-xs bg-transparent">
                              View Details
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-day Treks */}
              {treks.length > 0 && (activeTab === "all" || activeTab === "treks") && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Mountain className="w-6 h-6 text-purple-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Multi-day Treks</h3>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {treks.length} available
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {treks.map((trek) => (
                      <Card
                        key={trek._id}
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={trek.image || placeholderImages[0]}
                            alt={trek.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className={getTypeColor(trek.type)}>
                              {getTypeIcon(trek.type)}
                              <span className="ml-1">Trek</span>
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge className={getDifficultyColor(trek.difficulty)}>{trek.difficulty}</Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h4 className="text-white font-bold text-xl mb-2">{trek.name}</h4>
                            <div className="flex items-center gap-4 text-white/90 text-sm">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {trek.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {trek.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 mb-4 line-clamp-2">{trek.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-medium">{trek.rating}</span>
                              <span className="text-gray-500 text-sm">
                                ({Array.isArray(trek.reviews) ? trek.reviews.length : trek.reviews || 0} reviews)
                              </span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">${trek.price}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mountain className="w-4 h-4" />
                                {trek.elevation}m
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {trek.distance}km
                              </span>
                            </div>
                            <Link href={`/eco-adventure/${slugify(trek.name)}`}>
                              <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
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
              )}
            </div>
          </section>
        )}

      {/* All Destinations */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {activeTab === "all"
                  ? "All Adventures"
                  : activeTab === "hikes"
                    ? "Day Hikes"
                    : activeTab === "treks"
                      ? "Multi-day Treks"
                      : "Destinations"}
              </h2>
              <p className="text-xl text-gray-600">
                {filtered.length} amazing {activeTab === "all" ? "adventures" : activeTab} to explore
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-t-xl"></div>
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
              {filtered.map((destination) => (
                <Card
                  key={destination._id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={destination.image || placeholderImages[0]}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getTypeColor(destination.type)} border shadow-sm`}>
                        {getTypeIcon(destination.type)}
                        <span className="ml-1 capitalize">{destination.type}</span>
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className={`${getDifficultyColor(destination.difficulty)} border shadow-sm`}>
                        {destination.difficulty}
                      </Badge>
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
                      {destination.guideName && (
                        <div className="mt-1">
                          <Badge className="bg-white/20 text-white border-white/30 text-xs">
                            Guide: {destination.guideName}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">{destination.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium text-sm">{destination.rating}</span>
                        <span className="text-gray-500 text-xs">
                          ({Array.isArray(destination.reviews) ? destination.reviews.length : destination.reviews || 0})
                        </span>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs rounded-lg hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                        >
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
            <div className="text-center py-20">
              <Mountain className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No adventures found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or filters to discover more amazing destinations
              </p>
              <Button
                onClick={() => {
                  setSearch("")
                  setDifficulty("all")
                  setDuration("all")
                  setPrice("all")
                  setLocation("")
                  setType("all")
                  setActiveTab("all")
                }}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 py-3"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
