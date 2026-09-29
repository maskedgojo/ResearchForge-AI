"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/workspace", label: "Overview" },
  { href: "/findings", label: "Findings" },
  { href: "/critique", label: "Critique & Refinement" },
  { href: "/report", label: "Final Report" },
  { href: "/sources", label: "Sources" }
] as const;

export function WorkspaceTabs() {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto border-b border-slate-200">
      <nav className="flex min-w-max gap-1">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`border-b-2 px-3 py-3 text-sm font-medium transition ${
                active
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
