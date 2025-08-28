import { Search, Clock, ArrowRight, TrendingUp, BookOpen, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for blog articles with realistic hiking content
const featuredArticles = [
  {
    id: 1,
    title: "The Complete Guide to Hiking the Appalachian Trail: Planning Your Thru-Hike",
    excerpt:
      "Everything you need to know about planning and executing a successful thru-hike of the 2,190-mile Appalachian Trail, from gear selection to resupply strategies.",
    author: {
      name: "Trail Expert Mike",
      avatar: "/experienced-hiker.png",
      role: "Trail Guide",
    },
    category: "Trail Guides",
    readTime: "12 min read",
    publishedAt: "2024-01-15",
    image: "/appalachian-trail-hero.png",
    tags: ["thru-hiking", "appalachian-trail", "planning"],
    views: 2847,
    featured: true,
  },
  {
    id: 2,
    title: "Winter Hiking Safety: Essential Gear and Techniques for Cold Weather Adventures",
    excerpt:
      "Master the art of winter hiking with our comprehensive guide covering layering systems, traction devices, and emergency preparedness for cold conditions.",
    author: {
      name: "Dr. Sarah Winter",
      avatar: "/female-doctor-outdoors.png",
      role: "Safety Expert",
    },
    category: "Safety & Preparation",
    readTime: "8 min read",
    publishedAt: "2024-01-12",
    image: "/winter-hiking-safety.png",
    tags: ["winter-hiking", "safety", "gear"],
    views: 1923,
    featured: true,
  },
]

const recentArticles = [
  {
    id: 3,
    title: "Ultralight Backpacking: How to Cut Pack Weight Without Sacrificing Safety",
    excerpt:
      "Learn proven strategies to reduce your pack weight while maintaining essential safety gear for multi-day hiking adventures.",
    author: {
      name: "Ultralight Sarah",
      avatar: "/ultralight-hiker.png",
      role: "Gear Expert",
    },
    category: "Gear & Equipment",
    readTime: "10 min read",
    publishedAt: "2024-01-10",
    image: "/ultralight-backpacking.png",
    tags: ["ultralight", "backpacking", "gear"],
    views: 1654,
  },
  {
    id: 4,
    title: "Photography on the Trail: Capturing Stunning Landscape Images While Hiking",
    excerpt:
      "Professional tips for taking breathtaking photos during your hikes, including composition techniques and lightweight camera gear recommendations.",
    author: {
      name: "Alex Thompson",
      avatar: "/photographer-mountains.png",
      role: "Photography Expert",
    },
    category: "Photography",
    readTime: "7 min read",
    publishedAt: "2024-01-08",
    image: "/trail-photography.png",
    tags: ["photography", "landscape", "techniques"],
    views: 1432,
  },
  {
    id: 5,
    title: "Beginner's Guide to Day Hiking: Essential Tips for Your First Trail Adventure",
    excerpt:
      "Everything new hikers need to know to start their outdoor journey safely, from choosing the right trail to packing essentials.",
    author: {
      name: "Jessica Park",
      avatar: "/young-female-hiker.png",
      role: "Community Member",
    },
    category: "Beginner Guides",
    readTime: "6 min read",
    publishedAt: "2024-01-05",
    image: "/beginner-day-hiking.png",
    tags: ["beginner", "day-hiking", "tips"],
    views: 2156,
  },
  {
    id: 6,
    title: "Leave No Trace: Practicing Responsible Hiking and Environmental Stewardship",
    excerpt:
      "Understanding and implementing Leave No Trace principles to preserve our natural spaces for future generations of hikers.",
    author: {
      name: "Environmental Ed",
      avatar: "/environmental-educator.png",
      role: "Conservation Expert",
    },
    category: "Conservation",
    readTime: "9 min read",
    publishedAt: "2024-01-03",
    image: "/leave-no-trace.png",
    tags: ["conservation", "environment", "ethics"],
    views: 1789,
  },
  {
    id: 7,
    title: "Nutrition on the Trail: Fueling Your Body for Long-Distance Hiking",
    excerpt:
      "Science-based nutrition strategies for maintaining energy and health during extended hiking trips, including meal planning and hydration tips.",
    author: {
      name: "Nutritionist Lisa",
      avatar: "/trail-nutritionist.png",
      role: "Nutrition Expert",
    },
    category: "Health & Nutrition",
    readTime: "11 min read",
    publishedAt: "2024-01-01",
    image: "/trail-nutrition.png",
    tags: ["nutrition", "health", "meal-planning"],
    views: 1567,
  },
  {
    id: 8,
    title: "Hiking with Dogs: A Complete Guide to Trail Adventures with Your Canine Companion",
    excerpt:
      "Everything you need to know about safely hiking with dogs, from training and gear to trail etiquette and paw care.",
    author: {
      name: "Dog Trainer Mark",
      avatar: "/dog-trainer-hiker.png",
      role: "Animal Expert",
    },
    category: "Hiking with Pets",
    readTime: "8 min read",
    publishedAt: "2023-12-28",
    image: "/hiking-with-dogs.png",
    tags: ["dogs", "pets", "training"],
    views: 2234,
  },
]

const categories = [
  { name: "All Articles", count: 156 },
  { name: "Trail Guides", count: 34 },
  { name: "Gear & Equipment", count: 28 },
  { name: "Safety & Preparation", count: 22 },
  { name: "Photography", count: 18 },
  { name: "Beginner Guides", count: 16 },
  { name: "Conservation", count: 14 },
  { name: "Health & Nutrition", count: 12 },
  { name: "Hiking with Pets", count: 8 },
]

const popularTags = [
  "gear-reviews",
  "trail-reports",
  "safety-tips",
  "photography",
  "beginner-friendly",
  "ultralight",
  "winter-hiking",
  "backpacking",
  "day-hiking",
  "conservation",
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-adventure-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">TrailMate Blog</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 text-pretty">
              Expert insights, trail guides, and adventure stories from the hiking community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search articles, guides, tips..."
                  className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
              </div>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8">
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Articles
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Articles */}
            <section>
              <div className="flex items-center gap-2 mb-8">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">Featured Articles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="forum-thread-hover cursor-pointer overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <img
                        src={
                          article.image ||
                          `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(article.title)}`
                        }
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground">{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                            <AvatarFallback>
                              {article.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{article.author.name}</p>
                            <p className="text-xs text-muted-foreground">{article.author.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{article.views} views</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Filter Controls */}
            <section>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <h2 className="text-2xl font-bold">Recent Articles</h2>
                <div className="flex gap-2">
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Recent Articles */}
            <section>
              <div className="space-y-6">
                {recentArticles.map((article) => (
                  <Card key={article.id} className="forum-thread-hover cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              article.image ||
                              `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(article.title)}`
                            }
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={article.author.avatar || "/placeholder.svg"}
                                  alt={article.author.name}
                                />
                                <AvatarFallback>
                                  {article.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{article.author.name}</p>
                                <p className="text-xs text-muted-foreground">{article.author.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">{article.views} views</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </span>
                              <Button variant="ghost" size="sm">
                                Read More
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Load More */}
            <div className="text-center">
              <Button size="lg" variant="outline">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Categories</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex justify-between items-center py-1 hover:text-primary cursor-pointer transition-colors"
                  >
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Popular Tags</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Stay Updated</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get the latest hiking tips, gear reviews, and trail guides delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <Input placeholder="Enter your email" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Comments */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Recent Comments</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Great article on winter hiking! The gear recommendations were spot on...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sarah Miller</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Thanks for the ultralight tips! Managed to cut 5 pounds from my pack...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
