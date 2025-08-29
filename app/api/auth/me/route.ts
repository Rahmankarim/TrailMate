export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import clientPromise from "@/lib/mongodb";
import type { User } from "@/models/User";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }
  const payload = await verifyJwt(token);
  if (!payload || typeof payload !== "object" || !('userId' in payload)) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection<User>("users");
    const user = await users.findOne({ _id: (payload as any).userId });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(
      JSON.stringify({
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
        },
      }),
      { status: 200 }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
