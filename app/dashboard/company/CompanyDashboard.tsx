"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CompanyDashboard() {
  const [company, setCompany] = useState<any>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCompanyData() {
      const token = localStorage.getItem("token");
      // Fetch company info (replace with your actual endpoint if needed)
      // For now, just set a placeholder name
      setCompany({ name: "Eco Company" });

      // Fetch destinations
      const resDest = await fetch("/api/destination/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataDest = await resDest.json();
      setDestinations(dataDest.destinations || []);

      // Fetch bookings for company
      const resBookings = await fetch("/api/booking/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataBookings = await resBookings.json();
      setBookings(dataBookings.bookings || []);
    }
    fetchCompanyData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar role="company" active="Dashboard" />
      <div className="flex-1 flex flex-col">
        <Topbar user={{ name: company?.name || "Company" }} />
        <main className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <h3 className="font-bold text-lg mb-4 text-emerald-700 dark:text-emerald-400">Add New Adventure Destination</h3>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  const formData = new FormData(e.target as HTMLFormElement);
                  const payload = {
                    name: formData.get("name"),
                    description: formData.get("description"),
                    image: formData.get("image"),
                    date: formData.get("date"),
                    time: formData.get("time"),
                    availableSeats: Number(formData.get("availableSeats")),
                    companyName: company?.name || "Company"
                  };
                  const res = await fetch("/api/destination/post", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    alert("Destination posted successfully!");
                  } else {
                    alert(data.message || "Failed to post destination");
                  }
                }}
                className="space-y-4"
              >
                <input name="name" type="text" placeholder="Destination Name" className="w-full p-2 rounded border" required />
                <input name="description" type="text" placeholder="Description" className="w-full p-2 rounded border" required />
                <input name="image" type="text" placeholder="Image URL" className="w-full p-2 rounded border" required />
                <input name="date" type="date" className="w-full p-2 rounded border" required />
                <input name="time" type="time" className="w-full p-2 rounded border" required />
                <input name="availableSeats" type="number" min={1} placeholder="Available Seats" className="w-full p-2 rounded border" required />
                <button type="submit" className="w-full bg-emerald-700 text-white py-2 rounded hover:bg-emerald-800">Post Destination</button>
              </form>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <div className="flex items-center gap-4 mb-4">
                <img src="/placeholder-logo.png" alt="Company Logo" className="w-16 h-16 rounded-full shadow" />
                <div>
                  <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{company?.name || "Company"}</h2>
                  <p className="text-gray-500 dark:text-gray-300">Eco Adventure Company</p>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-200">Welcome! Manage your destinations and bookings here.</div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-400">Your Destinations</h3>
              <div className="grid grid-cols-1 gap-4">
                {destinations.length === 0 && <div className="text-gray-500">No destinations found.</div>}
                {destinations.map((d, idx) => (
                  <div key={idx} className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl">
                    <strong>{d.name}</strong> ({d.date} {d.time})<br />
                    {d.description}<br />
                    Seats: {d.availableSeats}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Card className="p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-900">
              <h3 className="font-bold text-lg mb-2 text-emerald-700 dark:text-emerald-400">Bookings</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-300">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Seats</th>
                    <th className="py-2">Destination</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr><td colSpan={4} className="text-gray-500 py-4">No bookings found.</td></tr>
                  )}
                  {bookings.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.name}</td>
                      <td>{b.email}</td>
                      <td>{b.seats}</td>
                      <td>{b.destinationName}</td>
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

