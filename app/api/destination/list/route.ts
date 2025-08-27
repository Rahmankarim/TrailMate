import clientPromise from "@/lib/mongodb";
import { Destination } from "@/models/Destination";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const destinations = db.collection<Destination>("destinations");
  const all = await destinations.find({}).toArray();
  return new Response(JSON.stringify({ destinations: all }), { status: 200 });
}
