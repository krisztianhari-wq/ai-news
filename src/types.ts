export type CategoryId =
  | "models-releases"
  | "research"
  | "agents-tools"
  | "ai-security"
  | "ai-threats"
  | "safety-evals"
  | "policy-regulation"
  | "industry-compute"
  | "incidents-society";

export interface Category { id: CategoryId; name: string; short: string }

export interface NewsItem {
  id: string;
  title: string;
  /** Original headline when `title` is an English translation */
  originalTitle?: string;
  url: string;
  source: string;
  published: string;
  category: CategoryId;
  summary: string;
  relevance: number;
  tags: string[];
  date?: string;
}

export interface FeedStatus { name: string; ok: boolean; items?: number; error?: string }

export interface DayFile {
  date: string;
  generatedAt: string;
  model: string | null;
  itemCount: number;
  feeds: FeedStatus[];
  items: NewsItem[];
}

export interface IndexFile {
  builtAt: string;
  days: { date: string; itemCount: number }[];
  items: NewsItem[];
}
