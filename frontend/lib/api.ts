import type { ResearchAnalysisResponse } from "@/types/research";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export async function analyzeResearch(
  topic: string,
  signal?: AbortSignal
): Promise<ResearchAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/research/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ topic }),
    signal
  });

  if (!response.ok) {
    let message = `Research request failed with status ${response.status}.`;

    try {
      const errorBody = await response.json();
      if (typeof errorBody?.detail === "string") {
        message = errorBody.detail;
      }
    } catch {
      // Keep the fallback message when the backend returns a non-JSON error.
    }

    throw new Error(message);
  }

  return response.json() as Promise<ResearchAnalysisResponse>;
}
