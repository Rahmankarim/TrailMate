"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Topbar from "@/components/dashboard/Topbar";

export default function CompanyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Get user info
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: tokenPayload.name || "Company" });

        const res = await fetch("/api/booking/company", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalSeats = bookings.reduce((sum, b) => sum + (b.seats || 0), 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex flex-col">
        <Topbar user={user} />
        <main className="p-8 pt-24">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage all bookings for your destinations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Bookings</div>
              <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Seats Booked</div>
              <div className="text-3xl font-bold text-emerald-600">{totalSeats}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-amber-600">${totalRevenue.toFixed(2)}</div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">All Bookings</h2>
            {loading && <div className="text-center py-8">Loading bookings...</div>}
            {!loading && bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bookings found. Bookings will appear here once customers book your destinations.
              </div>
            )}
            {!loading && bookings.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Customer</th>
                      <th className="text-left p-3">Destination</th>
                      <th className="text-left p-3">Seats</th>
                      <th className="text-left p-3">Price</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-3">
                          <div className="font-semibold">{b.name}</div>
                          <div className="text-sm text-gray-600">{b.email}</div>
                          {b.phone && <div className="text-xs text-gray-500">{b.phone}</div>}
                        </td>
                        <td className="p-3">{b.destinationName}</td>
                        <td className="p-3">{b.seats}</td>
                        <td className="p-3">${(b.totalPrice || 0).toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(b.status)}`}>
                            {b.status || "pending"}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}
