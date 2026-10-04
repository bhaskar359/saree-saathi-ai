import { searchSarees } from "./services/saree-search.js";

const results = await searchSarees({
	query: "traditional wedding saree",
	maxPrice: 7000,
	available: true,
	limit: 5,
});

console.log("\nTop matches:\n");

results.forEach((saree, index) => {
	console.log(`${index + 1}. ${saree.name}`);
	console.log(`   ID: ${saree.id}`);
	console.log(`   Origin: ${saree.origin}`);
	console.log(`   Fabric: ${saree.fabric}`);
	console.log(`   Price: ₹${saree.price}`);
	console.log(`   Score: ${saree.score.toFixed(4)}`);
	console.log();
});
