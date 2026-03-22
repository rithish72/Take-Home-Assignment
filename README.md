# AI Text Summarizer CLI

A lightweight command-line tool that converts unstructured text into a structured summary using an LLM (Groq API).

---

## Overview

This tool accepts raw text (via file or stdin) and generates a structured output containing:

* One-sentence summary
* Three key points
* Sentiment classification (positive / neutral / negative)

The result is displayed in a clean, readable terminal format.

---

## Features

* Supports input from file or stdin
* Structured JSON output from LLM
* Clean CLI formatting for readability
* Minimal and fast (~80 lines of code)
* Graceful error handling

---

## Setup

### Prerequisites

* Node.js 16+
* Groq API key (https://console.groq.com)

### Installation

```bash
npm install
```

Create a `.env` file:

```
GROQ_API_KEY=your_api_key_here
```

---

## Usage

### From a file

```bash
node index.js test.txt
```

### From stdin

```bash
node index.js
```

Then paste input and finish with:

* Ctrl+Z + Enter (Windows)

---

## Example Output

```
============================================================
TEXT ANALYSIS REPORT
============================================================

→ Summary
  Artificial Intelligence is transforming industries by improving efficiency and automation.

→ Key Points
  1. AI automates repetitive processes.
  2. It enhances decision-making capabilities.
  3. Adoption is increasing across industries.

→ Sentiment
  POSITIVE

============================================================
```

---

## LLM Choice

**Groq (llama-3.1-8b-instant)** was used because:

* Fast inference speed (ideal for CLI tools)
* Simple and reliable SDK
* Good performance for structured extraction tasks

---

## Prompt Design

The prompt is designed to maximize **consistency and parseability**:

* Enforces **strict JSON output** to avoid ambiguity
* Clearly defines required fields (summary, key points, sentiment)
* Uses a **low temperature (0.3)** for deterministic responses
* Keeps instructions minimal to reduce hallucination

**Trade-off:**
Strict formatting improves reliability but reduces flexibility in responses.

---

## Design Decisions

* **CLI-first approach**: Faster to build and demonstrates backend + API integration clearly
* **Single API call**: Keeps latency low and implementation simple
* **Inline JSON parsing**: Avoids additional schema validation complexity
* **Fail-fast error handling**: Clear errors instead of silent failures

---

## Error Handling

The tool handles:

* Missing API key
* Empty input
* File read errors
* API failures
* Invalid JSON responses (logs raw output for debugging)

---

## Limitations

* Assumes valid JSON from the model
* English-only prompt
* No retry mechanism for API failures
* Single model (not configurable via CLI)

---

## Future Improvements

With more time, I would add:

* Batch processing for multiple files
* Confidence scoring / reliability indicator
* CLI flags (e.g., `--json`, `--model`)
* Retry logic with exponential backoff
* Basic web UI (Express + form input)
* Result caching to reduce repeated API calls

---

## Code Structure

* `summarizeText(text)` – Handles LLM interaction
* `formatOutput(result)` – Formats CLI output
* `main()` – Input handling and orchestration

---

## Notes

This project intentionally prioritizes:

* Simplicity
* Readability
* Clear prompt design
