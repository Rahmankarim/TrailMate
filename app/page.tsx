"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import SearchBar from "@/components/SearchBar"
import { MapPin, Users, Shield, Leaf, Mountain, Star, ArrowRight, Globe, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TrailMatePage() {
  // All hooks at the very top, before any logic or variables
  const [activeFeature, setActiveFeature] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)
  const router = useRouter()
  const [where, setWhere] = useState("")
  const [when, setWhen] = useState("")
  // --- Search/autocomplete state (dynamic + filters) ---
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOptions, setSearchOptions] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [activityFilter, setActivityFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.3 // Set volume to 30%
      audio.loop = true

      // Try to play audio (may be blocked by browser autoplay policy)
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log("[v0] Autoplay prevented by browser policy")
        })
      }
    }

    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    setTimeout(() => {
      const sections = document.querySelectorAll(".animate-on-scroll")
      sections.forEach((section) => observer.observe(section))
    }, 100)

    return () => {
      observer.disconnect()
      clearTimeout(loadTimer)
    }
  }, [])

  // ...existing code...

  const toggleMute = () => {
    const audio = audioRef.current
    if (audio) {
      if (isMuted) {
        audio.volume = 0.3
        setIsMuted(false)
      } else {
        audio.volume = 0
        setIsMuted(true)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <Mountain className="h-16 w-16 text-gray-900 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">TrailMate</h1>
          <p className="text-gray-600 mb-8 animate-fade-in-up">Preparing your adventure...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-gray-900 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Users,
      title: "Travel Companion Matching",
      description:
        "AI-powered matching with like-minded eco-adventurers based on interests, experience level, and travel style.",
    },
    {
      icon: MapPin,
      title: "Expert Guide Finder",
      description: "Connect with certified local guides who know the best sustainable trails and hidden eco-gems.",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Safe and transparent booking system with verified eco-lodges and sustainable accommodations.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Lodging",
      description: "Curated selection of environmentally conscious accommodations that support local communities.",
    },
  ]

  const destinations = [
    {
      name: "Hunza Valley, Pakistan",
      rating: 4.9,
      travelers: 234,
      image: "/images/hunza-boat.jpg",
      description: "Turquoise lakes and dramatic peaks",
    },
    {
      name: "Skardu Lakes, Pakistan",
      rating: 4.8,
      travelers: 189,
      image: "/images/skardu-lake.jpg",
      description: "Serene mountain lakes and traditional architecture",
    },
    {
      name: "Karakoram Range",
      rating: 4.9,
      travelers: 156,
      image: "/images/karakoram-peaks.jpg",
      description: "Golden peaks and ancient valleys",
    },
    {
      name: "Attabad Lake",
      rating: 4.7,
      travelers: 298,
      image: "/images/attabad-lake.jpg",
      description: "Boat adventures in mountain paradise",
    },
  ]
  // ...existing code...

  return (
    <div className="min-h-screen bg-white">
      <audio ref={audioRef} preload="auto">
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/soft-calm-background-music-374964-Evti562G9CLXhGHos5SPieidnY9M0H.mp3"
          type="audio/mpeg"
        />
      </audio>

      <Button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg transition-all duration-300 hover:scale-110"
        size="sm"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      <section className="pt-24 pb-16 px-6 animate-on-scroll">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
            TrailMate – Smarter Routes, Greener Journeys
          </h1>
          <div className="mt-10 flex justify-center mb-12 md:mb-16">
            <SearchBar destinations={destinations} />
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden animate-fade-in-up animation-delay-600">
            <img
              src="/images/skardu-valley.jpg"
              alt="Mountain landscape"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50 animate-on-scroll" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Discover Your Perfect Adventure</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform connects you with the right people, places, and experiences for sustainable travel
              adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => setActiveFeature(index)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 hover:bg-gray-200 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-gray-700" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Find Your Perfect Travel Companion</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our advanced AI analyzes your preferences, experience level, and travel style to match you with
                compatible adventure partners who share your passion for sustainable travel.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 animate-slide-in-right animation-delay-200">
                  <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                  <span className="text-gray-700">Personality & Interest Matching</span>
                </div>
                <div className="flex items-center gap-3 animate-slide-in-right animation-delay-400">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <span className="text-gray-700">Experience Level Compatibility</span>
                </div>
                <div className="flex items-center gap-3 animate-slide-in-right animation-delay-600">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-gray-700">Sustainable Travel Values</span>
                </div>
              </div>
              <Link href="/guides">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 hover:scale-105 transition-all duration-300">
                  <Users className="mr-2 h-5 w-5" />
                  Find Guides
                </Button>
              </Link>
            </div>

            <div className="relative animate-fade-in-right">
              <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div
                      key={i}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 ${
                        i === 5 ? "bg-gray-900 scale-110 animate-pulse" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Users className={`h-6 w-6 ${i === 5 ? "text-white" : "text-gray-600"}`} />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Connected with <span className="text-gray-900 font-semibold animate-bounce">1,247</span>{" "}
                    eco-travelers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden animate-fade-in-up animation-delay-1000">
          <img
            src="/images/snow-peaks.jpg"
            alt="Snow-capped peaks"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
      <section className="py-20 px-6 bg-gray-50 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Popular Eco-Adventures</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover breathtaking destinations where sustainability meets adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {destinations.map((destination, index) => {
              const slug = destination.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
              return (
                <Link href={`/eco-adventure/${slug}`} key={index} className="group">
                  <Card className="bg-gray-50 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-500 overflow-hidden group animate-fade-in-up">
                    <div className="h-64 relative overflow-hidden">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/20 text-gray-900 backdrop-blur-sm">
                          <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                          {destination.rating}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-xl mb-1 group-hover:text-emerald-400 transition-colors">
                          {destination.name}
                        </h3>
                        <p className="text-white/80 text-sm mb-3">{destination.description}</p>
                        <div className="flex items-center justify-between text-white/90 text-sm">
                          <span>{destination.travelers} travelers</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Interactive stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-600">
            <div className="text-center p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-emerald-200 transition-colors">
                <Globe className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">50+</h4>
              <p className="text-gray-600">Eco Destinations</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">1,247</h4>
              <p className="text-gray-600">Active Travelers</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-amber-200 transition-colors">
                <Leaf className="h-8 w-8 text-amber-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">98%</h4>
              <p className="text-gray-600">Sustainability Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900 animate-on-scroll">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to Start Your Sustainable Adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed animate-fade-in-up animation-delay-200">
            Join thousands of eco-conscious travelers who are exploring the world responsibly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto animate-fade-in-up animation-delay-400">
            <Input
              placeholder="Enter your email"
              className="bg-white border-gray-300 hover:scale-105 transition-transform duration-300"
            />
            <Link href="/destinations">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 hover:scale-105 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
