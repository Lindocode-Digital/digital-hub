import type { Metadata } from "next";
import { Jost, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lindocode.com"),

  title: {
    default: "Digital Hub | Lindocode Digital",
    template: "%s | Lindocode Digital",
  },

  description:
    "Digital Hub is a centralized, elegant platform for showcasing creative work or projects. Built to be as intuitive to navigate as it is powerful to experience.",

  alternates: {
    canonical: "https://lindocode.com/digitalhub",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Digital Hub | Lindocode Digital",
    description:
      "Digital Hub is a centralized, elegant platform for showcasing creative work or projects. Built to be as intuitive to navigate as it is powerful to experience.",
    url: "https://lindocode.com/digitalhub",
    siteName: "Lindocode Digital",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Hub",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Digital Hub | Lindocode Digital",
    description:
      "Digital Hub is a centralized, elegant platform for showcasing creative work or projects. Built to be as intuitive to navigate as it is powerful to experience.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${jost.variable} ${playfair.variable} ${montserrat.variable} font-sans antialiased bg-white text-neutral-900 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
