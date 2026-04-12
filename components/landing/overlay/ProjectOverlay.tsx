"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";
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
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      setIsImageLoading(true);
      setImageError(false);
      setIsNavigating(false);
    }
  }, [isOpen, project]);

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

  const handleNavigate = () => {
    if (!project?.link || isNavigating) return;

    setIsNavigating(true);

    if (project.link.startsWith("/")) {
      router.push(project.link);
    } else {
      window.location.assign(project.link);
    }
  };

  const screenshotUrl = project?.link
    ? `https://api.microlink.io/?url=${encodeURIComponent(project.link)}&screenshot=true&embed=screenshot.url`
    : "";

  const isStatusActive = !isImageLoading && !imageError;

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
              {(isImageLoading || imageError) && (
                <div className="screenshot-loading">
                  <div className="loading-spinner" />
                  <span>
                    {imageError
                      ? "SCREENSHOT FAILED"
                      : "CAPTURING SCREENSHOT..."}
                  </span>
                  <span className="loading-url">
                    {project.link || "NO LINK AVAILABLE"}
                  </span>
                </div>
              )}

              {project.link ? (
                <img
                  src={screenshotUrl}
                  alt={project.title}
                  className="threat-image"
                  style={{
                    display: isImageLoading || imageError ? "none" : "block",
                  }}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setIsImageLoading(false);
                  }}
                />
              ) : (
                <div className="screenshot-loading">
                  <div className="loading-spinner" />
                  <span>NO LIVE PREVIEW</span>
                  <span className="loading-url">LINK NOT PROVIDED</span>
                </div>
              )}

              <div className="image-data-overlay">
                <div className="data-tag">
                  {" "}
                  <span className="dot"></span>
                  <span style={{ color: "white" }}>LIVE FEED</span>
                </div>
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
                <span className="stat-value high">
                  {!isStatusActive ? (
                    <span style={{ color: "red" }}>CRITICAL</span>
                  ) : (
                    <span style={{ color: "limegreen" }}>NONE</span>
                  )}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">PRIORITY</span>
                <span className="stat-value">ALPHA</span>
              </div>
              <div className="stat">
                <span className="stat-label">STATUS</span>
                <span
                  className={`stat-value ${
                    isStatusActive ? "blinking" : "offline"
                  }`}
                >
                  {isStatusActive ? (
                    <span style={{ color: "white" }}>ACTIVE</span>
                  ) : isImageLoading && project.link ? (
                    <span className="stream-dots">●●●</span>
                  ) : (
                    "OFFLINE"
                  )}
                </span>
              </div>
            </div>

            {isStatusActive && (
              <div className="threat-stats">
                <button
                  className="threat-enter-link"
                  onClick={handleNavigate}
                  disabled={!project.link || isNavigating}
                  type="button"
                >
                  {isNavigating ? (
                    <>
                      <span>REDIRECTING</span>
                      <span className="stream-dots">●●●</span>
                    </>
                  ) : (
                    "ENTER PROJECT"
                  )}
                </button>
              </div>
            )}
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
                  <span
                    className={`field-value ${isStatusActive ? "" : "offline"}`}
                  >
                    {isStatusActive ? (
                      <span style={{ color: "white" }}>READY FOR ACCESS</span>
                    ) : (
                      <span>UNAVAILABLE</span>
                    )}
                  </span>
                </div>

                <div className="data-field">
                  <span className="field-label">SLUG:</span>
                  <span className="field-value mono">
                    {project.slug || "UNSPECIFIED"}
                  </span>
                </div>

                <div className="data-field">
                  <span className="field-label">LINK:</span>
                  <span className="field-value mono">
                    {project.link || "NO LINK AVAILABLE"}
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
                <span className="flag">SECURE SESSION HANDOFF</span>
                <span className="flag">REMOTE TARGET VERIFIED</span>
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
                  <span
                    className={`conclusion-value ${
                      isStatusActive ? "threat" : "offline"
                    }`}
                  >
                    {isStatusActive ? (
                      <span style={{ color: "limegreen" }}>ACCESS READY</span>
                    ) : (
                      <span style={{ color: "red" }}>UNAVAILABLE</span>
                    )}
                  </span>
                </div>

                <div className="conclusion-row">
                  <span className="conclusion-label">RECOMMENDATION:</span>
                  <span
                    className={`conclusion-value ${
                      isStatusActive ? "track" : "offline"
                    }`}
                  >
                    {isStatusActive ? "ENTER TARGET PAGE" : "CHECK BACK LATER"}
                  </span>
                </div>
              </div>
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
