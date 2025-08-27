"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Leaf, Globe } from "lucide-react"


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About TrailMate</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make sustainable travel accessible, safe, and meaningful for everyone.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative h-96 rounded-2xl overflow-hidden mb-16">
            <img src="/images/attabad.jpg" alt="Mountain landscape" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Connecting Adventurers Worldwide</h2>
              <p className="text-lg opacity-90">Building a community of eco-conscious travelers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To create a platform where sustainable travel meets authentic connections, empowering travelers to explore
              responsibly while supporting local communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Sustainability First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Every destination and accommodation is carefully vetted for environmental responsibility and community
                  impact.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Our AI-powered matching connects like-minded travelers who share values of responsible exploration.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  Supporting local economies and conservation efforts in destinations around the world.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="mb-6">
              TrailMate was born from a simple observation: the most meaningful travel experiences happen when you
              connect with the right people and places. Our founders, passionate travelers themselves, noticed that
              finding compatible travel companions and authentic eco-friendly experiences was often the biggest barrier
              to sustainable adventure.
            </p>
            <p className="mb-6">
              In 2024, we set out to solve this problem by combining artificial intelligence with human connection. Our
              platform doesn't just match travelers based on destinations—it understands personalities, values, and
              travel styles to create meaningful partnerships that last beyond a single trip.
            </p>
            <p>
              Today, TrailMate connects thousands of eco-conscious adventurers worldwide, facilitating sustainable
              travel experiences that protect our planet while creating unforgettable memories.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
