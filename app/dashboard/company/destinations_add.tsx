"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddDestination() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    const res = await fetch("/api/destination/post", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/company/destinations");
    } else {
      alert("Failed to add destination.");
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Destination</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" placeholder="Destination Name" className="w-full p-2 rounded border" required />
          <input name="companyName" type="text" placeholder="Company Name" className="w-full p-2 rounded border" required />
          <input name="description" type="text" placeholder="Short Description" className="w-full p-2 rounded border" required />
          <textarea name="detailedDescription" placeholder="Detailed Description" className="w-full p-2 rounded border" />
          <input name="date" type="date" className="w-full p-2 rounded border" required />
          <input name="time" type="time" className="w-full p-2 rounded border" required />
          <input name="availableSeats" type="number" min={1} placeholder="Available Seats" className="w-full p-2 rounded border" required />
          <input name="difficulty" type="text" placeholder="Difficulty" className="w-full p-2 rounded border" />
          <input name="duration" type="text" placeholder="Duration" className="w-full p-2 rounded border" />
          <input name="elevation" type="text" placeholder="Elevation" className="w-full p-2 rounded border" />
          <input name="distance" type="text" placeholder="Distance" className="w-full p-2 rounded border" />
          <input name="bestSeason" type="text" placeholder="Best Season" className="w-full p-2 rounded border" />
          <input name="price" type="number" min={0} placeholder="Price" className="w-full p-2 rounded border" />
          <label className="flex items-center gap-2"><input name="featured" type="checkbox" /> Featured</label>
          <input name="activities" type="text" placeholder="Activities (comma separated)" className="w-full p-2 rounded border" />
          <input name="highlights" type="text" placeholder="Highlights (comma separated)" className="w-full p-2 rounded border" />
          <input name="itinerary" type="text" placeholder="Itinerary (comma separated)" className="w-full p-2 rounded border" />
          <input name="included" type="text" placeholder="Included (comma separated)" className="w-full p-2 rounded border" />
          <input name="notIncluded" type="text" placeholder="Not Included (comma separated)" className="w-full p-2 rounded border" />
          <input name="packingList" type="text" placeholder="Packing List (comma separated)" className="w-full p-2 rounded border" />
          <input name="images" type="text" placeholder="Image URL 1" className="w-full p-2 rounded border" />
          <input name="images" type="text" placeholder="Image URL 2" className="w-full p-2 rounded border" />
          <input name="images" type="text" placeholder="Image URL 3" className="w-full p-2 rounded border" />
          <Button type="submit" className="w-full bg-emerald-700 text-white py-2 rounded hover:bg-emerald-800" disabled={loading}>{loading ? "Adding..." : "Add Destination"}</Button>
        </form>
      </Card>
    </main>
  );
}
