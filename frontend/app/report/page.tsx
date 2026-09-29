"use client";

import { useState } from "react";
import {
  Check,
  Clipboard,
  ExternalLink,
  FileText,
  ImageIcon,
  Printer,
  ShieldCheck
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { CitationBadge } from "@/components/citation-badge";
import { ReportVisual } from "@/components/report-visual";
import { ResearchEmpty } from "@/components/research-empty";
import { WorkspaceTabs } from "@/components/workspace-tabs";
import { useResearch } from "@/context/research-context";
import {
  buildPlainTextReport,
  getRetrievedVisualForSourceIds
} from "@/lib/research-utils";


export default function ReportPage() {
  const {
    research,
    selectSource
  } = useResearch();

  const [
    copied,
    setCopied
  ] = useState(false);

  if (!research) {
    return (
      <AppShell>
        <ResearchEmpty
          title="No final report available"
        />
      </AppShell>
    );
  }

  async function copyReport() {
    if (!research) {
      return;
    }

    await navigator.clipboard.writeText(
      buildPlainTextReport(research)
    );

    setCopied(true);

    window.setTimeout(
      () => setCopied(false),
      1800
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="no-print flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-indigo-600">
              Verified synthesis dossier
            </div>

            <h1 className="heading-font mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Final Research Report
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              A backend-validated report with
              section-level source mappings and
              supporting research visuals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyReport}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copied ? (
                <Check
                  size={14}
                  className="text-emerald-600"
                />
              ) : (
                <Clipboard size={14} />
              )}

              {copied
                ? "Copied"
                : "Copy report"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
          </div>
        </div>

        <div className="no-print mt-5">
          <WorkspaceTabs />
        </div>

        <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,860px)_320px] xl:justify-center">
          <article className="surface-card rounded-2xl px-5 py-7 md:px-9 md:py-10">
            <div className="border-b border-slate-200 pb-7">
              <div className="mono-font flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                <span>
                  Research ID{" "}
                  {research.research_id}
                </span>

                <span>•</span>

                <span>
                  {
                    research.report.sources
                      .length
                  }{" "}
                  validated references
                </span>
              </div>

              <h2 className="heading-font mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950 md:text-4xl">
                {research.report.title}
              </h2>

              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/65 p-5">
                <div className="mono-font text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
                  Executive summary
                </div>

                <p className="mt-3 text-[15px] leading-7 text-slate-700">
                  {
                    research.report
                      .executive_summary
                  }
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {research.report.sections.map(
                (section, index) => {
                  const visual =
                    section.visual ??
                    getRetrievedVisualForSourceIds(
                      research,
                      section.source_ids
                    );

                  return (
                    <section
                      key={`${section.heading}-${index}`}
                      className="py-8"
                    >
                      <div className="flex gap-4">
                        <div className="mono-font mt-1 hidden w-8 shrink-0 text-[11px] font-semibold text-indigo-500 sm:block">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="heading-font text-xl font-semibold leading-8 text-slate-950 md:text-2xl">
                            {section.heading}
                          </h3>

                          <p className="mt-4 text-[15px] leading-8 text-slate-700">
                            {section.content}
                          </p>

                          <ReportVisual
                            visual={visual}
                          />

                          <div className="mt-5 flex flex-wrap items-center gap-2">
                            <span className="mono-font mr-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                              Section evidence
                            </span>

                            {section.source_ids.map(
                              (sourceId) => (
                                <CitationBadge
                                  key={sourceId}
                                  sourceId={
                                    sourceId
                                  }
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }
              )}
            </div>

            <section className="border-t border-slate-200 pt-8">
              <h3 className="heading-font text-2xl font-semibold text-slate-950">
                Conclusion
              </h3>

              <p className="mt-4 text-[15px] leading-8 text-slate-700">
                {research.report.conclusion}
              </p>
            </section>

            <section className="mt-9 border-t border-slate-200 pt-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    Evidence index
                  </div>

                  <h3 className="heading-font mt-1 text-2xl font-semibold text-slate-950">
                    Complete References
                  </h3>
                </div>

                <span className="mono-font text-[10px] text-slate-400">
                  {
                    research.report.sources
                      .length
                  }{" "}
                  sources
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {research.report.sources.map(
                  (source) => (
                    <button
                      key={source.source_id}
                      type="button"
                      onClick={() =>
                        selectSource(
                          source.source_id
                        )
                      }
                      className="flex w-full items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/45"
                    >
                      <span className="mono-font mt-0.5 shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                        {source.source_id}
                      </span>

                      <span className="min-w-0 flex-1 text-xs leading-5 text-slate-600">
                        {source.title}
                      </span>

                      <ExternalLink
                        size={13}
                        className="mt-1 shrink-0 text-slate-400"
                      />
                    </button>
                  )
                )}
              </div>
            </section>
          </article>

          <aside className="no-print space-y-4 xl:sticky xl:top-24">
            <div className="chrome-card rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <ShieldCheck size={15} />
                Research quality
              </div>

              <div className="mt-3 flex items-end gap-2">
                <div className="heading-font text-4xl font-semibold text-white">
                  {
                    research.critique
                      .overall_score
                  }
                </div>

                <span className="pb-1 text-sm text-slate-400">
                  /10
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                {
                  research.critique
                    .strengths[0]
                }
              </p>
            </div>

            <div className="surface-card rounded-xl p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FileText
                  size={15}
                  className="text-indigo-600"
                />
                Report telemetry
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    Sections
                  </span>

                  <span className="mono-font font-semibold text-slate-900">
                    {
                      research.report
                        .sections.length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    References
                  </span>

                  <span className="mono-font font-semibold text-slate-900">
                    {
                      research.report
                        .sources.length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">
                    Refinement rounds
                  </span>

                  <span className="mono-font font-semibold text-slate-900">
                    {
                      research
                        .refinement_history
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50/55 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-950">
                <ImageIcon
                  size={16}
                  className="text-indigo-600"
                />
                Research visuals
              </div>

              <p className="mt-2 text-xs leading-5 text-indigo-950/65">
                Relevant visuals retrieved from
                cited source pages are
                automatically attached to report
                sections when available.
              </p>

              <div className="mono-font mt-3 text-[10px] uppercase tracking-[0.1em] text-indigo-500">
                Source-linked visuals enabled
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}