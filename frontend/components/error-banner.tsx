"use client";

import { AlertTriangle, X } from "lucide-react";

export function ErrorBanner({ message, onClose }: { message: string; onClose?: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <AlertTriangle className="mt-0.5 shrink-0" size={17} />
      <p className="flex-1 leading-6">{message}</p>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss error" className="text-red-500 hover:text-red-700">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
