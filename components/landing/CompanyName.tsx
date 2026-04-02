import "./Logo.css";
import clsx from "clsx";
import Logo from "./Logo";

export default function CompanyName() {
  const word = "LINDOCODE";

  return (
    <header
      className={clsx(
        "company-name-enter flex w-full justify-center",
        "flex-col items-center gap-1",
        "sm:gap-2",
        "landscape:md:flex-row landscape:md:items-baseline landscape:md:gap-4",
      )}
    >
      <div
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
        {word.split("").map((char, index) =>
          char === "I" ? (
            <span
              key="logo-i"
              className="company-name-logo-pop mx-[0.04em] -mt-1 inline-flex items-end"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <span
                key="logo-i"
                className="company-name-logo-pop mx-[0.04em] -mt-1 inline-flex items-end"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {/* 0 - 639 */}
                <span className="inline-flex min-[640px]:hidden">
                  <Logo
                    size="medium"
                    scale={1}
                    postMargin={40}
                    headPos={0.3}
                    rayPos={1.2}
                  />
                </span>

                {/* 640 - 767 */}
                <span className="hidden min-[640px]:inline-flex min-[768px]:hidden">
                  <Logo
                    size="compact-xs"
                    scale={0.6}
                    postMargin={35}
                    headPos={0.3}
                    rayPos={1.2}
                  />
                </span>

                {/* 768 - 899 */}
                <span className="hidden min-[768px]:inline-flex min-[900px]:hidden">
                  <Logo
                    size="medium"
                    scale={1.02}
                    postMargin={38}
                    headPos={0.34}
                    rayPos={1.24}
                  />
                </span>

                {/* 900 - 1023 */}
                <span className="hidden min-[900px]:inline-flex min-[1024px]:hidden">
                  <Logo
                    size="medium"
                    scale={1.12}
                    postMargin={36}
                    headPos={0.38}
                    rayPos={1.28}
                  />
                </span>

                {/* 1024 - 1151 */}
                <span className="hidden min-[1024px]:inline-flex min-[1152px]:hidden">
                  <Logo
                    size="large"
                    scale={1.16}
                    postMargin={34}
                    headPos={0.42}
                    rayPos={1.34}
                  />
                </span>

                {/* 1152 - 1279 */}
                <span className="hidden min-[1152px]:inline-flex min-[1280px]:hidden">
                  <Logo
                    size="large"
                    scale={1.26}
                    postMargin={32}
                    headPos={0.46}
                    rayPos={1.4}
                  />
                </span>

                {/* 1280+ */}
                <span className="hidden min-[1280px]:inline-flex">
                  <Logo
                    size="large"
                    scale={1.45}
                    postMargin={30}
                    headPos={0.5}
                    rayPos={1.5}
                  />
                </span>
              </span>{" "}
            </span>
          ) : (
            <span
              key={index}
              className="company-name-letter inline-block"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              {char}
            </span>
          ),
        )}
      </div>

      <div
        className={clsx(
          "company-name-digital font-normal tracking-[0.18em] text-black",
          "text-[0.95rem] min-[421px]:text-[1.1rem] sm:text-[1.2rem] md:text-[1.8rem]",
          "landscape:md:self-baseline",
        )}
      >
        DIGITAL™
      </div>
    </header>
  );
}
