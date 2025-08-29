const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function createAdminUser() {
  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/TrailMate")

  try {
    await client.connect()
    const db = client.db()
    const users = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await users.findOne({ role: "admin" })
    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)
    const adminUser = {
      name: "Super Admin",
      email: "admin@trailmate.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    }

    await users.insertOne(adminUser)
    console.log("Admin user created successfully")
    console.log("Email: admin@trailmate.com")
    console.log("Password: admin123")
    console.log("Please change the password after first login")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await client.close()
  }
}

createAdminUser()
