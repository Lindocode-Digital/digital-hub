"use client";

/**
 * Interaction logic for the site assistant, shared by every Lindocode front end.
 *
 * Holds the knowledge base, the query state and the navigation rules, and
 * returns plain values — it renders nothing, so each site is free to present it
 * as a dropdown, a drawer, a sheet or a floating card.
 *
 *   const a = useAssistant({ links: SITE_LINKS });
 *   <div ref={a.containerRef}> ... </div>
 *
 * `links` must be a stable object (module-level const), not an inline literal.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createAssistant } from "./engine";
import { loadKnowledge } from "./client";
import { BUNDLED_KNOWLEDGE } from "./knowledge";

export function useAssistant(options = {}) {
  const { links, starterTopics, thinkingMs = 420 } = options;

  const router = useRouter();

  // The bundled snapshot answers on first paint; the live copy swaps in when it
  // arrives, so the assistant never waits on the network to become usable.
  const [knowledge, setKnowledge] = useState(BUNDLED_KNOWLEDGE);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);

  const containerRef = useRef(null);
  const lastTopicRef = useRef(null);
  const timerRef = useRef(null);

  const assistant = useMemo(
    () => createAssistant(knowledge, { links }),
    [knowledge, links],
  );

  // A site can open on its own topics rather than the payload's global set —
  // LazyAuthor leads with writing help, not studio services.
  const starters = useMemo(() => {
    if (!starterTopics) return assistant.starters;

    return starterTopics
      .map((id) => assistant.topics.find((topic) => topic.id === id))
      .filter(Boolean)
      .map((topic) => ({ label: topic.title, topic: topic.id }));
  }, [assistant, starterTopics]);

  useEffect(() => {
    let active = true;

    // Never rejects - falls back to the bundled snapshot on any failure.
    loadKnowledge().then((live) => {
      if (active) setKnowledge(live);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const ask = useCallback(
    (value, topic = null) => {
      const text = (value ?? "").trim();

      setOpen(true);
      setThinking(true);
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const answer = assistant.answer(text, {
          topic,
          lastTopic: lastTopicRef.current,
        });

        // Remembered so a follow-up like "does it work offline?" stays in context.
        lastTopicRef.current = answer.id;
        setResult(answer);
        setThinking(false);
      }, thinkingMs);
    },
    [assistant, thinkingMs],
  );

  const submit = useCallback(() => ask(query), [ask, query]);

  const close = useCallback(() => setOpen(false), []);

  const choose = useCallback(
    (suggestion) => {
      if (!suggestion) return;

      // Opens a topic, asks a follow-up, or navigates.
      if (suggestion.topic) {
        setQuery(suggestion.label);
        ask(suggestion.label, suggestion.topic);
        return;
      }

      if (typeof suggestion === "string" || suggestion.ask) {
        const question = suggestion.ask || suggestion;
        setQuery(question);
        ask(question);
        return;
      }

      const { label, href } = suggestion;
      if (!href) return;

      setQuery(label);
      setOpen(false);

      // Anything not rooted at "/" leaves the app: mail clients open in place,
      // other sites open in a new tab.
      if (!href.startsWith("/")) {
        if (href.startsWith("mailto:")) {
          window.location.assign(href);
        } else {
          window.open(href, "_blank", "noopener,noreferrer");
        }
        return;
      }

      router.push(href);
    },
    [ask, router],
  );

  useEffect(() => {
    if (!open) return undefined;

    // Must be pointerdown, not click: React flushes state before a click
    // finishes bubbling, so a suggestion button is already unmounted by then
    // and contains() would test a detached node and read as "outside".
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    },
    [submit],
  );

  return {
    containerRef,
    query,
    setQuery,
    result,
    open,
    setOpen,
    thinking,
    starters,
    topics: assistant.topics,
    ask,
    submit,
    choose,
    close,
    onKeyDown,
  };
}
