import type {
  PublicSource,
  ReportVisual,
  ResearchAnalysisResponse,
  SourceReference
} from "@/types/research";


export function getSourceById(
  research: ResearchAnalysisResponse | null,
  sourceId: string | null
): PublicSource | null {
  if (!research || !sourceId) {
    return null;
  }

  return (
    research.sources.find(
      (source) => source.source_id === sourceId
    ) ?? null
  );
}


export function getUsedSourceIds(
  research: ResearchAnalysisResponse | null
): Set<string> {
  if (!research) {
    return new Set();
  }

  return new Set(
    research.findings.flatMap(
      (finding) => finding.source_ids
    )
  );
}


export function getRetrievedVisualForSourceIds(
  research: ResearchAnalysisResponse,
  sourceIds: string[]
): ReportVisual | undefined {
  for (const sourceId of sourceIds) {
    const source = research.sources.find(
      (candidate) =>
        candidate.source_id === sourceId
    );

    if (!source || source.images.length === 0) {
      continue;
    }

    const image = source.images[0];

    return {
      type: "retrieved_image",
      url: image.url,
      caption:
        image.description ||
        source.title,
      provenance: `${source.source_id} · ${source.domain}`
    };
  }

  return undefined;
}


export function formatSourceType(
  sourceType: string
): string {
  return sourceType
    .split("_")
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase()
        + part.slice(1)
    )
    .join(" ");
}


export function buildPlainTextReport(
  research: ResearchAnalysisResponse
): string {
  const lines = [
    research.report.title,
    "",
    "Executive Summary",
    research.report.executive_summary,
    ""
  ];

  research.report.sections.forEach(
    (section, index) => {
      lines.push(
        `${index + 1}. ${section.heading}`
      );

      lines.push(
        section.content
      );

      if (section.sources.length > 0) {
        lines.push(
          `Sources: ${section.sources
            .map(
              (source) =>
                `[${source.source_id}] ${source.title}`
            )
            .join("; ")}`
        );
      }

      lines.push("");
    }
  );

  lines.push("Conclusion");
  lines.push(research.report.conclusion);
  lines.push("");
  lines.push("References");

  research.report.sources.forEach(
    (source: SourceReference) => {
      lines.push(
        `[${source.source_id}] ${source.title} — ${source.url}`
      );
    }
  );

  return lines.join("\n");
}