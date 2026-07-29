import type { RefObject, KeyboardEvent } from "react";
import type {
  AssistantAnswer,
  AssistantSuggestion,
  AssistantTopic,
} from "./engine";

export interface UseAssistant {
  /** Attach to the outermost element; drives outside-click dismissal. */
  containerRef: RefObject<HTMLDivElement | null>;
  query: string;
  setQuery: (value: string) => void;
  result: AssistantAnswer | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  thinking: boolean;
  starters: AssistantSuggestion[];
  topics: AssistantTopic[];
  ask: (value: string, topic?: string | null) => void;
  submit: () => void;
  choose: (suggestion: AssistantSuggestion) => void;
  close: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export function useAssistant(options?: {
  /** Must be a stable reference — a module-level const, not an inline literal. */
  links?: Record<string, string>;
  /** Topic ids to show before a question is asked. Must be a stable reference. */
  starterTopics?: string[];
  thinkingMs?: number;
}): UseAssistant;
