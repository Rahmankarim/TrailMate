"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyGuideBookings() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/booking/guide", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    }
    fetchBookings();
  }, []);

  return (
    <Card className="mt-8 shadow-lg border-0 rounded-2xl bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-gray-900">Bookings for Your Guide Adventures</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {bookings.length === 0 && <li className="text-gray-600">No bookings yet.</li>}
          {bookings.map((b, i) => (
            <li key={i} className="border p-4 rounded-xl bg-gray-50">
              <strong>{b.name}</strong> ({b.email})<br />
              Seats: {b.seats}<br />
              Details: {b.details}<br />
              Place: {b.placeName}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
