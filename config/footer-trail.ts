import { homeImages } from "@/config/home-images";

export const footerTrailImages = [
  homeImages.hero,
  homeImages.philosophyPrimary,
  homeImages.philosophySecondary,
  homeImages.banner,
  homeImages.craft,
  ...homeImages.editorial,
  ...homeImages.collection.map((item) => item.image),
];

export const footerTextColumnA = [
  "Clarity",
  "Serenity",
  "Balance",
  "Presence",
  "Intention",
  "Silhouette",
  "Refinement",
  "Stillness",
  "Calm",
  "Grace",
  "Lightness",
  "Harmony",
  "Ease",
  "Poise",
];

export const footerTextColumnB = [
  "Acetate",
  "Titanium",
  "Hinge",
  "Temple",
  "Bridge",
  "Lens",
  "Polarized",
  "UV400",
  "Polish",
  "Bevel",
  "Fit",
  "Curve",
  "Grain",
  "Tint",
  "Form",
];

export const footerTextColumnC = [
  "Aurora",
  "Solstice",
  "Nocturne",
  "Ethereal",
  "Serene",
  "Lumen",
  "Pastel",
  "Sage",
  "Mint",
  "Forest",
  "Gaze",
  "Frame",
  "Craft",
  "Studio",
  "Nirvana",
];

export const footerRotatedItems = [
  "Optical",
  "Sunglasses",
  "Bespoke",
  "Limited",
  "Fitting",
];

export const footerTrailEffects = [
  { id: "flame", label: "Frame" },
  { id: "venetian", label: "Acetate" },
  { id: "curtain", label: "Drape" },
  { id: "hexagon", label: "Prism" },
  { id: "liquid", label: "Mist" },
  { id: "zoomsplit", label: "Focus" },
] as const;

export type FooterTrailEffectId = (typeof footerTrailEffects)[number]["id"];
