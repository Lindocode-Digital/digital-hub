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
import { cardDescription, overlayDescription } from "@/lib/projects";
import "./ProjectOverlay.css";

type ProjectOverlayProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
};

type SectionKey = "overview" | "diagnostics" | "headers" | "recommendation" | "redirects";

type PreviewState = "loading" | "ready" | "broken" | "missing";

type Signal = {
  id: string;
  label: string;
  status: "pass" | "fail" | "warn" | "info" | "skip";
  detail: string;
  points: number;
};

type ValidationResult = {
  id?: number | null;
  url?: string;
  final_url?: string;
  score?: number;
  level?: "good" | "caution" | "high_caution" | "unknown";
  https?: boolean;
  reachable?: boolean;
  status_code?: number | null;
  redirect_count?: number | null;
  has_cross_domain_redirect?: boolean | null;
  response_time_ms?: number | null;
  tls_valid?: boolean | null;
  tls_expired?: boolean | null;
  headers?: {
    hsts: boolean | null;
    csp: boolean | null;
    x_frame_options: boolean | null;
    referrer_policy: boolean | null;
    permissions_policy: boolean | null;
  } | null;
  signals?: Signal[];
  redirect_chain?: string[];
  scanned_at?: string;
  error?: string;
};

type FlagVariant = "safe" | "warn" | "danger" | "neutral";

type DiagnosticFlag = {
  label: string;
  variant: FlagVariant;
  detail: string;
  points: number;
  isSkip: boolean;
};

