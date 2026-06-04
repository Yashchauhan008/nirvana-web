import { homeImages } from "@/config/home-images";

import type { Perspective } from "@/lib/cinematic-cylinder/types";

/** Texture atlas sources — Nirvana eyewear imagery */
export const cinematicCylinderImages = [
  homeImages.hero,
  homeImages.banner,
  homeImages.craft,
  homeImages.philosophyPrimary,
  homeImages.philosophySecondary,
  ...homeImages.editorial,
  ...homeImages.collection.map((item) => item.image),
];

export const cinematicPerspectives: Perspective[] = [
  {
    title: "Suspended elegance",
    description: "Armless chain-mounted pieces · Est. 2026",
    position: "top",
  },
  {
    title: "Ear-led balance",
    description: "Front chains on the ear · a rear chain settles the bridge on your nose",
    position: "center",
  },
  {
    title: "Crystal at the close",
    description: "Finials of crystal and hanging jewelry at every chain end",
    position: "center",
  },
  {
    title: "Find your Nirvana",
    position: "bottom",
  },
];

export const cinematicCylinderConfig = {
  radius: 3.5,
  height: 2,
  radialSegments: 64,
  heightSegments: 1,
};

export const cinematicParticleConfig = {
  numParticles: 12,
  particleRadius: 4.6,
  segments: 20,
  angleSpan: 0.3,
};

export const cinematicImageConfig = {
  width: 1024,
  height: 1024,
};

export function getCinematicImageConfig(isMobile: boolean) {
  const size = isMobile ? 512 : 768;
  return { width: size, height: size };
}
