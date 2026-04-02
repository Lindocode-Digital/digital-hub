# 🎨 Digital Hub

![Home](https://raw.githubusercontent.com/Lindo-code/images/refs/heads/main/creative-hub/Screenshot_20250702_185849.png)

---

## 💭 Vision

**Digital Hub** is envisioned as a centralized, elegant platform for showcasing projects/work. Built to be as intuitive to navigate as it is powerful to experience.

It’s a responsive, scalable solution that merges form and function. As development progresses, all existing projects and digital presence will be migrated into this unified space to improve accessibility, performance, and presentation across devices and users.

> 🔧 Modular, route-based architecture  
> 💡 Fully responsive and optimized for scalability  
> 📫 Includes integrated contact form and smooth scrolling sections

---

## 🚀 Features

- [x] 🧠 **Dynamic routing** with slug-based URLs

- [x] ⏳ **Lazy-loaded components** using `React.lazy` & `Suspense`

- [x] 🖼️ **Smooth background transitions** per project

- [x] 🧩 **Modular project pages**:

  - `Lazy Appz`: Stacked cards per category (web, games, mobile)
  - `PORTFOLIO`: Video intro, tech stack, testimonials, and contact
  - `Sdrow Vieli`: Carousel + tab-based layout

- [x] ✨ **GSAP-powered UI animations**

- [x] 💌 **Formspree contact integration**

- [x] 🎯 **Mobile-first design** with `useMediaQuery` via Material UI

## Updates

- [x] Make page refresh work

- [x] IOS (Safari) fix lack of pinning issue on scrolling

- [x] Move website deployment to different platform

- [x] Added review & contributions section

- [x] Added interactive stack visualizer

- [ ] Update Lazy Appz page:

  - [ ] Add tabs for page
  - [x] Add content to the page
  - [x] Organize projects and details

- [x] Update Portfolio page links to reference Lazy Appz

- [x] Update Sdrow Vieli page:

  - [ ] Add content relative to the page

- [x] Make Fully Responsive:

  - [x] Landscape mobile
  - [x]Main page portrait mobile

---

## 📁 Project Structure

```
src/
├── App.jsx
├── components/
│ ├── shared/ # Reusable UI components
│ ├── projects/ # Project-specific views
│ └── icon_ticker/ # Icon and testimonial tickers
├── data/ # All project + UI content (JSON)
│ └── *.json
├── assets/ # Static files (images, slogans, video)
└── EmailForm.jsx
```

---

## 🌐 Routes

| Path           | View Component | Description                          |
| -------------- | -------------- | ------------------------------------ |
| `/`            | `App`          | Main card carousel and navigation    |
| `/lazy-appz`   | `LazyAppz`     | Stacked cards for various app types  |
| `/portfolio`   | `Portfolio`    | Full project showcase + contact form |
| `/sdrow-vieli` | `SdrowVieli`   | Slider and tabbed word experiment    |
| `*`            | `NotFound`     | 404 fallback                         |

Routing is dynamically matched using slugs generated from project titles.

---

## 🧪 Contact Form Setup

CreativeHub uses [Formspree](https://formspree.io)

## 🙏 Acknowledgements

- React

- Nextjs

- Vite

- Material UI

- GSAP

- Formspree

## 📜 License

MIT License
© 2025 Lindo Matabane
