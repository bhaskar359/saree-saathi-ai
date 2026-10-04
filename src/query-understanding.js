import ollama from "ollama";

const QUERY_SCHEMA = {
	type: "object",
	properties: {
		semanticQuery: {
			type: "string",
		},
		maxPrice: {
			type: ["number", "null"],
		},
	},
	required: ["semanticQuery", "maxPrice"],
};

export async function understandQuery(userQuery) {
	const response = await ollama.chat({
		model: "gemma3:1b",

		messages: [
			{
				role: "system",
				content: `You are the query-understanding component of Saree Saathi AI.

        Your job is to convert a user's saree request into two fields:
        
        1. semanticQuery
        2. maxPrice
        
        IMPORTANT RULES:
        
        1. NEVER invent information.
        2. NEVER infer fabric, occasion, state, color, style, or any other attribute.
        3. Preserve the user's original meaning.
        4. semanticQuery must contain the important descriptive meaning of the user's request.
        5. Do not unnecessarily shorten or rewrite semanticQuery.
        6. Do not translate semanticQuery.
        7. maxPrice must only be extracted when the user explicitly provides a maximum budget.
        8. If the user does not provide a maximum budget, maxPrice must be null.
        9. Do not guess a price.
        10. Do not generate MongoDB queries.
        11. Return ONLY the requested JSON structure.
        
        Examples:
        
        User:
        "I need a traditional silk saree for a wedding under ₹7000"
        
        Output:
        {
          "semanticQuery": "traditional silk saree for a wedding",
          "maxPrice": 7000
        }
        
        User:
        "Show me a lightweight saree for office under 3000"
        
        Output:
        {
          "semanticQuery": "lightweight saree for office",
          "maxPrice": 3000
        }
        
        User:
        "I want a beautiful saree from Andhra Pradesh for a wedding"
        
        Output:
        {
          "semanticQuery": "beautiful saree from Andhra Pradesh for a wedding",
          "maxPrice": null
        }
        
        User:
        "I need something elegant for a party"
        
        Output:
        {
          "semanticQuery": "elegant saree for a party",
          "maxPrice": null
        }
        
        User:
        "Show me a saree"
        
        Output:
        {
          "semanticQuery": "saree",
          "maxPrice": null
        }
        
        Always return valid JSON matching the required schema.`,
			},
			{
				role: "user",
				content: userQuery,
			},
		],

		format: QUERY_SCHEMA,
	});

	return JSON.parse(response.message.content);
}
