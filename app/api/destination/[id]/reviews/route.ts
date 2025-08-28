import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Simple Joi schema for review validation
import Joi from "joi";
const reviewSchema = Joi.object({
  userName: Joi.string().min(2).max(50).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(2).max(1000).required(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const destinationId = params.id;
  const body = await req.json();
  const { error, value } = reviewSchema.validate(body);
  if (error) return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const destinations = db.collection("destinations");

  const review = {
    ...value,
    createdAt: new Date(),
  };

  // Push review to destination's reviews array
  const result = await destinations.updateOne(
    { _id: new ObjectId(destinationId) },
    { $push: { reviews: review } }
  );

  if (result.modifiedCount === 1) {
    return new Response(JSON.stringify({ review }), { status: 201 });
  } else {
    return new Response(JSON.stringify({ error: "Destination not found" }), { status: 404 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const destinationId = params.id;
  const client = await clientPromise;
  const db = client.db();
  const destinations = db.collection("destinations");
  const dest = await destinations.findOne({ _id: new ObjectId(destinationId) });
  return new Response(JSON.stringify({ reviews: dest?.reviews || [] }), { status: 200 });
}
