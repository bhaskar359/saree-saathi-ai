import { pipeline } from "@huggingface/transformers";
import { readFile } from "node:fs/promises";
import { cosineSimilarity } from "./similarity.js";

const MODEL = "Xenova/all-MiniLM-L6-v2";

console.log("Loading embedding model...");

const extractor = await pipeline("feature-extraction", MODEL);

console.log("Model loaded successfully!\n");

const file = await readFile("./data/sarees-with-embeddings.json", "utf-8");

const sarees = JSON.parse(file);

const query = process.argv.slice(2).join(" ");

if (!query) {
	console.log('Usage: npm run search -- "traditional saree for wedding"');
	process.exit(1);
}

console.log(`Search query: "${query}"\n`);

const queryOutput = await extractor(query, {
	pooling: "mean",
	normalize: true,
});

const queryEmbedding = queryOutput.data;

const results = sarees.map((saree) => {
	const similarity = cosineSimilarity(queryEmbedding, saree.embedding);

	return {
		...saree,
		similarity,
	};
});

results.sort((a, b) => b.similarity - a.similarity);

console.log("Top matches:\n");

results.slice(0, 5).forEach((saree, index) => {
	console.log(`${index + 1}. ${saree.name}`);
	console.log(`   Origin: ${saree.origin}`);
	console.log(`   Fabric: ${saree.fabric}`);
	console.log(`   Color: ${saree.color}`);
	console.log(`   Price: ₹${saree.price}`);
	console.log(`   Similarity: ${saree.similarity.toFixed(4)}`);
	console.log();
});