const SCAN_ENDPOINT = "/digitalhub/api/scan";

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
      const isShowcase = project.cardId !== "link-check";
      setIsImageLoading(Boolean(isShowcase ? (project.background || project.image) : project.background));
      setImageError(false);
      setIsNavigating(false);
      setShowDisclaimer(false);
      setOpenSection("overview");
      setValidation(null);
      setIsValidating(!isShowcase && Boolean(project.link));
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
    if (!isOpen || !project?.link || project.cardId !== "link-check") {
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
        const response = await fetch(SCAN_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: project.link }),
          signal: controller.signal,
        });

        const data: ValidationResult = await response.json();

        if (cancelled) return;

        if (!response.ok || data.error) {
          setValidation({ error: data.error ?? "Scan failed", reachable: false });
        } else {
          setValidation(data);
          if (data.reachable && !project?.background) {
            setIsImageLoading(true);
          }
        }
      } catch (error) {
        if (cancelled || controller.signal.aborted) return;

        setValidation({
          error: error instanceof Error ? error.message : "Validation failed",
          reachable: false,
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
  }, [isOpen, project?.link, project?.cardId]);

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
    if (project.background) return project.background;
    return `https://api.microlink.io/?url=${encodeURIComponent(
      project.link,
    )}&screenshot=true&embed=screenshot.url`;
  }, [project?.link, project?.background]);

  const hasLink = Boolean(project?.link);
  const isLinkWorking = Boolean(validation?.reachable);

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
    validation?.https ?? project?.link?.startsWith("https://"),
  );

  const hasRedirect = (validation?.redirect_count ?? 0) > 0;
  const hasCrossDomainRedirect = Boolean(validation?.has_cross_domain_redirect);

  // Score and level come from the server
  const trustScore: number | null =
    !hasLink || isValidating || validation?.score === undefined
      ? null
      : validation.score;

  const trustLevel =
    trustScore === null
      ? "SCANNING"
      : validation?.level === "good"
        ? "HIGH"
        : validation?.level === "caution"
          ? "MEDIUM"
          : "LOW";

  const passCount = validation?.signals?.filter((s) => s.status === "pass").length ?? 0;
  const failWarnCount = validation?.signals?.filter((s) => s.status === "fail" || s.status === "warn").length ?? 0;
  const skipCount = validation?.signals?.filter((s) => s.status === "skip").length ?? 0;
  const keyIssues = validation?.signals?.filter((s) => s.status === "fail" || s.status === "warn").slice(0, 3) ?? [];

  const verdictAdvice =
    trustLevel === "HIGH"
      ? "All or most safety checks passed — this link appears trustworthy based on automated analysis."
      : trustLevel === "MEDIUM"
        ? "Some checks flagged issues. Review the safety signals before opening, especially any HTTPS or redirect warnings."
        : trustLevel === "LOW"
          ? "Multiple checks failed. This link may be unsafe or unreachable — verify it through an independent source before proceeding."
          : null;

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

  // Map server signals → diagnostic flags; fall back to placeholder sets while
  // loading / broken / missing so the flags panel always has content.
  const signalToFlag = (s: Signal): DiagnosticFlag => ({
    label: s.label.toUpperCase(),
    variant:
      s.status === "pass"
        ? "safe"
        : s.status === "fail"
          ? "danger"
          : s.status === "warn"
            ? "warn"
            : "neutral",
    detail: s.detail,
    points: s.points,
    isSkip: s.status === "skip",
  });

  const diagnosticFlags: DiagnosticFlag[] =
    previewState === "ready" && validation?.signals?.length
      ? validation.signals.map(signalToFlag)
      : previewState === "loading"
        ? [
            { label: "PREVIEW REQUEST QUEUED", variant: "neutral" as FlagVariant, detail: "Waiting for scan response…", points: 0, isSkip: false },
            { label: "ROUTE VALIDATION PENDING", variant: "neutral" as FlagVariant, detail: "Checking reachability and TLS", points: 0, isSkip: false },
            { label: "REMOTE STATUS UNKNOWN", variant: "neutral" as FlagVariant, detail: "Network probe in progress", points: 0, isSkip: false },
            { label: "SESSION CHECK ACTIVE", variant: "neutral" as FlagVariant, detail: "Analysing security headers", points: 0, isSkip: false },
          ]
        : previewState === "missing"
          ? [
              { label: "NO TARGET LINK PROVIDED", variant: "danger" as FlagVariant, detail: "This project has no link configured", points: 0, isSkip: false },
              { label: "PREVIEW CAPTURE DISABLED", variant: "warn" as FlagVariant, detail: "Screenshot requires a valid URL", points: 0, isSkip: false },
              { label: "MANUAL ROUTE REQUIRED", variant: "warn" as FlagVariant, detail: "Add a link to enable safety analysis", points: 0, isSkip: false },
              { label: "PROJECT RECORD INCOMPLETE", variant: "danger" as FlagVariant, detail: "Safety checks cannot run without a target URL", points: 0, isSkip: false },
            ]
          : [
              { label: "PREVIEW CAPTURE FAILED", variant: "danger" as FlagVariant, detail: "Could not load or reach the target URL", points: 0, isSkip: false },
              {
                label: validation?.status_code
                  ? `REMOTE RESPONSE ${validation.status_code}`
                  : "POSSIBLE 404 OR DEAD ROUTE",
                variant: "danger" as FlagVariant,
                detail: "Server returned an error or did not respond",
                points: 0,
                isSkip: false,
              },
              { label: "REMOTE TARGET NOT VERIFIED", variant: "danger" as FlagVariant, detail: "TLS and header checks could not complete", points: 0, isSkip: false },
              { label: "MANUAL CHECK RECOMMENDED", variant: "warn" as FlagVariant, detail: "Verify the link independently before sharing", points: 0, isSkip: false },
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
        ? validation?.final_url ||
          validation?.error ||
          "Possible 404, bad route, blocked page, or unavailable screenshot source."
        : project?.link || "NO LINK AVAILABLE";

  if (animationState === "closed" || !project) return null;

  // Showcase projects (lib/projects.ts) get a clean image + stats panel,
  // not the security analysis UI.
  if (!isUserLink) {
    const showcaseImageSrc = project.background || project.image || "";
    return createPortal(
      <div
        className={`threat-overlay-wrapper ${animationState === "open" ? "is-open" : ""} ${animationState === "closing" ? "is-closing" : ""} ${isNavigating ? "is-navigating" : ""}`}
        onClick={animationState === "open" && !isNavigating ? onClose : undefined}
      >
        <div className="threat-overlay-backdrop" />
        <div
          className="threat-overlay-panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} showcase`}
        >
          <div className="scan-line" />
          <div className="glow-effect" />
          <div className="grid-overlay" />

          <div className="threat-header">
            <div className="threat-title-section">
              <span className="threat-badge">SHOWCASE</span>
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
            {/* Left — image */}
            <div className="threat-image-panel">
              <div className="image-container">
                {showcaseImageSrc ? (
                  <>
                    {isImageLoading && !imageError && (
                      <div className="screenshot-loading">
                        <div className="preview-status-badge">PREVIEW</div>
                        <div className="loading-spinner" />
                      </div>
                    )}
                    {imageError && (
                      <div className="screenshot-loading is-error">
                        <div className="preview-status-badge">PREVIEW</div>
                        <div className="error-icon" style={{ fontSize: "22px" }}>⊘</div>
                        <span>IMAGE UNAVAILABLE</span>
                      </div>
                    )}
                    <img
                      src={showcaseImageSrc}
                      alt={project.title}
                      className="threat-image"
                      style={{ display: !isImageLoading && !imageError ? "block" : "none" }}
                      onLoad={() => { setIsImageLoading(false); setImageError(false); }}
                      onError={() => { setImageError(true); setIsImageLoading(false); }}
                    />
                  </>
                ) : (
                  <div className="screenshot-loading is-error">
                    <div className="preview-status-badge">SHOWCASE</div>
                    <div className="error-icon" style={{ fontSize: "22px" }}>⊘</div>
                    <span>NO PREVIEW AVAILABLE</span>
                  </div>
                )}

                <div className="image-data-overlay">
                  <div className="data-tag">
                    <span className="dot" />
                    <span>SHOWCASE</span>
                  </div>
                  <div className="image-caption">
                    <span className="image-caption-label">TYPE</span>
                    <span className="image-caption-value">
                      {project.cardSubtitle ?? cardDescription(project)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="quick-stats">
                <div className="stat-card">
                  <span className="stat-label">DOMAIN</span>
                  <span className="stat-value online">{project.domain ?? "—"}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">CATEGORY</span>
                  <span className="stat-value">{project.cardSubtitle ?? "PROJECT"}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">STATUS</span>
                  <span className="stat-value online">ACTIVE</span>
                </div>
              </div>

              {project.link ? (
                <button
                  className="threat-enter-link is-safe"
                  onClick={() =>
                    window.open(project.link!, "_blank", "noopener,noreferrer")
                  }
                  disabled={isNavigating}
                  type="button"
                >
                  VISIT PROJECT ↗
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

            {/* Right — project stats */}
            <div className="threat-data-panel">
              <div className="hero-summary">
                <span className="hero-summary-kicker">ABOUT THIS PROJECT</span>
                <p className="hero-summary-text">{overlayDescription(project)}</p>
                {project.extra && (
                  <p
                    className="hero-summary-text"
                    style={{ marginTop: 10, color: "rgba(245, 247, 251, 0.6)" }}
                  >
                    {project.extra}
                  </p>
                )}
              </div>

              <div className="data-section">
                <div className="section-header">
                  <span className="section-title-wrap">
                    <span className="section-icon">◆</span>
                    <span className="section-title">PROJECT DETAILS</span>
                  </span>
                </div>
                <div className="section-body">
                  <div className="data-grid-2col">
                    <div className="data-field">
                      <span className="field-label">TITLE</span>
                      <span className="field-value">{project.cardTitle}</span>
                    </div>
                    <div className="data-field">
                      <span className="field-label">TYPE</span>
                      <span className="field-value">{project.cardSubtitle ?? "—"}</span>
                    </div>
                    <div className="data-field">
                      <span className="field-label">DOMAIN</span>
                      <span className="field-value mono">{project.domain ?? "—"}</span>
                    </div>
                    <div className="data-field">
                      <span className="field-label">LINK</span>
                      <span className="field-value mono">{project.link ?? "—"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {project.attribute && (
                <div className="data-section">
                  <div className="section-header">
                    <span className="section-title-wrap">
                      <span className="section-icon">◆</span>
                      <span className="section-title">CARD IMAGE CREDIT</span>
                    </span>
                  </div>
                  <div className="section-body">
                    <div className="data-grid-2col">
                      <div className="data-field">
                        <span className="field-label">ARTIST</span>
                        <span className="field-value">
                          {project.attribute.artistName}
                        </span>
                      </div>
                      <div className="data-field">
                        <span className="field-label">PLATFORM</span>
                        <span className="field-value">
                          {project.attribute.artistPlatform}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="data-stream">
                <span className="stream-text">SHOWCASE_MODE_ACTIVE</span>
                <span className="stream-dots">●●●</span>
              </div>
            </div>
          </div>

          <div className="threat-footer">
            <div className="footer-left">
              <span className="dot" />
              <span>CURATED PROJECT</span>
            </div>
            <div className="footer-right">
              <span>{project.domain ?? "LINDOCODE"}</span>
              <span>|</span>
              <span>SHOWCASE</span>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

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
                TRUST: {trustScore}/100
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
                      ? `${trustScore}/100`
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
                  ? `Trust score ${trustScore ?? 0}/100 — review the safety signals and redirect data below before opening this link.`
                  : previewState === "loading"
                    ? "Real-time analysis in progress. Scanning the link for safety signals, HTTPS status, TLS certificate, security headers, and redirect chains."
                    : previewState === "missing"
                      ? "No link provided for this project. Preview and safety checks cannot run without a target URL."
                      : "Link validation failed. The target may be unreachable, returning an error, or blocking automated access. Check the safety signals for details."}
              </p>
            </div>

            {/* ── LINK IDENTIFICATION ───────────────────────────────────── */}
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
                        {validation?.final_url ||
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
                              ? `CROSS-DOMAIN → ${(validation?.final_url ?? "").slice(0, 24)}…`
                              : `SAME-DOMAIN → ${(validation?.final_url ?? "").slice(0, 25)}…`}
                      </span>
                    </div>

                    {validation?.tls_valid !== undefined &&
                      validation.tls_valid !== null && (
                        <div className="data-field">
                          <span className="field-label">TLS CERT</span>
                          <span
                            className={`field-value ${
                              validation.tls_valid ? "status-ready" : "offline"
                            }`}
                          >
                            {validation.tls_valid
                              ? "VALID ✓"
                              : validation.tls_expired
                                ? "EXPIRED"
                                : "INVALID"}
                          </span>
                        </div>
                      )}

                    {validation?.response_time_ms !== undefined &&
                      validation.response_time_ms !== null && (
                        <div className="data-field">
                          <span className="field-label">RESPONSE</span>
                          <span
                            className={`field-value ${
                              validation.response_time_ms < 1000
                                ? "status-ready"
                                : validation.response_time_ms < 3000
                                  ? ""
                                  : "offline"
                            }`}
                          >
                            {validation.response_time_ms < 1000
                              ? `${validation.response_time_ms}ms ✓`
                              : validation.response_time_ms < 3000
                                ? `${validation.response_time_ms}ms`
                                : `${(validation.response_time_ms / 1000).toFixed(1)}s SLOW`}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            {/* ── SAFETY SIGNALS ────────────────────────────────────────── */}
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
                  <span className="section-title">SAFETY SIGNALS</span>
                </span>
                <span className="section-chevron">
                  {openSection === "diagnostics" ? "−" : "+"}
                </span>
              </button>

              {openSection === "diagnostics" && (
                <div className="section-body">
                  <div className="signals-detail-list">
                    {diagnosticFlags.map((flag, i) => (
                      <div
                        key={i}
                        className={`signal-detail-row ${flag.isSkip ? "signal-detail-row--skip" : `signal-detail-row--${flag.variant}`}`}
                      >
                        <span className="signal-detail-icon">
                          {flag.isSkip ? "—" : flag.variant === "safe" ? "✓" : flag.variant === "danger" ? "✗" : flag.variant === "warn" ? "!" : "·"}
                        </span>
                        <div className="signal-detail-content">
                          <span className="signal-detail-label">{flag.label}</span>
                          <span className="signal-detail-text">{flag.detail}</span>
                        </div>
                        {flag.points > 0 && (
                          <span className="signal-detail-points">+{flag.points}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {previewState === "ready" && validation?.id === null && (
                    <p className="signals-local-note">
                      Score not saved — deploy backend to enable scan history.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── REDIRECT CHAIN ────────────────────────────────────────── */}
            {validation?.redirect_chain && validation.redirect_chain.length > 1 && (
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
                      {validation.redirect_chain.map((hopUrl, i) => (
                        <div key={i} className="redirect-step">
                          <span className="redirect-step-index">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`redirect-step-url ${
                              i === validation.redirect_chain!.length - 1 ? "is-final" : ""
                            }`}
                          >
                            {hopUrl}
                          </span>
                          {i < validation.redirect_chain!.length - 1 && (
                            <span className="redirect-arrow">↓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── SECURITY HEADERS ──────────────────────────────────────── */}
            {previewState === "ready" && validation?.headers && (
              <div className="data-section">
                <button
                  type="button"
                  className={`section-header clickable ${
                    openSection === "headers" ? "active" : ""
                  }`}
                  onClick={() => toggleSection("headers")}
                  aria-expanded={openSection === "headers"}
                >
                  <span className="section-title-wrap">
                    <span className="section-icon">◆</span>
                    <span className="section-title">SECURITY HEADERS</span>
                  </span>
                  <span className="section-chevron">
                    {openSection === "headers" ? "−" : "+"}
                  </span>
                </button>

                {openSection === "headers" && (
                  <div className="section-body">
                    <div className="data-grid-2col">
                      {(
                        [
                          { label: "HSTS", value: validation.headers.hsts },
                          { label: "CSP", value: validation.headers.csp },
                          { label: "X-FRAME-OPTIONS", value: validation.headers.x_frame_options },
                          { label: "REFERRER-POLICY", value: validation.headers.referrer_policy },
                          { label: "PERMISSIONS-POLICY", value: validation.headers.permissions_policy },
                        ] as { label: string; value: boolean | null }[]
                      ).map(({ label, value }) => (
                        <div className="data-field" key={label}>
                          <span className="field-label">{label}</span>
                          <span
                            className={`field-value ${
                              value === true
                                ? "status-ready"
                                : value === false
                                  ? "offline"
                                  : ""
                            }`}
                          >
                            {value === null ? "N/A" : value ? "PRESENT ✓" : "MISSING"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── VERDICT & ACTION ──────────────────────────────────────── */}
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

                    {previewState === "ready" && trustScore !== null && (
                      <div className="conclusion-row">
                        <span className="conclusion-label">TRUST LEVEL</span>
                        <span
                          className={`conclusion-value verdict-trust-level--${trustLevel.toLowerCase()}`}
                        >
                          {trustLevel}
                        </span>
                      </div>
                    )}
                  </div>

                  {previewState === "ready" && trustScore !== null && (
                    <>
                      {/* Score bar */}
                      <div className="verdict-score-section">
                        <div className="verdict-score-header">
                          <span className="verdict-score-label">TRUST SCORE</span>
                          <span className="verdict-score-value">{trustScore}/100</span>
                        </div>
                        <div className="verdict-score-track">
                          <div
                            className={`verdict-score-fill verdict-score-fill--${trustLevel.toLowerCase()}`}
                            style={{ width: `${trustScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Checks summary */}
                      <div className="verdict-checks-row">
                        <div className="verdict-check-cell">
                          <span className="verdict-check-num verdict-check-num--pass">{passCount}</span>
                          <span className="verdict-check-desc">PASSED</span>
                        </div>
                        <div className="verdict-check-cell">
                          <span className="verdict-check-num verdict-check-num--fail">{failWarnCount}</span>
                          <span className="verdict-check-desc">FLAGGED</span>
                        </div>
                        {skipCount > 0 && (
                          <div className="verdict-check-cell">
                            <span className="verdict-check-num verdict-check-num--skip">{skipCount}</span>
                            <span className="verdict-check-desc">SKIPPED</span>
                          </div>
                        )}
                      </div>

                      {/* Key issues */}
                      {keyIssues.length > 0 && (
                        <div className="verdict-issues">
                          <span className="verdict-issues-title">KEY ISSUES</span>
                          {keyIssues.map((issue) => (
                            <div
                              key={issue.id}
                              className={`verdict-issue ${issue.status === "fail" ? "verdict-issue--danger" : "verdict-issue--warn"}`}
                            >
                              <span className="verdict-issue-icon">
                                {issue.status === "fail" ? "✗" : "!"}
                              </span>
                              <div className="verdict-issue-body">
                                <span className="verdict-issue-label">{issue.label}</span>
                                <span className="verdict-issue-detail">{issue.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Level advice */}
                      {verdictAdvice && (
                        <p className="verdict-advice">{verdictAdvice}</p>
                      )}
                    </>
                  )}
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
                  {trustScore}/100
                </span>
                &nbsp;&nbsp;·&nbsp;&nbsp;{trustLevel}
              </div>

              <p className="safety-disclaimer-text">
                Score is out of&nbsp;<strong>100</strong>. Checks cover HTTPS,
                reachability, TLS certificate validity, redirect chains, and
                security headers — they cannot assess content, intent, or
                legitimacy. Verify the link independently before proceeding.
              </p>

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
