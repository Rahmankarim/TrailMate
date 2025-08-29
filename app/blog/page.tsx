"use client"
import { useEffect, useState } from "react"
import { Search, Clock, ArrowRight, TrendingUp, BookOpen, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function fetchBlogs() {
    try {
      const res = await fetch("/api/blogs")
      const data = await res.json()
      setBlogs(data.blogs || [])
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const featuredBlogs = blogs.filter((blog) => blog.featured && blog.published)
  const recentBlogs = blogs.filter((blog) => blog.published && !blog.featured)

  const filteredBlogs = recentBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { name: "All Articles", count: blogs.filter((b) => b.published).length },
    ...Array.from(new Set(blogs.filter((b) => b.published).map((b) => b.category))).map((cat) => ({
      name: cat,
      count: blogs.filter((b) => b.published && b.category === cat).length,
    })),
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    )
  }

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            {featuredBlogs.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold">Featured Articles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredBlogs.slice(0, 2).map((article) => (
                    <Card key={article._id} className="forum-thread-hover cursor-pointer overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img
                          src={
                            article.image ||
                            `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(article.title) || "/placeholder.svg"}`
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
            )}

            {/* Filter Controls */}
            <section>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <h2 className="text-2xl font-bold">Recent Articles</h2>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Array.from(new Set(blogs.filter((b) => b.published).map((b) => b.category))).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Recent Articles */}
            <section>
              <div className="space-y-6">
                {filteredBlogs.map((article) => (
                  <Card key={article._id} className="forum-thread-hover cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              article.image ||
                              `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(article.title) || "/placeholder.svg"}`
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
            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filter</p>
              </div>
            )}
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
                    onClick={() => setSelectedCategory(category.name === "All Articles" ? "all" : category.name)}
                  >
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
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
          </div>
        </div>
      </div>
    </div>
  )
}
