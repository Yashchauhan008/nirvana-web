import type { RefObject } from "react";

import { svgTransitionPaths } from "@/lib/svg-path-transition/paths";

interface SvgPathOverlayProps {
  pathRef: RefObject<SVGPathElement | null>;
}

export function SvgPathOverlay({ pathRef }: SvgPathOverlayProps) {
  return (
    <svg
      className="svg-path-overlay"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        ref={pathRef}
        className="svg-path-overlay__path"
        vectorEffect="non-scaling-stroke"
        d={svgTransitionPaths.step1.unfilled}
      />
    </svg>
  );
}
