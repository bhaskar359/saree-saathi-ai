import { aiSearch } from "../ai-search.js";

export async function searchController(req, res, next) {
	try {
		const { query } = req.body;
		const result = await aiSearch(query);

		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
}
