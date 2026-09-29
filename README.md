# ResearchForge AI

ResearchForge AI is an end-to-end multi-agent research platform that
turns a user topic into a structured, evidence-backed research report.

Instead of treating research as a single LLM response, ResearchForge
separates the workflow into explicit stages for planning, web search,
retrieval, evidence synthesis, quality review, refinement, and report
generation.

------------------------------------------------------------------------

# Live Demo

Frontend: https://research-forge-ai-zeta.vercel.app

Backend API: https://researchforge-ai-production-0862.up.railway.app

API Documentation:
https://researchforge-ai-production-0862.up.railway.app/docs

------------------------------------------------------------------------

# Project Motivation

Modern AI assistants can generate answers quickly, but complex research
tasks require more than text generation.

ResearchForge AI focuses on building a structured research workflow
where information is:

-   collected from multiple sources
-   retrieved based on relevance
-   reviewed for quality
-   refined through feedback
-   transformed into a structured report

The goal is to create a traceable and modular research system rather
than a single conversational response.

------------------------------------------------------------------------

# Core Workflow

``` mermaid
flowchart TD

A[User Research Topic] --> B[Planner Agent]

B --> C[Research Questions]

C --> D[Searcher]

D --> E[Source Quality + Deduplication]

E --> F[ChromaDB / RAG]

F --> G[Researcher Agent]

G --> H[Critic Agent]

H --> I{Quality sufficient?}

I -- No --> J[Refiner Agent]

J --> K[Targeted Follow-up Questions]

K --> D

I -- Yes --> L[Writer Agent]

L --> M[Final Cited Research Report]
```

------------------------------------------------------------------------

# Production Architecture

``` text
User
 |
 v
Vercel Next.js Frontend
 |
 v
Railway FastAPI Backend
 |
 +-------------------------+
 |                         |
Google Gemini          Tavily Search
 |
 v
Multi-Agent Research Pipeline
 |
 v
ChromaDB Vector Retrieval
 |
 v
Structured Research Report
```

------------------------------------------------------------------------

# What Makes ResearchForge AI Interesting

ResearchForge does not claim that AI-powered research itself is new. Its
engineering focus is making the research pipeline modular, auditable,
and evidence-aware.

Key design decisions include:

-   Explicit Planner → Searcher → Researcher → Critic → Refiner → Writer
    workflow
-   Retrieval-Augmented Generation using ChromaDB
-   Research-session isolation using unique research IDs
-   Source normalization, deduplication, and quality scoring
-   Citation validation
-   Structured Gemini output validated with Pydantic
-   Section-level citations in final reports
-   Source-linked research visuals

------------------------------------------------------------------------

# Main Features

## Multi-Agent Research Pipeline

### Planner Agent

-   Converts a topic into focused research questions.
-   Defines initial research direction.

### Searcher Agent

-   Searches the web using Tavily.
-   Retrieves candidate sources.
-   Normalizes URLs.
-   Removes duplicates.
-   Records source metadata.

### RAG Layer

-   Stores research evidence in ChromaDB.
-   Uses semantic retrieval.
-   Provides relevant context to research agents.

### Researcher Agent

-   Answers research questions using retrieved evidence.
-   Produces structured findings.

### Critic Agent

-   Evaluates completeness.
-   Identifies missing information.
-   Reviews evidence quality.
-   Provides improvement suggestions.

### Refiner Agent

-   Creates targeted follow-up research questions.
-   Enables additional research cycles.

### Writer Agent

-   Generates the final professional report.
-   Produces summaries, sections, conclusions, and citations.

------------------------------------------------------------------------

# Technology Stack

## Backend

-   Python
-   FastAPI
-   Pydantic
-   Google Gemini API
-   Tavily Search API
-   ChromaDB
-   Sentence Transformers
-   LangChain text splitters
-   Uvicorn

## Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Lucide React

## Deployment

-   Docker
-   Railway (Backend)
-   Vercel (Frontend)

------------------------------------------------------------------------

# Engineering Highlights

-   Designed a complete agentic AI workflow.
-   Built a Retrieval-Augmented Generation pipeline.
-   Implemented structured LLM responses using Pydantic validation.
-   Added source tracking and citation validation.
-   Created production FastAPI APIs.
-   Containerized backend deployment using Docker.
-   Deployed frontend and backend independently on cloud platforms.
-   Integrated Gemini and Tavily for AI reasoning and web research.

------------------------------------------------------------------------

# Project Structure

``` text
ResearchForge-AI/

├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── planner.py
│   │   │   ├── searcher.py
│   │   │   ├── researcher.py
│   │   │   ├── critic.py
│   │   │   ├── refiner.py
│   │   │   └── writer.py
│   │   │
│   │   ├── rag/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
│
└── README.md
```

------------------------------------------------------------------------

# Local Development

## Backend

``` bash
cd backend

python -m venv venv

pip install -r requirements.txt
```

Create `.env`:

``` env
GEMINI_API_KEY=your_key
TAVILY_API_KEY=your_key
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000
CHROMA_PATH=./chroma_db
```

Run:

``` bash
uvicorn app.main:app --reload
```

## Frontend

``` bash
cd frontend

npm install

npm run dev
```

Create `.env.local`:

``` env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

------------------------------------------------------------------------

# API

## Health Check

    GET /health

## Create Research Plan

    POST /research/plan

## Run Complete Research Pipeline

    POST /research/analyze

Response includes:

-   research_id
-   topic
-   questions
-   sources
-   findings
-   critique
-   refinement history
-   final report

------------------------------------------------------------------------

# Application Screenshots

Add screenshots:

-   Research workspace
-   Generated findings
-   Critique section
-   Final report
-   Source visualization

------------------------------------------------------------------------

# Deployment

## Backend - Railway

Backend is deployed as a Dockerized FastAPI service.

Environment variables:

``` env
GEMINI_API_KEY=<secret>
TAVILY_API_KEY=<secret>
ENVIRONMENT=production
FRONTEND_URL=<vercel-url>
CHROMA_PATH=/data/chroma_db
```

## Frontend - Vercel

Environment variable:

``` env
NEXT_PUBLIC_API_BASE_URL=<railway-backend-url>
```

------------------------------------------------------------------------

# Production Request Flow

``` text
Browser

↓

Vercel / Next.js

↓

FastAPI / Railway

↓

Gemini + Tavily + ChromaDB

↓

Structured Research Response

↓

Research Workspace / Final Report
```

------------------------------------------------------------------------

# Current Status

``` text
Backend research pipeline      Complete

RAG                           Complete

Citation validation            Complete

Critic/refinement loop         Complete

Frontend workspace             Complete

Source-linked visuals          Complete

Production deployment          Complete

Documentation                  Complete
```

------------------------------------------------------------------------

# Future Improvements

-   Authentication
-   Saved research history
-   Background research jobs
-   Progress streaming
-   PDF/DOCX export
-   Better image relevance filtering
-   Additional search providers
-   Improved source credibility analysis

------------------------------------------------------------------------

# Author

## Kushaagra Singh

B.Tech Computer Science and Engineering

KIIT University
