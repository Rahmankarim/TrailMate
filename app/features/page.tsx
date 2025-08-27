"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, Users, MapPin, Shield, Leaf, Globe, Compass, Star, ArrowLeft, Zap, Heart, Award } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function FeaturesPage() {
  const features = [
    {
      icon: Users,
      title: "AI-Powered Companion Matching",
      description:
        "Our advanced algorithm analyzes your personality, interests, and travel style to connect you with perfect adventure partners.",
      benefits: [
        "Personality compatibility scoring",
        "Interest-based matching",
        "Experience level alignment",
        "Travel style preferences",
      ],
      color: "bg-blue-500",
    },
    {
      icon: MapPin,
      title: "Expert Local Guide Network",
      description:
        "Connect with certified local guides who know hidden gems and sustainable trails in every destination.",
      benefits: [
        "Verified local expertise",
        "Sustainable route planning",
        "Cultural immersion experiences",
        "Safety-first approach",
      ],
      color: "bg-green-500",
    },
    {
      icon: Shield,
      title: "Secure Booking Platform",
      description:
        "Book with confidence using our secure, transparent platform with verified accommodations and guides.",
      benefits: [
        "Encrypted payment processing",
        "Verified accommodation partners",
        "Transparent pricing",
        "24/7 customer support",
      ],
      color: "bg-purple-500",
    },
    {
      icon: Leaf,
      title: "Eco-Certified Accommodations",
      description:
        "Stay in carefully vetted eco-friendly lodges that support local communities and environmental conservation.",
      benefits: [
        "Environmental impact assessment",
        "Community benefit programs",
        "Sustainable practices verification",
        "Carbon offset options",
      ],
      color: "bg-emerald-500",
    },
    {
      icon: Globe,
      title: "Global Destination Network",
      description: "Access to 50+ carefully curated eco-adventure destinations across 6 continents.",
      benefits: [
        "Curated destination selection",
        "Local partnership network",
        "Cultural authenticity guarantee",
        "Off-the-beaten-path experiences",
      ],
      color: "bg-orange-500",
    },
    {
      icon: Zap,
      title: "Real-Time Trip Planning",
      description: "Dynamic itinerary creation that adapts to weather, group preferences, and local conditions.",
      benefits: [
        "Weather-adaptive planning",
        "Group preference integration",
        "Local event recommendations",
        "Flexible scheduling",
      ],
      color: "bg-yellow-500",
    },
  ]

  const stats = [
    { number: "1,247", label: "Active Travelers", icon: Users },
    { number: "50+", label: "Eco Destinations", icon: Globe },
    { number: "98%", label: "Satisfaction Rate", icon: Heart },
    { number: "500+", label: "Local Guides", icon: MapPin },
    { number: "15k+", label: "Adventures Completed", icon: Compass },
    { number: "4.9", label: "Average Rating", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">✨ Powered by AI</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Features That Make Adventures Extraordinary</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover how TrailMate's innovative features transform the way you plan, connect, and experience sustainable
            travel adventures.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative h-96 rounded-2xl overflow-hidden mb-16">
            <img src="/images/skardu-valley.jpg" alt="Adventure features" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Technology Meets Adventure</h2>
              <p className="text-lg opacity-90">AI-powered matching • Sustainable travel • Global community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-shadow">
                  <stat.icon className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</h3>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Feature Suite</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed with sustainability, safety, and authentic experiences in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How TrailMate Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From profile creation to adventure completion, every step is designed for seamless experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create Profile",
                description: "Tell us about your interests, experience level, and travel preferences",
                icon: Users,
              },
              {
                step: "02",
                title: "Get Matched",
                description: "Our AI finds compatible travel companions and perfect destinations",
                icon: Zap,
              },
              {
                step: "03",
                title: "Plan Together",
                description: "Collaborate with your matches to create the perfect itinerary",
                icon: MapPin,
              },
              {
                step: "04",
                title: "Adventure Awaits",
                description: "Embark on your sustainable adventure with confidence",
                icon: Compass,
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow">
                    <item.icon className="h-10 w-10 text-gray-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of eco-conscious travelers who are already using TrailMate to create unforgettable
            adventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Your Adventure
            </Button>
            <Link href="/destinations">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg bg-transparent"
              >
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
