const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Read .env file manually
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const envLines = envContent.split("\n");
envLines.forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

async function createTestUser() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB\n");

    const db = client.db();

    // Check if test user already exists
    const existingUser = await db
      .collection("users")
      .findOne({ email: "user@test.com" });

    if (existingUser) {
      console.log("✅ Test user already exists");
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   Password: user123`);
      return;
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("user123", 10);

    const testUser = {
      _id: new ObjectId(),
      name: "Test User",
      email: "user@test.com",
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").insertOne(testUser);

    console.log("✅ Created test user successfully!");
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: user123`);
    console.log(`   Role: ${testUser.role}`);
    console.log(`   ID: ${testUser._id}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

createTestUser();
