// ...existing code...
// ...existing code...

// ...existing code...
import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/TrailMate";

// Debug: Log the URI (first 50 chars to avoid exposing full credentials)
console.log('MongoDB URI prefix:', uri.substring(0, 50));
console.log('MongoDB URI length:', uri.length);

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect().catch((err) => {
    console.error('MongoDB connection error:', err.message);
    throw err;
  });
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
