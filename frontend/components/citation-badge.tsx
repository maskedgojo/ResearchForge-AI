"use client";

import { useResearch } from "@/context/research-context";

export function CitationBadge({ sourceId }: { sourceId: string }) {
  const { selectSource } = useResearch();

  return (
    <button
      type="button"
      onClick={() => selectSource(sourceId)}
      className="mono-font inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
    >
      [{sourceId}]
    </button>
  );
}
