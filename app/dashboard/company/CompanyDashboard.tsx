"use client";
// import Sidebar from "@/components/dashboard/Sidebar";
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

  // Example stats (replace with real API calls as needed)
  const totalDestinations = destinations.length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const recentBookings = bookings.slice(0, 5);
  const recentDestinations = destinations.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
  {/* <Sidebar role="company" active="Dashboard" /> */}
      <div className="flex-1 flex flex-col">
        <Topbar user={{ name: company?.name || "Company" }} />
  <main className="p-8 pt-28">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {company?.name || "Company"}</h1>
              <div className="text-lg text-gray-700 dark:text-gray-200">Manage your business and adventures from here.</div>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="/dashboard/company/profile" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700">Profile</a>
              <a href="/dashboard/company/destinations" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Destinations</a>
              <a href="/dashboard/company/bookings" className="bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600">Bookings</a>
              <a href="/dashboard/company/analytics" className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900">Analytics</a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-2xl font-bold text-emerald-600 mb-2">{totalDestinations}</div>
              <div className="text-gray-700 dark:text-gray-200">Destinations</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{totalBookings}</div>
              <div className="text-gray-700 dark:text-gray-200">Bookings</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-2xl font-bold text-amber-500 mb-2">${totalRevenue}</div>
              <div className="text-gray-700 dark:text-gray-200">Revenue</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
              {recentBookings.length === 0 ? (
                <div className="text-gray-500">No recent bookings.</div>
              ) : (
                <ul className="space-y-3">
                  {recentBookings.map((b, idx) => (
                    <li key={idx} className="border-b pb-2">
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-sm text-gray-600">{b.destinationName} &middot; {b.seats} seats</div>
                      <div className="text-xs text-gray-400">{b.email}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Destinations</h2>
              {recentDestinations.length === 0 ? (
                <div className="text-gray-500">No recent destinations.</div>
              ) : (
                <ul className="space-y-3">
                  {recentDestinations.map((d, idx) => (
                    <li key={idx} className="border-b pb-2">
                      <div className="font-semibold">{d.name}</div>
                      <div className="text-sm text-gray-600">{d.date} {d.time}</div>
                      <div className="text-xs text-gray-400">{d.companyName}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

