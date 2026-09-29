"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { analyzeResearch } from "@/lib/api";
import type { ResearchAnalysisResponse } from "@/types/research";

const STORAGE_KEY = "researchforge:last-research";

type ResearchContextValue = {
  research: ResearchAnalysisResponse | null;
  isRunning: boolean;
  error: string | null;
  activeTopic: string;
  selectedSourceId: string | null;
  startResearch: (topic: string) => Promise<void>;
  clearResearch: () => void;
  clearError: () => void;
  selectSource: (sourceId: string | null) => void;
};

const ResearchContext = createContext<ResearchContextValue | null>(null);

export function ResearchProvider({ children }: { children: React.ReactNode }) {
  const [research, setResearch] = useState<ResearchAnalysisResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const storedResearch = window.localStorage.getItem(STORAGE_KEY);

    if (!storedResearch) {
      return;
    }

    try {
      setResearch(JSON.parse(storedResearch) as ResearchAnalysisResponse);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const startResearch = useCallback(async (topic: string) => {
    const normalizedTopic = topic.trim();

    if (normalizedTopic.length < 3) {
      setError("Enter a research topic with at least 3 characters.");
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setActiveTopic(normalizedTopic);
    setSelectedSourceId(null);
    setError(null);
    setIsRunning(true);

    try {
      const result = await analyzeResearch(normalizedTopic, controller.signal);
      setResearch(result);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (requestError) {
      if (controller.signal.aborted) {
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Research could not be completed."
      );
    } finally {
      if (abortControllerRef.current === controller) {
        setIsRunning(false);
      }
    }
  }, []);

  const clearResearch = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setResearch(null);
    setIsRunning(false);
    setError(null);
    setActiveTopic("");
    setSelectedSourceId(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<ResearchContextValue>(
    () => ({
      research,
      isRunning,
      error,
      activeTopic,
      selectedSourceId,
      startResearch,
      clearResearch,
      clearError: () => setError(null),
      selectSource: setSelectedSourceId
    }),
    [
      research,
      isRunning,
      error,
      activeTopic,
      selectedSourceId,
      startResearch,
      clearResearch
    ]
  );

  return (
    <ResearchContext.Provider value={value}>
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);

  if (!context) {
    throw new Error("useResearch must be used inside ResearchProvider.");
  }

  return context;
}
