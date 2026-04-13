import clsx from "clsx";
import type { CSSProperties } from "react";

type LogoSize = "compact-xs" | "compact" | "medium" | "large";

type LogoProps = {
  className?: string;
  size?: LogoSize;
  scale?: number;
  lampHeight?: number;
  postWidth?: number;
  dotWidth?: number;
  bulbWidth?: number;
  postMargin?: number;
  headWidth?: number;
  headPos?: number;
  rayPos?: number;
  rayWidth?: number;
  rayHeight?: number;
  headColor?: string;
  postColor?: string;
  bulbColor?: string;
  dotColor?: string;
  rayColor?: string;
};

const sizeConfig: Record<
  LogoSize,
  {
    scale: number;
    postMargin: number;
    headPos: number;
    rayPos: number;
    lampHeight: number;
    postWidth: number;
    dotWidth: number;
    bulbWidth: number;
    headWidth: number;
    rayWidth: number;
    rayHeight: number;
  }
> = {
  "compact-xs": {
    scale: 0.55,
    postMargin: 40,
    headPos: 0.3,
    rayPos: 1.2,
    lampHeight: 70,
    postWidth: 0.65,
    dotWidth: 0.55,
    bulbWidth: 0.8,
    headWidth: 1.8,
    rayWidth: 0.2,
    rayHeight: 0.5,
  },
  compact: {
    scale: 0.72,
    postMargin: 18,
    headPos: 0.2,
    rayPos: 0.8,
    lampHeight: 50,
    postWidth: 0.65,
    dotWidth: 0.6,
    bulbWidth: 0.8,
    headWidth: 2,
    rayWidth: 0.2,
    rayHeight: 0.5,
  },
  medium: {
    scale: 0.92,
    postMargin: 50,
    headPos: 0.7,
    rayPos: 1.6,
    lampHeight: 40,
    postWidth: 0.6,
    dotWidth: 0.6,
    bulbWidth: 0.8,
    headWidth: 1.8,
    rayWidth: 0.2,
    rayHeight: 0.5,
  },
  large: {
    scale: 1.1,
    postMargin: 35,
    headPos: 0.5,
    rayPos: 1.4,
    lampHeight: 50,
    postWidth: 0.65,
    dotWidth: 0.6,
    bulbWidth: 0.8,
    headWidth: 2,
    rayWidth: 0.2,
    rayHeight: 0.5,
  },
};

export default function Logo({
  className,
  size = "medium",
  scale,
  lampHeight,
  postWidth,
  dotWidth,
  bulbWidth,
  postMargin,
  headWidth,
  headPos,
  rayPos,
  rayWidth,
  rayHeight,
  headColor = "#111111",
  postColor = "#111111",
  bulbColor = "#111111",
  dotColor = "#dc2626",
  rayColor = "#111111",
}: LogoProps) {
  const preset = sizeConfig[size];

  const cfg = {
    scale: scale ?? preset.scale,
    lampHeight: lampHeight ?? preset.lampHeight,
    postWidth: postWidth ?? preset.postWidth,
    dotWidth: dotWidth ?? preset.dotWidth,
    bulbWidth: bulbWidth ?? preset.bulbWidth,
    postMargin: postMargin ?? preset.postMargin,
    headWidth: headWidth ?? preset.headWidth,
    headPos: headPos ?? preset.headPos,
    rayPos: rayPos ?? preset.rayPos,
    rayWidth: rayWidth ?? preset.rayWidth,
    rayHeight: rayHeight ?? preset.rayHeight,
  };

  const s = cfg.scale;

  const containerStyle: CSSProperties = {
    width: `${3.5 * s}rem`,
    height: `${5 * s}rem`,
  };

  const postStyle: CSSProperties = {
    width: `${cfg.postWidth * s}rem`,
    height: `${cfg.lampHeight * s}%`,
    margin: `${cfg.postMargin * s}px auto`,
    backgroundColor: postColor,
  };

  const dotStyle: CSSProperties = {
    width: `${cfg.dotWidth * s}rem`,
    height: `${0.5 * s}rem`,
    top: `${-0.7 * s}rem`,
    backgroundColor: dotColor,
  };

  const headStyle: CSSProperties = {
    width: `${cfg.headWidth * s}rem`,
    height: `${1 * s}rem`,
    bottom: `${-cfg.headPos * s}rem`,
    backgroundColor: headColor,
    zIndex: 3,
  };

  const bulbStyle: CSSProperties = {
    width: `${cfg.bulbWidth * s}rem`,
    height: `${0.8 * s}rem`,
    bottom: `${-0.2 * s}rem`,
    backgroundColor: bulbColor,
    zIndex: 2,
  };

  const raysStyle: CSSProperties = {
    bottom: `${-cfg.rayPos * s}rem`,
    width: `${1 * s}rem`,
  };

  const rayStyle: CSSProperties = {
    width: `${cfg.rayWidth * s}rem`,
    height: `${cfg.rayHeight * s}rem`,
    backgroundColor: rayColor,
  };

  return (
    <span
      className={clsx("tm-logo-lamp-container", className)}
      style={containerStyle}
      aria-hidden="true"
    >
      <span className="tm-logo-lamp-post" style={postStyle}>
        <span className="tm-logo-lamp-dot" style={dotStyle} />
      </span>

      <span className="tm-logo-lamp-head" style={headStyle}>
        <span className="tm-logo-lamp-bulb" style={bulbStyle} />
      </span>

      <span className="tm-logo-lamp-rays" style={raysStyle}>
        <span className="tm-logo-ray left" style={rayStyle} />
        <span className="tm-logo-ray center" style={rayStyle} />
        <span className="tm-logo-ray right" style={rayStyle} />
      </span>
    </span>
  );
}
