import React from "react";
import { notFound } from "next/navigation";
import Gallery from "@/components/ui/gallery";
import BookingForm from "@/components/ui/booking-form";
import Reviews from "@/components/ui/reviews";
import MapSection from "@/components/ui/map-section";
import { getDestinationById, placeholderImages } from "@/lib/utils";

export default async function DestinationDetails({ params }: { params: { id: string } }) {
  const destination = await getDestinationById(params.id);
  if (!destination) return notFound();

  // Fallback images for gallery
  const galleryImages = destination.images?.length > 0 ? destination.images : placeholderImages;

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
        <img
          src={galleryImages[0]}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        />
        <div className="relative z-10 bg-white/70 rounded-xl p-8 shadow-xl max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2 text-green-900 drop-shadow-lg">{destination.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{destination.location}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {destination.tags?.map((tag: string) => (
              <span key={tag} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-5xl mx-auto py-10 px-4 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-800">About {destination.name}</h2>
          <p className="text-gray-800 mb-6 leading-relaxed">{destination.description}</p>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-green-700">Activities</h3>
            <ul className="list-disc list-inside text-gray-700">
              {destination.activities?.map((activity: string) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-green-700">Best Time to Visit</h3>
            <p className="text-gray-700">{destination.bestTimeToVisit}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-green-700">Guide</h3>
            <p className="text-gray-700">{destination.guide?.name || "Local Expert"}</p>
          </div>
        </div>
        {/* Gallery Section */}
        <div>
          <Gallery images={galleryImages} />
        </div>
      </section>

      {/* Booking Section */}
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-green-800">Book Your Adventure</h2>
        <BookingForm destinationId={destination._id} />
      </section>

      {/* Reviews Section */}
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-green-800">Traveler Reviews</h2>
        <Reviews destinationId={destination._id} />
      </section>

      {/* Map Section */}
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-green-800">Location Map</h2>
        <MapSection location={destination.location} />
      </section>
    </main>
  );
}
