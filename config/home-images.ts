/** Local brand imagery — paths under /public/images/models */
export const homeImages = {
  /** PNG cutout — hero product visual */
  heroCutout: "/images/models/model1.png",
  heroImages: [
    "/images/models/model1.png",
    "/images/models/model2.png",
    "/images/models/model3.png",
  ],
  hero: "/images/models/model4.png",
  philosophyPrimary: "/images/models/model5.png",
  philosophySecondary: "/images/models/model1.png",
  banner: "/images/models/model2.png",
  craft: "/images/models/model3.png",
  cta: "/images/models/model4.png",
  editorial: [
    "/images/models/model5.png",
    "/images/models/model1.png",
    "/images/models/model2.png",
  ],
  collection: [
    { name: "Crystal Tide", tag: "Crystal drop", image: "/images/models/model3.png" },
    { name: "Solstice", tag: "Dual-chain balance", image: "/images/models/model4.png" },
    { name: "Nocturne", tag: "Limited chain", image: "/images/models/model5.png" },
    { name: "Ethereal", tag: "Ear mount", image: "/images/models/model1.png" },
    { name: "Serene", tag: "Jeweled hang", image: "/images/models/model2.png" },
    { name: "Lumen", tag: "Signature chain", image: "/images/models/model3.png" },
  ],
} as const;
