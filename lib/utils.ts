import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fallback images for gallery
export const placeholderImages = [
  "/images/attabad-lake.jpg",
  "/images/autumn-hunza.jpg",
  "/images/gilgit-river.jpg",
  "/images/hunza-boat.jpg",
  "/images/hunza-bridge.jpg",
  "/images/k2-basecamp.jpg",
  "/images/karakoram-peaks.jpg",
  "/images/skardu-lake.jpg",
  "/images/skardu-valley.jpg",
  "/images/snow-peaks.jpg",
];

// Fetch destination by id from API
export async function getDestinationById(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/destination/list?id=${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.destinations) ? data.destinations[0] : data.destination || null;
  } catch {
    return null;
  }
}

// Create a shared slugify so list and detail pages match
export function slugify(name?: string) {
  if (!name) return ""
  return name.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}
