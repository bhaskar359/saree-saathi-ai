import { aiSearch } from "../ai-search.js";

export async function searchController(req, res) {
	try {
		const { query } = req.body;

		const result = await aiSearch(query);

		return res.status(200).json(result);
	} catch (error) {
		console.error("Search error:", error);

		return res.status(500).json({
			error: "Failed to process saree search.",
		});
	}
}
