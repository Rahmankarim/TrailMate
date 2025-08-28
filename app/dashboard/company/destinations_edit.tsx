"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditDestination() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [loading, setLoading] = useState(false);
  const [dest, setDest] = useState<any>(null);

  useEffect(() => {
    async function fetchDest() {
      if (!id) return;
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/destination/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDest(data.destination || null);
    }
    fetchDest();
  }, [id]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData(e.target);
    const images = formData.getAll("images").filter(Boolean);
    const activities = formData.get("activities")?.toString().split(",").map(a => a.trim()).filter(Boolean);
    const highlights = formData.get("highlights")?.toString().split(",").map(a => a.trim()).filter(Boolean);
    const itinerary = formData.get("itinerary")?.toString().split(",").map(a => a.trim()).filter(Boolean);
    const included = formData.get("included")?.toString().split(",").map(a => a.trim()).filter(Boolean);
    const notIncluded = formData.get("notIncluded")?.toString().split(",").map(a => a.trim()).filter(Boolean);
    const packingList = formData.get("packingList")?.toString().split(",").map(a => a.trim()).filter(Boolean);
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      detailedDescription: formData.get("detailedDescription"),
      image: images[0] || "",
      images,
      date: formData.get("date"),
      time: formData.get("time"),
      availableSeats: Number(formData.get("availableSeats")),
      companyName: formData.get("companyName"),
      difficulty: formData.get("difficulty"),
      duration: formData.get("duration"),
      elevation: formData.get("elevation"),
      distance: formData.get("distance"),
      bestSeason: formData.get("bestSeason"),
      activities,
      price: Number(formData.get("price")),
      featured: formData.get("featured") === "on",
      highlights,
      itinerary,
      included,
      notIncluded,
      packingList,
    };
    const res = await fetch(`/api/destination/${id}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/company/destinations");
    } else {
      alert("Failed to update destination.");
    }
  }

  if (!dest) return <main className="p-8">Loading...</main>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Destination</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" defaultValue={dest.name} placeholder="Destination Name" className="w-full p-2 rounded border" required />
          <input name="companyName" type="text" defaultValue={dest.companyName} placeholder="Company Name" className="w-full p-2 rounded border" required />
          <input name="description" type="text" defaultValue={dest.description} placeholder="Short Description" className="w-full p-2 rounded border" required />
          <textarea name="detailedDescription" defaultValue={dest.detailedDescription} placeholder="Detailed Description" className="w-full p-2 rounded border" />
          <input name="date" type="date" defaultValue={dest.date} className="w-full p-2 rounded border" required />
          <input name="time" type="time" defaultValue={dest.time} className="w-full p-2 rounded border" required />
          <input name="availableSeats" type="number" min={1} defaultValue={dest.availableSeats} placeholder="Available Seats" className="w-full p-2 rounded border" required />
          <input name="difficulty" type="text" defaultValue={dest.difficulty} placeholder="Difficulty" className="w-full p-2 rounded border" />
          <input name="duration" type="text" defaultValue={dest.duration} placeholder="Duration" className="w-full p-2 rounded border" />
          <input name="elevation" type="text" defaultValue={dest.elevation} placeholder="Elevation" className="w-full p-2 rounded border" />
          <input name="distance" type="text" defaultValue={dest.distance} placeholder="Distance" className="w-full p-2 rounded border" />
          <input name="bestSeason" type="text" defaultValue={dest.bestSeason} placeholder="Best Season" className="w-full p-2 rounded border" />
          <input name="price" type="number" min={0} defaultValue={dest.price} placeholder="Price" className="w-full p-2 rounded border" />
          <label className="flex items-center gap-2"><input name="featured" type="checkbox" defaultChecked={dest.featured} /> Featured</label>
          <input name="activities" type="text" defaultValue={dest.activities?.join(", ") || ""} placeholder="Activities (comma separated)" className="w-full p-2 rounded border" />
          <input name="highlights" type="text" defaultValue={dest.highlights?.join(", ") || ""} placeholder="Highlights (comma separated)" className="w-full p-2 rounded border" />
          <input name="itinerary" type="text" defaultValue={dest.itinerary?.join(", ") || ""} placeholder="Itinerary (comma separated)" className="w-full p-2 rounded border" />
          <input name="included" type="text" defaultValue={dest.included?.join(", ") || ""} placeholder="Included (comma separated)" className="w-full p-2 rounded border" />
          <input name="notIncluded" type="text" defaultValue={dest.notIncluded?.join(", ") || ""} placeholder="Not Included (comma separated)" className="w-full p-2 rounded border" />
          <input name="packingList" type="text" defaultValue={dest.packingList?.join(", ") || ""} placeholder="Packing List (comma separated)" className="w-full p-2 rounded border" />
          <input name="images" type="text" defaultValue={dest.images?.[0] || ""} placeholder="Image URL 1" className="w-full p-2 rounded border" />
          <input name="images" type="text" defaultValue={dest.images?.[1] || ""} placeholder="Image URL 2" className="w-full p-2 rounded border" />
          <input name="images" type="text" defaultValue={dest.images?.[2] || ""} placeholder="Image URL 3" className="w-full p-2 rounded border" />
          <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? "Updating..." : "Update Destination"}</Button>
        </form>
      </Card>
    </main>
  );
}
