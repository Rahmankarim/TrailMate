import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { destinationSchema } from "@/lib/joiSchemas";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const destinationId = params.id;
  const body = await req.json();
  const { error, value } = destinationSchema.validate(body);
  if (error) return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const destinations = db.collection("destinations");
  const result = await destinations.updateOne(
    { _id: new ObjectId(destinationId) },
    { $set: value }
  );
  if (result.modifiedCount === 1) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "Destination not found" }), { status: 404 });
  }
}
