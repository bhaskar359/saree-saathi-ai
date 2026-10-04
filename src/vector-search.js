import { MongoClient } from "mongodb";
import { pipeline } from "@huggingface/transformers";
import "dotenv/config";

const MODEL = "Xenova/all-MiniLM-L6-v2";
const INDEX_NAME = "saree_vector_index";

const uri = process.env.MONGODB_URI;

if (!uri) {
	throw new Error("MONGODB_URI is not defined in .env");
}

const query = process.argv.slice(2).join(" ");

if (!query) {
	console.log(
		'Usage: npm run vector:search -- "traditional saree for wedding"',
	);
	process.exit(1);
}

console.log("Loading embedding model...");

const extractor = await pipeline("feature-extraction", MODEL);

console.log("Model loaded successfully!\n");

console.log(`Search query: "${query}"`);

const output = await extractor(query, {
	pooling: "mean",
	normalize: true,
});

const queryEmbedding = Array.from(output.data);

const client = new MongoClient(uri);

try {
	console.log("Connecting to MongoDB...");

	await client.connect();

	console.log("✅ Connected!\n");

	const database = client.db("saree_saathi");
	const collection = database.collection("sarees");

	const results = await collection
		.aggregate([
			{
				$vectorSearch: {
					index: INDEX_NAME,
					path: "embedding",
					queryVector: queryEmbedding,

					filter: {
						price: {
							$lte: 7000,
						},
						available: true,
					},

					numCandidates: 50,
					limit: 5,
				},
			},
			{
				$project: {
					_id: 0,
					id: 1,
					name: 1,
					origin: 1,
					fabric: 1,
					color: 1,
					price: 1,
					occasion: 1,
					available: 1,
					similarity: {
						$meta: "vectorSearchScore",
					},
				},
			},
		])
		.toArray();

	console.log("Top matches:\n");

	results.forEach((saree, index) => {
		console.log(`${index + 1}. ${saree.name}`);
		console.log(`   ID: ${saree.id}`);
		console.log(`   Origin: ${saree.origin}`);
		console.log(`   Fabric: ${saree.fabric}`);
		console.log(`   Color: ${saree.color}`);
		console.log(`   Price: ₹${saree.price}`);
		console.log(`   Similarity: ${saree.similarity.toFixed(4)}`);
		console.log();
	});
} catch (error) {
	console.error("❌ Vector search failed:");
	console.error(error);
} finally {
	await client.close();
	console.log("MongoDB connection closed.");
}
