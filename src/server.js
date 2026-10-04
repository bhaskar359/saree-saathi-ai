import express from "express";
import searchRouter from "./routes/search.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
	res.json({
		status: "ok",
		service: "saree-saathi-ai",
	});
});

// API routes
app.use("/api", searchRouter);

app.use((req, res) => {
	res.status(404).json({
		error: "Route not found",
	});
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Saree Saathi API running on http://localhost:${PORT}`);
});
