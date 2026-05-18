import { homeImages } from "@/config/home-images";

import type { GalleryItem } from "@/lib/visual-gallery/types";

/** Frames shown in the footer 3D gallery — image + name only */
export const visualGalleryItems: GalleryItem[] = [
  ...homeImages.collection.map(({ name, image }) => ({ name, image })),
  ...homeImages.editorial.map((image, i) => ({
    name: `Editorial ${i + 1}`,
    image,
  })),
];
