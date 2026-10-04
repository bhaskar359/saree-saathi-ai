export function validateSearchRequest(req, res, next) {
	const { query } = req.body ?? {};

	if (query === undefined) {
		return res.status(400).json({
			error: "Missing required field: query",
		});
	}

	if (typeof query !== "string") {
		return res.status(400).json({
			error: "Field 'query' must be a string",
		});
	}

	const trimmedQuery = query.trim();

	if (!trimmedQuery) {
		return res.status(400).json({
			error: "Query cannot be empty",
		});
	}

	if (trimmedQuery.length > 500) {
		return res.status(400).json({
			error: "Query must not exceed 500 characters",
		});
	}

	req.body.query = trimmedQuery;

	next();
}
