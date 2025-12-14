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

async function fixDatabase() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB\n");

    const db = client.db();

    // Step 1: Check if an admin user exists
    let adminUser = await db.collection("users").findOne({ role: "admin" });

    if (!adminUser) {
      console.log("No admin user found. Creating super admin...");
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      adminUser = {
        _id: new ObjectId(),
        name: "Super Administrator",
        email: "admin@trailmate.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("users").insertOne(adminUser);
      console.log(`✅ Created admin user: ${adminUser.email}`);
      console.log(`   Password: admin123`);
      console.log(`   ID: ${adminUser._id}\n`);
    } else {
      console.log(`✅ Admin user exists: ${adminUser.email}`);
      console.log(`   ID: ${adminUser._id}\n`);
    }

    // Step 2: Update all destinations that have null or missing postedBy
    console.log("Updating destinations...");
    const destResult = await db.collection("destinations").updateMany(
      {
        $or: [{ postedBy: null }, { postedBy: { $exists: false } }],
      },
      {
        $set: {
          postedBy: adminUser._id,
          updatedAt: new Date(),
        },
      }
    );
    console.log(
      `✅ Updated ${destResult.modifiedCount} destinations to admin-owned\n`
    );

    // Step 3: Update all guides that have null, undefined or missing postedBy
    console.log("Updating guides...");
    const guideResult = await db.collection("guides").updateMany(
      {
        $or: [
          { postedBy: null },
          { postedBy: undefined },
          { postedBy: { $exists: false } },
        ],
      },
      {
        $set: {
          postedBy: adminUser._id,
          updatedAt: new Date(),
        },
      }
    );
    console.log(
      `✅ Updated ${guideResult.modifiedCount} guides to admin-owned\n`
    );

    // Step 4: Verify the fixes
    console.log("=== VERIFICATION ===");
    const destinations = await db.collection("destinations").find({}).toArray();
    const guides = await db.collection("guides").find({}).toArray();

    const adminDests = destinations.filter(
      (d) => d.postedBy?.toString() === adminUser._id.toString()
    );
    const adminGuides = guides.filter(
      (g) => g.postedBy?.toString() === adminUser._id.toString()
    );

    console.log(`Total Destinations: ${destinations.length}`);
    console.log(`Admin-owned Destinations: ${adminDests.length}`);
    console.log(`Total Guides: ${guides.length}`);
    console.log(`Admin-owned Guides: ${adminGuides.length}`);

    console.log("\n✅ Database fixed successfully!");
    console.log("\n📝 NEXT STEPS:");
    console.log("1. Login as Admin:");
    console.log(`   Email: ${adminUser.email}`);
    console.log("   Password: admin123");
    console.log("2. You should see ALL destinations and guides");
    console.log(
      "3. Login as regular user - they should see ONLY admin-created items"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

fixDatabase();
