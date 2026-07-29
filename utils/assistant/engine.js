/**
 * Site assistant matching engine.
 *
 * Pure and UI-free: hand it a knowledge payload and it answers questions.
 * Every Lindocode front end shares this file and renders the result however it
 * likes. Facts live in the payload, not here — see ./knowledge.js.
 *
 *   const assistant = createAssistant(knowledge, { links: { contact: "/contact" } });
 *   assistant.answer("which clouds does it support");
 *   assistant.answer("", { topic: "lr-clouds" });   // chips address topics by id
 */

/** Fold spelling variants onto one token so "lazy reader" and "LazyReader" match alike. */
const ALIASES = [
  [/\blazy\s*-?\s*reader\b/g, "lazyreader"],
  [/\blazy\s*-?\s*author\b/g, "lazyauthor"],
  [/\blazy\s*-?\s*store\b/g, "lazystore"],
  [/\blazy\s*-?\s*app(?:z+|s)?\b/g, "lazyappz"],
  [/\bdigital\s*-?\s*hub\b/g, "digitalhub"],
  [/\be[\s-]?books?\b/g, "ebook"],
  [/\be[\s-]?pub\b/g, "epub"],
  [/\blit[\s-]?rpg\b/g, "litrpg"],
  [/\bqr\s*-?\s*codes?\b/g, "qr"],
  [/\bweb\s*-?\s*sites?\b/g, "website"],
  [/\bweb\s*-?\s*apps?\b/g, "webapp"],
  [/\bmobile\s*-?\s*apps?\b/g, "mobileapp"],
  [/\bnext\s*\.?\s*js\b/g, "nextjs"],
  [/\bnode\s*\.?\s*js\b/g, "node"],
  [/\btext[\s-]to[\s-]speech\b/g, "tts"],
  [/\bread[\s-]aloud\b/g, "read aloud"],
];

const COMPARE = /\b(vs|versus|compare|comparison|difference|differ|instead of)\b/;
const FOLLOW_UP = /\b(it|its|it's|that|this|they|them|those|there|one)\b/;

const MIN_SCORE = 2;

function normalize(input) {
  let text = String(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const [pattern, replacement] of ALIASES) {
    text = text.replace(pattern, replacement);
  }

  return text.replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

/** Bounded Levenshtein - bails as soon as it knows the distance exceeds `max`. */
function withinEditDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return false;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowBest = i;

    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost,
      );
      rowBest = Math.min(rowBest, current[j]);
    }

    if (rowBest > max) return false;
    previous = current;
  }

  return previous[b.length] <= max;
}

/**
 * Phrases outweigh single words and whole words outweigh prefixes, so "store"
 * does not fire on "storage" while "services" still finds "service". Longer
 * words also tolerate a typo or two.
 */
function scoreTerm(term, query, words) {
  if (term.includes(" ")) {
    return query.includes(term) ? 3 * term.split(" ").length : 0;
  }

  if (words.has(term)) return 3;

  if (term.length >= 4) {
    for (const word of words) {
      if (word.startsWith(term)) return 2;
    }
  }

  if (term.length >= 6) {
    const budget = term.length >= 8 ? 2 : 1;
    for (const word of words) {
      if (word.length >= 4 && withinEditDistance(word, term, budget)) return 2;
    }
  }

  return term.length >= 5 && query.includes(term) ? 1 : 0;
}

function scoreTopic(topic, query, words) {
  let score = 0;

  for (const term of topic.terms) {
    score += scoreTerm(term, query, words);
  }

  return score > 0 ? score + (topic.boost || 0) : 0;
}

/** Where a topic is first mentioned, so a comparison reads in the asker's order. */
function mentionIndex(topic, query) {
  let earliest = Infinity;

  for (const term of topic.terms) {
    const at = query.indexOf(term);
    if (at !== -1 && at < earliest) earliest = at;
  }

  return earliest;
}

