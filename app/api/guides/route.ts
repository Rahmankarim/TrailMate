import clientPromise from "@/lib/mongodb";
import { guideSchema } from "@/lib/joiSchemas";
import { verifyJwt } from "@/lib/jwt";
import { ObjectId } from "mongodb";

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

  // Convert userId to ObjectId for proper storage
  const postedById = typeof user.userId === 'string' ? new ObjectId(user.userId) : user.userId;

  const guide = {
    postedBy: postedById,
    name: value.name,
    bio: value.bio,
    profileImage: value.profileImage || "/placeholder-user.jpg",
    experience: value.experience,
    specialties: value.specialties || [],
    languages: value.languages,
    location: value.location,
    dailyRate: value.dailyRate,
    totalHikes: 0,
    totalClients: 0,
    rating: 0,
    reviewCount: 0,
    isActive: true,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await guides.insertOne(guide);

  return new Response(
    JSON.stringify({ guide: { ...guide, _id: result.insertedId } }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}
