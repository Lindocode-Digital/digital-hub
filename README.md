<div align="center">

<!-- HERO -->
<a href="https://lindocode.com"><img src="https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/portfolio/icon.svg"
       width="36"
       style="vertical-align:-6px; margin-right:12px; " /></a>
<h1 style="font-size:2.4rem; font-weight:700; letter-spacing:0.5px; font-family: sans;">
  Lindocode Digital
</h1>
<a href="https://lindocode.com"><img src="https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/portfolio/slogan.svg" width="520" alt="INNOVATE · BUILD · SCALE" /></a>
<br/>
<br/>
<p style="max-width:620px; font-size:0.95rem; color:#555555; font-family: sans;">
  Premium web, mobile, and backend systems built with clarity,
  performance, and real-world purpose.
</p>
<!-- NAV -->
<br>
<p>
  <a href="https://lindocode.com"><img src="https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/portfolio/nav-studio.svg" height="28" alt="Studio" /></a>
  <img src="https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/portfolio/nav-dot.svg" height="28" alt="·" />
  <a href="https://lindocode.com/digitalhub"><img src="https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/portfolio/nav-digital-hub.svg" height="28" alt="Digital Hub" /></a>
  <img src="https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/portfolio/nav-dot.svg" height="28" alt="·" />
  <a href="https://lindocode.com/contact?theme=minimal"><img src="https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/portfolio/nav-contact.svg" height="28" alt="Contact" /></a>
</p>

<br>

<!-- BADGES -->
<a href="https://lindocode.com"><img src="https://img.shields.io/badge/STUDIO-LINDOCODE-0E0E0E?style=for-the-badge"/></a>
<a href="https://lindocode.com"><img src="https://img.shields.io/badge/FOCUS-WEB·MOBILE·SYSTEMS-0E0E0E?style=for-the-badge"/></a>
<a href="https://lindocode.com"><img src="https://img.shields.io/badge/BASED%20IN-SOUTH%20AFRICA-B27B32?style=for-the-badge"/></a>

</div>

<br>
<br>

# Digital Hub

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Oracle Cloud](https://img.shields.io/badge/Oracle_Cloud-VM-F80000?style=flat-square&logo=oracle)](https://www.oracle.com/cloud/)
[![Tests](https://img.shields.io/badge/Tests-131%20passing-22c55e?style=flat-square&logo=jest)](https://jestjs.io/)

<br>

![Home](https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/hub2-1.webp)

<br>

## Overview

**Digital Hub** is the public-facing portfolio and link-safety platform for Lindocode Digital. It does two things:

1. **Project showcase** — a Cover Flow carousel that lets visitors browse and deep-dive into Lindocode's work. Each card opens a full-screen overlay with project details, live screenshots, and direct links.

2. **Link Safety Scanner** — paste any URL and get an instant trust score. The scanner checks HTTPS, TLS certificate validity, redirect chains, security headers (HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy), URL structure signals (IP addresses, shorteners, punycode, subdomain depth), and site reachability — then surfaces a scored, human-readable report.

<br>

## Features

- **Cover Flow carousel** — GSAP-powered card browsing with active-state interactions and full-screen project overlays
- **Link Safety Scanner** — real-time URL analysis with a trust score, signal breakdown, and redirect chain visualization
- **Live site preview** — iframe preview of scanned URLs with bot-protection and reachability detection
- **Upstream API fallback** — scanner tries a hosted analysis API first; falls back to full local analysis (network probe + TLS check + header analysis) when unavailable
- **Responsive** — optimized for mobile and desktop
- **131 passing tests** — unit, integration, and API route tests with CI enforcement on every PR

<br>

## Project Structure

```
app/
├── api/
│   ├── scan/route.ts          # Link safety analysis (upstream fallback + local)
│   └── validate/route.ts      # URL reachability check with redirect chain
├── globals.css
├── layout.tsx
├── not-found.tsx
└── page.tsx

components/
├── common/
│   ├── Banner.tsx
│   ├── CompanyName.tsx
│   ├── Footer.tsx
│   └── logo/Logo.tsx
└── landing/
    ├── LandingPage.tsx
    ├── LinkChecker.tsx
    ├── carousel/
    │   ├── CarouselShell.tsx
    │   ├── CoverFlow.tsx
    │   └── CoverFlowCard.tsx
    └── overlay/
        └── ProjectOverlay.tsx

lib/
└── projects.ts                # Project data and description helpers

__tests__/                     # 131 tests across 12 suites
.github/workflows/test.yml     # CI: blocks merges when tests fail
```

<br>

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, custom CSS |
| Animation | GSAP |
| Testing | Jest + Testing Library (131 tests) |
| CI | GitHub Actions — blocks merge on failure |
| Infrastructure | Oracle Cloud VM |
| Media | Cloudflare Workers (image delivery) |

<br>

## API Routes

### `POST /api/scan`

Scores a URL for safety. Tries an upstream hosted API first; on failure runs local analysis:

- Phase 1 — URL signals: HTTPS, IP address, URL shortener, punycode, subdomain depth, query parameter count
- Phase 2 — Network probe: reachability, HTTP status, redirect chain, cross-domain redirects
- Phase 3 — TLS: certificate validity and expiry
- Phase 4 — Security headers: HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy

Returns a `score` (0–100), `level` (`good` / `caution` / `high_caution`), full `signals` array, `redirect_chain`, and `scanned_at` timestamp.

### `GET /api/validate?url=`

Fast reachability check with redirect chain following. Returns `isWorking`, `statusCode`, `finalUrl`, `responseTime`, and friendly status text for bot-blocked codes (401, 403, 406, 429).

<br>

## Author

**Lindocode Digital**  
_Trading as Lazy Apps_

<br>

## License

All rights reserved © Lindocode Digital

<br>

<div align="center">
<br/>

<p>
  <a href="https://lindocode.com/terms?theme=minimal" style="text-decoration: none; color: #B27B32; font-family: sans-serif; font-weight: 600;"><strong>Terms</strong></a>
  ·
  <a href="https://lindocode.com/privacy?theme=minimal" style="text-decoration: none; color: #B27B32; font-family: sans-serif; font-weight: 600;"><strong>Privacy</strong></a>
</p>

<sub>© Lindocode Digital · South Africa</sub>

</div>
