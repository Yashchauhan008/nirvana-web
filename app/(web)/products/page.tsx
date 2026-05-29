import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeImages } from "@/config/home-images";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[var(--nirvana-cream)]">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--nirvana-sage)]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="font-body-strong text-xs uppercase tracking-[0.3em] text-[var(--nirvana-leaf)]">
              Discover
            </span>
            <h1 className="font-display mt-4 text-5xl md:text-7xl text-[var(--nirvana-deep)]">
              The Collection
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full border border-[var(--nirvana-forest)]/20 text-[var(--nirvana-forest)] font-body text-sm hover:bg-[var(--nirvana-forest)] hover:text-[var(--nirvana-cream)] transition-colors">
              All Frames
            </button>
            <button className="px-6 py-2 rounded-full border border-transparent text-[var(--nirvana-sage)] font-body text-sm hover:text-[var(--nirvana-forest)] transition-colors">
              Sunglasses
            </button>
            <button className="px-6 py-2 rounded-full border border-transparent text-[var(--nirvana-sage)] font-body text-sm hover:text-[var(--nirvana-forest)] transition-colors">
              Optical
            </button>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="px-6 md:px-12 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {homeImages.collection.map((product, index) => {
            const productId = product.name.toLowerCase();
            return (
              <Link 
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
                      Hand-polished Acetate
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body-strong text-lg text-[var(--nirvana-deep)]">
                      $425
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
