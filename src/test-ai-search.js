import { aiSearch } from "./ai-search.js";

const result = await aiSearch(
	"I need a traditional silk saree for a wedding under ₹7000",
);

console.log("\nTop matching sarees:\n");

result.results.forEach((saree, index) => {
	console.log(`${index + 1}. ${saree.name}`);
	console.log(`   ID: ${saree.id}`);
	console.log(`   Origin: ${saree.origin}`);
	console.log(`   Fabric: ${saree.fabric}`);
	console.log(`   Color: ${saree.color}`);
	console.log(`   Price: ₹${saree.price}`);
	console.log(`   Score: ${saree.score.toFixed(4)}`);
	console.log();
});

// Print recommendation ONCE
console.log("================================");
console.log("AI RECOMMENDATION");
console.log("================================\n");

console.log(result.recommendation);
