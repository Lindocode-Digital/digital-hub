"use client";

import { useEffect } from "react";

export default function PageReadySignal() {
  useEffect(() => {
    let isSignaled = false;

    const signalPageReady = () => {
      if (isSignaled) return;
      isSignaled = true;

      // Dispatch custom event for the transition system
      const event = new CustomEvent("page-ready", {
        detail: {
          timestamp: Date.now(),
          url: window.location.href,
        },
      });
      window.dispatchEvent(event);

      // Add data attribute for MutationObserver detection
      document.body.setAttribute("data-page-loaded", "true");

      // Add a class to body for CSS detection
      document.body.classList.add("page-ready");

      // Signal that main content is ready
      const mainContent = document.querySelector(
        'main, [role="main"], .page-content',
      );
      if (mainContent) {
        mainContent.setAttribute("data-ready", "true");
      }

      // Also check for specific page containers
      const containers = document.querySelectorAll(
        "#__next > div, .app-container",
      );
      containers.forEach((container) => {
        container.setAttribute("data-ready", "true");
      });

      console.log(
        "[PageReadySignal] Page ready signaled for:",
        window.location.pathname,
      );
    };

    // Check if the page is already loaded
    const checkAndSignal = () => {
      if (document.readyState === "complete") {
        // Use requestIdleCallback or setTimeout to ensure React has rendered
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => signalPageReady(), { timeout: 200 });
        } else {
          setTimeout(signalPageReady, 100);
        }
      }
    };

    // Initial check
    checkAndSignal();

    // Listen for load event
    window.addEventListener("load", checkAndSignal);

    // Listen for Next.js route changes
    const handleRouteChange = () => {
      isSignaled = false;
      document.body.removeAttribute("data-page-loaded");
      document.body.classList.remove("page-ready");

      // Re-signal after route change
      setTimeout(checkAndSignal, 100);
    };

    // Listen for popstate (browser back/forward)
    window.addEventListener("popstate", handleRouteChange);

    // Use MutationObserver to detect when React has hydrated
    const observer = new MutationObserver(() => {
      if (!isSignaled && document.body.children.length > 0) {
        const mainContent = document.querySelector("main, [data-page-root]");
        if (mainContent && mainContent.children.length > 0) {
          signalPageReady();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      window.removeEventListener("load", checkAndSignal);
      window.removeEventListener("popstate", handleRouteChange);
      observer.disconnect();
      document.body.removeAttribute("data-page-loaded");
      document.body.classList.remove("page-ready");
    };
  }, []);

  return null;
}
