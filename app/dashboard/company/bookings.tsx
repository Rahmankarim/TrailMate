"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function CompanyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/booking/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>
      <div className="grid grid-cols-1 gap-6">
        {loading && <div>Loading...</div>}
        {!loading && bookings.length === 0 && <div>No bookings found.</div>}
        {!loading && bookings.map(b => (
          <Card key={b._id} className="p-6">
            <div className="font-semibold">{b.name}</div>
            <div>Email: {b.email}</div>
            <div>Seats: {b.seats}</div>
            <div>Destination: {b.destinationName}</div>
          </Card>
        ))}
      </div>
    </main>
  );
}
