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

  return (
    <>
      <div className="coverflow-wrapper">
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
      </div>

      <ProjectOverlay
        project={selectedProject}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </>
  );
}
