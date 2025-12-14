"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, Edit, Trash2, Eye, Calendar } from "lucide-react"

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function fetchBlogs() {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setBlogs(data.blogs || [])
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteBlog(id: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== id))
      } else {
        alert("Failed to delete blog post")
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      alert("Error deleting blog post")
    }
  }

  async function toggleFeatured(id: string, featured: boolean) {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !featured }),
      })

      if (res.ok) {
        setBlogs(blogs.map((blog) => (blog._id === id ? { ...blog, featured: !featured } : blog)))
      }
    } catch (error) {
      console.error("Error updating blog:", error)
    }
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && blog.published) ||
      (filter === "draft" && !blog.published) ||
      (filter === "featured" && blog.featured)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-slate-700" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Blog Management</h1>
                <p className="text-slate-600 text-sm">Create and manage blog posts</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => (window.location.href = "/admin/blogs/create")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/dashboard/admin")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All ({blogs.length})
              </Button>
              <Button
                variant={filter === "published" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("published")}
              >
                Published ({blogs.filter((b) => b.published).length})
              </Button>
              <Button variant={filter === "draft" ? "default" : "outline"} size="sm" onClick={() => setFilter("draft")}>
                Drafts ({blogs.filter((b) => !b.published).length})
              </Button>
              <Button
                variant={filter === "featured" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("featured")}
              >
                Featured ({blogs.filter((b) => b.featured).length})
              </Button>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Card key={blog._id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-slate-100 relative">
                <img
                  src={blog.image || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(blog.title)}`}
                  alt={blog.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  {blog.featured && <Badge className="bg-yellow-500 text-white">Featured</Badge>}
                  <Badge variant={blog.published ? "default" : "secondary"}>
                    {blog.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {blog.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {blog.views || 0} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => (window.location.href = `/admin/blogs/${blog._id}/edit`)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={blog.featured ? "default" : "outline"}
                    onClick={() => toggleFeatured(blog._id, blog.featured)}
                  >
                    {blog.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteBlog(blog._id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No blog posts found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by creating your first blog post"}
            </p>
            <Button onClick={() => (window.location.href = "/admin/blogs/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
