"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import "./TransitionProvider.css";

type TransitionContextValue = {
  startPageTransition: (navigate: () => Promise<void> | void) => Promise<void>;
};

const TransitionContext = createContext<TransitionContextValue | undefined>(
  undefined,
);

export function usePageTransition() {
  const context = useContext(TransitionContext);

  if (context) {
    return context;
  }

  // Safe fallback so the app never crashes even if a component renders
  // outside the provider during refactors.
  return {
    startPageTransition: async (navigate: () => Promise<void> | void) => {
      await navigate();
    },
  };
}

type TransitionProviderProps = {
  children: React.ReactNode;
};

export default function TransitionProvider({
  children,
}: TransitionProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"idle" | "enter" | "exit">("idle");
  const isRunningRef = useRef(false);
  const navigationPromiseRef = useRef<Promise<void> | null>(null);

  const startPageTransition = useCallback(
    async (navigate: () => Promise<void> | void) => {
      if (isRunningRef.current) return;

      isRunningRef.current = true;
      setPhase("enter");
      setIsActive(true);

      // Show enter animation
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Start navigation and wait for it to complete
      const navigationResult = navigate();
      navigationPromiseRef.current =
        navigationResult instanceof Promise
          ? navigationResult
          : Promise.resolve();

      try {
        await navigationPromiseRef.current;
      } catch (error) {
        console.error("Navigation failed:", error);
        // Reset state on error
        setIsActive(false);
        setPhase("idle");
        isRunningRef.current = false;
        navigationPromiseRef.current = null;
        return;
      }

      // Switch to exit phase
      setPhase("exit");

      // Wait for exit animation to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Clean up
      setIsActive(false);
      setPhase("idle");
      isRunningRef.current = false;
      navigationPromiseRef.current = null;
    },
    [],
  );

  const value = useMemo(
    () => ({
      startPageTransition,
    }),
    [startPageTransition],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}

      <div
        className={`route-transition-overlay ${isActive ? "is-active" : ""} ${
          phase === "enter" ? "is-entering" : ""
        } ${phase === "exit" ? "is-exiting" : ""}`}
        aria-hidden="true"
      >
        <div className="route-transition-overlay__noise" />
        <div className="route-transition-overlay__vignette" />
        <div className="route-transition-overlay__grid" />

        <div className="route-transition-overlay__topbar">
          <span className="route-transition-overlay__tag">
            BETA TEST COMPLETE
          </span>
          <span className="route-transition-overlay__status">
            FEED ACCESS TERMINATES IN <em>00:03</em>
          </span>
        </div>

        <div className="route-transition-overlay__center">
          <div className="route-transition-overlay__terminal">
            <span>INITIALIZING SECURE RELAY...</span>
            <span>VERIFYING TARGET ROUTE...</span>
            <span>GRANTING PAGE ACCESS...</span>
            <span className={phase === "exit" ? "loading-complete" : ""}>
              {phase === "exit" ? "ACCESS GRANTED" : "LOADING ASSETS..."}
            </span>
          </div>
        </div>

        <div className="route-transition-overlay__scanline" />
        <div className="route-transition-overlay__flash" />

        <div className="route-transition-overlay__footer">
          <span>REMOTE SESSION ACTIVE</span>
          <span>CHANNEL LOCKED</span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
