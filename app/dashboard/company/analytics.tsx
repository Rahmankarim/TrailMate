"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Topbar from "@/components/dashboard/Topbar";

export default function CompanyAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Get user info
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: tokenPayload.name || "Company" });

        const res = await fetch("/api/company/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data.stats || null);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex-1 flex flex-col">
          <Topbar user={user} />
          <main className="p-8 pt-24">
            <div className="text-center py-12">Loading analytics...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex-1 flex flex-col">
          <Topbar user={user} />
          <main className="p-8 pt-24">
            <div className="text-center py-12 text-gray-500">No analytics data available</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col">
        <Topbar user={user} />
        <main className="p-8 pt-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your business performance and metrics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{stats.totalDestinations}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Destinations</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalGuides}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Guides</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalBookings}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bookings</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.totalSeatsBooked}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Seats Booked</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">${stats.totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
              {stats.recentBookings && stats.recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentBookings.map((booking: any, idx: number) => (
                    <div key={idx} className="border-b pb-3 last:border-b-0">
                      <div className="font-semibold">{booking.customerName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.destinationName} • {booking.seats} seats • ${booking.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No recent bookings</div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Top Destinations</h2>
              {stats.destinations && stats.destinations.length > 0 ? (
                <div className="space-y-3">
                  {stats.destinations.slice(0, 5).map((dest: any, idx: number) => (
                    <div key={idx} className="border-b pb-3 last:border-b-0">
                      <div className="font-semibold">{dest.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {dest.location} • ${dest.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        {dest.availableSeats}/{dest.totalSeats} seats available
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No destinations</div>
              )}
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Guides</h2>
            {stats.guides && stats.guides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.guides.map((guide: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="font-semibold mb-2">{guide.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Experience: {guide.experience} years
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Rating: {guide.rating.toFixed(1)}/5 • {guide.totalClients} clients
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">No guides added yet</div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}
