import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;

if (!uri) {
	throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri);

try {
	console.log("Connecting to MongoDB...");

	await client.connect();

	await client.db("admin").command({ ping: 1 });

	console.log("✅ MongoDB connected successfully!");
} catch (error) {
	console.error("❌ MongoDB connection failed:");
	console.error(error.message);
} finally {
	await client.close();
}
