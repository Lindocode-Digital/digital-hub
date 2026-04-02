"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";

type CoverItem = Project & {
  image: string;
  alt?: string;
  "card-title"?: string;
};

type CoverFlowCardProps = {
  cover: CoverItem;
  isActive: boolean;
  offset: number;
  onAction: () => void;
};

export default function CoverFlowCard({
  cover,
  isActive,
  offset,
  onAction,
}: CoverFlowCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`coverflow-card ${isActive ? "active" : ""} ${isLoaded ? "loaded" : "loading"}`}
      style={{
        transform: `translateX(${offset * 120}%) rotateY(${offset * 45}deg) scale(${isActive ? 1.5 : 0.9})`,
        zIndex: isActive ? 100 : 50 - Math.abs(offset),
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
        alignItems: "center",
        cursor: isActive && cover.link ? "pointer" : "default",
      }}
      onClick={onAction}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAction();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={cover.alt || cover.title}
      aria-pressed={isActive}
    >
      <div className="coverflow-card-media">
        <img
          src={cover.image}
          alt={cover.alt || cover["card-title"] || cover.title}
          className={`coverflow-card-image ${isLoaded ? "is-visible" : ""}`}
          draggable={false}
          loading="eager"
          fetchPriority={offset === 0 ? "high" : "auto"}
          ref={(img) => {
            if (img?.complete) {
              setIsLoaded(true);
            }
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      </div>

      <span className="lm-project-title font-lemon">
        {cover["card-title"] ?? cover.title}
      </span>
    </div>
  );
}
