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

type SectionKey = "overview" | "diagnostics" | "recommendation" | "redirects";

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
  redirectChain?: string[];
  responseTime?: number;
};

type FlagVariant = "safe" | "warn" | "danger" | "neutral";

type DiagnosticFlag = {
  label: string;
  variant: FlagVariant;
};

const VALIDATION_ENDPOINT = "/digitalhub/api/validate";

export default function ProjectOverlay({
  project,
  isOpen,
  onClose,
}: ProjectOverlayProps) {
  const router = useRouter();

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
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
      setShowDisclaimer(false);
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

  useEffect(() => {
    return () => {
      clearNavigationTimeout();

      if (validationAbortRef.current) {
        validationAbortRef.current.abort();
        validationAbortRef.current = null;
      }
    };
  }, [clearNavigationTimeout]);

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
          `${VALIDATION_ENDPOINT}?url=${encodeURIComponent(project.link ?? "")}`,
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

  // Links scanned via the LinkChecker bar get the safety disclaimer on open.
  // Curated projects in lib/projects.ts (cardId !== "link-check") skip it.
  const isUserLink = project?.cardId === "link-check";

  const proceedWithNavigation = () => {
    if (!project?.link || isNavigating) return;
    const link = project.link;
    setShowDisclaimer(false);
    startTransition(() => setIsNavigating(true));
    clearNavigationTimeout();
    navigationTimeoutRef.current = setTimeout(() => {
      if (link.startsWith("/")) {
        router.push(link);
      } else {
        window.open(link, "_blank", "noopener,noreferrer");
      }
    }, 50);
  };

  const handleNavigate = () => {
    if (!project?.link || isNavigating || isValidating) return;
    if (isUserLink) {
      setShowDisclaimer(true);
      return;
    }
    proceedWithNavigation();
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
        : "ready";

  const isStatusActive = previewState === "ready";
  const isBrokenState = previewState === "broken";

  const isHttps = Boolean(
    project?.link?.startsWith("https://") ||
      validation?.finalUrl?.startsWith("https://"),
  );

  const hasRedirect = Boolean(
    validation?.finalUrl &&
      project?.link &&
      validation.finalUrl !== project.link,
  );

  // Only cross-domain redirects (e.g. google.com → evil.com) are suspicious.
  // Same-domain redirects (www ↔ non-www, trailing slash) are routine and safe.
  const hasCrossDomainRedirect = useMemo(() => {
    if (!validation?.redirectChain || validation.redirectChain.length < 2) return false;
    try {
      const firstHost = new URL(validation.redirectChain[0]).hostname.replace(/^www\./, "");
      const lastHost = new URL(validation.redirectChain[validation.redirectChain.length - 1]).hostname.replace(/^www\./, "");
      return firstHost !== lastHost;
    } catch {
      return false;
    }
  }, [validation?.redirectChain]);

  // Max achievable score is 85. Automated checks cannot guarantee content safety,
  // so 100 is intentionally unreachable.
  const trustScore: number | null = useMemo(() => {
    if (!hasLink || isValidating || !validation) return null;
    let score = 0;
    if (isHttps) score += 30;
    if (validation.isWorking) score += 25;
    if (!hasCrossDomainRedirect) score += 15;
    if (validation.statusCode === 200) score += 15;
    return score; // max 85
  }, [hasLink, isValidating, validation, isHttps, hasCrossDomainRedirect]);

  const trustLevel =
    trustScore === null
      ? "SCANNING"
      : trustScore >= 70
        ? "HIGH"
        : trustScore >= 45
          ? "MEDIUM"
          : "LOW";

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

  const recommendation =
    previewState === "ready"
      ? "OPEN PROJECT"
      : previewState === "missing"
        ? "ADD A VALID LINK"
        : "VERIFY ROUTE OR PAGE";

  const diagnosticFlags: DiagnosticFlag[] =
    previewState === "ready" && validation
      ? [
          {
            label: isHttps ? "HTTPS: ENCRYPTED CONNECTION" : "HTTP: NO ENCRYPTION",
            variant: isHttps ? "safe" : "danger",
          },
          {
            label: `HTTP ${validation.statusCode ?? "---"}: ${validation.statusText ?? "OK"}`,
            variant:
              validation.statusCode === 200
                ? "safe"
                : validation.statusCode && validation.statusCode < 400
                  ? "safe"
                  : validation.statusCode && validation.statusCode < 500
                    ? "warn"
                    : "danger",
          },
          {
            label: !hasRedirect
              ? "NO REDIRECT DETECTED"
              : hasCrossDomainRedirect
                ? "CROSS-DOMAIN REDIRECT DETECTED"
                : "SAME-DOMAIN REDIRECT (NORMAL)",
            variant: !hasRedirect ? "safe" : hasCrossDomainRedirect ? "danger" : "warn",
          },
          {
            label: validation.contentType
              ? `TYPE: ${validation.contentType.split(";")[0].trim().toUpperCase()}`
              : "CONTENT TYPE UNKNOWN",
            variant: validation.contentType ? "neutral" : "warn",
          },
        ]
      : previewState === "loading"
        ? [
            { label: "PREVIEW REQUEST QUEUED", variant: "neutral" },
            { label: "ROUTE VALIDATION PENDING", variant: "neutral" },
            { label: "REMOTE STATUS UNKNOWN", variant: "neutral" },
            { label: "SESSION CHECK ACTIVE", variant: "neutral" },
          ]
        : previewState === "missing"
          ? [
              { label: "NO TARGET LINK PROVIDED", variant: "danger" },
              { label: "PREVIEW CAPTURE DISABLED", variant: "warn" },
              { label: "MANUAL ROUTE REQUIRED", variant: "warn" },
              { label: "PROJECT RECORD INCOMPLETE", variant: "danger" },
            ]
          : [
              { label: "PREVIEW CAPTURE FAILED", variant: "danger" },
              {
                label: validation?.statusCode
                  ? `REMOTE RESPONSE ${validation.statusCode}`
                  : "POSSIBLE 404 OR DEAD ROUTE",
                variant: "danger",
              },
              { label: "REMOTE TARGET NOT VERIFIED", variant: "danger" },
              { label: "MANUAL CHECK RECOMMENDED", variant: "warn" },
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

  let checkHostname = "";
  try {
    if (project.link) checkHostname = new URL(project.link).hostname;
  } catch {}

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
            {!isValidating && hasLink && trustScore !== null && (
              <span
                className="threat-badge"
                style={
                  trustLevel === "HIGH"
                    ? {
                        borderColor: "rgba(78, 200, 120, 0.45)",
                        background: "rgba(78, 200, 120, 0.12)",
                        color: "#a5ffb4",
                      }
                    : trustLevel === "MEDIUM"
                      ? {
                          borderColor: "rgba(255, 196, 107, 0.45)",
                          background: "rgba(255, 196, 107, 0.12)",
                          color: "#ffd6a1",
                        }
                      : {
                          borderColor: "rgba(255, 123, 114, 0.45)",
                          background: "rgba(255, 123, 114, 0.12)",
                          color: "#ffb4ac",
                        }
                }
              >
                TRUST: {trustScore}/85
              </span>
            )}
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
              {/* Validation states: still checking / link down / no link */}
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

              {/* Link verified — screenshot capturing */}
              {previewState === "ready" && isImageLoading && (
                <div className="screenshot-loading">
                  <div className="preview-status-badge">LIVE FEED</div>
                  <div className="loading-spinner" />
                  <span>CAPTURING LIVE PREVIEW</span>
                  <span className="loading-url">{project?.link}</span>
                </div>
              )}

              {/* Link verified — screenshot blocked/unavailable */}
              {previewState === "ready" && !isImageLoading && imageError && (
                <div className="screenshot-loading is-error">
                  <div className="preview-status-badge">PREVIEW</div>
                  <div className="error-icon" style={{ fontSize: "22px" }}>
                    ⊘
                  </div>
                  <span>SCREENSHOT UNAVAILABLE</span>
                  <span className="loading-url">
                    Link verified — preview blocked or restricted
                  </span>
                </div>
              )}

              {hasLink && isLinkWorking && (
                <img
                  src={screenshotUrl}
                  alt={project.title}
                  className="threat-image"
                  style={{
                    display:
                      previewState === "ready" &&
                      !isImageLoading &&
                      !imageError
                        ? "block"
                        : "none",
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
                    {previewState === "ready" && !isImageLoading
                      ? imageError
                        ? "PREVIEW"
                        : "LIVE FEED"
                      : previewState === "loading" || isImageLoading
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
                <span className="stat-label">HTTPS</span>
                <span
                  className={`stat-value ${
                    isHttps && previewState === "ready" ? "online" : "offline"
                  }`}
                >
                  {isValidating
                    ? "CHECKING"
                    : isHttps
                      ? "SECURE"
                      : hasLink
                        ? "NONE"
                        : "N/A"}
                </span>
              </div>

              <div className="stat-card">
                <span className="stat-label">TRUST SCORE</span>
                <span
                  className={`stat-value ${
                    trustScore !== null && trustScore >= 70 ? "online" : "offline"
                  }`}
                >
                  {isValidating
                    ? "SCANNING"
                    : trustScore !== null
                      ? `${trustScore}/85`
                      : "N/A"}
                </span>
              </div>
            </div>

            {hasLink ? (
              <button
                className={`threat-enter-link ${
                  previewState === "ready" ? "is-safe" : "is-warning"
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
              <span className="hero-summary-kicker">LINK ANALYSIS</span>
              <p className="hero-summary-text">
                {previewState === "ready"
                  ? `Trust score ${trustScore ?? 0}/85 — review the safety flags and redirect data below before opening this link.`
                  : previewState === "loading"
                    ? "Real-time analysis in progress. Scanning the link for safety signals, HTTPS status, and redirect chains."
                    : previewState === "missing"
                      ? "No link provided for this project. Preview and safety checks cannot run without a target URL."
                      : "Link validation failed. The target may be unreachable, returning an error, or blocking automated access. Check the safety flags for details."}
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
                  <span className="section-title">LINK IDENTIFICATION</span>
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

                    <div className="data-field">
                      <span className="field-label">HTTPS</span>
                      <span
                        className={`field-value ${isHttps ? "status-ready" : "offline"}`}
                      >
                        {isHttps ? "SECURE ✓" : "NOT SECURE"}
                      </span>
                    </div>

                    <div className="data-field">
                      <span className="field-label">REDIRECT</span>
                      <span className="field-value mono">
                        {isValidating
                          ? "CHECKING..."
                          : !hasRedirect
                            ? "NONE DETECTED"
                            : hasCrossDomainRedirect
                              ? `CROSS-DOMAIN → ${(validation?.finalUrl ?? "").slice(0, 24)}…`
                              : `SAME-DOMAIN → ${(validation?.finalUrl ?? "").slice(0, 25)}…`}
                      </span>
                    </div>

                    {validation?.responseTime !== undefined && (
                      <div className="data-field">
                        <span className="field-label">RESPONSE</span>
                        <span
                          className={`field-value ${
                            validation.responseTime < 1000
                              ? "status-ready"
                              : validation.responseTime < 3000
                                ? ""
                                : "offline"
                          }`}
                        >
                          {validation.responseTime < 1000
                            ? `${validation.responseTime}ms ✓`
                            : validation.responseTime < 3000
                              ? `${validation.responseTime}ms`
                              : `${(validation.responseTime / 1000).toFixed(1)}s SLOW`}
                        </span>
                      </div>
                    )}
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
                  <span className="section-title">SAFETY FLAGS</span>
                </span>
                <span className="section-chevron">
                  {openSection === "diagnostics" ? "−" : "+"}
                </span>
              </button>

              {openSection === "diagnostics" && (
                <div className="section-body">
                  <div className="flags-list">
                    {diagnosticFlags.map((flag) => (
                      <span className={`flag flag-${flag.variant}`} key={flag.label}>
                        {flag.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {validation?.redirectChain && validation.redirectChain.length > 1 && (
              <div className="data-section">
                <button
                  type="button"
                  className={`section-header clickable ${
                    openSection === "redirects" ? "active" : ""
                  }`}
                  onClick={() => toggleSection("redirects")}
                  aria-expanded={openSection === "redirects"}
                >
                  <span className="section-title-wrap">
                    <span className="section-icon" style={{ color: "#fde047" }}>◆</span>
                    <span className="section-title">REDIRECT CHAIN</span>
                  </span>
                  <span className="section-chevron">
                    {openSection === "redirects" ? "−" : "+"}
                  </span>
                </button>

                {openSection === "redirects" && (
                  <div className="section-body">
                    <div className="redirect-chain">
                      {validation.redirectChain.map((hopUrl, i) => (
                        <div key={i} className="redirect-step">
                          <span className="redirect-step-index">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`redirect-step-url ${
                              i === validation.redirectChain!.length - 1 ? "is-final" : ""
                            }`}
                          >
                            {hopUrl}
                          </span>
                          {i < validation.redirectChain!.length - 1 && (
                            <span className="redirect-arrow">↓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  <span className="section-title">VERDICT & ACTION</span>
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

        {/* Safety disclaimer — shown on open-click for user-submitted links */}
        {showDisclaimer && (
          <div className="safety-disclaimer-overlay">
            <div
              className="safety-disclaimer-panel"
              style={{
                borderColor:
                  trustLevel === "HIGH"
                    ? "rgba(234, 179, 8, 0.45)"
                    : trustLevel === "MEDIUM"
                      ? "rgba(251, 146, 60, 0.45)"
                      : "rgba(239, 68, 68, 0.45)",
                boxShadow:
                  trustLevel === "HIGH"
                    ? "0 0 50px rgba(234, 179, 8, 0.14), 0 28px 64px rgba(0,0,0,0.65)"
                    : trustLevel === "MEDIUM"
                      ? "0 0 50px rgba(251, 146, 60, 0.14), 0 28px 64px rgba(0,0,0,0.65)"
                      : "0 0 50px rgba(239, 68, 68, 0.14), 0 28px 64px rgba(0,0,0,0.65)",
              }}
            >
              {/* X — dismiss without navigating */}
              <button
                className="safety-disclaimer-close"
                onClick={() => setShowDisclaimer(false)}
                type="button"
                aria-label="Cancel"
              >
                ✕
              </button>

              <span
                className="safety-disclaimer-icon"
                aria-hidden="true"
                style={{
                  color:
                    trustLevel === "HIGH"
                      ? "#fde047"
                      : trustLevel === "MEDIUM"
                        ? "#fb923c"
                        : "#f87171",
                }}
              >
                ⚠
              </span>

              <div className="safety-disclaimer-score">
                TRUST SCORE&nbsp;&nbsp;
                <span
                  style={{
                    color:
                      trustLevel === "HIGH"
                        ? "#a5ffb4"
                        : trustLevel === "MEDIUM"
                          ? "#fde047"
                          : "#ffd6d5",
                  }}
                >
                  {trustScore}/85
                </span>
                &nbsp;&nbsp;·&nbsp;&nbsp;{trustLevel}
              </div>

              <p className="safety-disclaimer-text">
                Score is capped at&nbsp;<strong>85</strong> by design.
                Automated checks cover HTTPS, reachability, and redirect
                patterns only — they cannot assess content, intent, or
                legitimacy. Verify the link independently before proceeding.
              </p>

              {/* Third-party verification services */}
              <div className="safety-verify-section">
                <span className="safety-verify-label">VERIFY INDEPENDENTLY</span>
                <div className="safety-verify-links">
                  <a
                    href={`https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(project.link ?? "")}&hl=en`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="safety-verify-link"
                  >
                    Google Safe Browsing ↗
                  </a>
                  <a
                    href="https://www.virustotal.com/gui/home/url"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="safety-verify-link"
                  >
                    VirusTotal ↗
                  </a>
                  <a
                    href={`https://www.urlvoid.com/scan/${checkHostname}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="safety-verify-link"
                  >
                    URLVoid ↗
                  </a>
                  <a
                    href={`https://who.is/whois/${checkHostname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="safety-verify-link"
                  >
                    WHOIS Lookup ↗
                  </a>
                </div>
              </div>

              <div className="safety-disclaimer-actions">
                <button
                  className="safety-disclaimer-btn"
                  onClick={proceedWithNavigation}
                  type="button"
                  style={{
                    borderColor:
                      trustLevel === "HIGH"
                        ? "rgba(234, 179, 8, 0.55)"
                        : trustLevel === "MEDIUM"
                          ? "rgba(251, 146, 60, 0.55)"
                          : "rgba(239, 68, 68, 0.55)",
                    color:
                      trustLevel === "HIGH"
                        ? "#fde047"
                        : trustLevel === "MEDIUM"
                          ? "#fb923c"
                          : "#f87171",
                    background:
                      trustLevel === "HIGH"
                        ? "linear-gradient(135deg, rgba(234, 179, 8, 0.18), rgba(234, 179, 8, 0.06))"
                        : trustLevel === "MEDIUM"
                          ? "linear-gradient(135deg, rgba(251, 146, 60, 0.18), rgba(251, 146, 60, 0.06))"
                          : "linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(239, 68, 68, 0.06))",
                  }}
                >
                  OPEN IN NEW TAB ↗
                </button>

                <button
                  className="safety-disclaimer-cancel"
                  onClick={() => setShowDisclaimer(false)}
                  type="button"
                >
                  Cancel — go back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
