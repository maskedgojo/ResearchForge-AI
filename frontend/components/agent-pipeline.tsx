"use client";

import {
  BookOpenCheck,
  Check,
  FlaskConical,
  Radar,
  SearchCheck,
  ShieldAlert,
  Sparkles
} from "lucide-react";

const AGENTS = [
  { name: "Planner", subtitle: "Decompose topic", icon: Sparkles },
  { name: "Search", subtitle: "Collect evidence", icon: Radar },
  { name: "Researcher", subtitle: "Synthesize findings", icon: SearchCheck },
  { name: "Critic", subtitle: "Audit quality", icon: ShieldAlert },
  { name: "Refiner", subtitle: "Close evidence gaps", icon: FlaskConical },
  { name: "Writer", subtitle: "Compose report", icon: BookOpenCheck }
] as const;

export function AgentPipeline({ running, complete }: { running: boolean; complete: boolean }) {
  return (
    <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
      {AGENTS.map((agent, index) => {
        const Icon = agent.icon;
        const status = complete ? "complete" : running ? "running" : "waiting";

        return (
          <div
            key={agent.name}
            className={`relative rounded-xl border p-3.5 ${
              status === "complete"
                ? "border-emerald-200 bg-emerald-50/45"
                : status === "running"
                  ? "border-indigo-200 bg-indigo-50/55"
                  : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  status === "complete"
                    ? "bg-emerald-100 text-emerald-700"
                    : status === "running"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {status === "complete" ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <span className="mono-font text-[10px] text-slate-400">0{index + 1}</span>
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-900">{agent.name}</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">{agent.subtitle}</div>
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "complete"
                    ? "bg-emerald-500"
                    : status === "running"
                      ? "bg-indigo-500 rf-pulse"
                      : "bg-slate-300"
                }`}
              />
              <span className="mono-font text-[10px] uppercase tracking-wide text-slate-500">
                {status === "complete" ? "Complete" : status === "running" ? "Processing" : "Waiting"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
