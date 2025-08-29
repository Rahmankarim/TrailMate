"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { slugify } from '@/lib/utils';

type Params = { params: { slug: string } };

import React from "react";
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [dest, setDest] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const apiUrl = `${baseUrl}/api/destination/list`;
      const res = await fetch(apiUrl, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      const list = (data && Array.isArray(data.destinations) ? data.destinations : data) || [];
      const found = list.find((d: any) => {
        const candidate = d.name || d.title || d.companyName || d._id || "";
        return slugify(candidate) === slug;
      }) || null;
      setDest(found);
      if (found?._id) {
        try {
          const resRev = await fetch(`/api/destination/${found._id}/reviews`);
          const dataRev = await resRev.json();
          setReviews(dataRev.reviews || found.reviews || []);
        } catch {
          setReviews(found.reviews || []);
        }
      }
    }
    fetchData();
  }, [slug]);

  async function handleReviewSubmit(e: any) {
    e.preventDefault();
    const form = e.target;
    const payload = {
      userName: form.userName.value,
      rating: Number(form.rating.value),
      comment: form.comment.value,
    };
    const res = await fetch(`/api/destination/${dest._id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const newReview = await res.json();
      setReviews([newReview.review, ...reviews]);
      form.reset();
    } else {
      alert("Failed to submit review.");
    }
  }

  if (!dest) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold mb-4">Destination not found</h1>
          <p className="text-gray-600 mb-6">We couldn't find that destination. Try browsing the destinations list.</p>
          <Link href="/destinations"><Button>Back to destinations</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative w-full h-[44vh] md:h-[56vh] overflow-hidden">
        <img src={dest.image || "/placeholder.jpg"} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-6 bottom-6 text-white z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">{dest.name}</h1>
          <div className="mt-2 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="font-medium">{dest.rating ?? "-"}</span>
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">{dest.location || dest.companyName || "Unknown"}</span>
            {dest.featured && <span className="bg-yellow-400 text-black px-3 py-1 rounded-full ml-2">Featured</span>}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-3">About this destination</h2>
              <p className="text-gray-700 leading-relaxed">{dest.detailedDescription || dest.description || "No description provided."}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div><strong>Difficulty:</strong> {dest.difficulty || "—"}</div>
                <div><strong>Duration:</strong> {dest.duration || "—"}</div>
                <div><strong>Elevation:</strong> {dest.elevation || "—"}</div>
                <div><strong>Distance:</strong> {dest.distance || "—"}</div>
                <div><strong>Best Season:</strong> {dest.bestSeason || "—"}</div>
                <div><strong>Price:</strong> {dest.price ? `$${dest.price}` : "—"}</div>
              </div>
              <div className="mt-4">
                <strong>Activities:</strong> {dest.activities?.join(", ") || "—"}
              </div>
              <div className="mt-4">
                <strong>Highlights:</strong>
                <ul className="list-disc ml-6">
                  {dest.highlights?.map((h:string,i:number)=>(<li key={i}>{h}</li>)) || <li>—</li>}
                </ul>
              </div>
              <div className="mt-4">
                <strong>Itinerary:</strong>
                <ul className="list-decimal ml-6">
                  {dest.itinerary?.map((it:string,i:number)=>(<li key={i}>{it}</li>)) || <li>—</li>}
                </ul>
              </div>
              <div className="mt-4">
                <strong>Included:</strong>
                <ul className="list-disc ml-6">
                  {dest.included?.map((inc:string,i:number)=>(<li key={i}>{inc}</li>)) || <li>—</li>}
                </ul>
              </div>
              <div className="mt-4">
                <strong>Not Included:</strong>
                <ul className="list-disc ml-6">
                  {dest.notIncluded?.map((ni:string,i:number)=>(<li key={i}>{ni}</li>)) || <li>—</li>}
                </ul>
              </div>
              <div className="mt-4">
                <strong>Packing List:</strong>
                <ul className="list-disc ml-6">
                  {dest.packingList?.map((p:string,i:number)=>(<li key={i}>{p}</li>)) || <li>—</li>}
                </ul>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Link href={`/book?destination=${slug}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Book a seat</Button>
                </Link>
                <Link href="/destinations" className="ml-2 text-sm text-gray-600 hover:underline">Back to list</Link>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-xl font-semibold mb-2">Reviews & Ratings</h3>
              <div className="mb-4">
                <span className="text-lg font-bold">Average Rating: </span>
                <span className="text-amber-500 font-bold">{dest.rating ?? "—"}</span>
                <span className="ml-2 text-gray-500">({reviews.length} reviews)</span>
              </div>
              <div className="space-y-4">
                {reviews.length ? reviews.map((r:any,i:number)=>(
                  <div key={i} className="border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold">{r.userName}</span>
                      <span className="text-amber-500">{r.rating} / 5</span>
                      <span className="text-xs text-gray-400 ml-2">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                    <p className="mt-1 text-gray-700">{r.comment}</p>
                  </div>
                )) : <div className="text-gray-500">No reviews yet.</div>}
              </div>
              {/* Review form (client-side) */}
              <form className="mt-6 space-y-2" onSubmit={handleReviewSubmit}>
                <input type="text" name="userName" placeholder="Your name" required className="border rounded px-2 py-1 w-full" />
                <select name="rating" required className="border rounded px-2 py-1 w-full">
                  <option value="">Rating</option>
                  {[1,2,3,4,5].map(n=>(<option key={n} value={n}>{n}</option>))}
                </select>
                <textarea name="comment" placeholder="Write your review..." required className="border rounded px-2 py-1 w-full" />
                <Button type="submit" className="bg-amber-500 text-white">Submit Review</Button>
              </form>
            </Card>
          </div>

          <aside>
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold">Quick facts</h4>
                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  <li><strong>Location:</strong> {dest.location || "—"}</li>
                  <li><strong>Difficulty:</strong> {dest.difficulty || "—"}</li>
                  <li><strong>Duration:</strong> {dest.duration || "—"}</li>
                  <li><strong>Elevation:</strong> {dest.elevation || "—"}</li>
                  <li><strong>Distance:</strong> {dest.distance || "—"}</li>
                  <li><strong>Best Season:</strong> {dest.bestSeason || "—"}</li>
                  <li><strong>Price:</strong> {dest.price ? `$${dest.price}` : "—"}</li>
                  <li><strong>Rating:</strong> {dest.rating ?? "—"}</li>
                  <li><strong>Reviews:</strong> {dest.reviews?.length ?? "—"}</li>
                </ul>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold">Gallery</h4>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(dest.images || [dest.image]).slice(0,6).map((img:any, i:number) => (
                    <img
                      key={i}
                      src={img || "/placeholder.jpg"}
                      alt={`${dest.name}-${i}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:scale-105 transition"
                      onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}
                    />
                  ))}
                </div>
                {galleryOpen && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
                    <div className="bg-white rounded-xl shadow-lg p-4 relative max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                      <img src={(dest.images || [dest.image])[galleryIndex] || "/placeholder.jpg"} alt="Gallery" className="w-full h-auto max-h-[70vh] object-contain rounded" />
                      <div className="flex justify-between w-full mt-4">
                        <Button onClick={() => setGalleryIndex(i => Math.max(0, i-1))} disabled={galleryIndex === 0}>Prev</Button>
                        <Button onClick={() => setGalleryOpen(false)}>Close</Button>
                        <Button onClick={() => setGalleryIndex(i => Math.min((dest.images?.length || 1)-1, i+1))} disabled={galleryIndex === (dest.images?.length || 1)-1}>Next</Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
