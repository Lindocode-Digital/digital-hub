/**
 * Site assistant for Digital Hub.
 *
 * The engine, client, hook and knowledge snapshot are shared verbatim with the
 * other Lindocode front ends. Only SITE_LINKS below is specific to this site.
 */

export { createAssistant } from "./engine";
export { loadKnowledge } from "./client";
export { useAssistant } from "./useAssistant";
export { BUNDLED_KNOWLEDGE } from "./knowledge";

/**
 * Knowledge-base links are absolute lindocode.com URLs so any front end works
 * untouched. Digital Hub only claims the one that points at itself; Next
 * prefixes it with the "/digitalhub" basePath automatically. Everything else
 * stays absolute and opens in a new tab.
 */
/** @type {Record<string, string>} */
export const SITE_LINKS = {
  digitalHub: "/",
};
