import { understandQuery } from "./query-understanding.js";
import { searchSarees } from "./services/saree-search.js";

export async function aiSearch(userQuery) {
	console.log("\nUser query:");
	console.log(userQuery);

	// 1. Understand the user's request using Gemma
	const parsedQuery = await understandQuery(userQuery);

	console.log("\nGemma understood:");
	console.log(JSON.stringify(parsedQuery, null, 2));

	// 2. Search the saree catalog using semantic search + exact filters
	const results = await searchSarees({
		query: parsedQuery.semanticQuery,
		maxPrice: parsedQuery.maxPrice,
		available: true,
		limit: 5,
	});

	return {
		query: parsedQuery,
		results,
	};
}
