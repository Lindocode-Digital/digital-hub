"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";
import { usePageTransition } from "@/components/transition/TransitionProvider";
import "./ProjectOverlay.css";

type ProjectOverlayProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProjectOverlay({
  project,
  isOpen,
  onClose,
}: ProjectOverlayProps) {
  const router = useRouter();
  const { startPageTransition } = usePageTransition();

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isNavigating) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isNavigating, onClose]);

  useEffect(() => {
    if (project?.link) {
      setIsImageLoading(true);
      setImageError(false);

      const url = `https://api.microlink.io/?url=${encodeURIComponent(
        project.link,
      )}&screenshot=true&embed=screenshot.url`;

      setScreenshotUrl(url);
    }
  }, [project]);

  useEffect(() => {
    if (!isOpen) {
      setIsNavigating(false);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    }
  }, [isOpen]);

  const navigateAndWaitForLoad = (href: string): Promise<void> => {
    return new Promise((resolve) => {
      // Start navigation
      router.push(href);

      // Set a timeout as fallback (max 5 seconds for slow networks)
      const timeout = setTimeout(() => {
        console.log("[Navigation] Timeout reached, resolving anyway");
        resolve();
      }, 5000);

      let hasResolved = false;

      // Listen for the page-ready event
      const handlePageReady = () => {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timeout);
          resolve();
          window.removeEventListener("page-ready", handlePageReady);
        }
      };

      window.addEventListener("page-ready", handlePageReady);

      // Also check for data attribute periodically as fallback
      const checkInterval = setInterval(() => {
        if (
          !hasResolved &&
          document.body.getAttribute("data-page-loaded") === "true"
        ) {
          hasResolved = true;
          clearTimeout(timeout);
          clearInterval(checkInterval);
          resolve();
          window.removeEventListener("page-ready", handlePageReady);
        }
      }, 100);

      // Cleanup
      setTimeout(() => {
        clearInterval(checkInterval);
        window.removeEventListener("page-ready", handlePageReady);
      }, 5500);
    });
  };

  const handleNavigate = async () => {
    if (!project?.link || isNavigating) return;

    setIsNavigating(true);

    try {
      await startPageTransition(async () => {
        if (project.link.startsWith("/")) {
          // Wait for the new page to fully load
          await navigateAndWaitForLoad(project.link);
        } else {
          // For external links
          window.location.assign(project.link);
          // Return a promise that never resolves since page will unload
          return new Promise(() => {});
        }
      });
    } catch (error) {
      console.error("Navigation error:", error);
      setIsNavigating(false);
    }
  };

  if (!isOpen || !project) return null;

  return createPortal(
    <div
      className={`threat-overlay-wrapper ${isNavigating ? "is-navigating" : ""}`}
      onClick={isNavigating ? undefined : onClose}
    >
      <div className="threat-overlay-backdrop" />

      <div
        className="threat-overlay-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="scan-line" />
        <div className="glow-effect" />

        <div className="threat-header">
          <div className="threat-title-section">
            <span className="threat-badge">// DEVANT</span>
            <span className="threat-code">SYSTEM://ASSESSMENT_001</span>
          </div>

          <button
            className="threat-close"
            onClick={onClose}
            disabled={isNavigating}
            aria-label="Close overlay"
          >
            ✕
          </button>
        </div>

        <div className="threat-content">
          <div className="threat-image-panel">
            <div className="image-container">
              {isImageLoading && !imageError && (
                <div className="screenshot-loading">
                  <div className="loading-spinner" />
                  <span>CAPTURING SCREENSHOT...</span>
                  <span className="loading-url">{project.link}</span>
                </div>
              )}

              <img
                src={screenshotUrl}
                alt={project.title}
                className="threat-image"
                style={{
                  display: isImageLoading && !imageError ? "none" : "block",
                }}
                onLoad={() => {
                  setIsImageLoading(false);
                }}
                onError={(e) => {
                  setImageError(true);
                  setIsImageLoading(false);
                  (e.target as HTMLImageElement).src = project.image;
                }}
              />

              <div className="image-data-overlay">
                <div className="data-tag">LIVE FEED</div>
                <div className="data-grid">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="threat-stats">
              <div className="stat">
                <span className="stat-label">THREAT LEVEL</span>
                <span className="stat-value high">CRITICAL</span>
              </div>
              <div className="stat">
                <span className="stat-label">PRIORITY</span>
                <span className="stat-value">ALPHA</span>
              </div>
              <div className="stat">
                <span className="stat-label">STATUS</span>
                <span className="stat-value blinking">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="threat-data-panel">
            <div className="data-section">
              <div className="section-header">
                <span className="section-icon">▶</span>
                <span className="section-title">SUBJECT IDENTIFICATION</span>
              </div>

              <div className="data-grid-2col">
                <div className="data-field">
                  <span className="field-label">PROJECT:</span>
                  <span className="field-value">{project.title}</span>
                </div>

                <div className="data-field">
                  <span className="field-label">STATUS:</span>
                  <span className="field-value">READY FOR ACCESS</span>
                </div>

                <div className="data-field">
                  <span className="field-label">SLUG:</span>
                  <span className="field-value mono">
                    {project.slug ?? "UNSPECIFIED"}
                  </span>
                </div>

                <div className="data-field">
                  <span className="field-label">LINK:</span>
                  <span className="field-value mono">
                    {project.link ?? "NO LINK AVAILABLE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="data-section">
              <div className="section-header">
                <span className="section-icon">⚠</span>
                <span className="section-title">DIAGNOSTIC FLAGS</span>
              </div>

              <div className="flags-list">
                <span className="flag">LIVE PREVIEW AVAILABLE</span>
                <span className="flag">ROUTE TRANSITION ENABLED</span>
                <span className="flag">SECURE SESSION HANDOFF</span>
                <span className="flag">REMOTE TARGET VERIFIED</span>
                <span className="flag">ANIMATED ACCESS SEQUENCE</span>
                <span className="flag">OVERLAY LINK INTERCEPT ACTIVE</span>
              </div>
            </div>

            <div className="data-section">
              <div className="section-header">
                <span className="section-icon">◆</span>
                <span className="section-title">
                  CONCLUSION & RECOMMENDATION
                </span>
              </div>

              <div className="conclusion-box">
                <div className="conclusion-row">
                  <span className="conclusion-label">CONCLUSION:</span>
                  <span className="conclusion-value threat">ACCESS READY</span>
                </div>

                <div className="conclusion-row">
                  <span className="conclusion-label">RECOMMENDATION:</span>
                  <span className="conclusion-value track">
                    ENTER TARGET PAGE
                  </span>
                </div>
              </div>
            </div>

            <div className="overlay-action-row">
              <button
                className="threat-enter-link"
                onClick={handleNavigate}
                disabled={!project.link || isNavigating}
                type="button"
              >
                {isNavigating ? "ESTABLISHING ACCESS..." : "ENTER PROJECT"}
              </button>
            </div>

            <div className="data-stream">
              <span className="stream-text">DATA_ACQUISITION_ACTIVE</span>
              <span className="stream-dots">●●●</span>
            </div>
          </div>
        </div>

        <div className="threat-footer">
          <div className="footer-left">
            <span className="dot"></span>
            <span>SECURE LINK ESTABLISHED</span>
          </div>

          <div className="footer-right">
            <span>ENC: AES-256</span>
            <span>|</span>
            <span>ID: 8472-AA</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
