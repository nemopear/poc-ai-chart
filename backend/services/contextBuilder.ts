import * as fs from "fs";
import * as path from "path";

const KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge");

export interface KnowledgeDoc {
  content: string;
  source: string;
}

export function loadKnowledgeFiles(): KnowledgeDoc[] {
  const docs: KnowledgeDoc[] = [];
  
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    return docs;
  }

  const files = fs.readdirSync(KNOWLEDGE_DIR);
  
  for (const file of files) {
    if (file.endsWith(".md")) {
      const filePath = path.join(KNOWLEDGE_DIR, file);
      const content = fs.readFileSync(filePath, "utf-8");
      docs.push({
        content,
        source: file,
      });
    }
  }
  
  return docs;
}

export function getRelevantKnowledge(question: string): string {
  const docs = loadKnowledgeFiles();
  
  if (docs.length === 0) {
    return "";
  }
  
  const lowerQuestion = question.toLowerCase();
  let relevantDocs: KnowledgeDoc[] = [];
  
  for (const doc of docs) {
    const content = doc.content.toLowerCase();
    
    if (
      lowerQuestion.includes("revenue") && content.includes("revenue") ||
      lowerQuestion.includes("profit") && content.includes("profit") ||
      lowerQuestion.includes("cost") && content.includes("cost") ||
      lowerQuestion.includes("customer") && content.includes("customer") ||
      lowerQuestion.includes("product") && content.includes("product") ||
      lowerQuestion.includes("chart") && content.includes("chart")
    ) {
      relevantDocs.push(doc);
    }
  }
  
  if (relevantDocs.length === 0 && docs.length > 0) {
    relevantDocs = [docs[0]];
  }
  
  return relevantDocs.map(doc => doc.content).join("\n\n");
}
