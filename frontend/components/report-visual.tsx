"use client";

import {
  useEffect,
  useState
} from "react";

import { Maximize2 } from "lucide-react";

import { ImageLightbox } from "@/components/image-lightbox";

import type {
  ReportVisual as ReportVisualType
} from "@/types/research";


export function ReportVisual({
  visual
}: {
  visual?: ReportVisualType;
}) {
  const [failed, setFailed] = useState(
    false
  );

  const [previewOpen, setPreviewOpen] =
    useState(false);

  useEffect(() => {
    setFailed(false);
    setPreviewOpen(false);
  }, [visual?.url]);

  if (!visual || failed) {
    return null;
  }

  return (
    <>
      <figure className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() =>
            setPreviewOpen(true)
          }
          className="group relative flex w-full items-center justify-center bg-slate-100 p-3"
          aria-label="Open image preview"
        >
          <img
            src={visual.url}
            alt={visual.caption}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() =>
              setFailed(true)
            }
            className="max-h-[560px] h-auto w-auto max-w-full object-contain"
          />

          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-white/30 bg-slate-950/65 px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
            <Maximize2 size={12} />

            View image
          </div>
        </button>

        <figcaption className="border-t border-slate-200 bg-white px-4 py-3">
          <div className="text-xs font-medium leading-5 text-slate-700">
            {visual.caption}
          </div>

          <div className="mono-font mt-1 text-[10px] uppercase tracking-[0.1em] text-slate-400">
            {visual.type ===
            "retrieved_image"
              ? "Retrieved source visual"
              : visual.type.replaceAll(
                  "_",
                  " "
                )}

            {visual.provenance
              ? ` · ${visual.provenance}`
              : ""}
          </div>
        </figcaption>
      </figure>

      <ImageLightbox
        open={previewOpen}
        imageUrl={visual.url}
        caption={visual.caption}
        provenance={visual.provenance}
        onClose={() =>
          setPreviewOpen(false)
        }
      />
    </>
  );
}