
import clientPromise from "@/lib/mongodb";
import { hashPassword } from "@/lib/bcrypt";
import { userSchema } from "@/lib/joiSchemas";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error, value } = userSchema.validate(body);
    if (error) return new Response(JSON.stringify({ error: error.details[0].message }), { status: 400 });

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection<User>("users");

    const existing = await users.findOne({ email: value.email });
    if (existing) return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 });

    const hashed = await hashPassword(value.password);
    const user: User = { ...value, password: hashed };
    const result = await users.insertOne(user);
    // Return JWT token and user info for immediate login
    const { signJwt } = require("@/lib/jwt");
    const token = signJwt({ userId: result.insertedId, role: user.role });
    return new Response(JSON.stringify({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
      message: "User registered successfully"
    }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
