import express from "express";
import cors from "cors";
import { handleChat } from "../api/chat";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await handleChat({ question });
    res.json(result);
  } catch (error) {
    console.error("Error handling chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
