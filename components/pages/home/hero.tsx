import { listCategoryBanners } from "@/services/api/product-category.api";
import HeroCarouselClient from "./hero-carousel-client";

interface BannerImage {
  id?: string;
  url: string;
  alt: string;
}

export default async function Hero() {
  let apiBanners: BannerImage[] = [];

  try {
    const banners = await listCategoryBanners();
    apiBanners = (banners ?? [])
      .filter((banner) => banner?.banner_image?.url)
      .map((banner) => ({
        id: banner.id,
        url: banner.banner_image!.url,
        alt: banner.name ?? "Banner",
      }));
  } catch (error) {
    console.error("Failed to fetch banners:", error);
  }

  return (
    <section className="w-full py-6 md:py-8">
      <HeroCarouselClient banners={apiBanners} />
    </section>
  );
}
