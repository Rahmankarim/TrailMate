import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Heart, MessageCircle, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// Mock data for individual blog post
const blogPost = {
  id: 1,
  title: "The Complete Guide to Hiking the Appalachian Trail: Planning Your Thru-Hike",
  content: `
    <p>The Appalachian Trail stretches 2,190 miles from Georgia to Maine, offering one of the most challenging and rewarding hiking experiences in North America. Planning a thru-hike requires careful preparation, physical conditioning, and strategic decision-making.</p>

    <h2>Getting Started: The Basics</h2>
    <p>Before you even think about hitting the trail, you need to understand what you're getting into. A typical thru-hike takes 5-7 months to complete, with most hikers starting in Georgia in March or April and finishing in Maine by October.</p>

    <h3>Physical Preparation</h3>
    <p>Start training at least 6 months before your planned departure. Focus on:</p>
    <ul>
      <li>Cardiovascular endurance through regular hiking and cardio exercises</li>
      <li>Leg strength with squats, lunges, and stair climbing</li>
      <li>Core stability for carrying a heavy pack</li>
      <li>Gradual pack weight increases during training hikes</li>
    </ul>

    <h3>Gear Selection</h3>
    <p>Your gear choices can make or break your thru-hike experience. Focus on the "Big Four":</p>
    <ul>
      <li><strong>Backpack:</strong> 40-60L capacity, properly fitted</li>
      <li><strong>Shelter:</strong> Lightweight tent or tarp, under 2 pounds</li>
      <li><strong>Sleep System:</strong> Sleeping bag and pad rated for expected conditions</li>
      <li><strong>Footwear:</strong> Comfortable, broken-in hiking boots or trail runners</li>
    </ul>

    <h2>Resupply Strategy</h2>
    <p>Planning your resupply strategy is crucial for success. Most hikers use a combination of:</p>
    <ul>
      <li>Mail drops to post offices and businesses along the trail</li>
      <li>Purchasing supplies in trail towns</li>
      <li>Bounce boxes for items needed periodically</li>
    </ul>

    <h3>Budgeting</h3>
    <p>Expect to spend $3,000-$6,000 for a complete thru-hike, including:</p>
    <ul>
      <li>Gear and equipment: $1,500-$3,000</li>
      <li>Food and resupply: $1,000-$1,500</li>
      <li>Lodging and town expenses: $500-$1,500</li>
    </ul>

    <h2>Mental Preparation</h2>
    <p>The mental challenge of a thru-hike often exceeds the physical demands. Prepare for:</p>
    <ul>
      <li>Long periods of solitude and self-reflection</li>
      <li>Weather-related challenges and setbacks</li>
      <li>Physical discomfort and potential injuries</li>
      <li>The temptation to quit during difficult sections</li>
    </ul>

    <h2>Leave No Trace</h2>
    <p>As a thru-hiker, you're an ambassador for the hiking community. Follow Leave No Trace principles:</p>
    <ul>
      <li>Plan ahead and prepare</li>
      <li>Travel and camp on durable surfaces</li>
      <li>Dispose of waste properly</li>
      <li>Leave what you find</li>
      <li>Minimize campfire impacts</li>
      <li>Respect wildlife</li>
      <li>Be considerate of other visitors</li>
    </ul>

    <h2>Conclusion</h2>
    <p>A successful Appalachian Trail thru-hike requires months of preparation, but the experience will change your life forever. Take time to plan carefully, train consistently, and approach the trail with respect and humility.</p>
  `,
  author: {
    name: "Trail Expert Mike",
    avatar: "/experienced-hiker.png",
    role: "Trail Guide",
    bio: "Mike has completed the Appalachian Trail three times and has been guiding hikers for over 15 years.",
  },
  category: "Trail Guides",
  readTime: "12 min read",
  publishedAt: "2024-01-15",
  updatedAt: "2024-01-16",
  image: "/appalachian-trail-hero.png",
  tags: ["thru-hiking", "appalachian-trail", "planning", "gear", "preparation"],
  views: 2847,
  likes: 156,
  comments: 23,
  bookmarks: 89,
}

