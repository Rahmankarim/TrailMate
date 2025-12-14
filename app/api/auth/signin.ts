import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { comparePassword } from "@/lib/bcrypt";
import { signJwt } from "@/lib/jwt";
import { User } from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection<User>("users");

  const user = await users.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid email or password" });

  const token = await signJwt({ userId: user._id, role: user.role });
  res.status(200).json({ token, user: { name: user.name, email: user.email, role: user.role, companyName: user.companyName } });
}
