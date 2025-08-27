import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { signJwt } from "@/lib/jwt";
import { User } from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email, googleId } = req.body;
  if (!email || !googleId) return res.status(400).json({ error: "Missing Google credentials" });

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection<User>("users");

  let user = await users.findOne({ email });
  if (!user) {
    const newUser: Omit<User, "_id"> = {
      name,
      email,
      password: "",
      role: "guide",
      googleId,
      companyName: "",
    };
    const result = await users.insertOne(newUser);
    user = { ...newUser, _id: result.insertedId };
  }

  if (!user || !user._id) {
    return res.status(500).json({ error: "User creation failed" });
  }
  const token = signJwt({ userId: user._id, role: user.role });
  res.status(200).json({ token, user: { name: user.name, email: user.email, role: user.role, companyName: user.companyName } });
}