const relatedPosts = [
  {
    id: 2,
    title: "Essential Gear for Long-Distance Hiking",
    slug: "essential-gear-long-distance-hiking",
    image: "/hiking-gear-essentials.jpg",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Mental Strategies for Completing a Thru-Hike",
    slug: "mental-strategies-thru-hike",
    image: "/mental-hiking-strategies.jpg",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Resupply Planning for the Appalachian Trail",
    slug: "resupply-planning-appalachian-trail",
    image: "/trail-resupply-planning.jpg",
    readTime: "10 min read",
  },
]

const comments = [
  {
    id: 1,
    author: {
      name: "Sarah Johnson",
      avatar: "/female-hiker.png",
    },
    content:
      "This is exactly what I needed! Starting my thru-hike attempt next spring and this guide covers everything I was wondering about. The budgeting section was particularly helpful.",
    publishedAt: "2024-01-16",
    likes: 12,
  },
  {
    id: 2,
    author: {
      name: "Mountain Dave",
      avatar: "/experienced-hiker.png",
    },
    content:
      "Great comprehensive guide! I'd add that mental preparation is just as important as physical. The trail will test you in ways you never expected.",
    publishedAt: "2024-01-16",
    likes: 8,
  },
  {
    id: 3,
    author: {
      name: "Hiking Newbie",
      avatar: "/young-female-hiker.png",
    },
    content:
      "As someone who's only done day hikes, this seems incredibly daunting but also exciting! Thanks for breaking it down so clearly.",
    publishedAt: "2024-01-15",
    likes: 5,
  },
]

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="max-w-4xl">
              {/* Hero Image */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
                <img
                  src={
                    blogPost.image ||
                    `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(blogPost.title)}`
                  }
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{blogPost.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {blogPost.readTime}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{blogPost.title}</h1>

                {/* Author Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={blogPost.author.avatar || "/placeholder.svg"} alt={blogPost.author.name} />
                      <AvatarFallback>
                        {blogPost.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{blogPost.author.name}</p>
                      <p className="text-sm text-muted-foreground">{blogPost.author.role}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(blogPost.publishedAt).toLocaleDateString()}
                        </span>
                        <span>{blogPost.views} views</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      {blogPost.likes}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-1" />
                      {blogPost.bookmarks}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {blogPost.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

              <Separator className="my-8" />

              {/* Author Bio */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={blogPost.author.avatar || "/placeholder.svg"} alt={blogPost.author.name} />
                      <AvatarFallback>
                        {blogPost.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">About {blogPost.author.name}</h3>
                      <p className="text-muted-foreground mb-3">{blogPost.author.bio}</p>
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MessageCircle className="h-6 w-6" />
                  Comments ({blogPost.comments})
                </h3>

                {/* Add Comment */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Leave a comment</h4>
                    <Textarea placeholder="Share your thoughts..." className="mb-4" />
                    <Button>Post Comment</Button>
                  </CardContent>
                </Card>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                            <AvatarFallback>
                              {comment.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium">{comment.author.name}</p>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground mb-3">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4 mr-1" />
                                {comment.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table of Contents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href="#getting-started" className="block text-sm hover:text-primary transition-colors">
                  Getting Started: The Basics
                </a>
                <a href="#physical-prep" className="block text-sm hover:text-primary transition-colors ml-4">
                  Physical Preparation
                </a>
                <a href="#gear-selection" className="block text-sm hover:text-primary transition-colors ml-4">
                  Gear Selection
                </a>
                <a href="#resupply" className="block text-sm hover:text-primary transition-colors">
                  Resupply Strategy
                </a>
                <a href="#budgeting" className="block text-sm hover:text-primary transition-colors ml-4">
                  Budgeting
                </a>
                <a href="#mental-prep" className="block text-sm hover:text-primary transition-colors">
                  Mental Preparation
                </a>
                <a href="#leave-no-trace" className="block text-sm hover:text-primary transition-colors">
                  Leave No Trace
                </a>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedPosts.map((post) => (
                  <div key={post.id} className="flex gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={
                          post.image || `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(post.title)}`
                        }
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">{post.title}</h4>
                      <p className="text-xs text-muted-foreground">{post.readTime}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share This Article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Share on Twitter
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Share on Facebook
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Copy Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
