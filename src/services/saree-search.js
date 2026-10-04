import { MongoClient } from "mongodb";
import { pipeline } from "@huggingface/transformers";
import "dotenv/config";

const MODEL = "Xenova/all-MiniLM-L6-v2";
const INDEX_NAME = "saree_vector_index";

let extractor;
let client;

async function getExtractor() {
	if (!extractor) {
		console.log("Loading embedding model...");

		extractor = await pipeline("feature-extraction", MODEL);

		console.log("Model loaded successfully!");
	}

	return extractor;
}

async function getMongoClient() {
	if (!client) {
		const uri = process.env.MONGODB_URI;

		if (!uri) {
			throw new Error("MONGODB_URI is not defined in .env");
		}

		client = new MongoClient(uri);

		await client.connect();

		console.log("MongoDB connected!");
	}

	return client;
}

export async function searchSarees({
	query,
	maxPrice,
	available = true,
	limit = 5,
}) {
	if (!query) {
		throw new Error("Search query is required");
	}

	// --------------------------------
	// 1. Convert query → embedding
	// --------------------------------

	const model = await getExtractor();

	const output = await model(query, {
		pooling: "mean",
		normalize: true,
	});

	const queryEmbedding = Array.from(output.data);

	// --------------------------------
	// 2. Build MongoDB filters
	// --------------------------------

	const filters = [];

	if (maxPrice !== undefined) {
		filters.push({
			price: {
				$lte: maxPrice,
			},
		});
	}

	if (available !== undefined) {
		filters.push({
			available,
		});
	}

	const filter =
		filters.length === 1
			? filters[0]
			: filters.length > 1
				? { $and: filters }
				: undefined;

	// --------------------------------
	// 3. Connect to MongoDB
	// --------------------------------

	const mongoClient = await getMongoClient();

	const database = mongoClient.db("saree_saathi");
	const collection = database.collection("sarees");

	// --------------------------------
	// 4. Vector Search
	// --------------------------------

	const vectorSearchStage = {
		$vectorSearch: {
			index: INDEX_NAME,
			path: "embedding",
			queryVector: queryEmbedding,
			numCandidates: 50,
			limit,
		},
	};

	if (filter) {
		vectorSearchStage.$vectorSearch.filter = filter;
	}

	// --------------------------------
	// 5. Return useful fields
	// --------------------------------

	const results = await collection
		.aggregate([
			vectorSearchStage,
			{
				$project: {
					_id: 0,
					id: 1,
					name: 1,
					origin: 1,
					state: 1,
					fabric: 1,
					color: 1,
					price: 1,
					occasion: 1,
					style: 1,
					description: 1,
					available: 1,
					score: {
						$meta: "vectorSearchScore",
					},
				},
			},
		])
		.toArray();

	return results;
}
