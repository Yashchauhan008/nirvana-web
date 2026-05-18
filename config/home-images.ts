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
    { name: "Aurora", tag: "Optical", image: "/images/models/model3.png" },
    { name: "Solstice", tag: "Sunglasses", image: "/images/models/model4.png" },
    { name: "Nocturne", tag: "Limited", image: "/images/models/model5.png" },
    { name: "Ethereal", tag: "Titanium", image: "/images/models/model1.png" },
    { name: "Serene", tag: "Acetate", image: "/images/models/model2.png" },
    { name: "Lumen", tag: "Polarized", image: "/images/models/model3.png" },
  ],
} as const;
