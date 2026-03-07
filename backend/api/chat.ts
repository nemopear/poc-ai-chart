import { queryDataByType, determineDataType } from "../services/db";
import { getRelevantKnowledge } from "../services/contextBuilder";
import { callLLaMA, callLLaMAStream } from "../services/llm";
import type { Response } from "express";

export interface ChatRequest {
  question: string;
}

export interface ChatResponse {
  chartType: string;
  title: string;
  xAxis?: {
    label: string;
    data: string[] | number[];
  };
  yAxis?: {
    label: string;
  };
  series?: Array<{
    name: string;
    data: number[];
  }>;
  data?: Array<{ name: string; value: number }>;
  columns?: string[];
  rows?: string[][];
  insight: string;
  error?: string;
}

export async function handleChat(req: ChatRequest): Promise<ChatResponse> {
  const { question } = req;
  
  const dataType = determineDataType(question);
  const dbResult = queryDataByType(dataType);
  const dbResultJson = JSON.stringify(dbResult, null, 2);
  
  const markdownContent = getRelevantKnowledge(question);
  
  const llmResponse = await callLLaMA(dbResultJson, markdownContent, question);
  
  return llmResponse as ChatResponse;
}

export async function handleChatStream(req: ChatRequest, res: Response): Promise<void> {
  const { question } = req;
  
  const dataType = determineDataType(question);
  const dbResult = queryDataByType(dataType);
  const dbResultJson = JSON.stringify(dbResult, null, 2);
  
  const markdownContent = getRelevantKnowledge(question);
  
  const stream = await callLLaMAStream(dbResultJson, markdownContent, question);
  
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullResponse = "";

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
              fullResponse += parsed.response;
              res.write(`data: ${JSON.stringify({ type: "chunk", content: parsed.response })}\n\n`);
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    }

    try {
      const finalData = JSON.parse(fullResponse);
      res.write(`data: ${JSON.stringify({ type: "complete", data: finalData })}\n\n`);
    } catch {
      res.write(`data: ${JSON.stringify({ type: "error", error: "Failed to parse LLM response as JSON" })}\n\n`);
    }
  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: "error", error: error instanceof Error ? error.message : "Unknown error" })}\n\n`);
  } finally {
    res.write("data: [DONE]\n\n");
    res.end();
  }
}
