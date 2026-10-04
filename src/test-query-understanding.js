import { understandQuery } from "./query-understanding.js";

const queries = [
	"I need a traditional silk saree for a wedding under ₹7000",

	"Show me a lightweight saree for office under 3000",

	"I want a beautiful saree from Andhra Pradesh for a wedding",

	"I need something elegant for a party",
];

for (const query of queries) {
	console.log("\n================================");
	console.log("USER:", query);
	console.log("================================");

	const result = await understandQuery(query);

	console.log(JSON.stringify(result, null, 2));
}
