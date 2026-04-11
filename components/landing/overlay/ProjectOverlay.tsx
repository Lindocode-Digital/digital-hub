// components/overlay/ProjectOverlay.tsx
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
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
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return createPortal(
    <div className="threat-overlay-wrapper" onClick={onClose}>
      <div className="threat-overlay-backdrop" />

      <div
        className="threat-overlay-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scanning line effect */}
        <div className="scan-line" />
        <div className="glow-effect" />

        {/* Header bar */}
        <div className="threat-header">
          <div className="threat-title-section">
            <span className="threat-badge">// DEVANT</span>
            <span className="threat-code">SYSTEM://ASSESSMENT_001</span>
          </div>
          <button className="threat-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Main content */}
        <div className="threat-content">
          {/* Left side - Image with data overlay */}
          <div className="threat-image-panel">
            <div className="image-container">
              <img
                src={project.image}
                alt={project.title}
                className="threat-image"
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

            {/* Stats bar */}
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

          {/* Right side - Assessment data */}
          <div className="threat-data-panel">
            <div className="data-section">
              <div className="section-header">
                <span className="section-icon">▶</span>
                <span className="section-title">SUBJECT IDENTIFICATION</span>
              </div>
              <div className="data-grid-2col">
                <div className="data-field">
                  <span className="field-label">NAME:</span>
                  <span className="field-value">HENDERSON, ALAN B.</span>
                </div>
                <div className="data-field">
                  <span className="field-label">DOB:</span>
                  <span className="field-value">03/18/84</span>
                </div>
                <div className="data-field">
                  <span className="field-label">IMEI:</span>
                  <span className="field-value mono">26182733772261</span>
                </div>
                <div className="data-field">
                  <span className="field-label">LOCATION:</span>
                  <span className="field-value mono">
                    40.768057, -73.981929
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
                <span className="flag">ATTENTION DEFICIT DISORDER</span>
                <span className="flag">
                  CONSUMPTION OF PORNOGRAPHIC MATERIALS
                </span>
                <span className="flag">ILLEGAL INTERNET DOWNLOADS</span>
                <span className="flag">ANTI-GOVERNMENT STATEMENTS</span>
                <span className="flag">MULTIPLE SEXUAL PARTNERS</span>
                <span className="flag">SELF-DELETING TEXTS</span>
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
                  <span className="conclusion-value threat">THREAT</span>
                </div>
                <div className="conclusion-row">
                  <span className="conclusion-label">RECOMMENDATION:</span>
                  <span className="conclusion-value track">TRACK</span>
                </div>
              </div>
            </div>

            {/* Data stream footer */}
            <div className="data-stream">
              <span className="stream-text">DATA_ACQUISITION_ACTIVE</span>
              <span className="stream-dots">●●●</span>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
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
