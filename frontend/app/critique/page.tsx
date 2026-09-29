"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Gauge,
  Lightbulb,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ResearchEmpty } from "@/components/research-empty";
import { WorkspaceTabs } from "@/components/workspace-tabs";
import { useResearch } from "@/context/research-context";

export default function CritiquePage() {
  const { research } = useResearch();

  if (!research) {
    return (
      <AppShell>
        <ResearchEmpty title="No critic audit available" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-amber-600">Adversarial quality audit</div>
            <h1 className="heading-font mt-2 text-3xl font-semibold tracking-tight text-slate-950">Critic Agent & Refinement Loop</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              The Critic evaluates completeness, evidence quality, source support, missing perspectives, and opportunities for targeted follow-up research.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <Gauge size={18} className="text-indigo-600" />
            <div>
              <div className="mono-font text-[10px] uppercase tracking-[0.1em] text-indigo-500">Final quality</div>
              <div className="heading-font text-xl font-semibold text-indigo-950">{research.critique.overall_score}/10</div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <WorkspaceTabs />
        </div>

        <section className="mt-6 grid gap-4 xl:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
              <ShieldCheck size={16} /> Strengths
            </div>
            <div className="mt-4 space-y-3">
              {research.critique.strengths.map((item) => (
                <div key={item} className="flex gap-2.5 text-xs leading-5 text-emerald-950/75">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/65 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <AlertCircle size={16} /> Remaining gaps
            </div>
            <div className="mt-4 space-y-3">
              {research.critique.missing_points.length > 0 ? (
                research.critique.missing_points.map((item) => (
                  <div key={item} className="flex gap-2.5 text-xs leading-5 text-amber-950/75">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs leading-5 text-amber-900/65">No significant missing points were returned.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50/65 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-900">
              <Lightbulb size={16} /> Recommendations
            </div>
            <div className="mt-4 space-y-3">
              {research.critique.recommendations.length > 0 ? (
                research.critique.recommendations.map((item) => (
                  <div key={item} className="flex gap-2.5 text-xs leading-5 text-sky-950/75">
                    <Sparkles size={13} className="mt-0.5 shrink-0 text-sky-600" />
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs leading-5 text-sky-900/65">No additional recommendations were required.</p>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-slate-400">Research lineage</div>
              <h2 className="heading-font mt-1 text-xl font-semibold text-slate-950">Autonomous refinement history</h2>
            </div>
            <span className="mono-font rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">
              {research.refinement_history.length} round{research.refinement_history.length === 1 ? "" : "s"}
            </span>
          </div>

          {research.refinement_history.length === 0 ? (
            <div className="surface-card rounded-xl p-6 text-sm leading-6 text-slate-500">
              The initial research passed the refinement threshold, so no additional research round was required.
            </div>
          ) : (
            <div className="space-y-4">
              {research.refinement_history.map((round) => (
                <article key={round.round} className="surface-card rounded-xl p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        <FlaskConical size={18} />
                      </div>
                      <div>
                        <div className="heading-font text-lg font-semibold text-slate-950">Refinement Round {round.round}</div>
                        <div className="mono-font mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Targeted evidence recovery</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                      <div className="text-center">
                        <div className="mono-font text-[10px] text-slate-400">BEFORE</div>
                        <div className="heading-font text-xl font-semibold text-slate-900">{round.score_before ?? "–"}</div>
                      </div>
                      <ArrowRight size={16} className="text-slate-400" />
                      <div className="text-center">
                        <div className="mono-font text-[10px] text-slate-400">AFTER</div>
                        <div className="heading-font text-xl font-semibold text-indigo-700">{round.score_after ?? "–"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-amber-100 bg-amber-50/45 p-4">
                      <div className="text-sm font-semibold text-amber-900">Gaps identified before the round</div>
                      <div className="mt-3 space-y-2">
                        {round.missing_points_before.map((item) => (
                          <div key={item} className="flex gap-2 text-xs leading-5 text-amber-950/70">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/45 p-4">
                      <div className="text-sm font-semibold text-indigo-900">Generated follow-up questions</div>
                      <div className="mt-3 space-y-2.5">
                        {round.questions.map((question, questionIndex) => (
                          <div key={question} className="flex gap-2.5 text-xs leading-5 text-indigo-950/75">
                            <span className="mono-font mt-0.5 text-[10px] font-semibold text-indigo-500">Q{questionIndex + 1}</span>
                            <span>{question}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-900">Critic status after this round</div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {round.missing_points_after.length > 0 ? (
                        round.missing_points_after.map((item) => (
                          <div key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                            <span>{item}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-emerald-700">
                          <CheckCircle2 size={14} /> No remaining gaps were recorded.
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
