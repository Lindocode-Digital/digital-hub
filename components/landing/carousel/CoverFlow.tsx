"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";
import CoverFlowCard from "./CoverFlowCard";
import ProjectOverlay from "../overlay/ProjectOverlay";
import "./CoverFlow.css";

type CoverItem = Project & {
  image: string;
  alt?: string;
  "card-title"?: string;
  indexLabel?: string;
};

type CoverFlowProps = {
  covers: CoverItem[];
};

export default function CoverFlow({ covers }: CoverFlowProps) {
  const router = useRouter();
  const navigatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    covers.length > 1 ? 1 : 0,
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    const resetNavigation = () => {
      navigatingRef.current = false;
    };

    window.addEventListener("pageshow", resetNavigation);
    window.addEventListener("focus", resetNavigation);

    return () => {
      window.removeEventListener("pageshow", resetNavigation);
      window.removeEventListener("focus", resetNavigation);
    };
  }, []);

  useEffect(() => {
    if (covers.length === 0) return;

    if (activeIndex > covers.length - 1) {
      setActiveIndex(covers.length > 1 ? 1 : 0);
    }
  }, [covers.length, activeIndex]);

  const navigateToLink = (link?: string) => {
    if (!link || navigatingRef.current) return;

    navigatingRef.current = true;

    if (link.startsWith("/")) {
      router.push(link);
    } else {
      window.location.assign(link);
    }
  };

  const handleCardAction = (cover: CoverItem, index: number) => {
    if (index === activeIndex) {
      setSelectedProject(cover);
      setIsOverlayOpen(true);
    } else {
      setActiveIndex(index);
    }
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < covers.length - 1;

  const goPrev = () => {
    if (hasPrev) setActiveIndex((i) => i - 1);
  };

  const goNext = () => {
    if (hasNext) setActiveIndex((i) => i + 1);
  };

  return (
    <>
      <div className="coverflow-wrapper">
        {hasPrev && (
          <button
            type="button"
            className="coverflow-nav coverflow-nav-prev"
            onClick={goPrev}
            aria-label="Previous project"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {covers.map((cover, index) => {
          const offset = index - activeIndex;
          const isActive = index === activeIndex;

          return (
            <CoverFlowCard
              key={cover.cardId ?? String(index)}
              cover={cover}
              isActive={isActive}
              offset={offset}
              indexLabel={
                cover.indexLabel ?? String(index + 1).padStart(2, "0")
              }
              onAction={() => handleCardAction(cover, index)}
            />
          );
        })}

        {hasNext && (
          <button
            type="button"
            className="coverflow-nav coverflow-nav-next"
            onClick={goNext}
            aria-label="Next project"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <ProjectOverlay
        project={selectedProject}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </>
  );
}
