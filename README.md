# Digital Hub

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-API-orange?style=flat-square&logo=express)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Container-blue?style=flat-square&logo=docker)](https://www.docker.com/)
[![Caddy](https://img.shields.io/badge/Caddy-Web_Server-1F8C44?style=flat-square&logo=caddy)](https://caddyserver.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com/)
[![AWS](https://img.shields.io/badge/AWS-SES-FF9900?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/ses/)
[![Oracle Cloud](https://img.shields.io/badge/Oracle_Cloud-VM-F80000?style=flat-square&logo=oracle)](https://www.oracle.com/cloud/)

---

![Home](https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/hub2-1.webp)

---

## 💭 Vision

**Digital Hub** is a unified platform designed to present digital products, experiences, and capabilities through a refined, high-performance interface.

Engineered for scalability and consistency, it consolidates multiple experiences into a single, cohesive system that delivers a seamless experience across devices. The platform emphasizes clarity, interaction quality, and maintainable architecture—enabling continuous growth without compromising performance or design integrity.

> 🔧 Modular, extensible architecture  
> 💡 Fully responsive and optimized for scale  
> ✨ High-performance, animation-driven user experience

---

## 🚀 Features

- [x] 🧠 **Next.js App Router architecture** with a modern component-based structure
- [x] 🎴 **Dual project showcase modes**
  - **Cover Flow view** for immersive browsing
  - **3D Cards view** for interactive project exploration
- [x] ✨ **GSAP-powered animations** for smooth motion and transitions
- [x] ⚡ **Dynamic component loading** using `next/dynamic`
- [x] 🖼️ **Cloudflare Workers image fetching** for flexible media delivery
- [x] 💫 **Shimmer loading states** for smoother perceived performance
- [x] 🎯 **Responsive UI** optimized for mobile and desktop
- [x] 🎛️ **View mode toggle interface** with quick switching between layouts
- [x] 🧩 **Reusable modular components** for shared UI and landing page sections
- [x] 🎨 **Tailwind CSS + custom CSS styling** for flexible presentation
- [x] 🪄 **Interactive carousel experiences**
  - 3D rotational card positioning
  - Cover flow navigation with active state interactions
- [x] 🚀 **Client-side navigation** with `next/navigation`

---

## Updates

- [x] Page refresh works correctly
- [x] iOS Safari scrolling / pinning issue fixed
- [x] Project deployment moved to a different platform
- [x] Added interactive stack visualizer
- [x] Fully responsive improvements
- [x] Shimmer loading effects

---

## 📁 Project Structure

```bash
app/
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── landing/
│   └── carousel/
│       ├── Carousel3D.tsx
│       ├── CarouselShell.tsx
│       ├── CoverFlow.tsx
│       └── ...
├── common/
│   ├── Banner.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx
│   └── CompanyName.tsx
└── LandingPage.tsx

lib/
└──
```

---

### Frontend

| Technology               | Purpose                                                 |
| ------------------------ | ------------------------------------------------------- |
| **Next.js**              | React framework for SSR, routing, and page optimization |
| **JavaScript / JSX**     | Core language and component syntax                      |
| **Base Path & Rewrites** | Project scaling and clean URL management                |

### Backend (Self-hosted on Oracle VM)

| Technology            | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| **Node.js + Express** | Custom API backend for form handling and internal services |
| **AWS SES**           | Email delivery for contact forms                           |
| **Caddy**             | Web server with automatic HTTPS                            |
| **Docker**            | Containerized deployment and service isolation             |

### Media & Performance

| Technology             | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| **Cloudflare Workers** | Image optimization, video streaming, and CDN caching |

### Infrastructure

| Technology          | Purpose                          |
| ------------------- | -------------------------------- |
| **Oracle Cloud VM** | Hosting gateway for all services |
| **Git**             | Version control                  |

---

## 🚀 Deployment Architecture

```text
User Request
   ↓
Cloudflare (CDN + Workers for images/videos)
   ↓
Caddy (Reverse Proxy + Auto-HTTPS)
   ↓
Docker Container (Next.js App)
   ↓
Express API (Node.js on same VM)
   ↓
AWS SES (Email sending)
```

---

## 👨‍💻 Author

**Lindocode Digital**  
_Trading as Lazy Apps_

_Apps That Work, So You Don't Have To._

---

## 📄 License

All rights reserved © Lindocode Digital

---

## ⭐ Support

_If this project helped you or you like it, consider giving it a star ⭐ on GitHub!_
