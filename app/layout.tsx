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
  title: "Lindocode Digital",
  description: "Elegant simplicity. Innovate. Build. Scale.",
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
