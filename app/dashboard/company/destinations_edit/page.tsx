"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditDestination() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchDestination() {
      if (!id) return;
      setLoading(true);
      const res = await fetch(`/api/destination/list`);
      const data = await res.json();
      const found = (data.destinations || []).find((d:any) => d._id === id);
      setDestination(found);
      setLoading(false);
    }
    fetchDestination();
  }, [id]);

  async function handleSave(e:any) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const token = localStorage.getItem("token");
  const payload = { ...destination };
  delete payload._id;
  delete payload.postedBy;
    const res = await fetch(`/api/destination/${id}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/dashboard/company/destinations");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update destination.");
    }
    setSaving(false);
  }

  if (loading) return <main className="p-16">Loading...</main>;
  if (!destination) return <main className="p-16">Destination not found.</main>;

  return (
    <main className="p-8 pt-32 bg-gray-50 min-h-screen">
      <Card className="max-w-xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Destination</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <input type="text" value={destination.name} onChange={e => setDestination({ ...destination, name: e.target.value })} placeholder="Name" required className="border rounded px-3 py-2 w-full" />
          <textarea value={destination.description} onChange={e => setDestination({ ...destination, description: e.target.value })} placeholder="Description" required className="border rounded px-3 py-2 w-full" />
          <input type="text" value={destination.location || ""} onChange={e => setDestination({ ...destination, location: e.target.value })} placeholder="Location" className="border rounded px-3 py-2 w-full" />
          <input type="number" value={destination.price || ""} onChange={e => setDestination({ ...destination, price: Number(e.target.value) })} placeholder="Price" className="border rounded px-3 py-2 w-full" />
          <input type="text" value={destination.difficulty || ""} onChange={e => setDestination({ ...destination, difficulty: e.target.value })} placeholder="Difficulty" className="border rounded px-3 py-2 w-full" />
          <input type="text" value={destination.duration || ""} onChange={e => setDestination({ ...destination, duration: e.target.value })} placeholder="Duration" className="border rounded px-3 py-2 w-full" />
          <input type="number" value={destination.elevation || ""} onChange={e => setDestination({ ...destination, elevation: Number(e.target.value) })} placeholder="Elevation (m)" className="border rounded px-3 py-2 w-full" />
          <input type="number" value={destination.distance || ""} onChange={e => setDestination({ ...destination, distance: Number(e.target.value) })} placeholder="Distance (km)" className="border rounded px-3 py-2 w-full" />
          <input type="text" value={destination.bestSeason || ""} onChange={e => setDestination({ ...destination, bestSeason: e.target.value })} placeholder="Best Season" className="border rounded px-3 py-2 w-full" />
          <input type="text" value={destination.companyName || ""} onChange={e => setDestination({ ...destination, companyName: e.target.value })} placeholder="Company Name" className="border rounded px-3 py-2 w-full" />
          <input type="text" value={Array.isArray(destination.activities) ? destination.activities.join(", ") : ""} onChange={e => setDestination({ ...destination, activities: e.target.value.split(",").map((a:string)=>a.trim()) })} placeholder="Activities (comma separated)" className="border rounded px-3 py-2 w-full" />
          <input type="text" value={Array.isArray(destination.images) ? destination.images.join(", ") : ""} onChange={e => setDestination({ ...destination, images: e.target.value.split(",").map((img:string)=>img.trim()) })} placeholder="Image URLs (comma separated)" className="border rounded px-3 py-2 w-full" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!destination.featured} onChange={e => setDestination({ ...destination, featured: e.target.checked })} />
            Featured
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-4 mt-6">
            <Button type="submit" className="bg-blue-600 text-white" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/company/destinations")}>Cancel</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