export function createAssistant(knowledge, options = {}) {
  const topics = knowledge?.topics || [];
  const byId = new Map(topics.map((topic) => [topic.id, topic]));

  // Payload links are absolute so any front end works untouched; a site
  // overrides the keys it can serve as a local route.
  const links = { ...(knowledge?.links || {}), ...(options.links || {}) };

  /** Symbolic { link: "contact" } becomes a real href for this site. */
  const resolve = (suggestion) => {
    if (suggestion.link) {
      return { label: suggestion.label, href: links[suggestion.link] };
    }
    return suggestion;
  };

  const resolveAll = (suggestions = []) =>
    suggestions.map(resolve).filter((s) => s.topic || s.href || s.ask);

  const jump = (label, topic) => ({ label, topic });

  const starters = resolveAll(knowledge?.starters);

  function toResult(topic, extraSuggestions = []) {
    const suggestions = resolveAll(topic.suggestions);

    for (const suggestion of extraSuggestions) {
      if (suggestions.length >= 5) break;
      if (suggestions.some((s) => s.label === suggestion.label)) continue;
      suggestions.push(suggestion);
    }

    return {
      id: topic.id,
      title: topic.title,
      answer: topic.answer,
      details: topic.details,
      suggestions,
    };
  }

  function rank(query, words, lastTopic) {
    const scored = [];

    for (const topic of topics) {
      let score = scoreTopic(topic, query, words);

      // A pronoun usually points back at whatever we just discussed.
      if (score > 0 && topic.id === lastTopic && FOLLOW_UP.test(query)) {
        score += 2;
      }

      if (score > 0) scored.push({ topic, score });
    }

    return scored.sort((a, b) => b.score - a.score);
  }

  /** "lazyreader vs lazyauthor" - answer both at once instead of picking one. */
  function compare(ranked, query) {
    const [first, second] = ranked
      .filter(({ topic }) => topic.summary)
      .slice(0, 2)
      .map(({ topic }) => topic)
      .sort((a, b) => mentionIndex(a, query) - mentionIndex(b, query));

    if (!first || !second) return null;

    return {
      id: `${first.id}-vs-${second.id}`,
      title: `${first.title} vs ${second.title}`,
      answer: `Two different jobs. ${first.title} is ${first.summary}. ${second.title} is ${second.summary}.`,
      details: [
        `${first.title} - ${first.details?.[0] || first.summary}`,
        `${second.title} - ${second.details?.[0] || second.summary}`,
      ],
      suggestions: [
        jump(first.title, first.id),
        jump(second.title, second.id),
        jump("How they connect", "ecosystem"),
      ].filter((s) => byId.has(s.topic)),
    };
  }

  function answer(input = "", { topic = null, lastTopic = null } = {}) {
    // Chips address a topic directly, so they can never land on a near miss.
    if (topic && byId.has(topic)) {
      return toResult(byId.get(topic));
    }

    const query = normalize(input);

    if (!query) {
      return {
        id: "idle",
        title: "Assistant",
        answer:
          "Ask about the studio - services, process, stack, pricing, contact - or about the products: Digital Hub, LazyReader, LazyAuthor and LazyStore.",
        suggestions: starters.slice(0, 4),
      };
    }

    const words = new Set(query.split(" "));
    const ranked = rank(query, words, lastTopic);

    if (COMPARE.test(query)) {
      const comparison = compare(ranked, query);
      if (comparison) return comparison;
    }

    const best = ranked[0];

    if (best && best.score >= MIN_SCORE) {
      // A close runner-up means the question was ambiguous - offer it as a chip
      // rather than silently picking one reading.
      const runnerUp = ranked[1];
      const alternatives =
        runnerUp &&
        runnerUp.score >= MIN_SCORE &&
        runnerUp.score >= best.score - 2
          ? [jump(`Or: ${runnerUp.topic.title}`, runnerUp.topic.id)]
          : [];

      return toResult(best.topic, alternatives);
    }

    // Nothing matched. Offer the nearest topics we did touch, if any.
    const nearest = ranked
      .slice(0, 3)
      .map(({ topic: t }) => jump(t.title, t.id));

    const human = links.contact
      ? [{ label: "Ask a human", href: links.contact }]
      : [];

    if (lastTopic && byId.has(lastTopic)) {
      const previous = byId.get(lastTopic);

      return {
        id: "unmatched",
        title: "Not sure about that one",
        answer: `I did not catch that. We were on ${previous.title} - I can go deeper there, or point you somewhere else.`,
        suggestions: [
          jump(`Back to ${previous.title}`, previous.id),
          ...nearest,
          ...human,
        ].slice(0, 4),
      };
    }

    return {
      id: "unmatched",
      title: "I can help with the site",
      answer:
        "That one is outside what I know. I cover Lindocode Digital's services, process, stack, pricing and contact details, plus Digital Hub, LazyReader, LazyAuthor and LazyStore in detail.",
      suggestions: nearest.length
        ? [...nearest, ...human].slice(0, 4)
        : starters.slice(0, 4),
    };
  }

  return { answer, starters, topics, links };
}
