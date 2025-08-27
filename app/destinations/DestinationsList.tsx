"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookingForm from "./BookingForm";

export default function DestinationsList() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      const res = await fetch("/api/destination/list");
      const data = await res.json();
      setDestinations(data.destinations || []);
    }
    fetchDestinations();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
      {destinations.length === 0 ? (
        <div className="col-span-3 text-center text-gray-500 text-lg py-16">No items added</div>
      ) : (
        destinations.map((d) => (
          <div key={d._id} className="relative group rounded-3xl overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-gray-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0" />
            <img src={d.image} alt={d.name} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 z-10" />
            <div className="absolute top-6 left-6 bg-white/90 dark:bg-gray-900/90 px-6 py-3 rounded-2xl shadow-lg flex flex-col gap-1 z-20">
              <span className="font-extrabold text-2xl text-emerald-700 dark:text-emerald-400 tracking-tight">{d.name}</span>
              <span className="bg-gradient-to-r from-emerald-700 to-blue-700 text-white px-3 py-1 rounded text-xs font-bold mt-1 shadow">{d.companyName || "Unknown Company"}</span>
            </div>
            <div className="p-8 z-20">
              <div className="text-gray-700 dark:text-gray-200 mb-4 text-lg font-semibold italic">{d.description}</div>
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-2xl font-semibold">Date: {d.date}</span>
                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-2xl font-semibold">Time: {d.time}</span>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-2xl font-semibold">Seats: {d.availableSeats}</span>
              </div>
              <Button className="bg-gradient-to-r from-emerald-700 to-blue-700 text-white w-full mt-2 font-bold py-3 rounded-2xl shadow-xl hover:from-emerald-800 hover:to-blue-800 transition-all duration-300 text-lg tracking-wide" onClick={() => setBookingId(d._id)}>
                Book a Seat
              </Button>
              {bookingId === d._id && <BookingForm destinationId={d._id} onCloseAction={() => setBookingId(null)} />}
            </div>
            <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
              <span className="bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-2xl text-xs font-semibold shadow">Adventure by</span>
              <span className="bg-emerald-700 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow">{d.companyName || "Unknown Company"}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
