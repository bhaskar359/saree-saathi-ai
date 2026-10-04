export function errorHandler(err, req, res, next) {
	console.error("Unhandled error:", err);

	const statusCode = err.statusCode || 500;
	const code = err.code || "INTERNAL_ERROR";

	return res.status(statusCode).json({
		error: err.isOperational ? err.message : "Internal server error",
		code,
	});
}
