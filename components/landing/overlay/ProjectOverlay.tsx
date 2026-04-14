"use client";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
  startTransition,
} from "react";
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

type PreviewState = "loading" | "ready" | "broken" | "missing";

type ValidationResult = {
  ok: boolean;
  isWorking?: boolean;
  isReachable?: boolean;
  statusCode?: number;
  statusText?: string;
  finalUrl?: string;
  contentType?: string | null;
  error?: string;
  link?: string;
};

const VALIDATION_ENDPOINT = "https://dawn-violet-bb5b.sdrowvieli1.workers.dev";

export default function ProjectOverlay({
  project,
  isOpen,
  onClose,
}: ProjectOverlayProps) {
  const router = useRouter();

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [openSection, setOpenSection] = useState<SectionKey>("overview");
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [animationState, setAnimationState] = useState<
    "closed" | "open" | "closing"
  >("closed");

  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const validationAbortRef = useRef<AbortController | null>(null);

  const clearNavigationTimeout = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, []);

  const resetTransientState = useCallback(() => {
    clearNavigationTimeout();

    if (validationAbortRef.current) {
      validationAbortRef.current.abort();
      validationAbortRef.current = null;
    }

    setIsNavigating(false);
    setIsValidating(false);
  }, [clearNavigationTimeout]);

  // Handle animation states when isOpen changes
  useEffect(() => {
    if (isOpen && animationState === "closed") {
      requestAnimationFrame(() => {
        setAnimationState("open");
      });
    } else if (!isOpen && animationState === "open") {
      setAnimationState("closing");
      const timer = setTimeout(() => {
        setAnimationState("closed");
        onClose();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationState, onClose]);

  // Reset navigating state when project changes or overlay closes
  useEffect(() => {
    if (!isOpen) {
      resetTransientState();
      return;
    }

    if (project) {
      setIsNavigating(false);
    }
  }, [isOpen, project, resetTransientState]);

  // Reset states when overlay opens with new project
  useEffect(() => {
    if (isOpen && project) {
      setIsImageLoading(false);
      setImageError(false);
      setIsNavigating(false);
      setOpenSection("overview");
      setValidation(null);
      setIsValidating(Boolean(project.link));
    }
  }, [isOpen, project]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        isOpen &&
        !isNavigating &&
        animationState === "open"
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isNavigating, onClose, animationState]);

  // Handle touch move to prevent background scroll
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

  // Reset stale "redirecting" / "validating" state when the page is restored
  // from history or bfcache after the user presses Back.
  useEffect(() => {
    const handlePageShow = () => {
      resetTransientState();
    };

    const handleFocus = () => {
      resetTransientState();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetTransientState();
      }
    };

    const handlePopState = () => {
      resetTransientState();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetTransientState]);

  // Cleanup pending async work on unmount
  useEffect(() => {
    return () => {
      clearNavigationTimeout();

      if (validationAbortRef.current) {
        validationAbortRef.current.abort();
        validationAbortRef.current = null;
      }
    };
  }, [clearNavigationTimeout]);

  // Validate project link
  useEffect(() => {
    if (!isOpen || !project?.link) {
      setIsValidating(false);
      return;
    }

    const controller = new AbortController();
    validationAbortRef.current = controller;
    let cancelled = false;

    const runValidation = async () => {
      setIsValidating(true);
      setValidation(null);
      setImageError(false);
      setIsImageLoading(false);

      try {
        const response = await fetch(
          `${VALIDATION_ENDPOINT}/?action=validate&url=${encodeURIComponent(project.link ?? "")}`,
          { signal: controller.signal },
        );

        const data: ValidationResult = await response.json();

        if (cancelled) return;

        setValidation(data);

        if (data.isWorking) {
          setIsImageLoading(true);
        }
      } catch (error) {
        if (cancelled || controller.signal.aborted) return;

        setValidation({
          ok: false,
          isWorking: false,
          error: error instanceof Error ? error.message : "Validation failed",
        });
      } finally {
        if (!cancelled && !controller.signal.aborted) {
          setIsValidating(false);
        }
      }
    };

    runValidation();

    return () => {
      cancelled = true;
      controller.abort();

      if (validationAbortRef.current === controller) {
        validationAbortRef.current = null;
      }
    };
  }, [isOpen, project?.link]);

  // Keep redirecting state visible during navigation,
  // but clear it automatically when the user returns.
  const handleNavigate = () => {
    if (!project?.link || isNavigating || isValidating) return;

    const link = project.link;

    startTransition(() => {
      setIsNavigating(true);
    });

    clearNavigationTimeout();

    navigationTimeoutRef.current = setTimeout(() => {
      if (link.startsWith("/")) {
        router.push(link);
      } else {
        window.location.assign(link);
      }
    }, 50);
  };

  const toggleSection = (section: SectionKey) => {
    setOpenSection((prev) => (prev === section ? prev : section));
  };

  const screenshotUrl = useMemo(() => {
    if (!project?.link) return "";
    return `https://api.microlink.io/?url=${encodeURIComponent(
      project.link,
    )}&screenshot=true&embed=screenshot.url`;
  }, [project?.link]);

  const hasLink = Boolean(project?.link);
  const isLinkWorking = Boolean(validation?.isWorking);

  const previewState: PreviewState = !hasLink
    ? "missing"
    : isValidating
      ? "loading"
      : !isLinkWorking
        ? "broken"
        : isImageLoading
          ? "loading"
          : imageError
            ? "broken"
            : "ready";

  const isStatusActive = previewState === "ready";
  const isBrokenState = previewState === "broken";

  const projectCode =
    project?.slug && project?.domain
      ? `PROJECT LINK: ${project.domain.toUpperCase()}${project.slug.toUpperCase()}`
      : project?.slug
        ? `PROJECT://${project.slug.toUpperCase()}`
        : "PROJECT://UNKNOWN";

  const statusLabel =
    previewState === "ready"
      ? "READY FOR ACCESS"
      : previewState === "loading"
        ? "SYNCING PREVIEW"
        : previewState === "missing"
          ? "NO LINK PROVIDED"
          : "PAGE UNAVAILABLE";

  const accessLabel =
    previewState === "ready"
      ? "OPEN"
      : previewState === "loading"
        ? "CHECKING"
        : "DOWN";

  const feedLabel =
    previewState === "ready"
      ? "ACTIVE"
      : previewState === "loading"
        ? "SYNCING"
        : "OFFLINE";

  const recommendation =
    previewState === "ready"
      ? "OPEN PROJECT"
      : previewState === "missing"
        ? "ADD A VALID LINK"
        : "VERIFY ROUTE OR PAGE";

  const diagnosticFlags =
    previewState === "ready"
      ? [
          "LIVE PREVIEW AVAILABLE",
          "SECURE SESSION HANDOFF",
          "REMOTE TARGET VERIFIED",
          "INTERCEPT LAYER ACTIVE",
        ]
      : previewState === "loading"
        ? [
            "PREVIEW REQUEST QUEUED",
            "ROUTE VALIDATION PENDING",
            "REMOTE STATUS UNKNOWN",
            "SESSION CHECK ACTIVE",
          ]
        : previewState === "missing"
          ? [
              "NO TARGET LINK PROVIDED",
              "PREVIEW CAPTURE DISABLED",
              "MANUAL ROUTE REQUIRED",
              "PROJECT RECORD INCOMPLETE",
            ]
          : [
              "PREVIEW CAPTURE FAILED",
              validation?.statusCode
                ? `REMOTE RESPONSE ${validation.statusCode}`
                : "POSSIBLE 404 OR DEAD ROUTE",
              "REMOTE TARGET NOT VERIFIED",
              "MANUAL CHECK RECOMMENDED",
            ];

  const errorTitle =
    previewState === "missing"
      ? "NO LIVE PREVIEW"
      : previewState === "broken"
        ? "PAGE NOT FOUND OR UNREACHABLE"
        : "CAPTURING LIVE PREVIEW";

  const errorSubtitle =
    previewState === "missing"
      ? "LINK NOT PROVIDED"
      : previewState === "broken"
        ? validation?.finalUrl ||
          validation?.error ||
          "Possible 404, bad route, blocked page, or unavailable screenshot source."
        : project?.link || "NO LINK AVAILABLE";

  if (animationState === "closed" || !project) return null;

  return createPortal(
    <div
      className={`threat-overlay-wrapper ${
        animationState === "open" ? "is-open" : ""
      } ${animationState === "closing" ? "is-closing" : ""} ${
        isNavigating ? "is-navigating" : ""
      }`}
      onClick={animationState === "open" && !isNavigating ? onClose : undefined}
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
            <div
              className={`image-container ${
                isBrokenState ? "is-broken-preview" : ""
              } ${previewState === "missing" ? "is-missing-preview" : ""}`}
            >
              {(previewState === "loading" ||
                previewState === "broken" ||
                previewState === "missing") && (
                <div
                  className={`screenshot-loading ${
                    previewState !== "loading" ? "is-error" : ""
                  }`}
                >
                  <div className="preview-status-badge">
                    {previewState === "loading"
                      ? "LIVE FEED"
                      : previewState === "broken"
                        ? "LINK ALERT"
                        : "MISSING LINK"}
                  </div>

                  {previewState === "loading" ? (
                    <div className="loading-spinner" />
                  ) : (
                    <div className="error-icon">!</div>
                  )}

                  <span>{errorTitle}</span>
                  <span className="loading-url">{errorSubtitle}</span>
                </div>
              )}

              {hasLink && isLinkWorking && (
                <img
                  src={screenshotUrl}
                  alt={project.title}
                  className="threat-image"
                  style={{
                    display: previewState === "ready" ? "block" : "none",
                  }}
                  onLoad={() => {
                    setIsImageLoading(false);
                    setImageError(false);
                  }}
                  onError={() => {
                    setImageError(true);
                    setIsImageLoading(false);
                  }}
                />
              )}

              <div className="image-data-overlay">
                <div
                  className={`data-tag ${
                    previewState !== "ready" ? "data-tag-alert" : ""
                  }`}
                >
                  <span
                    className="dot"
                    style={
                      previewState === "ready"
                        ? undefined
                        : {
                            background: "#ff7b72",
                            boxShadow: "0 0 10px rgba(255, 123, 114, 0.5)",
                          }
                    }
                  />
                  <span>
                    {previewState === "ready"
                      ? "LIVE FEED"
                      : previewState === "loading"
                        ? "CHECKING"
                        : "ALERT"}
                  </span>
                </div>

                <div className="image-caption">
                  <span className="image-caption-label">STATUS</span>
                  <span
                    className={`image-caption-value ${
                      previewState !== "ready" ? "caption-alert" : ""
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <span className="stat-label">ACCESS</span>
                <span
                  className={`stat-value ${
                    isStatusActive ? "online" : "offline"
                  }`}
                >
                  {accessLabel}
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">PRIORITY</span>
                <span className="stat-value">
                  {previewState === "ready" ? "ALPHA" : "REVIEW"}
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">FEED</span>
                <span
                  className={`stat-value ${
                    isStatusActive ? "online" : "offline"
                  }`}
                >
                  {feedLabel}
                </span>
              </div>
            </div>

            {hasLink ? (
              <button
                className={`threat-enter-link ${
                  previewState !== "ready" ? "is-warning" : ""
                }`}
                onClick={handleNavigate}
                disabled={isNavigating || isValidating}
                type="button"
              >
                {isNavigating ? (
                  <>
                    <span>REDIRECTING</span>
                    <span className="stream-dots">●●●</span>
                  </>
                ) : isValidating ? (
                  <>
                    <span>VALIDATING...</span>
                    <span className="stream-dots">●●●</span>
                  </>
                ) : previewState === "ready" ? (
                  "OPEN PROJECT"
                ) : (
                  "OPEN ANYWAY"
                )}
              </button>
            ) : (
              <button
                className="threat-enter-link is-disabled-look"
                disabled
                type="button"
              >
                LINK REQUIRED
              </button>
            )}
          </div>

          <div className="threat-data-panel">
            <div className="hero-summary">
              <span className="hero-summary-kicker">MISSION SUMMARY</span>
              <p className="hero-summary-text">
                {previewState === "ready"
                  ? "Secure project preview channel established. Review target status, live route availability, and access readiness before deployment."
                  : previewState === "loading"
                    ? "Preview capture is still syncing. Route validation is in progress and access status is being checked."
                    : previewState === "missing"
                      ? "This project does not currently include a live link, so preview and direct access cannot be verified."
                      : "The target route failed validation. This usually means the route is invalid, the page returns 404, the host is unavailable, or the remote page is blocking access."}
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
                        {validation?.finalUrl ||
                          project.link ||
                          "NO LINK AVAILABLE"}
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
                    {diagnosticFlags.map((flag) => (
                      <span className="flag" key={flag}>
                        {flag}
                      </span>
                    ))}
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
                        {previewState === "ready"
                          ? "ACCESS READY"
                          : previewState === "loading"
                            ? "VALIDATING"
                            : previewState === "missing"
                              ? "LINK MISSING"
                              : "PAGE UNAVAILABLE"}
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
              <span className="stream-text">
                {previewState === "ready"
                  ? "DATA_ACQUISITION_ACTIVE"
                  : previewState === "loading"
                    ? "TARGET_VALIDATION_RUNNING"
                    : "TARGET_VALIDATION_FAILED"}
              </span>
              <span className="stream-dots">●●●</span>
            </div>
          </div>
        </div>

        <div className="threat-footer">
          <div className="footer-left">
            <span
              className="dot"
              style={
                previewState === "ready"
                  ? undefined
                  : {
                      background: "#ff7b72",
                      boxShadow: "0 0 10px rgba(255, 123, 114, 0.5)",
                    }
              }
            />
            <span>
              {previewState === "ready"
                ? "SECURE LINK ESTABLISHED"
                : previewState === "loading"
                  ? "SECURE LINK CHECK IN PROGRESS"
                  : "LINK VERIFICATION FAILED"}
            </span>
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
