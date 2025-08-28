"use client";
// import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GuideDashboard() {
  const [guide, setGuide] = useState<any>(null);
  const [trips, setTrips] = useState<string[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGuideData() {
      const token = localStorage.getItem("token");
      // Fetch guide info
      const resGuide = await fetch("/api/guide/post", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}), // No body needed for get, but API expects POST
      });
      const dataGuide = await resGuide.json();
      setGuide(dataGuide.guide || null);
      setTrips(dataGuide.guide?.places || []);

      // Fetch bookings for guide
      const resBookings = await fetch("/api/booking/guide", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataBookings = await resBookings.json();
      setBookings(dataBookings.bookings || []);
    }
    fetchGuideData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
  {/* <Sidebar role="guide" active="Profile" /> */}
      <div className="flex-1 flex flex-col">
        <Topbar user={{ name: guide?.name || "Guide" }} />
        <main className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <div className="flex items-center gap-4 mb-4">
                <img src="/placeholder-user.jpg" alt="Guide Photo" className="w-16 h-16 rounded-full shadow" />
                <div>
                  <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{guide?.name || "Guide"}</h2>
                  <p className="text-gray-500 dark:text-gray-300">Adventure Guide</p>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-200">Welcome! View your trips, bookings, and earnings here.</div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <h3 className="font-bold text-lg mb-2 text-emerald-700 dark:text-emerald-400">My Trips</h3>
              <div className="grid grid-cols-2 gap-4">
                {trips.length === 0 && <div className="text-gray-500">No trips found.</div>}
                {trips.map((trip, idx) => (
                  <div key={idx} className="bg-emerald-100 dark:bg-emerald-900 p-4 rounded-xl">{trip}</div>
                ))}
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Card className="p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">Bookings</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-300">
                    <th className="py-2">Trip</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr><td colSpan={3} className="text-gray-500 py-4">No bookings found.</td></tr>
                  )}
                  {bookings.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.placeName || b.details || "-"}</td>
                      <td>{b.date || "-"}</td>
                      <td><span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700">Confirmed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
