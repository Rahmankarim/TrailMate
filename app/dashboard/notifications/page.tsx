"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash2, MessageSquare, Calendar, DollarSign, Star, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: "booking" | "message" | "payment" | "review" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
}

export default function NotificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "booking",
      title: "New Booking Request",
      message: "John Doe has requested to book your Everest Base Camp trek for March 15-25, 2024.",
      timestamp: "2024-01-15T10:30:00Z",
      read: false,
      priority: "high",
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      message: "Sarah Wilson sent you a message about the upcoming Annapurna trek.",
      timestamp: "2024-01-15T09:15:00Z",
      read: false,
      priority: "medium",
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Received",
      message: "Payment of $1,200 has been received for booking #TR-2024-001.",
      timestamp: "2024-01-14T16:45:00Z",
      read: true,
      priority: "medium",
    },
    {
      id: "4",
      type: "review",
      title: "New Review",
      message: "Mike Johnson left a 5-star review for your Manaslu Circuit trek.",
      timestamp: "2024-01-14T14:20:00Z",
      read: true,
      priority: "low",
    },
    {
      id: "5",
      type: "system",
      title: "Profile Update Required",
      message: "Please update your guide certification documents before February 1st.",
      timestamp: "2024-01-13T11:00:00Z",
      read: false,
      priority: "high",
    },
  ])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUser(payload)
    } catch {
      router.push("/signin")
    }
  }, [router])

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-5 w-5 text-blue-600" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-green-600" />
      case "payment":
        return <DollarSign className="h-5 w-5 text-emerald-600" />
      case "review":
        return <Star className="h-5 w-5 text-yellow-600" />
      case "system":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="h-8 w-8 text-emerald-600" />
              Notifications
              {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
            </h1>
            <p className="text-gray-600 mt-2">Stay updated with your latest activities and messages</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Check className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? "border-l-4 border-l-emerald-500 bg-emerald-50/30" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                            {notification.title}
                          </h3>
                          <Badge className={getPriorityColor(notification.priority)}>{notification.priority}</Badge>
                          {!notification.read && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                        </div>
                        <p className={`text-sm ${!notification.read ? "text-gray-700" : "text-gray-600"} mb-2`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
