export interface AssistantSuggestion {
  label: string;
  /** Opens a known topic by id — chips prefer this, it cannot miss. */
  topic?: string;
  /** Resolved href. Rooted at "/" means a local route on this site. */
  href?: string;
  /** Free text pushed back through the matcher. */
  ask?: string;
  /** Symbolic link key, resolved against the site's link map. */
  link?: string;
}


export interface AssistantTable {
  title?: string;
  columns: string[];
  rows: string[][];
}

export interface AssistantTopic {
  id: string;
  title: string;
  terms: string[];
  boost?: number;
  summary?: string;
  answer: string;
  /** Ordered walkthrough, for surfaces with room to show one. */
  steps?: string[];
  details?: string[];
  /** Reference tables lifted from the product's own docs. */
  tables?: AssistantTable[];
  suggestions: AssistantSuggestion[];
}

export interface AssistantKnowledge {
  version: number;
  updated_at: string;
  links: Record<string, string>;
  starters: AssistantSuggestion[];
  topics: AssistantTopic[];
}

export interface AssistantAnswer {
  id: string;
  title: string;
  answer: string;
  steps?: string[];
  details?: string[];
  tables?: AssistantTable[];
  suggestions: AssistantSuggestion[];
}

export interface Assistant {
  answer(
    input?: string,
    options?: { topic?: string | null; lastTopic?: string | null },
  ): AssistantAnswer;
  starters: AssistantSuggestion[];
  topics: AssistantTopic[];
  links: Record<string, string>;
}

export function createAssistant(
  knowledge: AssistantKnowledge | null | undefined,
  options?: { links?: Record<string, string> },
): Assistant;
