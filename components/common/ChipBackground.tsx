"use client";

import { useEffect, useState } from "react";

export default function ChipBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="chip-bg" aria-hidden="true">
      <style jsx>{`
        .chip-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
          mix-blend-mode: normal;
        }

        .chip-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0) 48%
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(201, 2, 1, 0.06) 0%,
              rgba(201, 2, 1, 0) 62%
            );
          opacity: 0.8;
        }

        .chip-bg svg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(1900px, 130vw);
          height: auto;
          min-height: 100vh;
          transform: translate(-50%, -50%);
          display: block;
          opacity: 0;
          animation: bgFadeIn 0.8s ease forwards;
        }

        #chip-bg .drift-slow {
          animation: driftSlow 18s ease-in-out infinite alternate;
          transform-origin: center;
        }

        #chip-bg .drift-fast {
          animation: driftFast 11s ease-in-out infinite alternate;
          transform-origin: center;
        }

        #chip-bg .board-grid {
          opacity: 0.16;
        }

        #chip-bg .board-grid line {
          stroke: rgba(0, 0, 0, 0.08);
          stroke-width: 1;
        }

        #chip-bg .trace {
          fill: none;
          stroke: rgba(135, 8, 8, 0.24);
          stroke-width: 10;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.45;
        }

        #chip-bg .trace-top {
          fill: none;
          stroke: #c90201;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          opacity: 0;
          filter: drop-shadow(0 0 4px rgba(201, 2, 1, 0.16));
          animation:
            traceReveal 0.01s linear forwards,
            traceDraw 3.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards,
            traceGlow 4s ease-in-out 3.4s;
        }

        #chip-bg .trace-top.delay-1 {
          animation-delay: 0s, 0.18s, 3.58s;
        }

        #chip-bg .trace-top.delay-2 {
          animation-delay: 0s, 0.34s, 3.74s;
        }

        #chip-bg .trace-top.delay-3 {
          animation-delay: 0s, 0.5s, 3.9s;
        }

        #chip-bg .trace-top.delay-4 {
          animation-delay: 0s, 0.66s, 4.06s;
        }

        #chip-bg .trace-top.delay-5 {
          animation-delay: 0s, 0.82s, 4.22s;
        }

        #chip-bg .trace-top.delay-6 {
          animation-delay: 0s, 0.98s, 4.38s;
        }

        #chip-bg .trace-top.delay-7 {
          animation-delay: 0s, 1.14s, 4.54s;
        }

        #chip-bg .trace-top.delay-8 {
          animation-delay: 0s, 1.3s, 4.7s;
        }

        #chip-bg .trace-top.delay-9 {
          animation-delay: 0s, 1.46s, 4.86s;
        }

        #chip-bg .trace-top.delay-10 {
          animation-delay: 0s, 1.62s, 5.02s;
        }

        #chip-bg .trace-top.delay-11 {
          animation-delay: 0s, 1.78s, 5.18s;
        }

        #chip-bg .trace-top.delay-12 {
          animation-delay: 0s, 1.94s, 5.34s;
        }

        #chip-bg .trace-muted {
          fill: none;
          stroke: rgba(0, 0, 0, 0.09);
          stroke-width: 1.3;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.65;
        }

        #chip-bg .pad {
          fill: #161616;
          opacity: 0.78;
        }

        #chip-bg .pad-ring {
          fill: none;
          stroke: rgba(201, 2, 1, 0.22);
          stroke-width: 1.2;
          opacity: 0.75;
        }

        #chip-bg .via {
          fill: #c90201;
          opacity: 0;
          filter: drop-shadow(0 0 5px rgba(201, 2, 1, 0.18));
          animation:
            nodeReveal 0.01s linear forwards,
            nodePulse 3.6s ease-in-out;
        }

        #chip-bg .via.delay-1 {
          animation-delay: 1.2s, 3.8s;
        }

        #chip-bg .via.delay-2 {
          animation-delay: 1.6s, 4.2s;
        }

        #chip-bg .via.delay-3 {
          animation-delay: 2s, 4.6s;
        }

        #chip-bg .via.delay-4 {
          animation-delay: 2.4s, 5s;
        }

        #chip-bg .chip-core {
          filter: drop-shadow(0 16px 38px rgba(0, 0, 0, 0.14));
        }

        #chip-bg .chip-shell {
          fill: rgba(255, 255, 255, 0.64);
          stroke: rgba(0, 0, 0, 0.1);
          stroke-width: 1.3;
          backdrop-filter: blur(3px);
        }

        #chip-bg .chip-inner {
          fill: rgba(12, 12, 12, 0.9);
          stroke: rgba(255, 255, 255, 0.06);
          stroke-width: 1;
        }

        #chip-bg .chip-highlight {
          fill: none;
          stroke: rgba(255, 255, 255, 0.16);
          stroke-width: 1;
        }

        #chip-bg .chip-pin {
          fill: rgba(25, 25, 25, 0.9);
          stroke: rgba(201, 2, 1, 0.18);
          stroke-width: 0.9;
        }

        #chip-bg .chip-accent {
          fill: none;
          stroke: rgba(201, 2, 1, 0.25);
          stroke-width: 1.4;
        }

        #chip-bg .signal {
          fill: #f5d37a;
          opacity: 0;
          filter: drop-shadow(0 0 7px rgba(245, 211, 122, 0.3));
          animation: signalMove 6s linear infinite;
        }

        #chip-bg .signal.s1 {
          offset-path: path("M0 170 H280 L350 240 H545");
          animation-delay: 1.2s;
        }

        #chip-bg .signal.s2 {
          offset-path: path("M1440 180 H1160 L1090 250 H895");
          animation-delay: 2.4s;
        }

        #chip-bg .signal.s3 {
          offset-path: path("M0 545 H245 L315 512 H545");
          animation-delay: 3.2s;
        }

        #chip-bg .signal.s4 {
          offset-path: path("M1440 560 H1195 L1115 520 H895");
          animation-delay: 4.1s;
        }

        #chip-bg .signal.s5 {
          offset-path: path("M220 1024 V845 L320 770 H585");
          animation-delay: 5s;
        }

        #chip-bg .signal.s6 {
          offset-path: path("M1220 1024 V850 L1120 770 H855");
          animation-delay: 5.7s;
        }

        #chip-bg .mobile-only {
          display: none;
        }

        #chip-bg .desktop-only {
          display: inline;
        }

        @media (max-width: 900px) {
          .chip-bg svg {
            width: min(1500px, 165vw);
          }

          #chip-bg .desktop-only {
            display: none;
          }

          #chip-bg .mobile-only {
            display: inline;
          }

          #chip-bg .trace-top {
            stroke-width: 1.8;
          }

          #chip-bg .trace {
            stroke-width: 8;
          }

          #chip-bg .chip-shell {
            opacity: 0.92;
          }
        }

        @media (max-width: 640px) {
          .chip-bg {
            opacity: 0.82;
          }

          .chip-bg svg {
            width: min(1300px, 185vw);
          }

          #chip-bg .board-grid {
            opacity: 0.09;
          }

          #chip-bg .trace-muted {
            opacity: 0.35;
          }

          #chip-bg .signal {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .chip-bg svg,
          #chip-bg .drift-slow,
          #chip-bg .drift-fast,
          #chip-bg .trace-top,
          #chip-bg .via,
          #chip-bg .signal {
            animation: none !important;
          }

          .chip-bg svg {
            opacity: 0.92;
          }

          #chip-bg .trace-top,
          #chip-bg .via {
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }

        @keyframes bgFadeIn {
          to {
            opacity: 0.95;
          }
        }

        @keyframes traceReveal {
          to {
            opacity: 0.92;
          }
        }

        @keyframes nodeReveal {
          to {
            opacity: 0.95;
          }
        }

        @keyframes traceDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes traceGlow {
          0%,
          100% {
            opacity: 0.75;
            filter: drop-shadow(0 0 3px rgba(201, 2, 1, 0.08));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 8px rgba(201, 2, 1, 0.18));
          }
        }

        @keyframes nodePulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.82;
          }
          50% {
            transform: scale(1.22);
            opacity: 1;
          }
        }

        @keyframes driftSlow {
          from {
            transform: translateY(0) translateX(0);
          }
          to {
            transform: translateY(7px) translateX(-4px);
          }
        }

        @keyframes driftFast {
          from {
            transform: translateY(0) translateX(0);
          }
          to {
            transform: translateY(-5px) translateX(5px);
          }
        }

        @keyframes signalMove {
          0% {
            opacity: 0;
            offset-distance: 0%;
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            offset-distance: 100%;
          }
        }
      `}</style>

      <svg
        id="chip-bg"
        viewBox="0 0 1440 1024"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="chipMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="50%" stopColor="rgba(245,245,245,0.45)" />
            <stop offset="100%" stopColor="rgba(210,210,210,0.2)" />
          </linearGradient>

          <radialGradient id="coreGlow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="rgba(201,2,1,0.12)" />
            <stop offset="60%" stopColor="rgba(201,2,1,0.045)" />
            <stop offset="100%" stopColor="rgba(201,2,1,0)" />
          </radialGradient>
        </defs>

        <g className="board-grid drift-slow">
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={80 + i * 85}
              y1="0"
              x2={80 + i * 85}
              y2="1024"
            />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={70 + i * 85}
              x2="1440"
              y2={70 + i * 85}
            />
          ))}
        </g>

        <g className="drift-fast">
          {/* background routing */}
          <path className="trace-muted" d="M0 170 H280 L350 240 H545" />
          <path className="trace-muted" d="M1440 180 H1160 L1090 250 H895" />
          <path className="trace-muted" d="M0 545 H245 L315 512 H545" />
          <path className="trace-muted" d="M1440 560 H1195 L1115 520 H895" />
          <path className="trace-muted" d="M220 1024 V845 L320 770 H585" />
          <path className="trace-muted" d="M1220 1024 V850 L1120 770 H855" />

          <path
            className="trace-muted desktop-only"
            d="M65 60 H260 L360 150 H590"
          />
          <path
            className="trace-muted desktop-only"
            d="M1375 75 H1180 L1080 155 H850"
          />
          <path
            className="trace-muted desktop-only"
            d="M90 885 H230 L330 810 H585"
          />
          <path
            className="trace-muted desktop-only"
            d="M1350 900 H1210 L1115 820 H855"
          />

          {/* thick underlay traces */}
          {/* <path className="trace" d="M0 170 H280 L350 240 H545" /> */}
          {/* <path className="trace" d="M1440 180 H1160 L1090 250 H895" /> */}
          {/* <path className="trace" d="M0 545 H245 L315 512 H545" /> */}
          {/* <path className="trace" d="M1440 560 H1195 L1115 520 H895" /> */}
          {/* <path className="trace" d="M220 1024 V845 L320 770 H585" /> */}
          {/* <path className="trace" d="M1220 1024 V850 L1120 770 H855" /> */}
          {/**/}
          {/* <path className="trace desktop-only" d="M65 60 H260 L360 150 H590" /> */}
          {/* <path */}
          {/*   className="trace desktop-only" */}
          {/*   d="M1375 75 H1180 L1080 155 H850" */}
          {/* /> */}
          {/* <path className="trace desktop-only" d="M90 885 H230 L330 810 H585" /> */}
          {/* <path */}
          {/*   className="trace desktop-only" */}
          {/*   d="M1350 900 H1210 L1115 820 H855" */}
          {/* /> */}
          {/**/}
          {/* <path className="trace mobile-only" d="M0 120 H250 L330 190 H555" /> */}
          {/* <path */}
          {/*   className="trace mobile-only" */}
          {/*   d="M1440 120 H1190 L1110 190 H885" */}
          {/* /> */}

          {/* top traces */}
          <path className="trace-top delay-1" d="M0 170 H280 L350 240 H545" />
          <path
            className="trace-top delay-2"
            d="M1440 180 H1160 L1090 250 H895"
          />
          <path className="trace-top delay-3" d="M0 545 H245 L315 512 H545" />
          <path
            className="trace-top delay-4"
            d="M1440 560 H1195 L1115 520 H895"
          />
          <path
            className="trace-top delay-5"
            d="M220 1024 V845 L320 770 H585"
          />
          <path
            className="trace-top delay-6"
            d="M1220 1024 V850 L1120 770 H855"
          />

          <path className="trace-top delay-7" d="M65 60 H260 L360 150 H590" />
          <path
            className="trace-top delay-8"
            d="M1375 75 H1180 L1080 155 H850"
          />
          <path
            className="trace-top delay-9 desktop-only"
            d="M90 885 H230 L330 810 H585"
          />
          <path
            className="trace-top delay-10 desktop-only"
            d="M1350 900 H1210 L1115 820 H855"
          />

          <path
            className="trace-top delay-11 mobile-only"
            d="M0 120 H250 L330 190 H555"
          />
          <path
            className="trace-top delay-12 mobile-only"
            d="M1440 120 H1190 L1110 190 H885"
          />
        </g>

        {/* chip core */}
        <g className="chip-core drift-slow">
          {/* internal lines */}
          <path className="chip-highlight" d="M630 360 H810" />
          <path className="chip-highlight" d="M630 430 H810" />
          <path className="chip-highlight" d="M630 500 H810" />
          <path className="chip-highlight" d="M630 570 H810" />
          <path className="chip-highlight" d="M630 640 H810" />
        </g>

        {/* contact pads */}
        <g className="drift-fast">
          {[
            [545, 240],
            [895, 250],
            [545, 512],
            [895, 520],
            [585, 770],
            [855, 770],
            [590, 150],
            [850, 155],
            [585, 810],
            [855, 820],
          ].map(([x, y], i) => (
            <g key={`pad-${i}`}>
              <circle className="pad" cx={x} cy={y} r="5.2" />
              <circle className="pad-ring" cx={x} cy={y} r="9.6" />
            </g>
          ))}

          {[
            [280, 170],
            [350, 240],
            [1160, 180],
            [1090, 250],
            [245, 545],
            [315, 512],
            [1195, 560],
            [1115, 520],
            [320, 770],
            [1120, 770],
            [260, 60],
            [1180, 75],
            [230, 885],
            [1210, 900],
          ].map(([x, y], i) => (
            <g key={`outer-pad-${i}`}>
              <circle className="pad" cx={x} cy={y} r="4.2" />
              <circle className="pad-ring" cx={x} cy={y} r="8.2" />
            </g>
          ))}
        </g>

        {/* active vias */}
        {/* <g> */}
        {/*   <circle className="via delay-1" cx="545" cy="240" r="3.3" /> */}
        {/*   <circle className="via delay-2" cx="895" cy="250" r="3.3" /> */}
        {/*   <circle className="via delay-3" cx="545" cy="512" r="3.3" /> */}
        {/*   <circle className="via delay-4" cx="895" cy="520" r="3.3" /> */}
        {/*   <circle className="via delay-1" cx="585" cy="770" r="3.3" /> */}
        {/*   <circle className="via delay-2" cx="855" cy="770" r="3.3" /> */}
        {/*   <circle */}
        {/*     className="via delay-3 desktop-only" */}
        {/*     cx="590" */}
        {/*     cy="150" */}
        {/*     r="3.3" */}
        {/*   /> */}
        {/*   <circle */}
        {/*     className="via delay-4 desktop-only" */}
        {/*     cx="850" */}
        {/*     cy="155" */}
        {/*     r="3.3" */}
        {/*   /> */}
        {/* </g> */}

        {/* signal particles */}
        <circle className="signal s1" r="3.2" />
        <circle className="signal s2" r="3.2" />
        <circle className="signal s3" r="3.2" />
        <circle className="signal s4" r="3.2" />
        <circle className="signal s5" r="3.2" />
        <circle className="signal s6" r="3.2" />
      </svg>
    </div>
  );
}
