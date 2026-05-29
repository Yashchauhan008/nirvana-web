import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { homeImages } from "@/config/home-images";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  // Find product by id (case insensitive match) or fallback to first product
  const product = homeImages.collection.find(p => p.name.toLowerCase() === id.toLowerCase()) || homeImages.collection[0];

  return (
    <main className="min-h-screen bg-[var(--nirvana-cream)] flex flex-col lg:flex-row">
      {/* Left Column - Product Imagery (Sticky) */}
      <section className="relative w-full lg:w-1/2 lg:h-screen lg:sticky top-0 bg-[var(--nirvana-sage)]/10">
        <Link href="/products" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-[var(--nirvana-deep)] hover:text-[var(--nirvana-leaf)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body-strong uppercase tracking-widest text-xs">Back</span>
        </Link>
        <div className="absolute inset-0 p-8 lg:p-16 flex items-center justify-center">
          <div className="relative w-full h-full max-h-[80vh] rounded-[2.5rem] overflow-hidden bg-white/40 border border-white/60 shadow-[0_30px_60px_rgba(42,69,56,0.1)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Right Column - Product Details */}
      <section className="w-full lg:w-1/2 px-6 py-12 lg:px-16 lg:py-32 flex flex-col">
        <div className="max-w-xl mx-auto lg:mx-0">
          {/* Breadcrumb & Tags */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-body-strong text-xs uppercase tracking-widest text-[var(--nirvana-leaf)]">
              {product.tag}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--nirvana-sage)]" />
            <span className="font-body-strong text-xs uppercase tracking-widest text-[var(--nirvana-sage)]">
              Signature Series
            </span>
          </div>

          {/* Title & Price */}
          <h1 className="font-display text-5xl lg:text-7xl text-[var(--nirvana-deep)] mb-4">
            {product.name}
          </h1>
          <p className="font-display text-2xl text-[var(--nirvana-forest)] mb-8">
            $425 USD
          </p>

          {/* Description */}
          <p className="font-body text-lg text-[var(--nirvana-deep)]/80 leading-relaxed mb-12">
            Crafted from high-density Japanese acetate, the {product.name} features a timeless silhouette elevated by architectural chamfering. Equipped with 18k gold-plated hinges and CR-39 lenses for ultimate clarity.
          </p>

          {/* Color Selection */}
          <div className="mb-12">
            <h3 className="font-body-strong text-sm uppercase tracking-widest text-[var(--nirvana-deep)] mb-4">
              Color: <span className="text-[var(--nirvana-leaf)]">Vintage Tortoise</span>
            </h3>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full bg-[#3e2723] border-2 border-[var(--nirvana-forest)] ring-2 ring-transparent transition-all flex items-center justify-center shadow-lg">
                <Check className="w-4 h-4 text-[var(--nirvana-cream)]" />
              </button>
              <button className="w-12 h-12 rounded-full bg-[#1a1a1a] border-2 border-transparent hover:border-black/20 transition-all opacity-70 hover:opacity-100" />
              <button className="w-12 h-12 rounded-full bg-[var(--nirvana-sage)] border-2 border-transparent hover:border-[var(--nirvana-sage)]/50 transition-all opacity-70 hover:opacity-100" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="flex-1 bg-[var(--nirvana-forest)] text-[var(--nirvana-cream)] py-5 px-8 rounded-full font-body-strong uppercase tracking-widest text-sm hover:bg-[var(--nirvana-deep)] transition-colors text-center shadow-[0_20px_40px_rgba(42,69,56,0.2)]">
              Add to Bag
            </button>
            <button className="sm:w-auto bg-transparent border border-[var(--nirvana-forest)]/30 text-[var(--nirvana-forest)] py-5 px-8 rounded-full font-body-strong uppercase tracking-widest text-sm hover:bg-[var(--nirvana-forest)] hover:text-[var(--nirvana-cream)] transition-colors text-center">
              Try On 3D
            </button>
          </div>

          {/* Accordion Details */}
          <div className="border-t border-[var(--nirvana-forest)]/10">
            {[
              { title: "Specifications", content: "Hand-polished Japanese Acetate. 5-barrel custom titanium hinges. Custom wire core with filigree engraving." },
              { title: "Lenses", content: "CR-39 polarized lenses with anti-reflective and hydrophobic coating. 100% UVA/UVB protection." },
              { title: "Fit & Dimensions", content: "Eye: 48mm / Bridge: 22mm / Temple: 145mm. Designed for a medium fit." },
              { title: "Shipping & Returns", content: "Complimentary express shipping on all orders. 30-day returns." }
            ].map((item, i) => (
              <div key={i} className="border-b border-[var(--nirvana-forest)]/10 py-6">
                <button className="w-full flex justify-between items-center group">
                  <h4 className="font-body-strong uppercase tracking-widest text-sm text-[var(--nirvana-deep)]">
                    {item.title}
                  </h4>
                  <Plus className="w-4 h-4 text-[var(--nirvana-sage)] group-hover:text-[var(--nirvana-forest)] transition-colors" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
