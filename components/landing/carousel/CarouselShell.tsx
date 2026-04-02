"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LayoutGrid, GalleryVerticalEnd } from "lucide-react";
import type { Project } from "@/lib/projects";
import CoverFlow from "./CoverFlow";

const Carousel3D = dynamic(() => import("./Carousel3D"), {
  loading: () => (
    <div className="flex min-h-[320px] items-center justify-center text-sm text-neutral-500">
      Loading showcase...
    </div>
  ),
});

export default function CarouselShell({ projects }: { projects: Project[] }) {
  const [viewMode, setViewMode] = useState<"cover" | "cards">("cover");

  return (
    <div className="carousel-shell">
      <div
        className="
          fixed right-5 top-5 z-[99999]
          mt-20 sm:mt-0
          flex items-center gap-1.5 rounded-full
          border border-white/15 bg-white/10 p-1.5
          shadow-[0_8px_16px_rgba(0,0,0,0.25)] backdrop-blur-md
        "
        aria-label="View mode toggle"
      >
        <button
          type="button"
          onClick={() => setViewMode("cover")}
          aria-pressed={viewMode === "cover"}
          aria-label="Cover flow view"
          title="Cover flow view"
          className={`grid h-11 w-11 place-items-center rounded-full transition-all duration-200 outline-none ${
            viewMode === "cover"
              ? "bg-rose-600 text-white shadow-[0_6px_18px_rgba(225,29,72,0.35)]"
              : "bg-white/10 text-black hover:bg-white/20"
          }`}
        >
          <GalleryVerticalEnd size={18} />
        </button>

        <button
          type="button"
          onClick={() => setViewMode("cards")}
          aria-pressed={viewMode === "cards"}
          aria-label="Cards view"
          title="Cards view"
          className={`grid h-11 w-11 place-items-center rounded-full transition-all duration-200 outline-none ${
            viewMode === "cards"
              ? "bg-rose-600 text-white shadow-[0_6px_18px_rgba(225,29,72,0.35)]"
              : "bg-white/10 text-black hover:bg-white/20"
          }`}
        >
          <LayoutGrid size={18} />
        </button>
      </div>

      {viewMode === "cover" ? (
        <CoverFlow covers={projects} />
      ) : (
        <Carousel3D projects={projects} />
      )}
    </div>
  );
}
