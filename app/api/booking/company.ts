import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { verifyJwt } from "@/lib/jwt";
import { Booking } from "@/models/Booking";
import { Destination } from "@/models/Destination";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = verifyJwt(token || "");
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const client = await clientPromise;
  const db = client.db();
  const destinations = db.collection<Destination>("destinations");
  const bookings = db.collection<Booking>("bookings");

  // Find destinations posted by this company
  const myDestinations = await destinations.find({ postedBy: user.userId }).toArray();
  const myDestinationIds = myDestinations.map(d => d._id);

  // Find bookings for these destinations
  const myBookings = await bookings.find({ destinationId: { $in: myDestinationIds } }).toArray();

  // Attach destination name to each booking
  const bookingsWithNames = myBookings.map(b => {
    const dest = myDestinations.find(d => d._id.equals(b.destinationId));
    return { ...b, destinationName: dest ? dest.name : "Unknown" };
  });

  res.status(200).json({ bookings: bookingsWithNames });
}
