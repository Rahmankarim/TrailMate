import { Search, Plus, TrendingUp, Users, MessageSquare, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for forum categories and discussions
const forumCategories = [
  {
    id: 1,
    name: "Trail Reports & Reviews",
    description: "Share your hiking experiences and trail conditions",
    icon: "🥾",
    threads: 234,
    posts: 1567,
    color: "bg-primary/10 text-primary",
  },
  {
    id: 2,
    name: "Gear & Equipment",
    description: "Discuss hiking gear, reviews, and recommendations",
    icon: "🎒",
    threads: 189,
    posts: 892,
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: 3,
    name: "Safety & First Aid",
    description: "Safety tips, emergency preparedness, and first aid",
    icon: "🚨",
    threads: 156,
    posts: 743,
    color: "bg-red-100 text-red-600",
  },
  {
    id: 4,
    name: "Photography & Nature",
    description: "Share your hiking photos and nature observations",
    icon: "📸",
    threads: 298,
    posts: 2134,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 5,
    name: "Planning & Routes",
    description: "Trip planning, route suggestions, and logistics",
    icon: "🗺️",
    threads: 167,
    posts: 934,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 6,
    name: "Beginner's Corner",
    description: "New to hiking? Ask questions and get advice",
    icon: "🌱",
    threads: 145,
    posts: 678,
    color: "bg-yellow-100 text-yellow-600",
  },
]

const recentDiscussions = [
  {
    id: 1,
    title: "Best lightweight tents for solo backpacking in 2024",
    author: {
      name: "Sarah Chen",
      avatar: "/female-hiker.png",
      badge: "Gear Expert",
    },
    category: "Gear & Equipment",
    replies: 23,
    views: 456,
    lastActivity: "2 hours ago",
    isPinned: true,
    tags: ["gear", "backpacking", "solo"],
  },
  {
    id: 2,
    title: "Trail conditions update: Mount Washington via Tuckerman Ravine",
    author: {
      name: "Mike Rodriguez",
      avatar: "/male-hiker-beard.png",
      badge: "Trail Guide",
    },
    category: "Trail Reports & Reviews",
    replies: 15,
    views: 289,
    lastActivity: "4 hours ago",
    isPinned: false,
    tags: ["trail-report", "new-hampshire", "winter"],
  },
  {
    id: 3,
    title: "Emergency shelter techniques for unexpected weather",
    author: {
      name: "Dr. Emily Watson",
      avatar: "/female-doctor-outdoors.png",
      badge: "Safety Expert",
    },
    category: "Safety & First Aid",
    replies: 31,
    views: 678,
    lastActivity: "6 hours ago",
    isPinned: true,
    tags: ["safety", "emergency", "shelter"],
  },
  {
    id: 4,
    title: "Sunrise photography tips from alpine peaks",
    author: {
      name: "Alex Thompson",
      avatar: "/photographer-mountains.png",
      badge: "Photo Pro",
    },
    category: "Photography & Nature",
    replies: 18,
    views: 234,
    lastActivity: "8 hours ago",
    isPinned: false,
    tags: ["photography", "sunrise", "alpine"],
  },
  {
    id: 5,
    title: "Planning my first multi-day hike - need advice!",
    author: {
      name: "Jessica Park",
      avatar: "/young-female-hiker.png",
      badge: "New Member",
    },
    category: "Beginner's Corner",
    replies: 27,
    views: 345,
    lastActivity: "12 hours ago",
    isPinned: false,
    tags: ["beginner", "planning", "multi-day"],
  },
]

const topContributors = [
  {
    name: "Mountain Mike",
    avatar: "/experienced-hiker.png",
    posts: 1234,
    badge: "Legend",
    specialty: "Alpine Routes",
  },
  {
    name: "Trail Sarah",
    avatar: "/female-guide.png",
    posts: 987,
    badge: "Expert",
    specialty: "Gear Reviews",
  },
  {
    name: "Safety Sam",
    avatar: "/safety-instructor.png",
    posts: 756,
    badge: "Expert",
    specialty: "Safety & First Aid",
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-adventure-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">TrailMate Community</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 text-pretty">
              Connect with fellow hikers, share experiences, and discover new adventures together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search discussions, trails, gear..."
                  className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
              </div>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8">
                <Plus className="h-5 w-5 mr-2" />
                New Discussion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Forum Categories */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Forum Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forumCategories.map((category) => (
                  <Card key={category.id} className="forum-thread-hover cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${category.color} text-2xl`}>{category.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{category.threads} threads</span>
                            <span>{category.posts} posts</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Discussions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Recent Discussions
                </h2>
                <Button variant="outline">View All</Button>
              </div>
              <div className="space-y-4">
                {recentDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="forum-thread-hover cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={discussion.author.avatar || "/placeholder.svg"}
                            alt={discussion.author.name}
                          />
                          <AvatarFallback>
                            {discussion.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              {discussion.isPinned && (
                                <Badge variant="secondary" className="mb-2 mr-2">
                                  📌 Pinned
                                </Badge>
                              )}
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                {discussion.title}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              by <strong>{discussion.author.name}</strong>
                              <Badge variant="outline" className="ml-1 text-xs">
                                {discussion.author.badge}
                              </Badge>
                            </span>
                            <span>in {discussion.category}</span>
                            <span>{discussion.lastActivity}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {discussion.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {discussion.replies}
                              </span>
                              <span>{discussion.views} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="font-semibold">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Today</span>
                  <span className="font-semibold text-green-600">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Discussions</span>
                  <span className="font-semibold">8,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Posts</span>
                  <span className="font-semibold">45,678</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topContributors.map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                        <AvatarFallback>
                          {contributor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{contributor.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {contributor.badge}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {contributor.posts} posts • {contributor.specialty}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Discussion
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Categories
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Find Members
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
