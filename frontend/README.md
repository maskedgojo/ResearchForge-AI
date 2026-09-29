# ResearchForge AI — Frontend

Next.js + TypeScript + Tailwind frontend for the ResearchForge multi-agent research backend.

## Included screens

- New Research
- Active Research / Workspace Overview
- Structured Findings
- Critic & Refinement
- Final Research Report
- Sources / Evidence Library

The UI is based on the provided Stitch concept while keeping the frontend aligned with the backend that actually exists today.

## Backend contract

The frontend expects:

```http
POST /research/analyze
Content-Type: application/json

{
  "topic": "Impact of AI on software engineering"
}
```

The expected response is the cleaned `ResearchAnalysisResponse` contract:

- `research_id`
- `topic`
- `questions`
- `sources` metadata only
- `findings`
- `critique`
- `refinement_history`
- `report`

## Setup

```bash
npm install
```

Copy the environment file:

```bash
cp .env.local.example .env.local
```

For a local FastAPI backend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Important integration note

The browser calls the FastAPI backend directly. The backend must allow the frontend origin through CORS, for example `http://localhost:3000` during local development and the deployed frontend domain in production.

## Research state

The current successful research response is stored in `localStorage` under:

```text
researchforge:last-research
```

This allows the user to navigate between Findings, Critique, Report, and Sources without losing the latest completed research result.

This is intentionally a single-session frontend for the current project milestone. Persistent multi-user research history can be added later with a database/API.

## Agent progress

The current backend returns `/research/analyze` only after the complete multi-agent workflow finishes. Therefore the frontend does **not** invent precise live agent events. While the request is running, the workspace honestly shows the whole pipeline as processing.

A future SSE/WebSocket progress endpoint can make the agent stages truly live.

## Visual explanations

The report model already includes an optional frontend-only visual contract:

```ts
visual?: {
  type: "retrieved_image" | "generated_visual" | "chart";
  url: string;
  caption: string;
  provenance?: string;
};
```

The `ReportVisual` component will render this automatically when the backend later attaches visual metadata. This keeps visual search/generation separate from research evidence and citations.

Recommended next visual architecture:

```text
Final validated report section
        ↓
Visual request
        ↓
Retrieved image OR generated explanatory diagram
        ↓
Store visual metadata
        ↓
ReportVisual component
```

Generated visuals should be labeled as generated illustrations and must not be treated as research evidence.

## Production sequence

1. Confirm local frontend ↔ backend integration.
2. Add the one required CORS configuration if needed.
3. Test error/loading/mobile states.
4. Deploy FastAPI backend.
5. Set `NEXT_PUBLIC_API_BASE_URL` to production backend URL.
6. Deploy frontend.
7. Prepare project report, screenshots, README, and architecture diagrams.
