"use client";

import { useEffect, useRef } from "react";
import { usePageTransition } from "./TransitionProvider";
import { usePathname } from "next/navigation";

export default function TransitionComplete() {
  const { finishPageTransition, isTransitioning } = usePageTransition();
  const pathname = usePathname();
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // Only run if we're actually in a transition
    if (!isTransitioning) return;

    // Reset the finished flag when pathname changes during transition
    hasFinishedRef.current = false;

    // Wait for page to be ready before finishing transition
    // Increased timeout to ensure page is fully loaded
    const timeoutId = window.setTimeout(() => {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        finishPageTransition();
      }
    }, 350); // Increased from 120ms to 350ms for better UX

    // Also listen for load event to ensure images and resources are loaded
    const handleLoad = () => {
      if (!hasFinishedRef.current) {
        window.clearTimeout(timeoutId);
        hasFinishedRef.current = true;
        finishPageTransition();
      }
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("load", handleLoad);
    };
  }, [finishPageTransition, isTransitioning, pathname]);

  return null;
}
