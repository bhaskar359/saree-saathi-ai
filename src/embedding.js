import { pipeline } from "@huggingface/transformers";
import { cosineSimilarity } from "./similarity.js";

const MODEL = "Xenova/all-MiniLM-L6-v2";

console.log("Loading embedding model...");

const extractor = await pipeline("feature-extraction", MODEL);

console.log("Model loaded successfully!\n");

const texts = [
	"Traditional silk saree suitable for a wedding",
	"Elegant silk saree for a marriage ceremony",
	"JavaScript programming tutorial",
];

const embeddings = [];

for (const text of texts) {
	const output = await extractor(text, {
		pooling: "mean",
		normalize: true,
	});

	embeddings.push(output.data);

	console.log(`Generated embedding for: "${text}"`);
}

const similarityAB = cosineSimilarity(embeddings[0], embeddings[1]);

const similarityAC = cosineSimilarity(embeddings[0], embeddings[2]);

console.log("\nSimilarity Results:");

console.log("A ↔ B:", similarityAB);

console.log("A ↔ C:", similarityAC);
