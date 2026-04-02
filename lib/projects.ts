export type ProjectAttribute = {
  artistName: string;
  artistLink: string;
  artistWorkLink: string;
  artistPlatform: string;
};

export type ProjectSeo = {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  og_image: string;
};

export type ProjectIcon = {
  src: string;
  size: number;
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  cardTitle: string;
  cardSubtitle?: string;
  description: string;
  extra?: string;
  image: string;
  background?: string;
  attribute?: ProjectAttribute;
  icons: ProjectIcon[];
  seo?: ProjectSeo;
  link?: string;
};

export const projects: Project[] = [
  {
    slug: "lazy-appz",
    title: "Lazy Appz",
    cardTitle: "LAZY APPZ™",
    cardSubtitle: "Visit Us",
    description: "Tech Solutions",
    extra: "Effortless tech, maximum ease.",
    image:
      "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/cards/cards.webp",
    background: "",
    link: "/projects",
    attribute: {
      artistName: "Kelly Sikkema",
      artistLink:
        "https://unsplash.com/@kellysikkema?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/yellow-click-pen-on-white-printer-paper-gcHFXsdcmJE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "Unsplash",
    },
    icons: [
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/dot-svgrepo-com.svg",
        size: 24,
        alt: "Dot",
      },
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/coding-app-svgrepo-com.svg",
        size: 35,
        alt: "App icon",
      },
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/dot-svgrepo-com.svg",
        size: 24,
        alt: "Dot",
      },
    ],
    seo: {
      title: "Lazy Appz | Web & mobile applications development",
      description:
        "Collection of minimalist web tools and productivity apps built for web and mobile apps - and production-ready utilities designed for maximum efficiency.",
      keywords:
        "productivity apps, lazy appz projects, react applications, node.js tools, workflow optimization, time management apps",
      canonical: "https://lindocode.com/lazy-appz",
      og_image: "https://lindocode.com/assets/lazy-appz-preview.webp",
    },
  },
  {
    slug: "portfolio",
    title: "PORTFOLIO",
    cardTitle: "PORTFOLIO",
    cardSubtitle: "Fullstack",
    description: "Web|Mobile Developer",
    image:
      "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/cards/cards7.webp",
    background: "",
    link: "/",
    attribute: {
      artistName: "Kelly Sikkema",
      artistLink:
        "https://unsplash.com/@kellysikkema?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/yellow-click-pen-on-white-printer-paper-gcHFXsdcmJE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "Unsplash",
    },
    icons: [
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/dot-svgrepo-com.svg",
        size: 24,
        alt: "Dot",
      },
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/coding-html-svgrepo-com-2.svg",
        size: 35,
        alt: "HTML icon",
      },
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/dot-svgrepo-com.svg",
        size: 24,
        alt: "Dot",
      },
    ],
    seo: {
      title: "Lindo Matabane | Full-Stack Developer",
      description:
        "Professional full stack developer specializing in web and mobile applications",
      keywords:
        "productivity apps, lazy appz projects, react applications, node.js tools, workflow optimization, time management apps",
      canonical: "https://lindocode.com/lazy-appz",
      og_image: "https://lindocode.com/assets/lazy-appz-preview.webp",
    },
  },
  {
    slug: "sdrow-vieli",
    title: "Sdrow Vieli",
    cardTitle: "SDROW VIELI",
    cardSubtitle: "Explore Books",
    description: "Into the Art of Storytelling",
    image:
      "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/cards/cards6.webp",
    background: "",
    link: "",
    attribute: {
      artistName: "Andrew Neel",
      artistLink:
        "https://unsplash.com/@andrewtneel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/macbook-pro-white-ceramic-mugand-black-smartphone-on-table-cckf4TsHAuw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "Unsplash",
    },
    icons: [
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/dot-svgrepo-com.svg",
        size: 24,
        alt: "Dot",
      },
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/writing-pencil-svgrepo-com-1.svg",
        size: 35,
        alt: "Writing icon",
      },
      {
        src: "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/icons/dot-svgrepo-com.svg",
        size: 24,
        alt: "Dot",
      },
    ],
    seo: {
      title: "Sdrow Vieli | Creative Writing",
      description:
        "Original fiction and thought experiments exploring human decisions, a narrative project.",
      keywords:
        "productivity apps, lazy appz projects, react applications, node.js tools, workflow optimization, time management apps",
      canonical: "https://lindocode.com/lazy-appz",
      og_image: "https://lindocode.com/assets/lazy-appz-preview.webp",
    },
  },
];
