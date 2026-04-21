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
  cardId: string;
  slug: string;
  title: string;
  cardTitle: string;
  cardSubtitle?: string;
  description: string;
  extra?: string;
  image: string;
  background?: string;
  attribute?: ProjectAttribute;
  domain?: string;
  link?: string;
  color?: string;
};

export const projects: Project[] = [
  {
    cardId: "01",
    slug: "/",
    domain: "lindocode.com",
    title: "Lindocode Digital",
    cardTitle: "Lindocode Digital™",
    cardSubtitle: "Visit Us",
    description: "Tech Solutions",
    extra: "Effortless tech, maximum ease.",
    image:
      "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/cards/cards.webp",
    background: "",
    color: "",
    link: "https://lindocode.com",
    attribute: {
      artistName: "Kelly Sikkema",
      artistLink:
        "https://unsplash.com/@kellysikkema?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/yellow-click-pen-on-white-printer-paper-gcHFXsdcmJE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "Unsplash",
    },
  },
  {
    cardId: "02",
    slug: "/",
    domain: "portfolio.lindocode.com",
    title: "PORTFOLIO",
    cardTitle: "PORTFOLIO",
    cardSubtitle: "Fullstack",
    description: "Web|Mobile Developer",
    image:
      "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/cards/cards7.webp",
    background: "",
    color: "",
    link: "https://portfolio.lindocode.com",
    attribute: {
      artistName: "Kelly Sikkema",
      artistLink:
        "https://unsplash.com/@kellysikkema?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/yellow-click-pen-on-white-printer-paper-gcHFXsdcmJE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "Unsplash",
    },
  },

  {
    cardId: "03",
    slug: "/",
    domain: "sdrowvieli.lindocode.com",
    title: "Sdrow Vieli",
    cardTitle: "SDROW VIELI",
    cardSubtitle: "Writing",
    description: "Art of Storytelling",
    image:
      "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/cards/cards6.webp",
    background: "",
    color: "",
    link: "https://sdrowvieli.lindocode.com",
    attribute: {
      artistName: "Andrew Neel",
      artistLink:
        "https://unsplash.com/@andrewtneel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/macbook-pro-white-ceramic-mugand-black-smartphone-on-table-cckf4TsHAuw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "Unsplash",
    },
  },

  {
    cardId: "04",
    slug: "/projects",
    domain: "lindocode.com",
    title: "Featured Projects",
    cardTitle: "SHOWCASE",
    cardSubtitle: "Projects",
    description: "Web & Mobile Apps",
    image:
      "https://dawn-unit-97b0.sdrowvieli1.workers.dev/creativehub/images/cards/projects.webp",
    background: "",
    color: "",
    link: "https://lindocode.com/projects",
    attribute: {
      artistName: "Andrew Neel",
      artistLink:
        "https://unsplash.com/@andrewt neel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/macbook-pro-white-ceramic-mugand-black-smartphone-on-table-cckf4TsHAuw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "Unsplash",
    },
  },
];
