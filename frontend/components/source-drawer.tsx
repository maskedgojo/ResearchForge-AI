"use client";

import {
  useState
} from "react";

import {
  ExternalLink,
  ImageIcon,
  Maximize2,
  ShieldCheck,
  X
} from "lucide-react";

import { ImageLightbox } from "@/components/image-lightbox";

import { useResearch } from "@/context/research-context";

import {
  formatSourceType,
  getSourceById
} from "@/lib/research-utils";


type PreviewImage = {
  url: string;
  description: string;
} | null;


export function SourceDrawer() {
  const {
    research,
    selectedSourceId,
    selectSource
  } = useResearch();

  const [
    previewImage,
    setPreviewImage
  ] = useState<PreviewImage>(
    null
  );

  const source = getSourceById(
    research,
    selectedSourceId
  );

  if (!source) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-[2px]"
        onClick={() =>
          selectSource(null)
        }
      >
        <aside
          className="absolute bottom-0 right-0 top-0 w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="mono-font rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700">
                {source.source_id}
              </span>

              <h2 className="heading-font mt-4 text-xl font-semibold leading-7 text-slate-950">
                {source.title}
              </h2>
            </div>

            <button
              type="button"
              aria-label="Close source panel"
              onClick={() =>
                selectSource(null)
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <X size={16} />
            </button>
          </div>

          {source.images.length > 0 && (
            <section className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ImageIcon
                  size={15}
                  className="text-indigo-600"
                />

                Source visuals
              </div>

              <div className="mt-3 grid gap-3">
                {source.images.map(
                  (image, index) => {
                    const caption =
                      image.description ||
                      source.title;

                    return (
                      <figure
                        key={`${image.url}-${index}`}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImage(
                              {
                                url:
                                  image.url,
                                description:
                                  caption
                              }
                            )
                          }
                          className="group relative flex w-full items-center justify-center bg-slate-100 p-2"
                          aria-label="Open source image"
                        >
                          <img
                            src={image.url}
                            alt={caption}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="max-h-64 h-auto w-auto max-w-full object-contain"
                          />

                          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-slate-950/65 px-2 py-1 text-[9px] font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                            <Maximize2
                              size={10}
                            />

                            View
                          </div>
                        </button>

                        {image.description && (
                          <figcaption className="border-t border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-500">
                            {
                              image.description
                            }
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                )}
              </div>

              <p className="mt-2 text-[10px] leading-4 text-slate-400">
                Visuals were retrieved
                from this source page and
                are shown for supporting
                context.
              </p>
            </section>
          )}

          <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">
                Domain
              </span>

              <span className="font-medium text-slate-900">
                {source.domain}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">
                Source type
              </span>

              <span className="font-medium text-slate-900">
                {formatSourceType(
                  source.source_type
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">
                Authority signal
              </span>

              <span className="font-medium capitalize text-slate-900">
                {
                  source.quality_label
                }
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">
                Quality score
              </span>

              <span className="mono-font font-semibold text-slate-900">
                {(
                  source.quality_score *
                  100
                ).toFixed(0)}
                %
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">
                Primary source
              </span>

              <span
                className={
                  source.is_primary
                    ? "font-medium text-emerald-700"
                    : "font-medium text-slate-700"
                }
              >
                {source.is_primary
                  ? "Yes"
                  : "No"}
              </span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900">
              <ShieldCheck
                size={16}
              />

              Source authority signal
            </div>

            <p className="mt-2 text-xs leading-5 text-indigo-900/70">
              This score is a ranking
              signal used by
              ResearchForge. It is not
              an absolute claim that a
              source is factually
              correct.
            </p>
          </div>

          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Open source

            <ExternalLink size={15} />
          </a>
        </aside>
      </div>

      {previewImage && (
        <ImageLightbox
          open
          imageUrl={
            previewImage.url
          }
          caption={
            previewImage.description
          }
          provenance={`${source.source_id} · ${source.domain}`}
          onClose={() =>
            setPreviewImage(null)
          }
        />
      )}
    </>
  );
}