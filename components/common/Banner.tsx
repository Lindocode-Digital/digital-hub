import clsx from "clsx";

type BannerProps = {
  textLeft?: string;
  textMiddle?: string;
  textRight?: string;
  accentColor?: string;
};

export default function Banner({
  textLeft = "INNOVATE.",
  textMiddle = "BUILD.",
  textRight = "SCALE.",
  accentColor = "text-rose-600",
}: BannerProps) {
  const baseHeadline =
    "text-[clamp(1.1rem,3vw,2.25rem)] tracking-[0.12em] font-['Lemon_Milk_Pro']";
  const sideText = "font-medium text-neutral-700 opacity-90";
  const middleText = "font-black";

  return (
    <section
      className="
        mx-auto w-full max-w-4xl px-3 py-3
        md:px-4 md:py-3
        lg:px-2 lg:py-2
      "
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-14 w-1 rounded-full bg-rose-600 sm:h-16" />

        <div className="min-w-0">
          <p className="m-0 text-xs text-neutral-600 sm:text-sm">
            Elegant Simplicity
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4 sm:flex-nowrap">
            <span className={clsx(baseHeadline, sideText)}>{textLeft}</span>
            <span className={clsx(baseHeadline, middleText, accentColor)}>
              {textMiddle}
            </span>
            <span className={clsx(baseHeadline, sideText)}>{textRight}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
