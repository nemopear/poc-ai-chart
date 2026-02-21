# AI Data Visualization Chatbot - POC

## Quick Start

### Prerequisites
- Node.js 18+
- Ollama installed locally (for LLaMA 3)
- Docker (optional, for containerized setup)

### Option 1: Local Development

1. **Start Ollama**
   ```bash
   # Pull LLaMA 3 model
   ollama pull llama3
   
   # Start Ollama server
   ollama serve
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open http://localhost:3000

### Option 2: Docker

```bash
docker-compose up --build
```

## Usage

1. Enter a question like:
   - "Show monthly revenue trend"
   - "Compare product sales by category"
   - "Show revenue breakdown by product"
   - "Display customer growth over time"

2. Click "Generate Chart"

## Project Structure

```
.
├── frontend/          # Next.js frontend
│   ├── components/    # Chart renderer component
│   └── pages/         # Main page
├── backend/           # Express backend
│   ├── api/           # Chat API endpoint
│   └── services/      # DB, LLM, context services
├── knowledge/         # Markdown knowledge files
└── prompts/          # LLM prompt templates
```

## Environment Variables

### Backend
- `OLLAMA_URL`: Ollama server URL (default: http://localhost:11434)
- `OLLAMA_MODEL`: Model name (default: llama3)
- `PORT`: Server port (default: 3001)

## API Endpoint

**POST** `/api/chat`

Request:
```json
{
  "question": "Show monthly revenue trend"
}
```

Response:
```json
{
  "chartType": "line",
  "title": "Monthly Revenue",
  "xAxis": {
    "label": "Month",
    "data": ["January", "February", "March"]
  },
  "yAxis": {
    "label": "Revenue"
  },
  "series": [
    {
      "name": "Revenue",
      "data": [120000, 150000, 170000]
    }
  ],
  "insight": "Revenue shows consistent growth."
}
```
