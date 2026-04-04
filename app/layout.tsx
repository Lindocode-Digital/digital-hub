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
  title: "Lindocode Digital | Web & Mobile App Development Solutions",
  description:
    "Lindocode Digital builds modern web and mobile applications, automation systems, and API integrations. We deliver scalable, high-performance digital solutions.",

  openGraph: {
    title: "Lindocode Digital",
    description:
      "Modern web and mobile app development, automation, and API integration.",
    url: "https://lindocode.com",
    siteName: "Lindocode Digital",
    type: "website",
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
