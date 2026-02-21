import { queryDataByType, determineDataType } from "../services/db";
import { getRelevantKnowledge } from "../services/contextBuilder";
import { callLLaMA } from "../services/llm";

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
  
  return llmResponse;
}
