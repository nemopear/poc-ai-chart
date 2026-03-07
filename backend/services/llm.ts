import * as fs from "fs";
import * as path from "path";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL_NAME = process.env.OLLAMA_MODEL || "llama3";

interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
  format: "json";
}

interface OllamaResponse {
  response: string;
}

export interface ChartResponse {
  chartType?: string;
  title?: string;
  xAxis?: {
    label?: string;
    data?: string[] | number[];
  };
  yAxis?: {
    label?: string;
  };
  series?: Array<{
    name: string;
    data: number[];
  }>;
  data?: Array<{ name: string; value: number }>;
  columns?: string[];
  rows?: string[][];
  insight?: string;
  error?: string;
}

function loadSystemPrompt(): string {
  const promptPath = path.join(process.cwd(), "prompts", "chart_prompt.txt");
  if (fs.existsSync(promptPath)) {
    return fs.readFileSync(promptPath, "utf-8");
  }
  return "";
}

export async function callLLaMAStream(
  dbResultJson: string,
  markdownContent: string,
  userQuestion: string
): Promise<ReadableStream<Uint8Array>> {
  const systemPrompt = loadSystemPrompt();
  
  const runtimePrompt = `You must respond with ONLY valid JSON, no other text.

INTERNAL DATA CONTEXT:
${dbResultJson}

BUSINESS DEFINITIONS:
${markdownContent}

USER QUESTION:
${userQuestion}

${systemPrompt}

Respond with ONLY valid JSON in this exact format:
{"chartType":"line|bar|pie|area|table","title":"...","xAxis":{"label":"...","data":[...]},"yAxis":{"label":"..."},"series":[{"name":"...","data":[...]}],"insight":"..."}`;

  const requestBody: OllamaRequest = {
    model: MODEL_NAME,
    prompt: runtimePrompt,
    stream: true,
    format: "json",
  };

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ error: `Ollama API error: ${response.status} - ${errorBody}` })));
        controller.close();
      }
    });
    return errorStream;
  }

  if (!response.body) {
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ error: "No response body" })));
        controller.close();
      }
    });
    return errorStream;
  }

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim()) {
              try {
                const parsed = JSON.parse(line);
                if (parsed.response) {
                  controller.enqueue(new TextEncoder().encode(parsed.response));
                }
                if (parsed.done) {
                  controller.close();
                  return;
                }
              } catch {
                // Skip invalid JSON lines
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    }
  });
}

export async function callLLaMA(
  dbResultJson: string,
  markdownContent: string,
  userQuestion: string
): Promise<ChartResponse> {
  const systemPrompt = loadSystemPrompt();
  
  const runtimePrompt = `You must respond with ONLY valid JSON, no other text.

INTERNAL DATA CONTEXT:
${dbResultJson}

BUSINESS DEFINITIONS:
${markdownContent}

USER QUESTION:
${userQuestion}

${systemPrompt}

Respond with ONLY valid JSON in this exact format:
{"chartType":"line|bar|pie|area|table","title":"...","xAxis":{"label":"...","data":[...]},"yAxis":{"label":"..."},"series":[{"name":"...","data":[...]}],"insight":"..."}`;

  const requestBody: OllamaRequest = {
    model: MODEL_NAME,
    prompt: runtimePrompt,
    stream: false,
    format: "json",
  };

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json() as OllamaResponse;
    
    try {
      const parsed = JSON.parse(data.response);
      return parsed as ChartResponse;
    } catch {
      return {
        error: "Failed to parse LLM response as JSON",
      };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error calling LLM",
    };
  }
}
