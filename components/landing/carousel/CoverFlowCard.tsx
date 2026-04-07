"use client";

import { useState, type CSSProperties } from "react";
import type { Project } from "@/lib/projects";
import "./CoverFlowCard.css";

type CoverIcon = {
  src: string;
  size?: number;
  alt?: string;
};

type CoverItem = Project & {
  image: string;
  alt?: string;
  "card-title"?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  description?: string;
  extra?: string;
  icons?: CoverIcon[];
  indexLabel?: string;
};

type TitleStyle = CSSProperties & {
  "--title-color"?: string;
};

type CoverFlowCardProps = {
  cover: CoverItem;
  isActive: boolean;
  offset: number;
  indexLabel?: string;
  onAction: () => void;
};

export default function CoverFlowCard({
  cover,
  isActive,
  offset,
  indexLabel,
  onAction,
}: CoverFlowCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const displayTitle = cover.cardTitle ?? cover["card-title"] ?? cover.title;
  const displaySubtitle = cover.cardSubtitle;
  const displayDescription = cover.description;

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

        <div className="cflow-ui-overlay" />

        <div className="cflow-ui-shell">
          <div className="cflow-ui-topline">
            <span className="cflow-ui-index">
              {indexLabel ?? String(Math.abs(offset) + 1).padStart(2, "0")}
            </span>{" "}
            <div className="cflow-ui-line" />
          </div>

          <div className="cflow-ui-content">
            <div className="cflow-ui-chip-row">
              <span className="cflow-ui-chip">
                {displaySubtitle || "View Project"}
              </span>
            </div>

            <div className="cflow-ui-panel">
              {/*  <p className="cflow-ui-kicker">{cover.title}</p> */}

              <h3
                className="cflow-ui-title font-lemon"
                style={
                  { "--title-color": cover.color || "#111827" } as TitleStyle
                }
              >
                {displayTitle}
              </h3>

              {displayDescription ? (
                <p className="cflow-ui-subtitle">{displayDescription}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {cover.title && (
        <span
          className="cflow-ui-floating-title font-lemon"
          style={{ "--title-color": cover.color || "#111827" } as TitleStyle}
        >
          {cover.title}
        </span>
      )}{" "}
    </div>
  );
}
