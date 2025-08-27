import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { bookingSchema } from "@/lib/joiSchemas";
import { Booking } from "@/models/Booking";
import { verifyJwt } from "@/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = verifyJwt(token || "");
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { error, value } = bookingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await clientPromise;
  const db = client.db();
  const bookings = db.collection<Booking>("bookings");

  const booking: Booking = {
    ...value,
    userId: user.userId,
  };
  const result = await bookings.insertOne(booking);
  res.status(201).json({ booking: { ...booking, _id: result.insertedId } });
}
