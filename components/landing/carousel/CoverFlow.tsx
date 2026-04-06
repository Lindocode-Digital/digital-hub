"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";
import CoverFlowCard from "./CoverFlowCard";
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

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex > covers.length - 1) {
      setActiveIndex(0);
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

  return (
    <div className="coverflow-wrapper">
      {covers.map((cover, index) => {
        const offset = index - activeIndex;
        const isActive = index === activeIndex;

        return (
          <CoverFlowCard
            key={cover.slug ?? String(index)}
            cover={cover}
            isActive={isActive}
            offset={offset}
            indexLabel={cover.indexLabel ?? String(index + 1).padStart(2, "0")}
            onAction={() => {
              if (isActive) {
                navigateToLink(cover.link);
              } else {
                setActiveIndex(index);
              }
            }}
          />
        );
      })}
    </div>
  );
}
