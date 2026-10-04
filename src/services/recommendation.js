import ollama from "ollama";

export async function generateRecommendation(userQuery, sarees) {
	const sareeContext = sarees
		.map(
			(saree, index) => `
Saree ${index + 1}:
ID: ${saree.id}
Name: ${saree.name}
Origin: ${saree.origin}
State: ${saree.state}
Fabric: ${saree.fabric}
Color: ${saree.color}
Price: ₹${saree.price}
Occasions: ${saree.occasion.join(", ")}
Style: ${saree.style}
Description: ${saree.description}
Available: ${saree.available}
`,
		)
		.join("\n");

	const response = await ollama.chat({
		model: "gemma3:4b",

		messages: [
			{
				role: "system",
				content: `
You are Saree Saathi, a helpful saree shopping assistant.

Answer the user's request using ONLY the saree information provided in the context.

IMPORTANT RULES:

1. Never invent product information.
2. Never invent prices, fabrics, colors, origins, availability, or features.
3. Do not recommend a saree that is not present in the provided context.
4. If the context does not contain a suitable saree, clearly say that no suitable match was found.
5. Keep recommendations concise and useful.
6. Explain why the recommended saree matches the user's request.
7. Mention the price when recommending a saree.
8. Do not claim customer reviews, popularity, quality, or handloom status unless explicitly provided.
9. Do not make unsupported comparisons.
10. Do not expose internal implementation details such as embeddings, vector search, MongoDB, or model names.
`,
			},
			{
				role: "user",
				content: `
      USER REQUEST:
      ${userQuery}
      
      ==============================
      CATALOG DATA — TRUSTED SOURCE
      ==============================
      
      ${sareeContext}
      
      ==============================
      END CATALOG DATA
      ==============================
      
      Using ONLY the catalog data above, recommend the most suitable saree.
      Do not invent any information.
      `,
			},
		],
	});

	return response.message.content;
}
