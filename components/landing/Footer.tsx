import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="
        flex w-full items-center text-neutral-600
        flex-col gap-3 py-3
        sm:flex-row sm:justify-between sm:gap-4 sm:py-4
      "
    >
      <div
        className="
          order-2 flex w-full items-center justify-center gap-2 text-center text-xs
          sm:order-1 sm:w-auto sm:justify-start sm:text-left sm:gap-3 sm:text-sm
        "
      >
        <span className="inline-flex rounded-full p-0.5">
          <Logo
            size="compact"
            scale={0.4}
            postWidth={0.9}
            dotWidth={1.5}
            bulbWidth={0.7}
            headWidth={2.3}
            headPos={-1.7}
            rayPos={-0.7}
            postMargin={33}
            headColor="#4b5563"
            postColor="#4b5563"
            bulbColor="#4b5563"
            rayColor="#4b5563"
            dotColor="#4b5563"
          />
        </span>
        <span>© {year} Lindocode Digital. All rights reserved.</span>
      </div>

      <div
        className="
          order-1 flex w-full items-center justify-center gap-3
          sm:order-2 sm:w-auto
        "
      >
        <Link
          href="https://www.linkedin.com/company/lindocode-digital-pty-ltd"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-200 hover:scale-110"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5 sm:h-5 sm:w-5" />
        </Link>

        <Link
          href="https://github.com/Lindocode-Digital"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform duration-200 hover:scale-110"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5 sm:h-5 sm:w-5" />
        </Link>
      </div>
    </footer>
  );
}
