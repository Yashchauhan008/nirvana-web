import Image from "next/image";

interface ProductsPageBannerProps {
  url: string;
  alt: string;
}

export function ProductsPageBanner({ url, alt }: ProductsPageBannerProps) {
  return (
    <section className="w-full py-0 md:py-8">
      <div className="overflow-hidden rounded-none md:rounded-2xl container mx-auto">
        <div className="relative container mx-auto w-full aspect-[5/2]">
          <Image
            src={url}
            alt={alt}
            fill
            className="object-cover rounded-none"
            priority={false}
            quality={100}
          />
        </div>
      </div>
    </section>
  );
}
