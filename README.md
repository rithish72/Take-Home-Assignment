# Text Summarization Tool

A lightweight command-line tool that accepts unstructured text and produces structured summaries using the Groq API.

## What it does

- **Input**: Text file or stdin
- **Output**: Structured JSON with:
    - One-sentence summary
    - Three key points
    - Sentiment label (positive/neutral/negative)
- **Display**: Clean, formatted terminal output with emoji indicators

## Quick Start

### Prerequisites

- Node.js 16+
- Groq API key (get one free at [console.groq.com](https://console.groq.com))

### Setup

```bash
# Install dependencies
npm install

# Create .env file with your API key
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### Usage

**From a file:**

```bash
npm start test.txt
```

**From stdin (paste or pipe text):**

```bash
npm start
# Then paste your text and press Ctrl+D (Mac/Linux) or Ctrl+Z then Enter (Windows)
```

## Implementation Details

### LLM API: Groq

**Why Groq?**

- Free tier generous enough for testing
- Fast inference (important for CLI responsiveness)
- Easy-to-use SDK and clear API documentation
- Model: `llama-3.1-8b-instant` (fast, capable for this task)

### Prompt Design

The prompt instructs the model to:

1. Return **strictly formatted JSON** (eliminates parsing ambiguity)
2. Provide specific outputs (summary, key points, sentiment) in a defined schema
3. Be concise (key points are pulled directly from the text context)

**Trade-off:** The strict JSON requirement helps with reliability but means the model is less free-form. A JSON schema validation step is intentionally inline in the model itself rather than a separate parser.

### Example Output

```
==================================================
📋 SUMMARY ANALYSIS
==================================================

📝 Summary:
Artificial Intelligence is transforming industries by automating processes and improving efficiency.

🔑 Key Points:
  1. Artificial Intelligence is transforming industries globally.
  2. AI automates processes to improve efficiency.
  3. Companies are adopting AI to enhance decision-making and reduce manual work.

💭 Sentiment: POSITIVE
==================================================
```

## Error Handling

- **Missing API key**: Exits with clear error message
- **Empty input**: Rejected before API call
- **API errors**: Caught and reported with Groq error details
- **Invalid JSON response**: Logs raw response for debugging

## Code Structure

- **`summarizeText(text)`**: Calls Groq API with structured prompt
- **`formatOutput(result)`**: Pretty-prints JSON result with formatting
- **`main()`**: Handles file I/O and CLI argument parsing

**Total lines of code: ~80**

## What I'd Do Differently With More Time

1. **Batch processing** – Support multiple files in one run
2. **Confidence scoring** – Return a reliability metric (e.g., "High confidence" vs "Low confidence") by inspecting token probabilities or re-running on uncertain outputs
3. **Config file** – Allow users to customize the output schema via a `config.json` file
4. **Web UI** – Simple Express.js server with a form to paste text and display results
5. **Caching** – Store results locally to avoid re-summarizing identical inputs
6. **Model selection** – CLI flag to choose between models for different speed/quality trade-offs
7. **Better parsing** – Regex fallback in case JSON fails to parse (currently strict)

## Known Trade-Offs & Shortcuts

- **Single model**: Hard-coded to one model. Easy to parameterize if needed.
- **No retries**: If API fails, tool exits immediately. A retry loop (3x with exponential backoff) would be production-ready.
- **Stdin on Windows**: Requires Ctrl+Z, which is less intuitive than Unix Ctrl+D.
- **No streaming output**: For long inputs, the API call blocks until complete.
- **Prompt is English-only**: Assumes input is English; multilingual support would need prompt tweaking.

## Dependencies

- `groq-sdk` – LLM API client
- `dotenv` – Environment variable management
- `fs`, `path` – Node.js built-ins for file I/O

## License

ISC
