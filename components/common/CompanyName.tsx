import clsx from "clsx";

export default function CompanyName() {
  const lindoCodeLetters = "LINDOCODE".split("");

  return (
    <header
      className={clsx(
        "company-name-enter flex w-full justify-center",
        "flex-col items-center",
        "gap-1.5", // Reduced from gap-1
        "sm:gap-1.5", // Reduced from sm:gap-2
        "landscape:md:flex-row landscape:md:items-baseline landscape:md:gap-4",
      )}
    >
      {/* SEO + accessibility */}
      <h1 className="sr-only">Digital Hub</h1>

      {/* Visual branding */}
      <div
        aria-hidden="true"
        className={clsx(
          "flex items-end justify-center font-black tracking-[0.06em] text-black",
          "text-[2.5rem]",
          "min-[421px]:text-[2.8rem]",
          "sm:text-[2rem]",
          "md:text-[2.5rem]",
          "lg:text-[4rem]",
          "font-['Lemon_Milk_Pro']",
        )}
      >
        {/* LINDOCODE vertically stacked on the left of D, aligned with D */}
        <div className="relative inline-flex items-center">
          {/* LINDOCODE vertically stacked - aligned with D */}
          <div className="absolute right-full mr-1 flex flex-col items-end justify-center h-full">
            {lindoCodeLetters.map((letter, idx) => (
              <span
                key={idx}
                className="text-[0.11em] font-mono tracking-tighter leading-none whitespace-nowrap"
              >
                {letter}
              </span>
            ))}
          </div>

          {/* D letter */}
          <span>D</span>
        </div>

        {/* Rest of "igital" */}
        <span>igital</span>
      </div>

      <p
        className={clsx(
          "company-name-digital font-normal tracking-[0.18em]",
          "text-[0.95rem] min-[421px]:text-[1.1rem] sm:text-[1.2rem] md:text-[1.8rem]",
          "landscape:md:self-baseline",
          "-mt-2 sm:-mt-3 md:-mt-4", // Negative margin to pull Hub closer to Digital
        )}
      >
        <span className="text-red-600">Hub</span>
        <span className="text-black text-[0.6em] align-super">™</span>
      </p>
    </header>
  );
}
