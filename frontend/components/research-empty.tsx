import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";

export function ResearchEmpty({ title = "No research result yet" }: { title?: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <FlaskConical size={22} />
      </div>
      <h2 className="heading-font mt-4 text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Start a research session first. ResearchForge will populate this view with findings, critique, citations, and the final report.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <ArrowLeft size={15} />
        New research
      </Link>
    </div>
  );
}
