# File Investigator

AI-powered document analysis demo built with [CopilotKit](https://copilotkit.ai), [Strands Agents](https://strandsagents.com), and Amazon Bedrock.

Upload a PDF and chat with an AI agent that analyzes it, extracting key findings, speculating on redacted content, generating shareable tweets, and producing an executive summary.

## Features

- **PDF Document Analysis** - Upload any PDF for AI-powered investigation
- **Key Findings** - Extracts 3-5 most important points with severity ratings
- **Redacted Content Speculation** - AI guesses what might be hidden in redacted sections
- **Tweet Generation** - Creates shareable tweets based on document findings
- **Executive Summary** - Produces a concise markdown summary
- **Real-time Chat** - Conversational interface powered by CopilotKit
- **State Synchronization** - Frontend panels update as the agent works

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ File Upload │  │  Dashboard  │  │   CopilotKit Chat   │  │
│  │             │  │   Panels    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                           │                                  │
│                    useCoAgent (state sync)                   │
└───────────────────────────┬─────────────────────────────────┘
                            │ AG-UI Protocol (SSE)
┌───────────────────────────┴─────────────────────────────────┐
│                     Python Agent                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Strands Agent + ag_ui_strands              ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ││
│  │  │update_findings│ │update_redacted│ │ update_tweets │  ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  ││
│  │                    ┌──────────────┐                     ││
│  │                    │update_summary│                     ││
│  │                    └──────────────┘                     ││
│  └─────────────────────────────────────────────────────────┘│
│                           │                                  │
│                    Amazon Bedrock                            │
│               (Claude claude-haiku-4-5-20251001)                           │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 20+
- Python 3.12+
- AWS credentials with Bedrock access
- npm/yarn/pnpm/bun

## Quick Start

### 1. Install dependencies

```bash
npm install
cd agent && uv sync && cd ..
```

### 2. Configure AWS credentials

Create `agent/.env`:

```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-west-1
```

### 3. Start development servers

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Agent**: http://localhost:8000

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main page with dashboard panels
│   │   └── api/copilotkit/    # CopilotKit API route
│   ├── components/
│   │   ├── dashboard-panels.tsx  # Findings, Redacted, Tweets, Summary
│   │   ├── file-upload.tsx       # PDF upload component
│   │   └── tool-cards.tsx        # Tool UI renderers
│   └── types/
│       └── investigator.ts    # TypeScript types
├── agent/
│   ├── main.py                # Strands agent with Bedrock
│   └── pyproject.toml         # Python dependencies
└── package.json
```

## How It Works

1. **Upload PDF** - User uploads a document via the file upload component
2. **State Sync** - File is stored in shared state via `useCoAgent`
3. **Chat Request** - User asks agent to analyze the document
4. **Agent Processing** - Strands agent reads PDF, calls Claude via Bedrock
5. **Tool Calls** - Agent calls `update_*` tools to populate dashboard panels
6. **State Updates** - Each tool call updates shared state
7. **UI Renders** - Dashboard panels automatically render from state

## Agent Tools

| Tool | Purpose |
|------|---------|
| `update_findings` | Populates Key Findings panel with severity-rated items |
| `update_redacted` | Populates Redacted Content panel with speculations |
| `update_tweets` | Populates Generated Tweets panel |
| `update_summary` | Populates Executive Summary panel with markdown |

## Environment Variables

### Agent (`agent/.env`)

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key for Bedrock |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region (default: `us-west-1`) |

### Frontend (optional)

| Variable | Description |
|----------|-------------|
| `AGENT_URL` | Override agent URL (default: `http://localhost:8000`) |

## Tech Stack

**Frontend:**
- Next.js 16
- React 19
- CopilotKit 1.10
- Tailwind CSS 4
- TypeScript

**Backend:**
- Python 3.12
- Strands Agents 1.15+
- ag_ui_strands 0.1.0b12
- FastAPI + Uvicorn
- Amazon Bedrock (Claude claude-haiku-4-5-20251001)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and agent |
| `npm run dev:ui` | Start frontend only |
| `npm run dev:agent` | Start agent only |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |

## Troubleshooting

### Agent not connecting
- Verify agent is running on port 8000
- Check AWS credentials in `agent/.env`
- Ensure Bedrock model access is enabled in AWS console

### PDF not processing
- Check agent logs for errors
- Verify PDF is not corrupted
- Large PDFs may take longer to process

### State not syncing
- Ensure both servers are running
- Check browser console for WebSocket errors
- Verify `useCoAgent` name matches agent name

## License

MIT

Built by Mark Morgan