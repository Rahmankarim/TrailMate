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
    <main className="p-8 pt-32 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Destinations Management</h1>
        <a href="/dashboard/company/destinations/add" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-emerald-700 transition">+ Add Destination</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading && <div className="col-span-full text-center text-lg text-gray-500">Loading...</div>}
        {!loading && destinations.length === 0 && <div className="col-span-full text-center text-lg text-gray-500">No destinations found.</div>}
        {!loading && destinations.map(dest => (
          <Card key={dest._id} className="p-6 bg-white rounded-2xl shadow-md flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-emerald-700">{dest.name}</h2>
              <p className="mb-2 text-gray-700">{dest.description}</p>
              <div className="mb-2 text-sm text-gray-600">Company: <span className="font-semibold">{dest.companyName}</span></div>
              <div className="mb-2 text-sm text-gray-600">Difficulty: {dest.difficulty}</div>
              <div className="mb-2 text-sm text-gray-600">Duration: {dest.duration}</div>
              <div className="mb-2 text-sm text-gray-600">Price: {dest.price ? `$${dest.price}` : "—"}</div>
              {dest.images && dest.images.length > 0 && (
                <div className="mb-2 flex gap-2">
                  {dest.images.slice(0,3).map((img:string,i:number)=>(
                    <img key={i} src={img} alt="Destination" className="w-16 h-16 object-cover rounded-lg border" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <a href={`/dashboard/company/destinations_edit?id=${dest._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Edit</a>
              <Button variant="destructive" onClick={() => handleDelete(dest._id)} className="px-4 py-2 rounded-lg font-semibold">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
