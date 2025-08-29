"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SearchBar({ destinations = [] }: { destinations?: any[] }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOptions, setSearchOptions] = useState<any[]>(destinations)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [activityFilter, setActivityFilter] = useState("")
  const [priceFilter, setPriceFilter] = useState("")
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [destinationsRes, hikesRes] = await Promise.all([
          fetch("/api/destination/list"),
          fetch("/api/guides/hikes"),
        ])

  let allOptions: any[] = []

        if (destinationsRes.ok) {
          const destinationsData = await destinationsRes.json()
          allOptions = [...allOptions, ...(destinationsData.destinations || [])]
        }

        if (hikesRes.ok) {
          const hikesData = await hikesRes.json()
          allOptions = [...allOptions, ...(hikesData.hikes || [])]
        }

        if (mounted && allOptions.length > 0) {
          setSearchOptions(allOptions)
        } else if (mounted) {
          setSearchOptions(destinations)
        }
      } catch (e) {
        if (mounted) setSearchOptions(destinations)
      }
    })()
    return () => {
      mounted = false
    }
  }, [destinations])

  useEffect(() => {
    const id = setTimeout(() => {
      if (!searchQuery) return setSuggestions([])
      const q = searchQuery.toLowerCase()
      const matches = searchOptions.filter((d: any) => {
        const name = (d.name || "").toLowerCase()
        const desc = (d.description || "").toLowerCase()
        const location = (d.location || "").toLowerCase()
        const activities = (d.activities || []).join(" ").toLowerCase()
        const guideName = (d.guideName || "").toLowerCase()
        const type = (d.type || "").toLowerCase()

        return (
          name.includes(q) ||
          desc.includes(q) ||
          location.includes(q) ||
          activities.includes(q) ||
          guideName.includes(q) ||
          type.includes(q)
        )
      })
      setSuggestions(matches.slice(0, 8))
    }, 250)
    return () => clearTimeout(id)
  }, [searchQuery, searchOptions])

  return (
    <div className="w-full max-w-4xl relative mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const q = new URLSearchParams()
          if (searchQuery) q.set("q", searchQuery)
          if (locationFilter) q.set("location", locationFilter)
          if (activityFilter) q.set("activity", activityFilter)
          if (priceFilter) q.set("price", priceFilter)
          router.push(`/destinations?${q.toString()}`)
        }}
        className="bg-white shadow-lg rounded-3xl px-4 py-3 flex items-center gap-3 border border-gray-100"
      >
        <Input
          placeholder="Search destinations, hikes, guides, or activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-0 focus:ring-0 placeholder-gray-400 text-gray-900"
        />
        <div className="hidden sm:flex items-center gap-2">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-sm"
            aria-label="Location"
          >
            <option value="">Any location</option>
            {hasMounted &&
              Array.from(new Set(searchOptions.map((s: any) => s.location).filter(Boolean))).map((loc: any, i) => (
                <option key={i} value={loc}>
                  {loc}
                </option>
              ))}
          </select>
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-sm"
            aria-label="Activity"
          >
            <option value="">Any activity</option>
            {["Hiking", "Trekking", "Adventure", "Cultural", "Nature", "Photography", "Mountaineering"].map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-sm"
            aria-label="Price"
          >
            <option value="">Any price</option>
            <option value="under100">Under $100</option>
            <option value="100to1000">$100 - $1000</option>
            <option value="1000to2500">$1000 - $2500</option>
            <option value="over2500">$2500+</option>
          </select>
        </div>
        <button
          type="submit"
          className="ml-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5 py-2 flex items-center gap-2 shadow-sm transition-all duration-300 hover:scale-105"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>
      {hasMounted && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-40">
          <ul className="divide-y max-h-96 overflow-y-auto">
            {suggestions.map((s) => (
              <li
                key={s._id || s.name}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors duration-200"
                onClick={() => {
                  const slug = (s.name || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")
                  router.push(`/eco-adventure/${slug}`)
                }}
              >
                <img
                  src={s.image || "/placeholder.svg?height=32&width=48"}
                  alt={s.name}
                  className="w-12 h-8 object-cover rounded-md"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {s.name}
                    {s.type && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          s.type === "hike"
                            ? "bg-blue-100 text-blue-800"
                            : s.type === "trek"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {s.type}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-1">{s.description}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                    {s.location && <span>{s.location}</span>}
                    {s.guideName && <span>• Guide: {s.guideName}</span>}
                    {s.price && <span>• ${s.price}</span>}
                  </div>
                </div>
                <div className="text-sm text-gray-400">View</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
