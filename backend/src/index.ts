import express from "express";
import cors from "cors";
import { handleChat, handleChatStream } from "../api/chat";
import { getAllMockExamples, getMockExample } from "../services/mockData";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { question, stream, mock } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      
      if (mock) {
        const example = getMockExample(question);
        if (example) {
          await streamMockResponse(question, example.streamingText, example.answer, res);
        } else {
          res.write(`data: ${JSON.stringify({ type: "error", error: "No mock example found" })}\n\n`);
          res.end();
        }
        return;
      }
      
      await handleChatStream({ question }, res);
    } else {
      if (mock) {
        const example = getMockExample(question);
        if (example) {
          res.json(example.answer);
        } else {
          res.status(404).json({ error: "No mock example found" });
        }
        return;
      }
      const result = await handleChat({ question });
      res.json(result);
    }
  } catch (error) {
    console.error("Error handling chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function streamMockResponse(question: string, text: string, data: any, res: express.Response) {
  const words = text.split(" ");
  
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
    res.write(`data: ${JSON.stringify({ type: "chunk", content: words[i] + (i < words.length - 1 ? " " : "") })}\n\n`);
  }
  
  await new Promise(resolve => setTimeout(resolve, 200));
  res.write(`data: ${JSON.stringify({ type: "complete", data })}\n\n`);
  res.write("data: [DONE]\n\n");
  res.end();
}

app.get("/api/examples", (req, res) => {
  res.json(getAllMockExamples());
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
