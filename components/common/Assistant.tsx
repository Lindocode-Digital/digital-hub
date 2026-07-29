"use client";

import clsx from "clsx";

import { useAssistant, SITE_LINKS } from "@/utils/assistant";
import type { AssistantSuggestion } from "@/utils/assistant/engine";

/**
 * Digital Hub's take on the site assistant: a floating launcher that opens a
 * light card, matching this site's white surface and rose brand.
 *
 * Facts come from the shared knowledge base on the Lazy Appz API — the copy is
 * identical across every Lindocode front end, only the presentation differs.
 */

const chip =
  "rounded-full border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-[0.72rem] " +
  "font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-rose-500";

export default function Assistant() {
  const a = useAssistant({ links: SITE_LINKS });

  const chips: AssistantSuggestion[] = a.result
    ? a.result.suggestions
    : a.starters.slice(0, 5);

  return (
    <div
      ref={a.containerRef}
      className="fixed top-3 right-3 z-[1200] flex flex-col items-end gap-2 sm:top-5 sm:right-5 sm:gap-3"
    >
      <button
        type="button"
        onClick={() => a.setOpen(!a.open)}
        aria-expanded={a.open}
        aria-label={a.open ? "Close assistant" : "Open assistant"}
        className={clsx(
          // Compact on phones, full size from the sm breakpoint up.
          "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-white",
          "sm:gap-2 sm:px-4 sm:py-3 sm:text-sm",
          "shadow-[0_8px_24px_-6px_rgba(225,29,72,0.45)] transition",
          a.open ? "bg-neutral-900" : "bg-rose-600 hover:bg-rose-700",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/90 sm:h-2 sm:w-2" />
        {a.open ? "Close" : "Ask"}
      </button>

      {a.open && (
        <div
          className="
            w-[min(23rem,calc(100vw-2.5rem))] max-h-[min(70vh,32rem)] overflow-y-auto
            rounded-2xl border border-neutral-200 bg-white p-4
            shadow-[0_24px_60px_-12px_rgba(15,23,42,0.28)]
          "
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-600" />
            <span
              className="text-sm font-semibold text-neutral-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Lindocode Assistant
            </span>
          </div>

          <div className="flex gap-2">
            <input
              autoFocus
              value={a.query}
              onChange={(e) => a.setQuery(e.target.value)}
              onKeyDown={a.onKeyDown}
              placeholder="Ask about the studio or the apps…"
              aria-label="Ask the assistant"
              className="
                min-w-0 flex-1 rounded-lg border border-neutral-200 bg-neutral-50
                px-3 py-2 text-sm text-neutral-900 outline-none
                placeholder:text-neutral-400 focus:border-rose-400 focus:bg-white
              "
            />
            <button
              type="button"
              onClick={a.submit}
              className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Ask
            </button>
          </div>

          {a.thinking ? (
            <div className="flex gap-1.5 px-1 py-5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-rose-400"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          ) : (
            <>
              {a.result && (
                <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3">
                  <p className="m-0 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-neutral-500">
                    {a.result.title}
                  </p>
                  <p className="mt-1.5 mb-0 text-[0.83rem] leading-relaxed text-neutral-700">
                    {a.result.answer}
                  </p>

                  {a.result.details && a.result.details.length > 0 && (
                    <ul className="mt-2.5 space-y-1.5 border-t border-neutral-200 pt-2.5">
                      {a.result.details.map((detail) => (
                        <li
                          key={detail}
                          className="relative pl-3.5 text-[0.78rem] leading-snug text-neutral-600"
                        >
                          <span className="absolute left-0 top-[0.5em] h-1 w-1 rounded-full bg-rose-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {!a.result && (
                <p className="mt-3 mb-0 text-[0.78rem] leading-relaxed text-neutral-500">
                  Try “what does the scanner check?”, “what is LazyReader?” or
                  “how much does a build cost?”
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {chips.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => a.choose(s)}
                    className={chip}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
