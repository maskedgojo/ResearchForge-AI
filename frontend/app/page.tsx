"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  FlaskConical,
  Radar,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap
} from "lucide-react";

import { AgentPipeline } from "@/components/agent-pipeline";
import { AppShell } from "@/components/app-shell";
import { ErrorBanner } from "@/components/error-banner";
import { useResearch } from "@/context/research-context";

const SUGGESTIONS = [
  "Impact of AI on software engineering",
  "Quantum computing in drug discovery",
  "Long-term effects of remote work on productivity",
  "Renewable energy adoption in emerging economies"
];

const CAPABILITIES = [
  { icon: Radar, label: "Web research", detail: "Multi-source evidence collection" },
  { icon: SearchCheck, label: "RAG retrieval", detail: "Semantic evidence selection" },
  { icon: ShieldCheck, label: "Citation integrity", detail: "Validated source IDs" },
  { icon: FlaskConical, label: "Self-refinement", detail: "Critic-driven follow-up research" },
  { icon: BookOpenCheck, label: "Final synthesis", detail: "Structured cited report" },
  { icon: WandSparkles, label: "Visual ready", detail: "Prepared for future visual explainers" }
];

export default function HomePage() {
  const router = useRouter();
  const { startResearch, isRunning, error, clearError } = useResearch();
  const [topic, setTopic] = useState("Impact of AI on software engineering");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTopic = topic.trim();
    if (normalizedTopic.length < 3 || isRunning) {
      return;
    }

    void startResearch(normalizedTopic);
    router.push("/workspace");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        {error && (
          <div className="mb-5">
            <ErrorBanner message={error} onClose={clearError} />
          </div>
        )}

        <section className="rf-grid overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-10 shadow-sm md:px-10 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mono-font mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Autonomous multi-agent research engine
            </div>

            <h1 className="heading-font mt-6 text-4xl font-bold tracking-[-0.035em] text-slate-950 md:text-5xl">
              Research deeply. <span className="text-indigo-600">Verify intelligently.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              ResearchForge plans, searches, retrieves evidence, critiques its own work, performs targeted follow-up research, and composes a cited final report.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" /> Evidence-backed findings</span>
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-indigo-600" /> Multi-agent synthesis</span>
              <span className="flex items-center gap-1.5"><FlaskConical size={14} className="text-amber-600" /> Critic + refinement loop</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-[0_15px_40px_rgba(79,70,229,0.10)]">
            <div className="p-4 md:p-5">
              <label htmlFor="research-topic" className="sr-only">Research topic</label>
              <textarea
                id="research-topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                rows={4}
                maxLength={300}
                placeholder="What would you like to research?"
                className="w-full resize-none border-0 bg-transparent text-base leading-7 text-slate-900 outline-none placeholder:text-slate-400 md:text-lg"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <span className="mono-font text-[10px] uppercase tracking-[0.12em] text-slate-400">Suggested</span>
                {SUGGESTIONS.slice(1).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setTopic(suggestion)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-indigo-100 bg-indigo-50/70 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="mono-font rounded-lg border border-indigo-100 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-indigo-700">
                  Deep research
                </span>
                <span className="mono-font rounded-lg border border-indigo-100 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600">
                  Up to 2 refinement rounds
                </span>
                <span className="mono-font rounded-lg border border-indigo-100 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600">
                  Trusted citation mapping
                </span>
              </div>

              <button
                type="submit"
                disabled={topic.trim().length < 3 || isRunning}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap size={17} />
                {isRunning ? "Research running" : "Start Autonomous Research"}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-slate-400">Engine Architecture</div>
              <h2 className="heading-font mt-1 text-2xl font-semibold tracking-tight text-slate-950">Multi-Agent Autonomous Pipeline</h2>
            </div>
            <span className="mono-font text-[10px] text-slate-400">Planner → Search → Research → Critic → Refine → Writer</span>
          </div>
          <AgentPipeline running={false} complete={false} />
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CAPABILITIES.map((capability) => {
            const Icon = capability.icon;
            return (
              <div key={capability.label} className="surface-card rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon size={17} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{capability.label}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-500">{capability.detail}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
