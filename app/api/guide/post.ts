import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { guideSchema } from "@/lib/joiSchemas";
import { Guide } from "@/models/Guide";
import { verifyJwt } from "@/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = verifyJwt(token || "");
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { error, value } = guideSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const client = await clientPromise;
  const db = client.db();
  const guides = db.collection<Guide>("guides");

  const guide: Guide = {
    userId: user.userId,
    places: value.places,
    availableDates: value.availableDates,
  };
  const result = await guides.insertOne(guide);
  res.status(201).json({ guide: { ...guide, _id: result.insertedId } });
}
