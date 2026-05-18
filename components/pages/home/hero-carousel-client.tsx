"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BannerImage {
  id?: string;
  url: string;
  alt: string;
}

interface HeroCarouselClientProps {
  banners: BannerImage[];
}

export default function HeroCarouselClient({
  banners,
}: HeroCarouselClientProps) {
  const router = useRouter();

  if (!banners || banners.length === 0) {
    return null;
  }

  const handleBannerClick = (banner: BannerImage) => {
    if (banner.id) {
      const params = new URLSearchParams({ category_id: banner.id });
      router.push(`/products?${params.toString()}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <div className="overflow-hidden rounded-none shadow-md border border-slate-200 md:rounded-2xl">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={index} className="relative w-full">
              <button
                type="button"
                onClick={() => handleBannerClick(banner)}
                className="relative w-full aspect-[5/2] cursor-pointer"
              >
                <Image
                  src={banner.url}
                  alt={banner.alt}
                  fill
                  className="block rounded-none object-cover md:hidden"
                  priority={index === 0}
                />
                <Image
                  src={banner.url}
                  alt={banner.alt}
                  fill
                  className="hidden object-cover h-full w-full rounded-none md:block"
                  priority={index === 0}
                  quality={100}
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-[#0046B7] md:left-4" />
        <CarouselNext className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-white hover:text-[#0046B7] md:right-4" />
      </Carousel>
    </div>
  );
}
