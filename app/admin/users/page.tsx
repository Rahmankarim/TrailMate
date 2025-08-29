"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Edit, Trash2, Shield, Building, Compass } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return

    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setUsers(users.filter((user) => user._id !== id))
      } else {
        alert("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Error deleting user")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "company" && user.role === "company") ||
      (filter === "guide" && user.role === "guide") ||
      (filter === "admin" && user.role === "admin")
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
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
              <Users className="h-6 w-6 text-slate-700" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                <p className="text-slate-600 text-sm">Manage platform users and permissions</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = "/admin/dashboard")}>
              Back to Dashboard
            </Button>
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All ({users.length})
              </Button>
              <Button
                variant={filter === "company" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("company")}
              >
                Companies ({users.filter((u) => u.role === "company").length})
              </Button>
              <Button variant={filter === "guide" ? "default" : "outline"} size="sm" onClick={() => setFilter("guide")}>
                Guides ({users.filter((u) => u.role === "guide").length})
              </Button>
              <Button variant={filter === "admin" ? "default" : "outline"} size="sm" onClick={() => setFilter("admin")}>
                Admins ({users.filter((u) => u.role === "admin").length})
              </Button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      {user.role === "admin" && <Shield className="h-6 w-6 text-slate-600" />}
                      {user.role === "company" && <Building className="h-6 w-6 text-emerald-600" />}
                      {user.role === "guide" && <Compass className="h-6 w-6 text-purple-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{user.name}</h3>
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant={user.role === "admin" ? "default" : user.role === "company" ? "secondary" : "outline"}
                  >
                    {user.role}
                  </Badge>
                </div>

                {user.companyName && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-600">
                      <strong>Company:</strong> {user.companyName}
                    </p>
                  </div>
                )}

                <div className="text-xs text-slate-500 mb-4">
                  Joined: {new Date(user._id.getTimestamp()).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  {user.role !== "admin" && (
                    <Button size="sm" variant="destructive" onClick={() => deleteUser(user._id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No users found</h3>
            <p className="text-slate-600">
              {searchTerm ? "Try adjusting your search terms" : "No users match the selected filter"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
