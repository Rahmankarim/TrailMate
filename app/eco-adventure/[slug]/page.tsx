import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"
import { slugify } from '@/lib/utils'

type Params = { params: { slug: string } }


export default async function Page({ params }: Params) {
  const { slug } = params

  // Server-side fetch to get list (no-store so we always get fresh data)
  let apiUrl = "/api/destination/list"
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BASE_URL) {
    apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/destination/list`
  }
  const res = await fetch(apiUrl, { cache: "no-store" })
  const data = await res.json().catch(() => null)
  const list = (data && Array.isArray(data.destinations) ? data.destinations : data) || []

  const dest =
    list.find((d: any) => {
      const candidate = d.name || d.title || d.companyName || d._id || ""
      return slugify(candidate) === slug
    }) || null

  if (!dest) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold mb-4">Destination not found</h1>
          <p className="text-gray-600 mb-6">We couldn't find that destination. Try browsing the destinations list.</p>
          <Link href="/destinations"><Button>Back to destinations</Button></Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative w-full h-[44vh] md:h-[56vh] overflow-hidden">
        <img src={dest.image || "/placeholder.jpg"} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-6 bottom-6 text-white z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">{dest.name}</h1>
          <div className="mt-2 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="font-medium">{dest.rating ?? "-"}</span>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">{dest.location || dest.companyName || "Unknown"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-3">About this destination</h2>
              <p className="text-gray-700 leading-relaxed">{dest.description || "No description provided."}</p>
              <div className="mt-6 flex items-center gap-3">
                <Link href={`/book?destination=${slug}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Book a seat</Button>
                </Link>
                <Link href="/destinations" className="ml-2 text-sm text-gray-600 hover:underline">Back to list</Link>
              </div>
            </Card>
          </div>

          <aside>
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold">Quick facts</h4>
                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  <li><strong>Location:</strong> {dest.location || "—"}</li>
                  <li><strong>Rating:</strong> {dest.rating ?? "—"}</li>
                  <li><strong>Reviews:</strong> {dest.reviews ?? "—"}</li>
                </ul>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold">Gallery</h4>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(dest.images || [dest.image]).slice(0,6).map((img:any, i:number) => (
                    <img key={i} src={img || "/placeholder.jpg"} alt={`${dest.name}-${i}`} className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
