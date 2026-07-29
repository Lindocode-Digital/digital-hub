import type { AssistantKnowledge } from "./engine";

/** Resolves to the freshest usable knowledge base. Never rejects. */
export function loadKnowledge(): Promise<AssistantKnowledge>;
