"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  FileSearch,
  Gauge,
  Layers3,
  LoaderCircle,
  RefreshCw,
  ShieldCheck
} from "lucide-react";

import { AgentPipeline } from "@/components/agent-pipeline";
import { AppShell } from "@/components/app-shell";
import { ErrorBanner } from "@/components/error-banner";
import { MetricCard } from "@/components/metric-card";
import { ResearchEmpty } from "@/components/research-empty";
import { WorkspaceTabs } from "@/components/workspace-tabs";
import { useResearch } from "@/context/research-context";
import { getUsedSourceIds } from "@/lib/research-utils";

function RunningWorkspace({ topic }: { topic: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mono-font flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-indigo-600">
              <span className="h-2 w-2 rounded-full bg-indigo-500 rf-pulse" />
              Multi-agent pipeline running
            </div>
            <h1 className="heading-font mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {topic}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              ResearchForge is planning questions, collecting evidence, retrieving relevant sources, auditing the findings, and preparing the final cited report.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-indigo-700">
            <LoaderCircle className="animate-spin" size={20} />
            <div>
              <div className="text-xs font-semibold">Processing</div>
              <div className="mono-font text-[10px] text-indigo-500">WAIT FOR FINAL RESPONSE</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="heading-font text-lg font-semibold text-slate-950">Agent execution</h2>
          <span className="text-xs text-slate-400">Status is intentionally shown as processing until the backend returns.</span>
        </div>
        <AgentPipeline running complete={false} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <RefreshCw size={16} className="text-indigo-600" />
            What is happening now
          </div>
          <div className="mt-4 space-y-3">
            {["Generating research questions", "Searching and ranking evidence", "Synthesizing findings and citations", "Critiquing and refining weak areas", "Writing the final report"].map((step) => (
              <div key={step} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500 rf-pulse" />
                <span className="text-sm text-slate-600">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chrome-card rounded-xl p-5">
          <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-indigo-300">Trust boundary</div>
          <h3 className="heading-font mt-2 text-lg font-semibold text-white">Citations stay deterministic</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            The model selects source IDs only. Exact source titles and URLs are attached by the backend after validation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const { research, isRunning, activeTopic, error, clearError } = useResearch();

  if (!research && !isRunning) {
    return (
      <AppShell>
        {error && <div className="mx-auto mb-5 max-w-4xl"><ErrorBanner message={error} onClose={clearError} /></div>}
        <ResearchEmpty title="No active research workspace" />
      </AppShell>
    );
  }

  if (isRunning) {
    return (
      <AppShell>
        <div className="mx-auto max-w-6xl">
          {error && <div className="mb-5"><ErrorBanner message={error} onClose={clearError} /></div>}
          <RunningWorkspace topic={activeTopic || research?.topic || "Research in progress"} />
        </div>
      </AppShell>
    );
  }

  if (!research) {
    return null;
  }

  const usedSources = getUsedSourceIds(research);
  const refinementCount = research.refinement_history.length;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-emerald-600">Research complete</div>
            <h1 className="heading-font mt-2 max-w-4xl text-3xl font-semibold tracking-tight text-slate-950">
              {research.topic}
            </h1>
            <div className="mono-font mt-2 text-[10px] text-slate-400">Research ID: {research.research_id}</div>
          </div>
          <Link href="/report" className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Open final report
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-5">
          <WorkspaceTabs />
        </div>

        <section className="mt-6">
          <AgentPipeline running={false} complete />
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Research questions" value={research.questions.length} helper="Original + refinement" icon={FileSearch} />
          <MetricCard label="Sources collected" value={research.sources.length} helper="Clean metadata" icon={Database} />
          <MetricCard label="Sources used" value={usedSources.size} helper="Cited in findings" icon={ShieldCheck} />
          <MetricCard label="Research quality" value={`${research.critique.overall_score}/10`} helper="Final critic score" icon={Gauge} />
          <MetricCard label="Refinement rounds" value={refinementCount} helper="Targeted follow-up" icon={Layers3} />
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="heading-font text-lg font-semibold text-slate-950">Research progression</h2>
              <span className="mono-font text-[10px] uppercase tracking-[0.12em] text-emerald-600">Verified pipeline</span>
            </div>
            <div className="mt-5 space-y-5 border-l border-slate-200 pl-5">
              <div className="relative">
                <span className="absolute -left-[25px] top-1 flex h-3 w-3 rounded-full border-2 border-white bg-indigo-500 shadow" />
                <div className="text-sm font-semibold text-slate-900">Planner generated {research.questions.length - research.refinement_history.flatMap((round) => round.questions).length} original questions</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">The topic was decomposed into focused research dimensions.</div>
              </div>
              <div className="relative">
                <span className="absolute -left-[25px] top-1 flex h-3 w-3 rounded-full border-2 border-white bg-cyan-500 shadow" />
                <div className="text-sm font-semibold text-slate-900">Evidence corpus collected and ranked</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">{research.sources.length} unique source records passed through normalization and authority scoring.</div>
              </div>
              {research.refinement_history.map((round) => (
                <div key={round.round} className="relative">
                  <span className="absolute -left-[25px] top-1 flex h-3 w-3 rounded-full border-2 border-white bg-amber-500 shadow" />
                  <div className="text-sm font-semibold text-slate-900">Refinement round {round.round}: {round.score_before ?? "–"}/10 → {round.score_after ?? "–"}/10</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{round.questions.length} follow-up questions targeted critic-identified evidence gaps.</div>
                </div>
              ))}
              <div className="relative">
                <span className="absolute -left-[25px] top-1 flex h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow" />
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><CheckCircle2 size={15} className="text-emerald-600" /> Final report synthesized</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">Section-level citations were validated and mapped back to trusted source metadata.</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="chrome-card rounded-xl p-5">
              <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-indigo-300">Final critique</div>
              <div className="mt-3 flex items-end gap-2">
                <div className="heading-font text-4xl font-semibold text-white">{research.critique.overall_score}</div>
                <div className="pb-1 text-sm text-slate-400">/ 10</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{research.critique.strengths[0] ?? "Research successfully completed."}</p>
              <Link href="/critique" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 hover:text-indigo-200">
                Review critic audit <ArrowRight size={13} />
              </Link>
            </div>

            <div className="surface-card rounded-xl p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><BookOpen size={16} className="text-indigo-600" /> Final report</div>
              <div className="heading-font mt-3 text-base font-semibold leading-6 text-slate-950">{research.report.title}</div>
              <p className="mt-2 line-clamp-5 text-xs leading-5 text-slate-500">{research.report.executive_summary}</p>
              <Link href="/report" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 hover:text-indigo-800">
                Read report <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
