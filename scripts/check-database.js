const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
envLines.forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

async function checkDatabase() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db();
    
    // Check users
    console.log('=== USERS ===');
    const users = await db.collection('users').find({}).toArray();
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
      console.log(`  ID: ${user._id}`);
      console.log(`  Role: ${user.role}\n`);
    });
    
    // Check destinations
    console.log('\n=== DESTINATIONS ===');
    const destinations = await db.collection('destinations').find({}).toArray();
    console.log(`Total destinations: ${destinations.length}`);
    destinations.forEach(dest => {
      console.log(`\n- ${dest.name}`);
      console.log(`  ID: ${dest._id}`);
      console.log(`  Posted By: ${dest.postedBy}`);
      console.log(`  Posted By Type: ${typeof dest.postedBy}`);
      
      // Find who posted it
      const poster = users.find(u => 
        u._id.toString() === dest.postedBy?.toString() ||
        u._id.equals(dest.postedBy)
      );
      if (poster) {
        console.log(`  Posted By User: ${poster.name} (${poster.role})`);
      } else {
        console.log(`  Posted By User: NOT FOUND`);
      }
    });
    
    // Check guides
    console.log('\n\n=== GUIDES ===');
    const guides = await db.collection('guides').find({}).toArray();
    console.log(`Total guides: ${guides.length}`);
    guides.forEach(guide => {
      console.log(`\n- ${guide.name}`);
      console.log(`  ID: ${guide._id}`);
      console.log(`  Posted By: ${guide.postedBy}`);
      console.log(`  Posted By Type: ${typeof guide.postedBy}`);
      
      // Find who posted it
      const poster = users.find(u => 
        u._id.toString() === guide.postedBy?.toString() ||
        u._id.equals(guide.postedBy)
      );
      if (poster) {
        console.log(`  Posted By User: ${poster.name} (${poster.role})`);
      } else {
        console.log(`  Posted By User: NOT FOUND`);
      }
    });
    
    console.log('\n\n=== SUMMARY ===');
    const adminUsers = users.filter(u => u.role === 'admin');
    const companyUsers = users.filter(u => u.role === 'company');
    const regularUsers = users.filter(u => u.role === 'user');
    
    console.log(`Admins: ${adminUsers.length}`);
    console.log(`Companies: ${companyUsers.length}`);
    console.log(`Regular Users: ${regularUsers.length}`);
    console.log(`Total Destinations: ${destinations.length}`);
    console.log(`Total Guides: ${guides.length}`);
    
    const adminDestinations = destinations.filter(d => {
      return adminUsers.some(admin => 
        admin._id.toString() === d.postedBy?.toString() ||
        admin._id.equals(d.postedBy)
      );
    });
    
    const adminGuides = guides.filter(g => {
      return adminUsers.some(admin => 
        admin._id.toString() === g.postedBy?.toString() ||
        admin._id.equals(g.postedBy)
      );
    });
    
    console.log(`\nAdmin-created Destinations: ${adminDestinations.length}`);
    console.log(`Admin-created Guides: ${adminGuides.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkDatabase();
