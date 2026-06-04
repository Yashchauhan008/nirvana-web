import Image from "next/image";
import { TransitionLink } from "@/components/shared/transition-link";
import { ArrowRight } from "lucide-react";
import { homeImages } from "@/config/home-images";
import { listProducts } from "@/services/api/product.api";
import { resolvePublicFileUrl } from "@/utils/resolvePublicFileUrl";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <main className="relative min-h-screen bg-[var(--nirvana-cream)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(560px,60vh)] bg-gradient-to-b from-[var(--nirvana-sage)]/20 to-transparent"
        aria-hidden
      />

      {/* Header Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="font-body-strong text-xs uppercase tracking-[0.3em] text-[var(--nirvana-leaf)]">
              Discover
            </span>
            <h1 className="font-display mt-4 text-5xl md:text-7xl text-[var(--nirvana-deep)]">
              Chain-Mounted Collection
            </h1>
            <p className="font-body mt-6 max-w-xl text-base leading-relaxed text-[var(--nirvana-forest)]/80">
              Armless pieces that hang from the ear on chains — with a balance
              chain behind the ear to seat the bridge, and crystal or jewelry at
              the ends.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-32 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {products && products.length > 0
            ? products.map((product) => {
                const imageUrl =
                  resolvePublicFileUrl(
                    product.primary_image?.url ??
                      product.images?.find((i) => i.is_primary)?.image?.url ??
                      product.images?.[0]?.image?.url,
                  ) || "/images/models/model3.png";

                const displayPrice = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(product.sale_price_in_rupee);

                return (
                  <TransitionLink
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group relative flex flex-col items-center cursor-pointer"
                  >
                    {/* Image Card */}
                    <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-white/40 border border-white/60 shadow-[0_20px_40px_rgba(42,69,56,0.05)] transition-all duration-700 group-hover:shadow-[0_30px_60px_rgba(42,69,56,0.15)] group-hover:-translate-y-2">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={imageUrl.startsWith("http://")}
                      />
                      <div className="absolute inset-0 bg-[var(--nirvana-forest)]/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-[var(--nirvana-forest)]/10" />

                      {/* Badge */}
                      <div className="absolute top-4 left-4 rounded-full bg-white/70 backdrop-blur-md px-4 py-1 border border-white/50">
                        <span className="font-body-strong text-[10px] uppercase tracking-widest text-[var(--nirvana-deep)]">
                          {product.category?.name ||
                            product.product_label ||
                            "Chain piece"}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="w-full mt-6 flex justify-between items-start px-2">
                      <div>
                        <h3 className="font-display text-2xl text-[var(--nirvana-deep)] group-hover:text-[var(--nirvana-leaf)] transition-colors animate-fade-in">
                          {product.name}
                        </h3>
                        <p className="font-body text-[var(--nirvana-sage)] mt-1">
                          Ear chains · crystal finials
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-body-strong text-lg text-[var(--nirvana-deep)]">
                          {displayPrice}
                        </p>
                      </div>
                    </div>
                  </TransitionLink>
                );
              })
            : homeImages.collection.map((product, index) => {
                const productId = product.name.toLowerCase();
                return (
                  <TransitionLink
                    key={productId + index}
                    href={`/products/${productId}`}
                    className="group relative flex flex-col items-center cursor-pointer"
                  >
                    {/* Image Card */}
                    <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-white/40 border border-white/60 shadow-[0_20px_40px_rgba(42,69,56,0.05)] transition-all duration-700 group-hover:shadow-[0_30px_60px_rgba(42,69,56,0.15)] group-hover:-translate-y-2">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[var(--nirvana-forest)]/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-[var(--nirvana-forest)]/10" />

                      {/* Badge */}
                      <div className="absolute top-4 left-4 rounded-full bg-white/70 backdrop-blur-md px-4 py-1 border border-white/50">
                        <span className="font-body-strong text-[10px] uppercase tracking-widest text-[var(--nirvana-deep)]">
                          {product.tag}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="w-full mt-6 flex justify-between items-start px-2">
                      <div>
                        <h3 className="font-display text-2xl text-[var(--nirvana-deep)] group-hover:text-[var(--nirvana-leaf)] transition-colors">
                          {product.name}
                        </h3>
                        <p className="font-body text-[var(--nirvana-sage)] mt-1">
                          Ear chains · crystal finials
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-body-strong text-lg text-[var(--nirvana-deep)]">
                          $425
                        </p>
                      </div>
                    </div>
                  </TransitionLink>
                );
              })}
        </div>
      </section>
    </main>
  );
}
