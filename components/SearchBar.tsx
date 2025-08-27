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

  useEffect(() => { setHasMounted(true) }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/destination/list")
        if (!res.ok) return
        const data = await res.json()
        if (mounted && Array.isArray(data)) setSearchOptions(data)
      } catch (e) {
        // fallback to static destinations
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      if (!searchQuery) return setSuggestions([])
      const q = searchQuery.toLowerCase()
      const matches = searchOptions.filter((d: any) => {
        const name = (d.name || "").toLowerCase()
        const desc = (d.description || "").toLowerCase()
        return name.includes(q) || desc.includes(q)
      })
      setSuggestions(matches.slice(0, 6))
    }, 250)
    return () => clearTimeout(id)
  }, [searchQuery, searchOptions])

  return (
    <div className="w-full max-w-4xl relative mx-auto">
      <form
        onSubmit={e => {
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
          placeholder="Search destinations…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-0 focus:ring-0 placeholder-gray-400 text-gray-900"
        />
        <div className="hidden sm:flex items-center gap-2">
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-sm"
            aria-label="Location"
          >
            <option value="">Any location</option>
            {hasMounted && Array.from(new Set(searchOptions.map((s: any) => s.location).filter(Boolean))).map((loc: any, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={activityFilter}
            onChange={e => setActivityFilter(e.target.value)}
            className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-sm"
            aria-label="Activity"
          >
            <option value="">Any activity</option>
            {["Adventure","Relaxation","Cultural","Nature","Hiking"].map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
          <select
            value={priceFilter}
            onChange={e => setPriceFilter(e.target.value)}
            className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-full text-sm"
            aria-label="Price"
          >
            <option value="">Any price</option>
            <option value="budget">Budget</option>
            <option value="mid">Mid</option>
            <option value="lux">Luxury</option>
          </select>
        </div>
        <button
          type="submit"
          className="ml-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5 py-2 flex items-center gap-2 shadow-sm"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>
      {hasMounted && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-40">
          <ul className="divide-y">
            {suggestions.map(s => (
              <li
                key={s._id || s.name}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                onClick={() => {
                  const slug = (s.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                  router.push(`/eco-adventure/${slug}`)
                }}
              >
                <img src={s.image || "/placeholder.jpg"} alt={s.name} className="w-12 h-8 object-cover rounded-md" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.description}</div>
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
