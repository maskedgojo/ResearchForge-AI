export type SourceReference = {
  source_id: string;
  title: string;
  url: string;
};

export type SourceImage = {
  url: string;
  description: string;
};

export type PublicSource = SourceReference & {
  domain: string;
  source_type: string;
  quality_score: number;
  quality_label: string;
  is_primary: boolean;
  images: SourceImage[];
};

export type ResearchFinding = {
  question: string;
  summary: string;
  key_points: string[];
  source_ids: string[];
  sources: SourceReference[];
};

export type CriticFeedback = {
  overall_score: number;
  strengths: string[];
  missing_points: string[];
  recommendations: string[];
};

export type RefinementRound = {
  round: number;
  questions: string[];
  score_before: number | null;
  score_after: number | null;
  missing_points_before: string[];
  missing_points_after: string[];
};

export type ReportSource = SourceReference;

export type ReportVisual = {
  type: "retrieved_image" | "generated_visual" | "chart";
  url: string;
  caption: string;
  provenance?: string;
};

export type ReportSection = {
  heading: string;
  content: string;
  source_ids: string[];
  sources: ReportSource[];
  visual?: ReportVisual;
};

export type ResearchReport = {
  title: string;
  executive_summary: string;
  sections: ReportSection[];
  conclusion: string;
  sources: ReportSource[];
};

export type ResearchAnalysisResponse = {
  research_id: string;
  topic: string;
  questions: string[];
  sources: PublicSource[];
  findings: ResearchFinding[];
  critique: CriticFeedback;
  refinement_history: RefinementRound[];
  report: ResearchReport;
};