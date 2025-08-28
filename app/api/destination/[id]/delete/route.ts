import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const destinationId = params.id;
  const client = await clientPromise;
  const db = client.db();
  const destinations = db.collection("destinations");
  const result = await destinations.deleteOne({ _id: new ObjectId(destinationId) });
  if (result.deletedCount === 1) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "Destination not found" }), { status: 404 });
  }
}
