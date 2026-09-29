"use client";

import { BookOpenCheck, CheckCircle2, Layers3 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { CitationBadge } from "@/components/citation-badge";
import { ResearchEmpty } from "@/components/research-empty";
import { WorkspaceTabs } from "@/components/workspace-tabs";
import { useResearch } from "@/context/research-context";

export default function FindingsPage() {
  const { research } = useResearch();

  if (!research) {
    return (
      <AppShell>
        <ResearchEmpty title="No structured findings available" />
      </AppShell>
    );
  }

  const refinementQuestions = new Set(
    research.refinement_history.flatMap((round) => round.questions)
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-indigo-600">Evidence synthesis</div>
            <h1 className="heading-font mt-2 text-3xl font-semibold tracking-tight text-slate-950">Structured Empirical Findings</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Each finding answers one research question and carries only source IDs selected by the Researcher and validated by the backend.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="mono-font rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">{research.findings.length} findings</span>
            <span className="mono-font rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-[10px] text-indigo-700">{research.report.sources.length} cited sources</span>
          </div>
        </div>

        <div className="mt-5">
          <WorkspaceTabs />
        </div>

        <div className="mt-6 space-y-4">
          {research.findings.map((finding, index) => {
            const isRefinement = refinementQuestions.has(finding.question);

            return (
              <article key={finding.question} className="surface-card rounded-xl p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mono-font text-[10px] font-semibold text-slate-400">Q{String(index + 1).padStart(2, "0")}</span>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          isRefinement
                            ? "bg-amber-50 text-amber-700"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        {isRefinement ? "Refinement" : "Original"}
                      </span>
                    </div>
                    <h2 className="heading-font mt-3 text-lg font-semibold leading-7 text-slate-950">{finding.question}</h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    <BookOpenCheck size={14} className="text-indigo-600" />
                    {finding.source_ids.length} cited
                  </div>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
                  <div>
                    <div className="mono-font text-[10px] uppercase tracking-[0.12em] text-slate-400">Research synthesis</div>
                    <p className="mt-2 text-sm leading-7 text-slate-700">{finding.summary}</p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Layers3 size={15} className="text-indigo-600" />
                      Key findings
                    </div>
                    {finding.key_points.length > 0 ? (
                      <div className="mt-3 space-y-2.5">
                        {finding.key_points.map((point) => (
                          <div key={point} className="flex gap-2.5 text-xs leading-5 text-slate-600">
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs leading-5 text-slate-500">No supported key points were returned for this question.</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  <span className="mono-font mr-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Evidence</span>
                  {finding.source_ids.length > 0 ? (
                    finding.source_ids.map((sourceId) => <CitationBadge key={sourceId} sourceId={sourceId} />)
                  ) : (
                    <span className="text-xs text-slate-400">No source citation was validated for this finding.</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
