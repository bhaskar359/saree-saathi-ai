import { MongoClient } from "mongodb";
import { readFile } from "node:fs/promises";
import "dotenv/config";

const uri = process.env.MONGODB_URI;

if (!uri) {
	throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri);

try {
	console.log("Connecting to MongoDB...");

	await client.connect();

	console.log("✅ Connected!");

	const database = client.db("saree_saathi");
	const collection = database.collection("sarees");

	const file = await readFile("./data/sarees-with-embeddings.json", "utf-8");

	const sarees = JSON.parse(file);

	console.log(`Found ${sarees.length} sarees to import.`);

	await collection.deleteMany({});

	const result = await collection.insertMany(sarees);

	console.log(`✅ Successfully inserted ${result.insertedCount} sarees.`);

	const count = await collection.countDocuments();

	console.log(`📦 Total sarees in MongoDB: ${count}`);
} catch (error) {
	console.error("❌ Import failed:");
	console.error(error);
} finally {
	await client.close();
	console.log("MongoDB connection closed.");
}
