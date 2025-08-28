import { ArrowLeft, Plus, Filter, SortDesc, MessageSquare, Eye, Clock, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Mock data for category discussions
const categoryData = {
  "gear-equipment": {
    name: "Gear & Equipment",
    description: "Discuss hiking gear, reviews, and recommendations",
    icon: "🎒",
    color: "bg-secondary/10 text-secondary",
  },
}

const discussions = [
  {
    id: 1,
    title: "Comprehensive review: Osprey Atmos AG 65 vs Gregory Baltoro 65",
    author: {
      name: "GearGuru Mike",
      avatar: "/gear-expert.png",
      badge: "Gear Expert",
      joinDate: "2022",
    },
    replies: 45,
    views: 1234,
    lastActivity: "2 hours ago",
    lastReply: {
      author: "Sarah H.",
      time: "2 hours ago",
    },
    isPinned: true,
    isLocked: false,
    tags: ["backpack", "review", "comparison"],
    excerpt: "After 6 months of testing both packs on various trails, here's my detailed comparison...",
  },
  {
    id: 2,
    title: "Budget-friendly alternatives to expensive hiking boots",
    author: {
      name: "BudgetHiker",
      avatar: "/budget-hiker.png",
      badge: "Community Member",
      joinDate: "2023",
    },
    replies: 28,
    views: 567,
    lastActivity: "4 hours ago",
    lastReply: {
      author: "TrailRunner22",
      time: "4 hours ago",
    },
    isPinned: false,
    isLocked: false,
    tags: ["boots", "budget", "alternatives"],
    excerpt: "Found some great alternatives that won't break the bank but still provide excellent performance...",
  },
  {
    id: 3,
    title: "Ultralight cooking systems: What's worth the weight?",
    author: {
      name: "UltralightSarah",
      avatar: "/ultralight-hiker.png",
      badge: "Ultralight Expert",
      joinDate: "2021",
    },
    replies: 67,
    views: 2134,
    lastActivity: "6 hours ago",
    lastReply: {
      author: "CookingEnthusiast",
      time: "6 hours ago",
    },
    isPinned: true,
    isLocked: false,
    tags: ["ultralight", "cooking", "stoves"],
    excerpt: "Comparing weight vs functionality across different cooking systems for long-distance hiking...",
  },
]

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categoryData[params.category as keyof typeof categoryData] || categoryData["gear-equipment"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/community">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${category.color} text-2xl`}>{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Discussion
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="recent">
              <SelectTrigger className="w-40">
                <SortDesc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="replies">Most Replies</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Discussions List */}
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Card key={discussion.id} className="forum-thread-hover cursor-pointer">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={discussion.author.avatar || "/placeholder.svg"} alt={discussion.author.name} />
                    <AvatarFallback>
                      {discussion.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {discussion.isPinned && <Pin className="h-4 w-4 text-primary" />}
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                            {discussion.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{discussion.excerpt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        by <strong>{discussion.author.name}</strong>
                        <Badge variant="outline" className="ml-1 text-xs">
                          {discussion.author.badge}
                        </Badge>
                      </span>
                      <span>joined {discussion.author.joinDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {discussion.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {discussion.views}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <div className="text-right">
                            <div>Last reply by {discussion.lastReply.author}</div>
                            <div className="text-xs">{discussion.lastReply.time}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
