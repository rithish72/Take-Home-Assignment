import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import fs from "fs";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

async function summarizeText(text) {
	if (!text || text.trim() === "") {
		console.error("[ERROR] Input text is empty.");
		process.exit(1);
	}

	try {
		const response = await groq.chat.completions.create({
			model: "llama-3.1-8b-instant",
			messages: [
				{
					role: "user",
					content: `
Analyze the following text and return:

- One-sentence summary
- Three key points
- Sentiment (positive, neutral, negative)

Respond strictly in valid JSON format:

{
  "summary": "string",
  "key_points": ["point1", "point2", "point3"],
  "sentiment": "positive | neutral | negative"
}

Text:
${text}
          `,
				},
			],
			temperature: 0.3, 
		});

		return response.choices[0].message.content;
	} catch (err) {
		console.error("[API ERROR]", err.message);
		process.exit(1);
	}
}

function formatOutput(result) {
	console.log("\n" + "=".repeat(60));
	console.log("TEXT ANALYSIS REPORT");
	console.log("=".repeat(60) + "\n");

	console.log("→ Summary");
	console.log("  " + result.summary + "\n");

	console.log("→ Key Points");
	result.key_points.forEach((point, i) => {
		console.log(`  ${i + 1}. ${point}`);
	});

	console.log("\n→ Sentiment");
	console.log("  " + result.sentiment.toUpperCase());

	console.log("\n" + "=".repeat(60) + "\n");
}

async function main() {
	const args = process.argv.slice(2);

	if (!process.env.GROQ_API_KEY) {
		console.error("[ERROR] GROQ_API_KEY environment variable is not set.");
		process.exit(1);
	}

	let inputText;

	if (args.length > 0) {
		const filePath = args[0];
		try {
			inputText = fs.readFileSync(filePath, "utf-8");
		} catch (err) {
			console.error(`[ERROR] Cannot read file: ${filePath}`);
			console.error(err.message);
			process.exit(1);
		}
	} else {
		console.log(
			"Reading input from stdin (Ctrl+D / Ctrl+Z to finish)...\n",
		);
		inputText = fs.readFileSync(0, "utf-8");
	}

	const result = await summarizeText(inputText);

	try {
		const parsed = JSON.parse(result);
		formatOutput(parsed);
	} catch (err) {
		console.error("[ERROR] Failed to parse LLM response as JSON.");
		console.log("\nRaw Output:\n", result);
		process.exit(1);
	}
}

main();
