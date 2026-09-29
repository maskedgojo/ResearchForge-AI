import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  helper,
  icon: Icon
}: {
  label: string;
  value: string | number;
  helper?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="surface-card rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mono-font text-[10px] uppercase tracking-[0.12em] text-slate-400">
            {label}
          </div>
          <div className="heading-font mt-2 text-2xl font-semibold text-slate-950">{value}</div>
          {helper && <div className="mt-1 text-xs text-slate-500">{helper}</div>}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon size={17} />
          </div>
        )}
      </div>
    </div>
  );
}
