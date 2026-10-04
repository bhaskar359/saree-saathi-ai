import { pipeline } from "@huggingface/transformers";
import { readFile, writeFile } from "node:fs/promises";

const MODEL = "Xenova/all-MiniLM-L6-v2";

console.log("Loading embedding model...");

const extractor = await pipeline("feature-extraction", MODEL);

console.log("Model loaded successfully!\n");

const file = await readFile("./data/sarees.json", "utf-8");
const sarees = JSON.parse(file);

const enrichedSarees = [];

for (const saree of sarees) {
	const text = `
    ${saree.name}.
    Origin: ${saree.origin}, ${saree.state}.
    Fabric: ${saree.fabric}.
    Color: ${saree.color}.
    Occasion: ${saree.occasion.join(", ")}.
    Style: ${saree.style}.
    ${saree.description}
  `.trim();

	const output = await extractor(text, {
		pooling: "mean",
		normalize: true,
	});

	const embedding = Array.from(output.data);

	enrichedSarees.push({
		...saree,
		embedding,
	});

	console.log(`✓ ${saree.id} - ${saree.name} (${embedding.length} dimensions)`);
}

await writeFile(
	"./data/sarees-with-embeddings.json",
	JSON.stringify(enrichedSarees, null, 2),
);

console.log("\nDone!");
console.log(`Generated embeddings for ${enrichedSarees.length} sarees.`);
