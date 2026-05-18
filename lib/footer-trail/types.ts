export interface TrailFragment {
  element: HTMLElement;
  index: number;
  reveal: () => void;
  collapse: () => void;
}

export interface TrailImageEntry {
  element: HTMLElement;
  rotation?: number;
  removeTime: number;
  isFlame?: boolean;
  fragments?: TrailFragment[];
  pattern?: string;
}

export interface TrailPattern {
  name: string;
  create: (container: HTMLElement, imageSrc: string, size: number) => TrailFragment[];
  revealTiming: (i: number, total: number) => number;
  collapseTiming: (i: number, total: number) => number;
}

export interface TrailConfig {
  imageLifespan: number;
  removalDelay: number;
  mouseThreshold: number;
  scrollThreshold: number;
  inDuration: number;
  outDuration: number;
  inEasing: string;
  outEasing: string;
  touchImageInterval: number;
  minMovementForImage: number;
  baseImageSize: number;
  minImageSize: number;
  maxImageSize: number;
  baseRotation: number;
  maxRotationFactor: number;
  speedSmoothingFactor: number;
  staggerRange: number;
  easing: { scale: string; reveal: string };
}
