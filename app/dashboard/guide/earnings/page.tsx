"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Calendar, Download, Eye, CreditCard, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"

interface Earning {
  id: string
  bookingId: string
  tripTitle: string
  customer: string
  amount: number
  commission: number
  netEarning: number
  date: string
  status: "paid" | "pending" | "processing"
  paymentMethod: string
}

export default function GuideEarningsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [timeFilter, setTimeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [earnings, setEarnings] = useState<Earning[]>([
    {
      id: "E-001",
      bookingId: "BK-2024-001",
      tripTitle: "Everest Base Camp Trek",
      customer: "John Smith",
      amount: 2400,
      commission: 240,
      netEarning: 2160,
      date: "2024-01-15",
      status: "paid",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "E-002",
      bookingId: "BK-2024-003",
      tripTitle: "Manaslu Circuit",
      customer: "Mike Johnson",
      amount: 2100,
      commission: 210,
      netEarning: 1890,
      date: "2024-01-10",
      status: "paid",
      paymentMethod: "PayPal",
    },
    {
      id: "E-003",
      bookingId: "BK-2024-005",
      tripTitle: "Nagarkot Sunrise",
      customer: "David Chen",
      amount: 120,
      commission: 12,
      netEarning: 108,
      date: "2024-01-08",
      status: "paid",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "E-004",
      bookingId: "BK-2024-002",
      tripTitle: "Annapurna Circuit",
      customer: "Sarah Wilson",
      amount: 1800,
      commission: 180,
      netEarning: 1620,
      date: "2024-01-20",
      status: "pending",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "E-005",
      bookingId: "BK-2024-006",
      tripTitle: "Gokyo Lakes Trek",
      customer: "Emma Davis",
      amount: 1600,
      commission: 160,
      netEarning: 1440,
      date: "2024-01-25",
      status: "processing",
      paymentMethod: "PayPal",
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
      if (payload.role !== "guide") {
        router.push("/dashboard")
        return
      }
      setUser(payload)
    } catch {
      router.push("/signin")
    }
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredEarnings = earnings.filter((earning) => {
    const matchesStatus = statusFilter === "all" || earning.status === statusFilter
    // Add time filtering logic here
    return matchesStatus
  })

  const stats = {
    totalEarnings: earnings.reduce((sum, e) => sum + e.netEarning, 0),
    paidEarnings: earnings.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.netEarning, 0),
    pendingEarnings: earnings.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.netEarning, 0),
    totalCommission: earnings.reduce((sum, e) => sum + e.commission, 0),
    thisMonth: earnings
      .filter((e) => new Date(e.date).getMonth() === new Date().getMonth())
      .reduce((sum, e) => sum + e.netEarning, 0),
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600 mt-2">Track your income and payment history</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-green-600">${stats.paidEarnings.toLocaleString()}</p>
                </div>
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">${stats.pendingEarnings.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">${stats.thisMonth.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Commission Paid</p>
                  <p className="text-2xl font-bold text-purple-600">${stats.totalCommission.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="earnings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="earnings">Earnings History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payouts">Payout Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="earnings">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="thisYear">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Earnings List */}
            <div className="space-y-4">
              {filteredEarnings.map((earning) => (
                <Card key={earning.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{earning.tripTitle}</h3>
                            <Badge className={getStatusColor(earning.status)}>{earning.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Customer:</span> {earning.customer}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {new Date(earning.date).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Payment:</span> {earning.paymentMethod}
                            </div>
                            <div>
                              <span className="font-medium">Booking ID:</span> {earning.bookingId}
                            </div>
                          </div>
                          <div className="flex items-center gap-6 mt-3 text-sm">
                            <div>
                              <span className="text-gray-600">Gross Amount:</span>
                              <span className="font-medium ml-2">${earning.amount}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Commission:</span>
                              <span className="font-medium ml-2 text-red-600">-${earning.commission}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Net Earning:</span>
                              <span className="font-bold ml-2 text-emerald-600">${earning.netEarning}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="outline" className="flex items-center gap-2 bg-transparent">
                          <Eye className="h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Analytics</CardTitle>
                <CardDescription>Detailed breakdown of your earnings performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-600">Detailed charts and analytics will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>Manage your payment methods and payout preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Payout Settings</h3>
                  <p className="text-gray-600">Configure your payment methods and payout schedule.</p>
                  <Button className="mt-4">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
