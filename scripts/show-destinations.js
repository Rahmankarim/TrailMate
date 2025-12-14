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

async function showDestinations() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    const destinations = await db.collection('destinations').find({}).toArray();
    
    console.log('=== DESTINATIONS IN DATABASE ===\n');
    destinations.forEach(dest => {
      console.log(`Name: ${dest.name}`);
      console.log(`Description: ${dest.description || 'N/A'}`);
      console.log(`Location: ${dest.location || 'N/A'}`);
      console.log(`Price: ${dest.price || 'N/A'}`);
      console.log(`Image: ${dest.image || 'N/A'}`);
      console.log(`Posted By: ${dest.postedBy}`);
      console.log('---\n');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

showDestinations();
