import ollama from "ollama";

const response = await ollama.chat({
	model: "gemma3:1b",
	messages: [
		{
			role: "user",
			content: "I need a traditional silk saree for a wedding under ₹7000.",
		},
	],
});

console.log(response.message.content);
