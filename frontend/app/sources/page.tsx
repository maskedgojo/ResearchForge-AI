"use client";

import { useMemo, useState } from "react";
import {
  Database,
  Filter,
  Search,
  ShieldCheck,
  Star
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ResearchEmpty } from "@/components/research-empty";
import { WorkspaceTabs } from "@/components/workspace-tabs";
import { useResearch } from "@/context/research-context";
import {
  formatSourceType,
  getUsedSourceIds
} from "@/lib/research-utils";

type QualityFilter = "all" | "high" | "medium_high" | "medium" | "low";
type PrimaryFilter = "all" | "primary" | "secondary";

export default function SourcesPage() {
  const { research, selectSource } = useResearch();
  const [query, setQuery] = useState("");
  const [quality, setQuality] = useState<QualityFilter>("all");
  const [primary, setPrimary] = useState<PrimaryFilter>("all");

  if (!research) {
    return (
      <AppShell>
        <ResearchEmpty title="No evidence library available" />
      </AppShell>
    );
  }

  const usedSourceIds = getUsedSourceIds(research);

  const filteredSources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...research.sources]
      .filter((source) => {
        const matchesQuery =
          !normalizedQuery ||
          source.title.toLowerCase().includes(normalizedQuery) ||
          source.domain.toLowerCase().includes(normalizedQuery) ||
          source.source_id.toLowerCase().includes(normalizedQuery);

        const matchesQuality = quality === "all" || source.quality_label === quality;
        const matchesPrimary =
          primary === "all" ||
          (primary === "primary" && source.is_primary) ||
          (primary === "secondary" && !source.is_primary);

        return matchesQuery && matchesQuality && matchesPrimary;
      })
      .sort((a, b) => {
        const usedDelta = Number(usedSourceIds.has(b.source_id)) - Number(usedSourceIds.has(a.source_id));
        if (usedDelta !== 0) {
          return usedDelta;
        }
        return b.quality_score - a.quality_score;
      });
  }, [primary, quality, query, research.sources, usedSourceIds]);

  const primaryCount = research.sources.filter((source) => source.is_primary).length;
  const highAuthorityCount = research.sources.filter((source) => source.quality_score >= 0.85).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-indigo-600">Evidence provenance</div>
            <h1 className="heading-font mt-2 text-3xl font-semibold tracking-tight text-slate-950">Evidence Library & Citation Graph</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Browse every normalized source collected for this research session. Raw scraped article text stays inside the backend and RAG pipeline.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="mono-font rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">{research.sources.length} collected</span>
            <span className="mono-font rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-[10px] text-emerald-700">{usedSourceIds.size} cited</span>
          </div>
        </div>

        <div className="mt-5">
          <WorkspaceTabs />
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-card rounded-xl p-4">
            <Database size={17} className="text-indigo-600" />
            <div className="heading-font mt-3 text-2xl font-semibold text-slate-950">{research.sources.length}</div>
            <div className="mt-1 text-xs text-slate-500">Unique source records</div>
          </div>
          <div className="surface-card rounded-xl p-4">
            <ShieldCheck size={17} className="text-emerald-600" />
            <div className="heading-font mt-3 text-2xl font-semibold text-slate-950">{primaryCount}</div>
            <div className="mt-1 text-xs text-slate-500">Primary-source signals</div>
          </div>
          <div className="surface-card rounded-xl p-4">
            <Star size={17} className="text-amber-500" />
            <div className="heading-font mt-3 text-2xl font-semibold text-slate-950">{highAuthorityCount}</div>
            <div className="mt-1 text-xs text-slate-500">High-authority signals</div>
          </div>
          <div className="surface-card rounded-xl p-4">
            <Filter size={17} className="text-cyan-600" />
            <div className="heading-font mt-3 text-2xl font-semibold text-slate-950">{filteredSources.length}</div>
            <div className="mt-1 text-xs text-slate-500">Visible after filters</div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1 lg:max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sources by title, domain, or source ID"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={quality}
                onChange={(event) => setQuality(event.target.value as QualityFilter)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-300"
              >
                <option value="all">All quality levels</option>
                <option value="high">High</option>
                <option value="medium_high">Medium-high</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={primary}
                onChange={(event) => setPrimary(event.target.value as PrimaryFilter)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-300"
              >
                <option value="all">All provenance</option>
                <option value="primary">Primary only</option>
                <option value="secondary">Secondary only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 mono-font text-[10px] uppercase tracking-[0.1em] text-slate-400">ID</th>
                  <th className="px-4 py-3 mono-font text-[10px] uppercase tracking-[0.1em] text-slate-400">Source</th>
                  <th className="px-4 py-3 mono-font text-[10px] uppercase tracking-[0.1em] text-slate-400">Type</th>
                  <th className="px-4 py-3 mono-font text-[10px] uppercase tracking-[0.1em] text-slate-400">Authority signal</th>
                  <th className="px-4 py-3 mono-font text-[10px] uppercase tracking-[0.1em] text-slate-400">Primary</th>
                  <th className="px-4 py-3 mono-font text-[10px] uppercase tracking-[0.1em] text-slate-400">Usage</th>
                </tr>
              </thead>
              <tbody>
                {filteredSources.map((source) => (
                  <tr
                    key={source.source_id}
                    onClick={() => selectSource(source.source_id)}
                    className="cursor-pointer border-b border-slate-100 transition last:border-0 hover:bg-indigo-50/35"
                  >
                    <td className="px-4 py-3.5 align-top">
                      <span className="mono-font rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">{source.source_id}</span>
                    </td>
                    <td className="max-w-xl px-4 py-3.5 align-top">
                      <div className="text-sm font-medium leading-5 text-slate-900">{source.title}</div>
                      <div className="mono-font mt-1 text-[10px] text-slate-400">{source.domain}</div>
                    </td>
                    <td className="px-4 py-3.5 align-top text-xs text-slate-600">{formatSourceType(source.source_type)}</td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.round(source.quality_score * 100)}%` }} />
                        </div>
                        <span className="mono-font text-[10px] font-semibold text-slate-600">{Math.round(source.quality_score * 100)}%</span>
                      </div>
                      <div className="mt-1 text-[10px] capitalize text-slate-400">{source.quality_label.replaceAll("_", " ")}</div>
                    </td>
                    <td className="px-4 py-3.5 align-top text-xs">
                      <span className={source.is_primary ? "text-emerald-700" : "text-slate-400"}>{source.is_primary ? "Yes" : "No"}</span>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      {usedSourceIds.has(source.source_id) ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">Cited</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">Collected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSources.length === 0 && (
            <div className="p-10 text-center text-sm text-slate-500">No sources match the current filters.</div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
