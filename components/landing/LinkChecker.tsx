"use client";

import { useState, useRef, useCallback } from "react";
import type { Project } from "@/lib/projects";
import ProjectOverlay from "./overlay/ProjectOverlay";

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function LinkChecker() {
  const [input, setInput] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = useCallback(() => {
    const url = normalizeUrl(input);
    if (!url) return;

    let hostname = input.trim();
    let pathname = "/";
    try {
      const parsed = new URL(url);
      hostname = parsed.hostname;
      pathname = parsed.pathname || "/";
    } catch {
      // keep defaults
    }

    const synthetic: Project = {
      cardId: "link-check",
      slug: pathname,
      title: hostname,
      cardTitle: hostname,
      description: "Link Safety Check",
      image: "",
      link: url,
      domain: hostname,
    };

    setProject(synthetic);
    setIsOpen(true);
  }, [input]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setProject(null), 350);
  }, []);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div
          className="
            flex items-center gap-2 sm:gap-3
            rounded-2xl border border-neutral-200
            bg-white px-3 py-2.5 sm:px-4 sm:py-3
            shadow-sm
            focus-within:border-red-300 focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.07)]
            transition-all duration-200
          "
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="flex-shrink-0 text-neutral-400"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>

          <input
            ref={inputRef}
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="Paste any link to inspect — https://example.com"
            className="
              flex-1 min-w-0 bg-transparent
              text-sm text-neutral-800 placeholder:text-neutral-400
              outline-none font-mono
            "
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            inputMode="url"
            aria-label="Enter a URL to inspect"
          />

          <button
            onClick={handleScan}
            disabled={!input.trim()}
            type="button"
            className="
              flex-shrink-0 rounded-xl
              bg-red-600 px-3.5 py-1.5 sm:px-4
              text-[0.68rem] sm:text-xs font-bold tracking-[0.14em] text-white
              transition-all duration-150
              hover:bg-red-700 active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-sm
            "
          >
            SCAN LINK
          </button>
        </div>

        <p className="mt-2 text-center text-[0.68rem] text-neutral-400 tracking-wide">
          Live preview · HTTPS detection · redirect analysis · trust score
        </p>
      </div>

      <ProjectOverlay project={project} isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
