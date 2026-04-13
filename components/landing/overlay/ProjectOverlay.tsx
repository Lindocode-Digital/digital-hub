"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";
import "./ProjectOverlay.css";

type ProjectOverlayProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
};

type SectionKey = "overview" | "diagnostics" | "recommendation";

export default function ProjectOverlay({
  project,
  isOpen,
  onClose,
}: ProjectOverlayProps) {
  const router = useRouter();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [openSection, setOpenSection] = useState<SectionKey>("overview");

  useEffect(() => {
    if (isOpen && project) {
      setIsImageLoading(true);
      setImageError(false);
      setIsNavigating(false);
      setOpenSection("overview");
    }
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
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
    if (!isOpen) return;

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".threat-overlay-panel")) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen]);

  const handleNavigate = () => {
    if (!project?.link || isNavigating) return;

    setIsNavigating(true);

    if (project.link.startsWith("/")) {
      router.push(project.link);
      return;
    }

    window.location.assign(project.link);
  };

  const toggleSection = (section: SectionKey) => {
    setOpenSection((prev) => (prev === section ? section : section));
  };

  const screenshotUrl = useMemo(() => {
    if (!project?.link) return "";
    return `https://api.microlink.io/?url=${encodeURIComponent(
      project.link,
    )}&screenshot=true&embed=screenshot.url`;
  }, [project?.link]);

  const isStatusActive = !isImageLoading && !imageError;
  const projectCode = project?.slug
    ? `PROJECT://${project.slug.toUpperCase()}`
    : "PROJECT://UNKNOWN";

  const statusLabel = isStatusActive
    ? "READY FOR ACCESS"
    : isImageLoading && project?.link
      ? "SYNCING PREVIEW"
      : "UNAVAILABLE";

  const recommendation = isStatusActive ? "ENTER PROJECT" : "CHECK BACK LATER";

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
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} preview overlay`}
      >
        <div className="scan-line" />
        <div className="glow-effect" />
        <div className="grid-overlay" />

        <div className="threat-header">
          <div className="threat-title-section">
            <span className="threat-badge">LIVE PREVIEW</span>
            <div className="threat-title-stack">
              <span className="threat-code">{projectCode}</span>
              <h2 className="threat-main-title">{project.title}</h2>
            </div>
          </div>

          <button
            className="threat-close"
            onClick={onClose}
            disabled={isNavigating}
            aria-label="Close overlay"
            type="button"
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
                      ? "PREVIEW CAPTURE FAILED"
                      : "CAPTURING LIVE PREVIEW"}
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
                  <span className="dot" />
                  <span>LIVE FEED</span>
                </div>

                <div className="image-caption">
                  <span className="image-caption-label">STATUS</span>
                  <span className="image-caption-value">{statusLabel}</span>
                </div>
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <span className="stat-label">ACCESS</span>
                <span
                  className={`stat-value ${isStatusActive ? "online" : "offline"}`}
                >
                  {isStatusActive ? "OPEN" : "DOWN"}
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">PRIORITY</span>
                <span className="stat-value">ALPHA</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">FEED</span>
                <span
                  className={`stat-value ${isStatusActive ? "online" : "offline"}`}
                >
                  {isStatusActive ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
            </div>

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

          <div className="threat-data-panel">
            <div className="hero-summary">
              <span className="hero-summary-kicker">MISSION SUMMARY</span>
              <p className="hero-summary-text">
                Secure project preview channel established. Review target
                status, live route availability, and access readiness before
                deployment.
              </p>
            </div>

            <div className="data-section">
              <button
                type="button"
                className={`section-header clickable ${
                  openSection === "overview" ? "active" : ""
                }`}
                onClick={() => toggleSection("overview")}
                aria-expanded={openSection === "overview"}
              >
                <span className="section-title-wrap">
                  <span className="section-icon">◆</span>
                  <span className="section-title">SUBJECT IDENTIFICATION</span>
                </span>
                <span className="section-chevron">
                  {openSection === "overview" ? "−" : "+"}
                </span>
              </button>

              {openSection === "overview" && (
                <div className="section-body">
                  <div className="data-grid-2col">
                    <div className="data-field">
                      <span className="field-label">PROJECT</span>
                      <span className="field-value">{project.title}</span>
                    </div>

                    <div className="data-field">
                      <span className="field-label">STATUS</span>
                      <span
                        className={`field-value ${
                          isStatusActive ? "status-ready" : "offline"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div className="data-field">
                      <span className="field-label">SLUG</span>
                      <span className="field-value mono">
                        {project.slug || "UNSPECIFIED"}
                      </span>
                    </div>

                    <div className="data-field">
                      <span className="field-label">LINK</span>
                      <span className="field-value mono">
                        {project.link || "NO LINK AVAILABLE"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="data-section">
              <button
                type="button"
                className={`section-header clickable ${
                  openSection === "diagnostics" ? "active" : ""
                }`}
                onClick={() => toggleSection("diagnostics")}
                aria-expanded={openSection === "diagnostics"}
              >
                <span className="section-title-wrap">
                  <span className="section-icon">◆</span>
                  <span className="section-title">DIAGNOSTIC FLAGS</span>
                </span>
                <span className="section-chevron">
                  {openSection === "diagnostics" ? "−" : "+"}
                </span>
              </button>

              {openSection === "diagnostics" && (
                <div className="section-body">
                  <div className="flags-list">
                    <span className="flag">LIVE PREVIEW AVAILABLE</span>
                    <span className="flag">SECURE SESSION HANDOFF</span>
                    <span className="flag">REMOTE TARGET VERIFIED</span>
                    <span className="flag">INTERCEPT LAYER ACTIVE</span>
                  </div>
                </div>
              )}
            </div>

            <div className="data-section">
              <button
                type="button"
                className={`section-header clickable ${
                  openSection === "recommendation" ? "active" : ""
                }`}
                onClick={() => toggleSection("recommendation")}
                aria-expanded={openSection === "recommendation"}
              >
                <span className="section-title-wrap">
                  <span className="section-icon">◆</span>
                  <span className="section-title">CONCLUSION & ACTION</span>
                </span>
                <span className="section-chevron">
                  {openSection === "recommendation" ? "−" : "+"}
                </span>
              </button>

              {openSection === "recommendation" && (
                <div className="section-body">
                  <div className="conclusion-box">
                    <div className="conclusion-row">
                      <span className="conclusion-label">CONCLUSION</span>
                      <span
                        className={`conclusion-value ${
                          isStatusActive ? "ready" : "offline"
                        }`}
                      >
                        {isStatusActive ? "ACCESS READY" : "UNAVAILABLE"}
                      </span>
                    </div>

                    <div className="conclusion-row">
                      <span className="conclusion-label">RECOMMENDATION</span>
                      <span
                        className={`conclusion-value ${
                          isStatusActive ? "track" : "offline"
                        }`}
                      >
                        {recommendation}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="data-stream">
              <span className="stream-text">DATA_ACQUISITION_ACTIVE</span>
              <span className="stream-dots">●●●</span>
            </div>
          </div>
        </div>

        <div className="threat-footer">
          <div className="footer-left">
            <span className="dot" />
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
