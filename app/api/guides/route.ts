import clientPromise from "@/lib/mongodb";
import { guideSchema } from "@/lib/joiSchemas";
import { verifyJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = await verifyJwt(token || "");
  if (!user || !user.userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  const { error, value } = guideSchema.validate(body);
  if (error) {
    return new Response(JSON.stringify({ error: error.details[0].message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = await clientPromise;
  const db = client.db();
  const guides = db.collection("guides");

  const guide = {
    userId: user.userId,
    ...value,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await guides.insertOne(guide);

  return new Response(JSON.stringify({ guide: { ...guide, _id: result.insertedId } }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
