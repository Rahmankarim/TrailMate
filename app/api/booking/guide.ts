import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { verifyJwt } from "@/lib/jwt";
import { Booking } from "@/models/Booking";
import { Guide } from "@/models/Guide";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = verifyJwt(token || "");
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const client = await clientPromise;
  const db = client.db();
  const guides = db.collection<Guide>("guides");
  const bookings = db.collection<Booking>("bookings");

  // Find guide info for this user
  const myGuide = await guides.findOne({ userId: user.userId });
  if (!myGuide) return res.status(200).json({ bookings: [] });

  // Find bookings for places this guide can go
  const myBookings = await bookings.find({ place: { $in: myGuide.places } }).toArray();

  // Attach place name to each booking
  const bookingsWithNames = myBookings.map(b => ({ ...b, placeName: b.name || b.details || "" }));

  res.status(200).json({ bookings: bookingsWithNames });
}
