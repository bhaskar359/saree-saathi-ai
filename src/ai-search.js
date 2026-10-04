import { understandQuery } from "./query-understanding.js";
import { extractConstraints } from "./query-constraints.js";
import { searchSarees } from "./services/saree-search.js";
import { generateRecommendation } from "./services/recommendation.js";

export async function aiSearch(userQuery) {
	console.log("\nUser query:");
	console.log(userQuery);

	// AI-based semantic understanding
	const parsedQuery = await understandQuery(userQuery);

	console.log("\nGemma understood:");
	console.log(JSON.stringify(parsedQuery, null, 2));

	// Deterministic extraction of explicit constraints
	const constraints = extractConstraints(userQuery);

	console.log("\nHard constraints:");
	console.log(JSON.stringify(constraints, null, 2));

	// Hybrid search
	const results = await searchSarees({
		query: parsedQuery.semanticQuery,
		maxPrice: parsedQuery.maxPrice,
		fabric: constraints.fabric,
		state: constraints.state,
		available: true,
		limit: 5,
	});

	const recommendation = await generateRecommendation(userQuery, results);

	return {
		query: parsedQuery,
		constraints,
		results,
		recommendation,
	};
}
