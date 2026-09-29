"use client";

import { useEffect } from "react";
import {
  ExternalLink,
  X,
  ZoomIn
} from "lucide-react";


type ImageLightboxProps = {
  open: boolean;
  imageUrl: string;
  caption: string;
  provenance?: string;
  onClose: () => void;
};


export function ImageLightbox({
  open,
  imageUrl,
  caption,
  provenance,
  onClose
}: ImageLightboxProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm md:p-8"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-7xl flex-col"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <ZoomIn size={15} />

              Image preview
            </div>

            {provenance && (
              <div className="mono-font mt-1 truncate text-[10px] uppercase tracking-[0.1em] text-slate-400">
                {provenance}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-9 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-xs font-medium text-white transition hover:bg-white/15"
            >
              <ExternalLink size={14} />

              Open original
            </a>

            <button
              type="button"
              aria-label="Close image preview"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-white/5">
          <img
            src={imageUrl}
            alt={caption}
            referrerPolicy="no-referrer"
            className="max-h-[calc(100vh-160px)] max-w-full object-contain"
          />
        </div>

        {caption && (
          <div className="mx-auto mt-3 max-w-4xl text-center text-xs leading-5 text-slate-300">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}