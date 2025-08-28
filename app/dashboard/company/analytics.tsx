"use client";
import { useEffect, useState } from "react";

export default function CompanyAnalytics() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/company/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data.stats || null);
    }
    fetchStats();
  }, []);

  if (!stats) return <main className="p-8">Loading...</main>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <div className="mb-4">Total Destinations: {stats.totalDestinations}</div>
      <div className="mb-4">Total Bookings: {stats.totalBookings}</div>
      <div className="mb-4">Total Revenue: ${stats.totalRevenue}</div>
      {/* Add more analytics as needed */}
    </main>
  );
}
