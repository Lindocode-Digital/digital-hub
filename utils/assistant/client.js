/**
 * Loads the assistant knowledge base from the Lazy Appz API.
 *
 * The bundled snapshot answers immediately on first paint; the live copy is
 * fetched in the background and swapped in when it arrives. Every failure path
 * ends at the bundled copy, so the assistant degrades to slightly stale answers
 * instead of breaking.
 */

import { BUNDLED_KNOWLEDGE } from "./knowledge";

const ENDPOINT =
  process.env.NEXT_PUBLIC_ASSISTANT_ENDPOINT ||
  "https://api.lazy-appz.lindocode.com/api/lazy-appz/assistant";

const CACHE_KEY = "lindocode.assistant.knowledge";
const CACHE_TTL = 60 * 60 * 1000; // Matches the endpoint's max-age.
const TIMEOUT = 4000;

// Survives route changes within a session; one fetch per page load at most.
let inFlight = null;

/** A payload we would rather ignore than render. */
function isUsable(data) {
  return Boolean(
    data &&
      typeof data.version === "number" &&
      Array.isArray(data.topics) &&
      data.topics.length > 0 &&
      data.topics.every((topic) => topic.id && topic.title && topic.answer) &&
      data.links,
  );
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const { storedAt, data } = JSON.parse(raw);
    if (Date.now() - storedAt > CACHE_TTL) return null;

    return isUsable(data) ? data : null;
  } catch {
    // Private mode, quota, or malformed entry - the network path still works.
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ storedAt: Date.now(), data }),
    );
  } catch {
    // Caching is an optimisation; losing it changes nothing.
  }
}

/**
 * Resolves to the freshest usable knowledge base. Never rejects, and never
 * returns something the engine cannot render.
 */
export function loadKnowledge() {
  if (typeof window === "undefined") return Promise.resolve(BUNDLED_KNOWLEDGE);
  if (inFlight) return inFlight;

  const cached = readCache();
  if (cached) return Promise.resolve(cached);

  inFlight = fetch(ENDPOINT, {
    signal: AbortSignal.timeout(TIMEOUT),
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!isUsable(data)) throw new Error("unusable payload");

      // An older payload than the one we shipped is a rollback, not an update.
      if (data.version < BUNDLED_KNOWLEDGE.version) return BUNDLED_KNOWLEDGE;

      writeCache(data);
      return data;
    })
    .catch(() => BUNDLED_KNOWLEDGE);

  return inFlight;
}
