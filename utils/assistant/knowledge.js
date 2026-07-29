/**
 * Bundled fallback copy of the assistant knowledge base.
 *
 * The live copy comes from GET /api/lazy-appz/assistant — see ./client.js.
 * This copy ships with the bundle so the assistant answers instantly on first
 * paint and keeps working if the API is unreachable.
 *
 * GENERATED — do not edit by hand. Facts live in the API repo at
 * src/data/assistant_knowledge.js. Change them there, deploy, then run
 * `npm run sync:assistant` to refresh this file.
 */

export const BUNDLED_KNOWLEDGE = {
  "version": 3,
  "updated_at": "2026-07-29",
  "links": {
    "about": "https://lindocode.com/#about",
    "whyUs": "https://lindocode.com/#why-us",
    "services": "https://lindocode.com/#value-prop-section",
    "process": "https://lindocode.com/#process",
    "technologies": "https://lindocode.com/#technologies",
    "showcase": "https://lindocode.com/#showcase",
    "contact": "https://lindocode.com/contact",
    "privacy": "https://lindocode.com/privacy",
    "terms": "https://lindocode.com/terms",
    "digitalHub": "https://lindocode.com/digitalhub",
    "projects": "https://lindocode.com/projects?theme=minimal",
    "lazyReader": "https://lazyreader.lindocode.com",
    "lazyAuthor": "https://lazyauthor.lindocode.com",
    "googlePlay": "https://play.google.com/store/apps/details?id=com.lindocode.lazyreader",
    "support": "mailto:support@lindocode.com"
  },
  "starters": [
    {
      "label": "Services",
      "topic": "services"
    },
    {
      "label": "Projects",
      "topic": "projects"
    },
    {
      "label": "Digital Hub",
      "topic": "digital-hub"
    },
    {
      "label": "LazyReader",
      "topic": "lazyreader"
    },
    {
      "label": "LazyAuthor",
      "topic": "lazyauthor"
    },
    {
      "label": "LazyStore",
      "topic": "lazystore"
    },
    {
      "label": "Pricing",
      "topic": "pricing"
    }
  ],
  "topics": [
    {
      "id": "services",
      "title": "Services",
      "terms": [
        "service",
        "offer",
        "offering",
        "what do you do",
        "what do you build",
        "build",
        "capability",
        "solution"
      ],
      "answer": "Four things, and usually some combination of them: web applications, mobile apps, backend APIs, and automation that removes manual work. Scope runs from a single landing page to a product with its own infrastructure and CI.",
      "details": [
        "Web - marketing sites, dashboards, web apps, e-commerce front ends",
        "Mobile - React Native apps shipped to Android and iOS",
        "Backend - REST APIs, auth, databases, integrations, deployment",
        "Automation - scrapers, schedulers, reporting, internal tooling"
      ],
      "suggestions": [
        {
          "label": "Web work",
          "topic": "services-web"
        },
        {
          "label": "Mobile work",
          "topic": "services-mobile"
        },
        {
          "label": "Backend & APIs",
          "topic": "services-backend"
        },
        {
          "label": "Automation",
          "topic": "services-automation"
        }
      ]
    },
    {
      "id": "services-web",
      "title": "Web Development",
      "terms": [
        "web app",
        "webapp",
        "website",
        "web development",
        "landing page",
        "frontend",
        "front end",
        "e commerce",
        "ecommerce",
        "web design"
      ],
      "boost": 1,
      "answer": "Next.js and React front ends, server-rendered for speed and search visibility. That covers marketing sites, dashboards with real data behind them, and full web apps with accounts and payments.",
      "details": [
        "Server rendering and static generation where each one fits",
        "Responsive down to small phones, not just resized desktop",
        "Accessibility and semantic markup as part of the build",
        "Lighthouse and Core Web Vitals treated as requirements"
      ],
      "suggestions": [
        {
          "label": "What's the stack?",
          "topic": "tech"
        },
        {
          "label": "How a build runs",
          "topic": "process"
        },
        {
          "label": "Start a project",
          "link": "contact"
        }
      ]
    },
    {
      "id": "services-mobile",
      "title": "Mobile Development",
      "terms": [
        "mobile app",
        "mobileapp",
        "mobile",
        "android app",
        "ios app",
        "react native",
        "app store",
        "cross platform"
      ],
      "boost": 1,
      "answer": "Cross-platform apps in React Native and Expo, one codebase to Android and iOS. LazyReader is our own proof of it: cloud sync, offline storage, background audio and store releases.",
      "details": [
        "Expo builds with EAS, over-the-air updates for quick fixes",
        "Offline-first storage and background sync",
        "OAuth against third-party providers where the app needs it",
        "Store listing, release notes and staged rollout handled too"
      ],
      "suggestions": [
        {
          "label": "See LazyReader",
          "topic": "lazyreader"
        },
        {
          "label": "How a build runs",
          "topic": "process"
        },
        {
          "label": "Start a project",
          "link": "contact"
        }
      ]
    },
    {
      "id": "services-backend",
      "title": "Backend & APIs",
      "terms": [
        "backend",
        "back end",
        "api",
        "server",
        "database",
        "auth",
        "authentication",
        "integration",
        "infrastructure",
        "devops",
        "deployment"
      ],
      "boost": 1,
      "answer": "REST APIs, authentication, databases and the deployment around them. Node and SQL, Supabase where it earns its place, running on Oracle Cloud with Cloudflare in front.",
      "details": [
        "Schema design, migrations and row-level security",
        "OAuth flows and token handling against third-party APIs",
        "Metrics and status endpoints so you can see what's running",
        "CI that blocks a merge when the tests fail"
      ],
      "suggestions": [
        {
          "label": "What's the stack?",
          "topic": "tech"
        },
        {
          "label": "How a build runs",
          "topic": "process"
        },
        {
          "label": "Start a project",
          "link": "contact"
        }
      ]
    },
    {
      "id": "services-automation",
      "title": "Automation",
      "terms": [
        "automation",
        "automate",
        "script",
        "scraper",
        "scraping",
        "workflow tool",
        "internal tool",
        "reporting",
        "repetitive",
        "manual work"
      ],
      "boost": 1,
      "answer": "If a person is copying data between two systems every week, that is a job for a script. We build scrapers, schedulers, reporting pipelines and internal tools that take the repetitive part away.",
      "details": [
        "Scheduled jobs with logging and failure alerts",
        "Data pulled from APIs, spreadsheets or pages without an API",
        "Reports generated and delivered instead of assembled by hand",
        "Small internal dashboards so the team can see the output"
      ],
      "suggestions": [
        {
          "label": "What does it cost?",
          "topic": "pricing"
        },
        {
          "label": "Describe your workflow",
          "link": "contact"
        }
      ]
    },
    {
      "id": "process",
      "title": "How We Work",
      "terms": [
        "process",
        "how do you work",
        "how does it work",
        "workflow",
        "timeline",
        "how long",
        "step",
        "delivery",
        "deliver",
        "start a project",
        "get started",
        "milestone"
      ],
      "answer": "Scope first, then design, then build in reviewable steps, then launch and support. You see working software along the way instead of waiting on one big reveal at the end.",
      "details": [
        "Scope - what it must do, what it must not, what it costs",
        "Design - layouts and flows agreed before code gets written",
        "Build - shipped in slices you can open and comment on",
        "Launch - deploy, monitor, then support and iterate"
      ],
      "suggestions": [
        {
          "label": "See the process",
          "link": "process"
        },
        {
          "label": "What does it cost?",
          "topic": "pricing"
        },
        {
          "label": "Why work with you?",
          "topic": "why-us"
        }
      ]
    },
    {
      "id": "tech",
      "title": "Tech Stack",
      "terms": [
        "stack",
        "tech",
        "technology",
        "nextjs",
        "react",
        "node",
        "typescript",
        "javascript",
        "sql",
        "supabase",
        "tailwind",
        "framework",
        "language",
        "tooling",
        "hosting"
      ],
      "answer": "TypeScript and JavaScript throughout. React and Next.js on the web, React Native and Expo on mobile, Node and SQL behind them, Tailwind and GSAP for interface work, Jest and Vitest for tests, hosted on Oracle Cloud with Cloudflare in front.",
      "details": [
        "Web - Next.js App Router, React 19, Tailwind v4, GSAP",
        "Mobile - React Native, Expo, EAS build pipeline",
        "Data - PostgreSQL and Supabase, row-level security",
        "Quality - Jest, Vitest and Testing Library, CI gating merges"
      ],
      "suggestions": [
        {
          "label": "View technologies",
          "link": "technologies"
        },
        {
          "label": "Do you test?",
          "topic": "testing"
        },
        {
          "label": "How a build runs",
          "topic": "process"
        }
      ]
    },
    {
      "id": "testing",
      "title": "Testing & Quality",
      "terms": [
        "test",
        "tests",
        "testing",
        "write tests",
        "do you test",
        "unit test",
        "coverage",
        "quality",
        "ci",
        "continuous integration",
        "bug free",
        "reliable",
        "maintainable"
      ],
      "boost": 1,
      "answer": "Tests are part of the build, not a later phase. Digital Hub alone carries 131 tests across 12 suites, and CI blocks a merge the moment one fails.",
      "details": [
        "Unit, integration and API route tests per project",
        "GitHub Actions running on every pull request",
        "A failing suite blocks the merge - no manual override habit",
        "Code you can hand to another developer without a rewrite"
      ],
      "suggestions": [
        {
          "label": "What's the stack?",
          "topic": "tech"
        },
        {
          "label": "Report a bug",
          "topic": "feedback"
        }
      ]
    },
    {
      "id": "pricing",
      "title": "Pricing",
      "terms": [
        "price",
        "pricing",
        "cost",
        "quote",
        "budget",
        "rate",
        "fee",
        "how much",
        "cheap",
        "expensive",
        "afford",
        "payment",
        "deposit",
        "free"
      ],
      "answer": "Pricing follows scope, so it gets quoted per project rather than off a list. A landing page, a web app with accounts, a backend API and a mobile app are four different amounts of work with four different timelines.",
      "details": [
        "Quoted against an agreed scope, not an hourly guess",
        "Bigger builds split into phases you approve one at a time",
        "Hosting and third-party services billed at cost, listed up front",
        "Our own apps - LazyReader, LazyAuthor, LazyStore - are free to use"
      ],
      "suggestions": [
        {
          "label": "Contact for a quote",
          "link": "contact"
        },
        {
          "label": "What goes into scope?",
          "topic": "process"
        }
      ]
    },
    {
      "id": "contact",
      "title": "Contact",
      "terms": [
        "contact",
        "email",
        "hire",
        "reach",
        "message",
        "get in touch",
        "talk",
        "call",
        "linkedin",
        "github",
        "social",
        "available",
        "availability"
      ],
      "answer": "The contact form is the fastest route, or info@lindocode.com if you prefer mail. We are on LinkedIn and GitHub as Lindocode Digital.",
      "details": [
        "Say what you want built and roughly when you need it",
        "Mention any fixed constraints - budget, platform, deadline",
        "You get a scoped reply rather than a generic brochure"
      ],
      "suggestions": [
        {
          "label": "Go to contact",
          "link": "contact"
        },
        {
          "label": "What does it cost?",
          "topic": "pricing"
        }
      ]
    },
    {
      "id": "about",
      "title": "About Lindocode",
      "terms": [
        "about",
        "who are you",
        "who is",
        "company",
        "team",
        "studio",
        "south africa",
        "based",
        "location",
        "history",
        "story"
      ],
      "answer": "Lindocode Digital is a South African software studio, trading as Lazy Appz. We build web, mobile and backend systems for clients, and ship our own products alongside that work.",
      "details": [
        "Based in South Africa, working with clients remotely",
        "Client builds on one side, our own products on the other",
        "Digital Hub, LazyReader, LazyAuthor and LazyStore are all ours",
        "The products are where the approach gets proven first"
      ],
      "suggestions": [
        {
          "label": "About us",
          "link": "about"
        },
        {
          "label": "Why work with you?",
          "topic": "why-us"
        },
        {
          "label": "See the products",
          "topic": "lazyappz"
        }
      ]
    },
    {
      "id": "why-us",
      "title": "Why Work With Us",
      "terms": [
        "why us",
        "why choose",
        "why work with",
        "choose",
        "different",
        "better",
        "advantage",
        "trust",
        "credible",
        "portfolio proof"
      ],
      "boost": 1,
      "answer": "We ship our own products, so the same standards we sell get applied to software we have to live with. Tests, CI and public issue boards are not a pitch - they are how our own apps run.",
      "details": [
        "Live products you can open right now, not mockups",
        "Tests and CI on the work, so changes stay safe later",
        "Public feature and issue boards - progress in the open",
        "Direct contact with the person building it, not a queue"
      ],
      "suggestions": [
        {
          "label": "Why work with us",
          "link": "whyUs"
        },
        {
          "label": "See the products",
          "topic": "lazyappz"
        },
        {
          "label": "See projects",
          "link": "showcase"
        }
      ]
    },
    {
      "id": "projects",
      "title": "Projects",
      "terms": [
        "project",
        "portfolio",
        "showcase",
        "work",
        "example",
        "case study",
        "built",
        "made",
        "shipped"
      ],
      "answer": "The showcase covers shipped work: Digital Hub, LazyReader, LazyAuthor and LazyStore, plus client web apps and interface experiments. Each one links to something you can actually open.",
      "suggestions": [
        {
          "label": "Show projects",
          "link": "showcase"
        },
        {
          "label": "Featured projects",
          "link": "projects"
        },
        {
          "label": "The Lazy Appz products",
          "topic": "lazyappz"
        }
      ]
    },
    {
      "id": "digital-hub",
      "title": "Digital Hub",
      "terms": [
        "digitalhub",
        "hub",
        "cover flow",
        "coverflow",
        "carousel"
      ],
      "boost": 2,
      "summary": "our portfolio platform with a built-in link safety scanner",
      "answer": "Digital Hub is our public portfolio and link-safety platform. A GSAP-powered Cover Flow carousel lets you browse projects and open any card into a full-screen deep dive, and a Link Safety Scanner scores any URL you paste.",
      "details": [
        "Cover Flow carousel with full-screen project overlays",
        "Link Safety Scanner with a 0-100 trust score",
        "Live preview of a scanned site, with bot-protection detection",
        "Next.js 16, React 19, TypeScript, 131 passing tests"
      ],
      "suggestions": [
        {
          "label": "Go to Digital Hub",
          "link": "digitalHub"
        },
        {
          "label": "The link scanner",
          "topic": "scanner"
        },
        {
          "label": "What does it check?",
          "topic": "scanner-checks"
        }
      ]
    },
    {
      "id": "scanner",
      "title": "Link Safety Scanner",
      "terms": [
        "link safety",
        "safety scanner",
        "link scanner",
        "scanner",
        "scan a link",
        "check a link",
        "is this link safe",
        "safe link",
        "phishing",
        "trust score",
        "malicious",
        "suspicious",
        "scam"
      ],
      "boost": 2,
      "summary": "a URL trust scanner built into Digital Hub",
      "answer": "Paste a URL into Digital Hub and it returns a 0-100 trust score with a plain-language reason for every signal, rated good, caution or high caution. It tries a hosted analysis API first and falls back to full local analysis if that is unavailable.",
      "details": [
        "Score out of 100 plus a good / caution / high-caution level",
        "Every signal explained, not just a red or green verdict",
        "Redirect chain visualised, including cross-domain hops",
        "Falls back to local analysis when the upstream API is down"
      ],
      "suggestions": [
        {
          "label": "Try the scanner",
          "link": "digitalHub"
        },
        {
          "label": "What does it check?",
          "topic": "scanner-checks"
        },
        {
          "label": "About Digital Hub",
          "topic": "digital-hub"
        }
      ]
    },
    {
      "id": "scanner-checks",
      "title": "What The Scanner Checks",
      "terms": [
        "what does it check",
        "scanner check",
        "check",
        "signal",
        "security header",
        "headers",
        "hsts",
        "csp",
        "certificate",
        "tls",
        "ssl",
        "https",
        "redirect",
        "punycode",
        "shortener",
        "signal"
      ],
      "boost": 2,
      "answer": "Four passes over the URL. Structure first, then a live network probe, then the certificate, then the security headers the site sends back.",
      "details": [
        "URL signals - HTTPS, raw IP addresses, shorteners, punycode, subdomain depth, query bloat",
        "Network - reachability, HTTP status, full redirect chain, cross-domain redirects",
        "TLS - certificate validity and how close it is to expiry",
        "Headers - HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy"
      ],
      "suggestions": [
        {
          "label": "Try the scanner",
          "link": "digitalHub"
        },
        {
          "label": "Back to the scanner",
          "topic": "scanner"
        }
      ]
    },
    {
      "id": "lazyappz",
      "title": "Lazy Appz",
      "terms": [
        "lazyappz",
        "lazy",
        "product",
        "apps",
        "app suite",
        "brand"
      ],
      "answer": "Lazy Appz is the product side of the studio, and the three pieces fit together: write a book or interactive story in LazyAuthor, publish it to get a redeem code, list it on LazyStore, and readers open it in LazyReader.",
      "details": [
        "LazyAuthor - write books and branching interactive stories",
        "LazyStore - a catalog of free books with QR redeem codes",
        "LazyReader - read them, from your own cloud storage",
        "Digital Hub - the portfolio and link-safety platform"
      ],
      "suggestions": [
        {
          "label": "LazyReader",
          "topic": "lazyreader"
        },
        {
          "label": "LazyAuthor",
          "topic": "lazyauthor"
        },
        {
          "label": "LazyStore",
          "topic": "lazystore"
        },
        {
          "label": "How they connect",
          "topic": "ecosystem"
        }
      ]
    },
    {
      "id": "ecosystem",
      "title": "How They Fit Together",
      "terms": [
        "how they connect",
        "apps connect",
        "products connect",
        "fit together",
        "ecosystem",
        "pipeline",
        "work together",
        "connected",
        "relationship"
      ],
      "boost": 1,
      "answer": "One line from writing to reading. Write and publish in LazyAuthor, publishing hands back a redeem code and QR, and LazyReader turns that code into a book in someone's library. LazyStore is one way to get the code in front of readers - a curated catalog - but an author can share it directly instead.",
      "details": [
        "1. Write in LazyAuthor - story editor or book editor",
        "2. Publish - you get a short redeem code and a QR back",
        "3. Share the code yourself, or request a LazyStore listing",
        "4. Reader scans or types the code in LazyReader"
      ],
      "suggestions": [
        {
          "label": "Writing in LazyAuthor",
          "topic": "lazyauthor"
        },
        {
          "label": "Publishing a book",
          "topic": "publishing"
        },
        {
          "label": "Getting on LazyStore",
          "topic": "store-listing"
        }
      ]
    },
    {
      "id": "lazyreader",
      "title": "LazyReader",
      "terms": [
        "lazyreader",
        "reader",
        "reading app",
        "read",
        "book app",
        "library"
      ],
      "boost": 2,
      "summary": "a distraction-free cloud ebook reader for EPUB and interactive fiction",
      "answer": "A distraction-free ebook reader that reads straight from your cloud storage. Link Dropbox, Nextcloud or OneDrive and your library is already there - nothing to upload, copy or import. It also plays branching interactive fiction.",
      "details": [
        "Reads EPUB from your own cloud, no transferring files",
        "Adjustable fonts, themes and brightness, no ads",
        "Highlights, notes, collections and read-aloud",
        "Offline downloads and automatic progress sync"
      ],
      "suggestions": [
        {
          "label": "Which clouds?",
          "topic": "lr-clouds"
        },
        {
          "label": "Reading features",
          "topic": "lr-library"
        },
        {
          "label": "Does it work offline?",
          "topic": "lr-offline"
        },
        {
          "label": "What formats?",
          "topic": "lr-formats"
        },
        {
          "label": "How do I get it?",
          "topic": "lr-download"
        }
      ]
    },
    {
      "id": "lr-clouds",
      "title": "Cloud Storage",
      "terms": [
        "which cloud",
        "cloud storage",
        "cloud",
        "dropbox",
        "nextcloud",
        "onedrive",
        "google drive",
        "storage",
        "connect",
        "sync my books",
        "self hosted"
      ],
      "boost": 2,
      "answer": "Three providers today: Dropbox, Nextcloud and OneDrive. You connect an account once, LazyReader browses your existing folders, and books open from where they already live.",
      "details": [
        "Dropbox - connect and browse your existing folders",
        "Nextcloud - including self-hosted servers, over WebDAV",
        "OneDrive - personal accounts",
        "No uploading, no second copy, no import step"
      ],
      "suggestions": [
        {
          "label": "Do you store my books?",
          "topic": "lr-privacy"
        },
        {
          "label": "What about offline?",
          "topic": "lr-offline"
        },
        {
          "label": "Open LazyReader",
          "link": "lazyReader"
        }
      ]
    },
    {
      "id": "lr-formats",
      "title": "Supported Formats",
      "terms": [
        "format",
        "file type",
        "epub",
        "pdf",
        "mobi",
        "azw",
        "kindle",
        "ebook",
        "what files",
        "support pdf"
      ],
      "boost": 1,
      "answer": "LazyReader is built around EPUB - the whole reader, from pagination to highlights to read-aloud, is designed for it. Interactive stories are EPUB too, exported from LazyAuthor.",
      "details": [
        "EPUB is the supported format, including EPUB 3 features",
        "Interactive stories ship as EPUB exports from LazyAuthor",
        "Covers and metadata read from the file itself",
        "Kindle-native formats such as AZW are not supported"
      ],
      "suggestions": [
        {
          "label": "Where do books come from?",
          "topic": "lazystore"
        },
        {
          "label": "Writing your own",
          "topic": "lazyauthor"
        }
      ]
    },
    {
      "id": "lr-offline",
      "title": "Offline & Sync",
      "terms": [
        "offline",
        "read offline",
        "no internet",
        "no connection",
        "no signal",
        "download book",
        "on a plane",
        "aeroplane",
        "airplane",
        "flight",
        "sync",
        "progress",
        "where i left off",
        "bookmark",
        "across devices"
      ],
      "boost": 1,
      "answer": "Download a book once and it reads offline, no connection needed. Reading position syncs automatically, so picking up on another device puts you back on the right page.",
      "details": [
        "Download for offline reading, keep them or clear them later",
        "Reading progress saved automatically as you read",
        "Position follows you across sessions and devices",
        "Highlights and notes sync with your account too"
      ],
      "suggestions": [
        {
          "label": "Which clouds?",
          "topic": "lr-clouds"
        },
        {
          "label": "Reading features",
          "topic": "lr-library"
        }
      ]
    },
    {
      "id": "lr-library",
      "title": "Reading Features",
      "terms": [
        "highlight",
        "note",
        "annotation",
        "collection",
        "organise",
        "organize",
        "shelf",
        "tag",
        "font",
        "theme",
        "brightness",
        "night mode",
        "dark mode",
        "feature"
      ],
      "boost": 1,
      "answer": "Long-press any passage to highlight it or attach a note, and both are saved to your account. Collections let you group books your way, and the reader itself adjusts fonts, themes and brightness.",
      "details": [
        "Highlights and notes - long-press text, saved and searchable",
        "Collections - group books without moving cloud files",
        "Typography - font, size, spacing, themes, brightness",
        "Read-aloud - text-to-speech with background playback"
      ],
      "suggestions": [
        {
          "label": "Read-aloud",
          "topic": "lr-tts"
        },
        {
          "label": "Offline & sync",
          "topic": "lr-offline"
        },
        {
          "label": "Languages",
          "topic": "lr-languages"
        }
      ]
    },
    {
      "id": "lr-tts",
      "title": "Read Aloud",
      "terms": [
        "read aloud",
        "read to me",
        "read it to me",
        "audio",
        "audiobook",
        "listen",
        "text to speech",
        "tts",
        "voice",
        "speech",
        "narration",
        "accessibility"
      ],
      "boost": 2,
      "answer": "LazyReader can read a book out loud with text-to-speech, keeping playback going in the background with proper media controls in the notification shade.",
      "details": [
        "Text-to-speech straight from the EPUB you are reading",
        "Background playback with lock-screen media controls",
        "Abbreviation handling so it does not spell things out",
        "Useful for commutes and for readers who need audio"
      ],
      "suggestions": [
        {
          "label": "Other reading features",
          "topic": "lr-library"
        },
        {
          "label": "Languages",
          "topic": "lr-languages"
        }
      ]
    },
    {
      "id": "lr-languages",
      "title": "Languages",
      "terms": [
        "language",
        "translated",
        "translation",
        "english",
        "spanish",
        "french",
        "german",
        "italian",
        "portuguese",
        "localised",
        "localized",
        "afrikaans"
      ],
      "boost": 2,
      "answer": "The app interface ships in six languages: English, Spanish, French, German, Italian and Portuguese. That is the interface itself - books are in whatever language they were written.",
      "suggestions": [
        {
          "label": "Reading features",
          "topic": "lr-library"
        },
        {
          "label": "Request another language",
          "link": "lazyReader"
        }
      ]
    },
    {
      "id": "lr-privacy",
      "title": "Your Books, Your Storage",
      "terms": [
        "store my books",
        "my books",
        "upload my books",
        "keep my books",
        "private",
        "privacy of books",
        "who can see",
        "copy of my",
        "safe books"
      ],
      "boost": 2,
      "answer": "We do not download or store your books. LazyReader opens them where they already sit in your cloud account, so your library stays yours and stays private.",
      "details": [
        "No server-side copy of your library is kept",
        "Cloud access is scoped to reading your own files",
        "You can disconnect a provider and the access ends",
        "Offline downloads live on your device, under your control"
      ],
      "suggestions": [
        {
          "label": "Which clouds?",
          "topic": "lr-clouds"
        },
        {
          "label": "Site privacy policy",
          "topic": "policies"
        },
        {
          "label": "Delete my account",
          "topic": "delete-account"
        }
      ]
    },
    {
      "id": "lr-download",
      "title": "Getting LazyReader",
      "terms": [
        "download",
        "download lazyreader",
        "get lazyreader",
        "install lazyreader",
        "get the app",
        "install",
        "android",
        "google play",
        "play store",
        "app store",
        "where to get",
        "how much is the app",
        "available"
      ],
      "boost": 1,
      "answer": "LazyReader is live on Google Play - search LazyReader or install it straight from the store listing. It is free to install, and you connect your own cloud storage once it is open.",
      "details": [
        "Free on Google Play, no payment to install",
        "Connect Dropbox, Nextcloud or OneDrive on first run",
        "Your existing books show up - nothing to upload",
        "News, feature requests and bug reports live on the LazyReader site"
      ],
      "suggestions": [
        {
          "label": "Get it on Google Play",
          "link": "googlePlay"
        },
        {
          "label": "What can it do?",
          "topic": "lazyreader"
        },
        {
          "label": "Which clouds?",
          "topic": "lr-clouds"
        }
      ]
    },
    {
      "id": "interactive-fiction",
      "title": "Interactive Fiction",
      "terms": [
        "interactive fiction",
        "interactive story",
        "interactive",
        "litrpg",
        "gamebook",
        "branching",
        "choose your own adventure",
        "multiple ending",
        "choice",
        "game book",
        "rpg"
      ],
      "boost": 1,
      "summary": "branching, choice-driven stories that play inside LazyReader",
      "answer": "Stories where your choices steer the plot. Variables and stats carry from scene to scene, some paths stay locked until you meet a condition, and a story can finish several different ways - LitRPG and gamebooks included.",
      "details": [
        "Choices branch the narrative, not just the wording",
        "Variables track stats, items and decisions across scenes",
        "Conditions gate paths until you have earned them",
        "Multiple endings, so a second read goes somewhere else"
      ],
      "suggestions": [
        {
          "label": "How do I write one?",
          "topic": "la-story-editor"
        },
        {
          "label": "Where do I read them?",
          "topic": "lazyreader"
        },
        {
          "label": "Find stories",
          "topic": "lazystore"
        }
      ]
    },
    {
      "id": "lazyauthor",
      "title": "LazyAuthor",
      "terms": [
        "lazyauthor",
        "author",
        "write",
        "writing",
        "writer",
        "editor",
        "compose",
        "creating a book"
      ],
      "boost": 2,
      "summary": "a free browser tool for writing books and branching interactive stories",
      "answer": "LazyAuthor is the free writing tool behind LazyReader, at lazyauthor.lindocode.com. Pick one of two editors when you start: Interactive Story for branching fiction, or Book for a straight ebook. Everything auto-saves as you type.",
      "details": [
        "Interactive Story - scenes, choices, variables, conditions, endings",
        "Book - chapters, table of contents, cover art, inline images",
        "Auto-save and sync, so nothing depends on remembering to save",
        "Preview any scene, then export straight to EPUB"
      ],
      "suggestions": [
        {
          "label": "Story editor",
          "topic": "la-story-editor"
        },
        {
          "label": "Book editor",
          "topic": "la-book-editor"
        },
        {
          "label": "Worked examples",
          "topic": "la-workflow-name"
        },
        {
          "label": "Writing tips",
          "topic": "la-tips"
        },
        {
          "label": "Open LazyAuthor",
          "link": "lazyAuthor"
        }
      ]
    },
    {
      "id": "la-story-editor",
      "title": "Story Editor",
      "terms": [
        "story editor",
        "branch",
        "branching",
        "branching story",
        "branching fiction",
        "ending",
        "write interactive",
        "write a story",
        "branching editor"
      ],
      "boost": 2,
      "answer": "Three columns: scenes on the left, the scene you are editing in the middle, story metadata on the right. Each scene is narrative, player input or an ending, and choices wire them together.",
      "details": [
        "Scenes - add, rename, reorder, and mark one as the start",
        "Choices - each points at another scene and can set effects",
        "Variables - track names, stats and items across the story",
        "Conditions - hide or lock a choice until a rule is satisfied",
        "Player input - capture a value and store it in a variable"
      ],
      "suggestions": [
        {
          "label": "Variables",
          "topic": "la-variables"
        },
        {
          "label": "Conditions",
          "topic": "la-conditions"
        },
        {
          "label": "Player input",
          "topic": "la-player-input"
        },
        {
          "label": "Media",
          "topic": "la-media"
        },
        {
          "label": "Worked examples",
          "topic": "la-workflow-name"
        }
      ]
    },
    {
      "id": "la-book-editor",
      "title": "Book Editor",
      "terms": [
        "book editor",
        "table of contents",
        "toc",
        "write a book",
        "novel",
        "manuscript"
      ],
      "boost": 2,
      "answer": "The straight-ebook editor: chapters you can add, reorder and rename, with a table of contents generated from them, plus cover art and inline images.",
      "details": [
        "Chapters - add, reorder, rename, delete",
        "Images - placed inline inside a chapter",
        "Metadata - title, author, description, cover",
        "Theme - typography and colours applied to the export"
      ],
      "suggestions": [
        {
          "label": "Chapters",
          "topic": "la-chapters"
        },
        {
          "label": "Book details",
          "topic": "la-meta"
        },
        {
          "label": "Images",
          "topic": "la-media"
        },
        {
          "label": "Theming",
          "topic": "la-theme"
        },
        {
          "label": "Exporting",
          "topic": "la-export"
        }
      ]
    },
    {
      "id": "la-export",
      "title": "Export & Import",
      "terms": [
        "export",
        "import",
        "epub export",
        "export to epub",
        "export my story",
        "download my book",
        "file out",
        "existing manuscript",
        "bring my book",
        "preview",
        "theme my book"
      ],
      "boost": 1,
      "answer": "Click Export EPUB and the file is built entirely on your device — no upload, no wait — then downloads named after your title. Import works the other way, so an existing manuscript does not have to be retyped.",
      "details": [
        "EPUB 3 containing a cover page, every scene themed, and all media embedded",
        "A JavaScript runtime ships inside it to handle choices, conditions, effects and input",
        "Opens fully in LazyReader; other EPUB 3 readers may differ on timed inputs",
        "Import an existing EPUB to keep working on it — this replaces what is open"
      ],
      "suggestions": [
        {
          "label": "Importing",
          "topic": "la-import"
        },
        {
          "label": "Theming",
          "topic": "la-theme"
        },
        {
          "label": "Publishing",
          "topic": "publishing"
        }
      ]
    },
    {
      "id": "la-account",
      "title": "Accounts & Auto-Save",
      "terms": [
        "auto save",
        "autosave",
        "save my work",
        "lose my work",
        "account",
        "sign up",
        "log in",
        "login",
        "free account",
        "cloud save"
      ],
      "boost": 1,
      "answer": "Create a free account and your work saves as you type - no save button to forget. Your projects follow the account, so signing in elsewhere picks up where you left off.",
      "details": [
        "Free account, sign up at lazyauthor.lindocode.com",
        "Auto-save on every change, synced to your account",
        "Switch between story mode and book mode any time",
        "Work stays available when you sign in on another machine"
      ],
      "suggestions": [
        {
          "label": "Open LazyAuthor",
          "link": "lazyAuthor"
        },
        {
          "label": "Exporting",
          "topic": "la-export"
        }
      ]
    },
    {
      "id": "la-variables",
      "title": "Variables",
      "terms": [
        "variable",
        "variables",
        "remember",
        "score",
        "counter",
        "stat",
        "template",
        "placeholder",
        "playername",
        "track a value"
      ],
      "boost": 3,
      "answer": "Variables let a story remember things — the reader's name, a score, whether they picked up a key. Create one in the Variables panel, print it in narrative with {{name}}, and change it with an effect on a choice.",
      "steps": [
        "Click Variables in the toolbar, then + Add variable",
        "Set Name (no spaces, e.g. courage), Label, Type (number or text) and a default",
        "In any scene body write {{courage}} where the value should appear",
        "Expand a choice → + Effect → pick the variable, operation and value"
      ],
      "details": [
        "set — assign a fixed value; add / subtract — move a counter; multiply — scale one",
        "Effects stack on a single choice and run in order",
        "{{score + 10}} displays arithmetic without changing the stored value",
        "Short names win: score beats playerCurrentScore when typing conditions"
      ],
      "suggestions": [
        {
          "label": "Gating with conditions",
          "topic": "la-conditions"
        },
        {
          "label": "Asking the reader",
          "topic": "la-player-input"
        },
        {
          "label": "Worked example: a score",
          "topic": "la-workflow-score"
        }
      ]
    },
    {
      "id": "la-conditions",
      "title": "Conditions",
      "terms": [
        "condition",
        "conditions",
        "gate",
        "hide a choice",
        "operator",
        "requirement",
        "only if",
        "unless"
      ],
      "boost": 3,
      "answer": "A condition hides a choice until a variable meets a threshold — that is how a path stays locked until the reader has earned it.",
      "steps": [
        "Expand the choice row",
        "Click Set condition",
        "Pick the variable, an operator and the value to compare against",
        "The choice row then shows the condition as a label"
      ],
      "details": [
        "Operators: eq, ne, gt, gte, lt, lte",
        "gt 3 is strictly greater than 3 — use gte 3 to include 3",
        "Always leave one unconditional choice as a fallback: if conditions hide every choice on a scene, the reader is stuck",
        "Remove condition clears it again"
      ],
      "suggestions": [
        {
          "label": "Variables",
          "topic": "la-variables"
        },
        {
          "label": "Worked example: locked door",
          "topic": "la-workflow-lock"
        },
        {
          "label": "Troubleshooting",
          "topic": "la-troubleshooting"
        }
      ]
    },
    {
      "id": "la-player-input",
      "title": "Player Input Scenes",
      "terms": [
        "player input",
        "input scene",
        "ask the reader",
        "reader types",
        "prompt",
        "validation",
        "wrong answer",
        "time limit",
        "attempts",
        "puzzle"
      ],
      "boost": 3,
      "answer": "A Player Input scene pauses the story, asks the reader to type something, and stores the answer in a variable you can use from then on.",
      "steps": [
        "Select the scene and set Scene type to Player input",
        "Write the Prompt, e.g. “What is your name, traveller?”",
        "Choose the variable the answer is stored in",
        "Set Next scene after submit — this clears any leftover choices"
      ],
      "details": [
        "Input type: Text, Number (numeric keypad on mobile) or Password (hidden)",
        "Validation matches exact, contains or regex, with your own error message",
        "On wrong answer can branch to a different scene, with a max-attempts cap",
        "Time limit adds a countdown and an on-timeout scene; a submission cap works the same way"
      ],
      "suggestions": [
        {
          "label": "Variables",
          "topic": "la-variables"
        },
        {
          "label": "Worked example: timed puzzle",
          "topic": "la-workflow-puzzle"
        },
        {
          "label": "Story editor",
          "topic": "la-story-editor"
        }
      ]
    },
    {
      "id": "la-media",
      "title": "Images, Audio & Video",
      "terms": [
        "media",
        "image",
        "picture",
        "photo",
        "audio",
        "music",
        "sound",
        "video",
        "upload",
        "autoplay",
        "marker",
        "add audio",
        "add an image",
        "add a video",
        "background music"
      ],
      "boost": 2,
      "answer": "Any scene or chapter can carry images, audio and video. Upload in the Media section, then place it with a marker in the text — or leave the marker out and it appends after the body.",
      "steps": [
        "Expand the Media section of the editor",
        "Upload the file — images (PNG, JPG, WebP, GIF), audio (MP3, OGG, WAV) or video (MP4, WebM)",
        "Type [image], [audio] or [video] in the body where it should sit",
        "Use [image2], [image3] for later images"
      ],
      "details": [
        "Everything uploads to cloud storage and is embedded in the exported EPUB",
        "Audio options: autoplay, loop, and hide controls",
        "Most browsers and readers block autoplay until the reader has tapped something",
        "Click × on a thumbnail to remove it"
      ],
      "suggestions": [
        {
          "label": "Theming the export",
          "topic": "la-theme"
        },
        {
          "label": "Exporting",
          "topic": "la-export"
        }
      ]
    },
    {
      "id": "la-theme",
      "title": "Theming The Export",
      "terms": [
        "theme",
        "styling",
        "style",
        "font",
        "typography",
        "colour",
        "color",
        "divider",
        "appearance",
        "look"
      ],
      "boost": 2,
      "answer": "The Theme panel controls how the exported EPUB looks, and changes preview in real time when you toggle Preview on any scene.",
      "details": [
        "Typography — family, size, line height, colour, alignment, first-line indent",
        "Scene titles — size, weight, italic, alignment, decorative rules above and below",
        "Choice buttons — outline or filled, colour, and corner radius from pill to square",
        "Images — maximum width and alignment; Divider — the symbol [break] renders as, default * * *",
        "Custom font files are not embedded, so pick a web-safe family like Georgia, serif"
      ],
      "suggestions": [
        {
          "label": "Previewing",
          "topic": "la-preview"
        },
        {
          "label": "Exporting",
          "topic": "la-export"
        },
        {
          "label": "Writing tips",
          "topic": "la-tips"
        }
      ]
    },
    {
      "id": "la-preview",
      "title": "Previewing",
      "terms": [
        "preview",
        "test",
        "try it",
        "see how it looks",
        "check my story"
      ],
      "boost": 2,
      "answer": "Preview renders a scene the way a reader will see it — narrative, themed choice buttons and inline media. It substitutes variables using their default values, so it is a layout check rather than a full play-through.",
      "details": [
        "Conditions are evaluated against defaults, so a gated choice may be hidden here",
        "A blank default makes {{playerName}} render as nothing — set a test default while writing",
        "For real branching, export the EPUB and open it in LazyReader",
        "Click Edit to go back to the editor"
      ],
      "suggestions": [
        {
          "label": "Exporting",
          "topic": "la-export"
        },
        {
          "label": "Conditions",
          "topic": "la-conditions"
        },
        {
          "label": "Troubleshooting",
          "topic": "la-troubleshooting"
        }
      ]
    },
    {
      "id": "la-import",
      "title": "Importing",
      "terms": [
        "import",
        "existing manuscript",
        "bring my book",
        "docx",
        "word",
        "migrate",
        "open an epub"
      ],
      "boost": 2,
      "answer": "You can import an EPUB and carry on working on it. Importing replaces what is currently open, so export first if you want to keep it.",
      "steps": [
        "Click your email address in the toolbar → Import EPUB",
        "Choose the .epub file",
        "Confirm the replace prompt if the current project has content",
        "Read and dismiss the yellow banner if anything could not be mapped"
      ],
      "details": [
        "Importing then exporting again migrates an older story to the latest EPUB format",
        "A .docx splits into chapters on Heading 1 — bold text alone will not be detected",
        "Your last export is your backup; there is no version history"
      ],
      "suggestions": [
        {
          "label": "Exporting",
          "topic": "la-export"
        },
        {
          "label": "Chapters",
          "topic": "la-chapters"
        },
        {
          "label": "Troubleshooting",
          "topic": "la-troubleshooting"
        }
      ]
    },
    {
      "id": "la-chapters",
      "title": "Chapters",
      "terms": [
        "chapter",
        "chapters",
        "reorder",
        "section break",
        "break marker",
        "table of contents",
        "toc"
      ],
      "boost": 3,
      "answer": "The book editor is chapters and prose — no scene types, variables or choices. Numbers are computed from position, so you never type them yourself.",
      "steps": [
        "Click + Add chapter at the bottom of the chapter list",
        "Click the title field to name it — this feeds the EPUB heading and table of contents",
        "Hover a row and use ▲ ▼ to reorder, × to delete",
        "Type [break] on its own line for a section divider"
      ],
      "details": [
        "× only appears when more than one chapter exists — a book needs at least one",
        "[image] places an uploaded image inline; without a marker it lands at the end",
        "Set Chapter start at to 1 so an opening Prologue stays unnumbered"
      ],
      "suggestions": [
        {
          "label": "Book details",
          "topic": "la-meta"
        },
        {
          "label": "Images",
          "topic": "la-media"
        },
        {
          "label": "Exporting",
          "topic": "la-export"
        }
      ]
    },
    {
      "id": "la-meta",
      "title": "Book & Story Details",
      "terms": [
        "meta",
        "metadata",
        "details",
        "cover",
        "cover image",
        "title",
        "language",
        "description",
        "prologue",
        "chapter start",
        "add a prologue",
        "front matter",
        "unnumbered chapter"
      ],
      "boost": 2,
      "answer": "The Meta panel on the right holds everything that describes the work: title, author, language, cover, and — for books — a description and the chapter numbering offset.",
      "details": [
        "Language is a two-letter code: en, fr, zu and so on",
        "Cover images look best at 1600 × 2400 px (2:3) — other ratios may letterbox",
        "Description is written into EPUB metadata; library apps show it, the reader does not",
        "Chapter start at 1 leaves your first chapter unnumbered, so a Prologue reads correctly"
      ],
      "suggestions": [
        {
          "label": "Chapters",
          "topic": "la-chapters"
        },
        {
          "label": "Theming",
          "topic": "la-theme"
        },
        {
          "label": "Exporting",
          "topic": "la-export"
        }
      ]
    },
    {
      "id": "la-workflow-name",
      "title": "Worked Example — Name The Reader",
      "terms": [
        "name the player",
        "name the reader",
        "address the reader",
        "use their name",
        "personalise",
        "personalize",
        "ask the reader their name",
        "reader their name",
        "ask for a name"
      ],
      "boost": 2,
      "answer": "Ask the reader their name once at the start, then address them by it for the rest of the story.",
      "steps": [
        "Add a variable: name playerName, type text, default blank",
        "Set your opening scene to Player input",
        "Prompt “What is your name, traveller?”, store in playerName, next scene = your second scene",
        "Write {{playerName}} in any later scene to address them"
      ],
      "suggestions": [
        {
          "label": "Variables",
          "topic": "la-variables"
        },
        {
          "label": "Player input",
          "topic": "la-player-input"
        }
      ]
    },
    {
      "id": "la-workflow-score",
      "title": "Worked Example — Track A Score",
      "terms": [
        "track a score",
        "points",
        "scoring",
        "award points",
        "final score",
        "keep score"
      ],
      "boost": 2,
      "answer": "Award points for brave choices and reveal the total on an ending scene.",
      "steps": [
        "Add a variable: name score, type number, default 0",
        "On each choice that deserves points, add an effect: score · add · 10",
        "Create an Ending scene and write “Final score: {{score}} points.”"
      ],
      "details": [
        "{{score >= 50}} prints the calculated value — it does not hide text",
        "To show different endings, put the condition on a choice leading to two different ending scenes"
      ],
      "suggestions": [
        {
          "label": "Variables",
          "topic": "la-variables"
        },
        {
          "label": "Conditions",
          "topic": "la-conditions"
        }
      ]
    },
    {
      "id": "la-workflow-lock",
      "title": "Worked Example — Lock A Choice",
      "terms": [
        "locked door",
        "lock behind an item",
        "haskey",
        "key",
        "item",
        "inventory",
        "requires an item",
        "lock a choice",
        "lock a choice behind an item",
        "locked choice"
      ],
      "boost": 2,
      "answer": "Show “Unlock the door” only to readers who found the key earlier.",
      "steps": [
        "Add a variable: name hasKey, type text, default false",
        "On the choice where the key is found, add an effect: hasKey · set · true",
        "On the door scene add the choice “Unlock the door” → Inside the House",
        "Set its condition to hasKey · eq · true",
        "Add a second, unconditional choice as the fallback for readers without the key"
      ],
      "suggestions": [
        {
          "label": "Conditions",
          "topic": "la-conditions"
        },
        {
          "label": "Variables",
          "topic": "la-variables"
        }
      ]
    },
    {
      "id": "la-workflow-puzzle",
      "title": "Worked Example — Timed Puzzle",
      "terms": [
        "timed puzzle",
        "countdown",
        "code word",
        "access code",
        "timer",
        "against the clock"
      ],
      "boost": 2,
      "answer": "Give the reader 30 seconds to type the right code word, with somewhere to go if they fail.",
      "steps": [
        "Add a text variable, e.g. codeAttempt",
        "Set the puzzle scene to Player input, storing into it",
        "Validation: match exact, correct answer LAZARUS, case-sensitive off, max attempts 3",
        "On wrong answer → a Wrong Code scene",
        "Time limit: 30 seconds, on timeout → a Time's Up scene"
      ],
      "suggestions": [
        {
          "label": "Player input",
          "topic": "la-player-input"
        },
        {
          "label": "Conditions",
          "topic": "la-conditions"
        }
      ]
    },
    {
      "id": "la-tips",
      "title": "Writing Tips",
      "terms": [
        "tip",
        "tips",
        "best practice",
        "advice",
        "how should i",
        "plan my story",
        "structure"
      ],
      "boost": 2,
      "answer": "Habits that keep a branching story manageable as it grows.",
      "details": [
        "Plan the scene tree first — 5 choices deep 3 levels is already 156 scenes",
        "Name scenes clearly: “Ending — Coward's Way” beats “Scene 12” in every dropdown",
        "One ending per branch, not one global ending — each outcome deserves its own conclusion",
        "Keep variable names short: score, hasKey",
        "Export early and read it in LazyReader — problems invisible in the editor show up there",
        "Use [break] at every time skip or change of place"
      ],
      "suggestions": [
        {
          "label": "Previewing",
          "topic": "la-preview"
        },
        {
          "label": "Exporting",
          "topic": "la-export"
        },
        {
          "label": "Troubleshooting",
          "topic": "la-troubleshooting"
        }
      ]
    },
    {
      "id": "la-troubleshooting",
      "title": "Troubleshooting",
      "terms": [
        "not working",
        "broken",
        "problem",
        "wont",
        "won't",
        "failed",
        "save failed",
        "stuck",
        "missing",
        "error",
        "undo",
        "deleted a scene",
        "export does nothing",
        "export button",
        "nothing happens",
        "download never starts"
      ],
      "boost": 2,
      "answer": "The problems that come up most, and what they usually mean.",
      "details": [
        "Export does nothing — you need at least one scene or chapter with content, and downloads allowed",
        "Choices missing in preview — only Narrative scenes show choices, and every choice needs a target",
        "A conditioned choice never appears — preview uses defaults, and gt 3 excludes 3 (use gte)",
        "{{playerName}} shows literally — its default is blank; set a test default while writing",
        "Save failed — the cloud write did not land; work is still local, so export a backup before refreshing",
        "Deleted a scene — there is no undo, so export a draft before big structural changes"
      ],
      "suggestions": [
        {
          "label": "Previewing",
          "topic": "la-preview"
        },
        {
          "label": "Conditions",
          "topic": "la-conditions"
        },
        {
          "label": "Accounts & auto-save",
          "topic": "la-account"
        }
      ]
    },
    {
      "id": "publishing",
      "title": "Publishing A Book",
      "terms": [
        "publish",
        "publishing",
        "publish a book",
        "distribute",
        "sell my book",
        "get readers",
        "release my book",
        "share my book"
      ],
      "boost": 2,
      "answer": "Publishing from LazyAuthor hands back a short redeem code and a QR for the book. That is all a reader needs - so you can market the book yourself straight away, or ask for it to be listed on LazyStore as well.",
      "details": [
        "1. Finish the book or story in LazyAuthor",
        "2. Publish - you get a short redeem code and a QR back",
        "3. Share that code and QR anywhere you like - it works on its own",
        "4. Optionally email support@lindocode.com for a LazyStore listing",
        "5. Readers scan or type the code in LazyReader"
      ],
      "suggestions": [
        {
          "label": "Getting on LazyStore",
          "topic": "store-listing"
        },
        {
          "label": "How redeeming works",
          "topic": "redeem"
        },
        {
          "label": "Open LazyAuthor",
          "link": "lazyAuthor"
        }
      ]
    },
    {
      "id": "lazystore",
      "title": "LazyStore",
      "terms": [
        "lazystore",
        "store",
        "catalog",
        "catalogue",
        "free book",
        "browse books",
        "shop",
        "buy book",
        "find books",
        "where do i get books"
      ],
      "boost": 2,
      "summary": "a catalog of free books that redeem into LazyReader",
      "answer": "A curated catalog of free books for LazyReader. Each listing has a cover, a synopsis, a QR code and a short redeem code, and the seed catalog is public-domain titles from Project Gutenberg.",
      "details": [
        "Every book is free - no account or payment to browse",
        "Cover, author, synopsis and tags per listing",
        "A QR code and a typed code, whichever suits you",
        "Curated - listings are added by us, not self-serve"
      ],
      "suggestions": [
        {
          "label": "How do I redeem?",
          "topic": "redeem"
        },
        {
          "label": "Listing my own book",
          "topic": "store-listing"
        },
        {
          "label": "About LazyReader",
          "topic": "lazyreader"
        }
      ]
    },
    {
      "id": "store-listing",
      "title": "Getting Listed On LazyStore",
      "terms": [
        "get listed",
        "listing",
        "list my book",
        "add my book",
        "book on lazystore",
        "my book on the store",
        "submit",
        "submit my book",
        "submission",
        "who adds books",
        "curated",
        "sell on lazystore"
      ],
      "boost": 2,
      "answer": "LazyStore is curated - only the admin adds listings, so there is no self-serve upload. Publish in LazyAuthor first, then email support@lindocode.com with the book and its redeem code to ask for a spot.",
      "details": [
        "Publish in LazyAuthor to get the redeem code and QR",
        "Email support@lindocode.com with the book details and that code",
        "We add the listing - cover, synopsis, QR and code",
        "You do not have to wait for it: the code and QR already work, so you can market the book yourself in the meantime"
      ],
      "suggestions": [
        {
          "label": "Email support@lindocode.com",
          "link": "support"
        },
        {
          "label": "Publishing a book",
          "topic": "publishing"
        },
        {
          "label": "About LazyStore",
          "topic": "lazystore"
        }
      ]
    },
    {
      "id": "redeem",
      "title": "Adding A Book",
      "terms": [
        "redeem",
        "redeem code",
        "book code",
        "add a book",
        "add books",
        "scan qr",
        "qr",
        "enter code",
        "claim",
        "how do i get a book into"
      ],
      "boost": 2,
      "answer": "Open the scanner in LazyReader and either scan the QR from a LazyStore listing or type the code by hand. The book appears in your library straight away.",
      "details": [
        "1. Find a book on LazyStore, or get a code from its author",
        "2. In LazyReader, open the scan screen",
        "3. Scan the QR, or type the short code instead",
        "4. The book lands in your library, ready to read"
      ],
      "suggestions": [
        {
          "label": "Browse LazyStore",
          "topic": "lazystore"
        },
        {
          "label": "Publishing your own",
          "topic": "publishing"
        },
        {
          "label": "Open LazyReader",
          "link": "lazyReader"
        }
      ]
    },
    {
      "id": "feedback",
      "title": "Feedback & Status",
      "terms": [
        "bug",
        "issue",
        "report",
        "broken",
        "not working",
        "crash",
        "feature request",
        "request a feature",
        "roadmap",
        "vote",
        "feedback",
        "suggest",
        "status",
        "uptime",
        "support",
        "help me"
      ],
      "answer": "The LazyReader site runs public boards. Post a bug on the issue board and follow its status, or put a feature on the feature board and let votes decide what gets built next. Backend status is published live on the same site.",
      "details": [
        "Issue board - report a bug, track it through to fixed",
        "Feature board - request and vote on what comes next",
        "Both boards are public, so progress is visible",
        "Live server status published alongside them"
      ],
      "suggestions": [
        {
          "label": "Open the boards",
          "link": "lazyReader"
        },
        {
          "label": "Contact us directly",
          "link": "contact"
        }
      ]
    },
    {
      "id": "policies",
      "title": "Privacy & Terms",
      "terms": [
        "privacy",
        "popia",
        "gdpr",
        "policy",
        "terms",
        "conditions",
        "legal",
        "data protection",
        "personal information",
        "cookie"
      ],
      "answer": "The Privacy & POPIA policy covers what this site collects and how it is handled, and the Terms & Conditions cover use of the site and the apps. Both are linked in the footer on every page.",
      "suggestions": [
        {
          "label": "Privacy & POPIA policy",
          "link": "privacy"
        },
        {
          "label": "Terms & conditions",
          "link": "terms"
        },
        {
          "label": "What about my books?",
          "topic": "lr-privacy"
        }
      ]
    },
    {
      "id": "delete-account",
      "title": "Deleting Your Account",
      "terms": [
        "delete account",
        "delete my account",
        "remove account",
        "close account",
        "erase my data",
        "deactivate",
        "unsubscribe"
      ],
      "boost": 2,
      "answer": "Account deletion is requested from the LazyReader site, on its delete-account page. Removing the account removes the data tied to it - the books in your cloud are untouched, because they were never ours to begin with.",
      "suggestions": [
        {
          "label": "LazyReader site",
          "link": "lazyReader"
        },
        {
          "label": "Privacy policy",
          "topic": "policies"
        }
      ]
    },
    {
      "id": "greeting",
      "title": "Hello",
      "terms": [
        "hi",
        "hey",
        "hello",
        "howzit",
        "good morning",
        "good afternoon",
        "good evening"
      ],
      "answer": "Hi. I know this studio and the Lazy Appz products well - services, pricing and process on one side, LazyReader, LazyAuthor, LazyStore and Digital Hub on the other. Ask something specific and you get a specific answer.",
      "suggestions": [
        {
          "label": "What do you build?",
          "topic": "services"
        },
        {
          "label": "The products",
          "topic": "lazyappz"
        },
        {
          "label": "What does it cost?",
          "topic": "pricing"
        }
      ]
    },
    {
      "id": "capabilities",
      "title": "What I Can Answer",
      "terms": [
        "what can you do",
        "what can you answer",
        "help",
        "topics",
        "options",
        "are you real",
        "are you ai",
        "chatbot",
        "who are you assistant"
      ],
      "answer": "I answer from a fixed knowledge base about this studio - no model behind me, so no invented answers. Studio side: services, process, stack, pricing, contact. Product side: LazyReader, LazyAuthor, LazyStore, Digital Hub, down to specifics like which clouds sync or how redeem codes work.",
      "suggestions": [
        {
          "label": "Services",
          "topic": "services"
        },
        {
          "label": "The products",
          "topic": "lazyappz"
        },
        {
          "label": "How they connect",
          "topic": "ecosystem"
        },
        {
          "label": "Pricing",
          "topic": "pricing"
        }
      ]
    }
  ]
};
