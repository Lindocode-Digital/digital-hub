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
  /** Single string used everywhere, or [cardDescription, overlayDescription] tuple. */
  description: string | [string, string];
  extra?: string;
  image: string;
  background?: string;
  attribute?: ProjectAttribute;
  domain?: string;
  link?: string;
  color?: string;
};

/** Short label shown on carousel cards (index 0 of a tuple, or the plain string). */
export function cardDescription(p: Project): string {
  return Array.isArray(p.description) ? p.description[0] : p.description;
}

/** Full description shown in the overlay panel (index 1 of a tuple, falling back to index 0). */
export function overlayDescription(p: Project): string {
  return Array.isArray(p.description) ? p.description[1] : p.description;
}

export const projects: Project[] = [
  {
    cardId: "01",
    slug: "/projects",
    domain: "lindocode.com",
    title: "Featured Projects",
    cardTitle: "SHOWCASE",
    cardSubtitle: "Projects",
    description: "Web & Mobile Apps",
    image:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fcreativehub_images_cards_projects.webp",
    background:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fscreenshot_image4.png",
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

  {
    cardId: "02",
    slug: "/",
    domain: "portfolio.lindocode.com",
    title: "PORTFOLIO",
    cardTitle: "PORTFOLIO",
    cardSubtitle: "Fullstack",
    description: [
      "Web|Mobile Developer",
      "A premium, performance-focused developer portfolio built with Vite and modern UI principles. It showcases real-world projects, open-source activity, and interactive components with smooth animations, optimized for both high-end and low-end devices.",
    ],
    image:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fcreativehub_images_cards_cards7.webp",
    background:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fscreenshot_image3.png",
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
    domain: "lindocode.com",
    title: "Lindocode Digital",
    cardTitle: "Lindocode Digital™",
    cardSubtitle: "Visit Us",
    description: [
      "Tech Solutions",
      "Official Lindocode Digital homepage. Showcasing our services across web development, mobile applications, databases, APIs, and full-stack digital solutions.",
    ],
    extra: "Effortless tech, maximum ease.",
    image:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fcreativehub_images_cards_cards.webp",
    background:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fscreenshot_image5.png",
    color: "",
    link: "https://lindocode.com",
    attribute: {
      artistName: "Sdrow Vieli",
      artistLink:
        "https://unsplash.com/@kellysikkema?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/yellow-click-pen-on-white-printer-paper-gcHFXsdcmJE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "DigitalHub",
    },
  },

  {
    cardId: "04",
    slug: "/",
    domain: "lazyreader.lindocode.com",
    title: "LazyReader",
    cardTitle: "LAZYREADER",
    cardSubtitle: "Mobile",
    description: [
      "Reading Experience",
      "LazyReader is a modern cloud-connected EPUB reader built for readers who want their library anywhere. Connect your cloud storage, open any EPUB instantly - including interactive EPUBs with embedded media and rich formatting - and enjoy a focused reading experience with a premium interface built for speed and simplicity. Pair it with LazyAuthor to write, publish, and push your own EPUBs straight to your LazyReader library.",
    ],
    image:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fnew_mockups.webp",
    background:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fscreenshot_image2.png",
    color: "",
    link: "https://lazyreader.lindocode.com",
    attribute: {
      artistName: "Sdrow Vieli",
      artistLink:
        "https://unsplash.com/@andrewtneel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/macbook-pro-white-ceramic-mugand-black-smartphone-on-table-cckf4TsHAuw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "DigitalHub",
    },
  },
  {
    cardId: "05",
    slug: "/",
    domain: "lazyauthor.lindocode.com",
    title: "LazyAuthor",
    cardTitle: "LAZYAUTHOR",
    cardSubtitle: "Writing",
    description: [
      "Art of Storytelling",
      "LazyAuthor is a distraction-free writing studio built for authors who want to craft and publish interactive EPUBs without the friction. Write in a clean, focused editor, structure your chapters, embed rich media, and produce polished EPUB files ready for any reader. Pair it with LazyReader to push your work straight to your personal library and read it exactly as your audience will.",
    ],
    image:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fnew_mockup.webp",
    background:
      "https://objectstorage.ca-montreal-1.oraclecloud.com/n/axl9dc7vfz2c/b/bucket-20250511-1735/o/main-cards%2Fscreenshot_image1.png",
    color: "",
    link: "https://sdrowvieli.lindocode.com",
    attribute: {
      artistName: "Sdrow Vieli",
      artistLink:
        "https://unsplash.com/@andrewtneel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistWorkLink:
        "https://unsplash.com/photos/macbook-pro-white-ceramic-mugand-black-smartphone-on-table-cckf4TsHAuw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
      artistPlatform: "DigitalHub",
    },
  },
];
