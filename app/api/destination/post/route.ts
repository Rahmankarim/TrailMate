import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { destinationSchema } from "@/lib/joiSchemas";
import { Destination } from "@/models/Destination";
import { verifyJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = verifyJwt(token || "");
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await req.json();
  const { error, value } = destinationSchema.validate(body);
  if (error) return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const destinations = db.collection<Destination>("destinations");

  const destination: Destination = {
    ...value,
    postedBy: user.userId,
  };
  const result = await destinations.insertOne(destination);
  return new Response(JSON.stringify({ destination: { ...destination, _id: result.insertedId } }), { status: 201 });
}
