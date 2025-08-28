"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CompanyDestinations() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/destination/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDestinations(data.destinations || []);
      setLoading(false);
    }
    fetchDestinations();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/destination/${id}/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setDestinations(destinations.filter(d => d._id !== id));
    } else {
      alert("Failed to delete destination.");
    }
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Destinations</h1>
        <a href="/dashboard/company/destinations_add" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700">Add Destination</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && <div>Loading...</div>}
        {!loading && destinations.length === 0 && <div>No destinations found.</div>}
        {!loading && destinations.map(dest => (
          <Card key={dest._id} className="p-6">
            <h2 className="text-xl font-semibold mb-2">{dest.name}</h2>
            <p className="mb-2">{dest.description}</p>
            <div className="mb-2 text-sm text-gray-600">Company: {dest.companyName}</div>
            <div className="mb-2 text-sm text-gray-600">Difficulty: {dest.difficulty}</div>
            <div className="mb-2 text-sm text-gray-600">Duration: {dest.duration}</div>
            <div className="mb-2 text-sm text-gray-600">Price: {dest.price ? `$${dest.price}` : "—"}</div>
            <div className="flex gap-2 mt-4">
              <a href={`/dashboard/company/destinations_edit?id=${dest._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Edit</a>
              <Button variant="destructive" onClick={() => handleDelete(dest._id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
