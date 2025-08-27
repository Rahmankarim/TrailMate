"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAll() {
      // Fetch all users, destinations, bookings from API
      // For demo, set dummy data
      setUsers([{ name: "John Doe", email: "john@example.com", role: "company" }]);
      setDestinations([{ name: "Hunza Valley", companyName: "EcoTours" }]);
      setBookings([{ name: "Jane", destinationName: "Hunza Valley", seats: 2 }]);
    }
    fetchAll();
  }, []);

  return (
    <Card className="max-w-4xl mx-auto mt-16 shadow-lg border-0 rounded-2xl bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-3xl font-bold text-gray-900">Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold text-emerald-700 mb-4">Users</h2>
        <ul className="mb-8 space-y-2">
          {users.map((u, i) => (
            <li key={i} className="border p-2 rounded bg-gray-50">{u.name} ({u.email}) - {u.role}</li>
          ))}
        </ul>
        <h2 className="text-xl font-bold text-emerald-700 mb-4">Destinations</h2>
        <ul className="mb-8 space-y-2">
          {destinations.map((d, i) => (
            <li key={i} className="border p-2 rounded bg-gray-50">{d.name} by {d.companyName}</li>
          ))}
        </ul>
        <h2 className="text-xl font-bold text-emerald-700 mb-4">Bookings</h2>
        <ul className="space-y-2">
          {bookings.map((b, i) => (
            <li key={i} className="border p-2 rounded bg-gray-50">{b.name} booked {b.destinationName} ({b.seats} seats)</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
