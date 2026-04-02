"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";
import CoverFlowCard from "./CoverFlowCard";
import "./CoverFlow.css";

type CoverItem = Project & {
  image: string;
  alt?: string;
  "card-title"?: string;
};

type CoverFlowProps = {
  covers: CoverItem[];
};

function moveItemToCenteredIndex<T>(items: T[], targetIndex: number) {
  if (!items.length) return items;

  const centered = Math.floor(items.length / 2);
  const next = [...items];
  const [item] = next.splice(targetIndex, 1);
  next.splice(centered, 0, item);
  return next;
}

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

  const reorderedCards = useMemo(
    () => moveItemToCenteredIndex(covers, 0),
    [covers],
  );

  const initialIndex = useMemo(() => {
    if (!reorderedCards.length) return 0;
    return Math.floor(reorderedCards.length / 2);
  }, [reorderedCards]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

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
      {reorderedCards.map((cover, index) => {
        const offset = index - activeIndex;
        const isActive = index === activeIndex;

        return (
          <CoverFlowCard
            key={cover.slug ?? String(index)}
            cover={cover}
            isActive={isActive}
            offset={offset}
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
