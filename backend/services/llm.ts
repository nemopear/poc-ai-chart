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

    const data: OllamaResponse = await response.json();
    
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
