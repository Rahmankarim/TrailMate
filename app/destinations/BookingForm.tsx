"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BookingForm({ destinationId, onCloseAction }: { destinationId: string, onCloseAction: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [seats, setSeats] = useState(1);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const res = await fetch("/api/booking/post", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ destinationId, name, email, seats, details }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Booking failed");
      setLoading(false);
      return;
    }
    setSuccess("Booking successful!");
    setLoading(false);
  }

  return (
    <Card className="mt-6 shadow-lg border-0 rounded-2xl bg-white">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-emerald-700">Book Your Adventure</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBook} className="space-y-4">
          <Input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
          <Input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input type="number" min={1} placeholder="Seats" value={seats} onChange={e => setSeats(Number(e.target.value))} required />
          <Input type="text" placeholder="Details (optional)" value={details} onChange={e => setDetails(e.target.value)} />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <div className="flex gap-4">
            <Button type="submit" className="w-full bg-emerald-700 text-white hover:bg-emerald-800" disabled={loading}>
              {loading ? "Booking..." : "Book"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={onCloseAction}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
