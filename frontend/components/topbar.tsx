"use client";

import Link from "next/link";
import { Bell, FileText, Search, Sparkles } from "lucide-react";

import { useResearch } from "@/context/research-context";

export function Topbar() {
  const { research, isRunning } = useResearch();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/92 px-4 backdrop-blur-md md:px-6 lg:ml-[248px]">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles size={16} />
          </div>
          <span className="heading-font hidden text-sm font-semibold sm:inline">ResearchForge</span>
        </Link>
        <div className="hidden h-5 w-px bg-slate-200 lg:block" />
        <div className="hidden min-w-0 md:block">
          <div className="mono-font text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Synthesis Stream
          </div>
          <div className="max-w-[420px] truncate text-sm font-medium text-slate-800">
            {isRunning ? "Multi-agent research in progress" : research?.topic ?? "Research workspace"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 xl:flex">
          <Search size={14} />
          Search synthesized intelligence
          <span className="mono-font rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            ⌘K
          </span>
        </div>
        {research && (
          <Link
            href="/report"
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:flex"
          >
            <FileText size={14} />
            Report
          </Link>
        )}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        >
          <Bell size={15} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
        </button>
      </div>
    </header>
  );
}
