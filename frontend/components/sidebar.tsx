"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  FileText,
  FlaskConical,
  Library,
  PlusCircle,
  Settings,
  Sparkles
} from "lucide-react";

import { useResearch } from "@/context/research-context";

const NAV_ITEMS = [
  { href: "/", label: "New Research", icon: PlusCircle },
  { href: "/workspace", label: "Workspace", icon: Boxes },
  { href: "/findings", label: "Findings", icon: BookOpen },
  { href: "/critique", label: "Critic & Refinement", icon: FlaskConical },
  { href: "/report", label: "Final Report", icon: FileText },
  { href: "/sources", label: "Sources Library", icon: Library }
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { research, isRunning } = useResearch();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[#1e293b] bg-[#0b0f17] text-slate-200 lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-[#1e293b] px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/25 bg-indigo-500/10 text-indigo-300">
          <Sparkles size={18} />
        </div>
        <div>
          <div className="heading-font text-[15px] font-semibold text-white">ResearchForge</div>
          <div className="mono-font text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Cognitive Synthesis Engine
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
              }`}
            >
              <Icon size={17} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-6">
          <div className="mono-font px-3 text-[10px] uppercase tracking-[0.16em] text-slate-600">
            Current Session
          </div>
          <div className="mt-2 rounded-lg border border-slate-800 bg-slate-900/55 px-3 py-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span
                className={`h-2 w-2 rounded-full ${
                  isRunning ? "bg-amber-400 rf-pulse" : research ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
              {isRunning ? "Research running" : research ? "Research ready" : "No active research"}
            </div>
            {research && (
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                {research.topic}
              </p>
            )}
          </div>
        </div>
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500">
          <Settings size={16} />
          <span>Settings</span>
        </div>
        <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-300">
            RF
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-200">Research Workspace</div>
            <div className="mono-font text-[10px] text-slate-600">LOCAL SESSION</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
