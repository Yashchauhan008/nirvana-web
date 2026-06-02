import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Plus } from "lucide-react";
import { homeImages } from "@/config/home-images";
import { getProduct } from "@/services/api/product.api";
import { ProductImageGallery } from "@/components/pages/products/product-image-gallery";
import { AddToCartButton } from "@/components/pages/products/add-to-cart-button";
import { EnquireNowButton } from "@/components/pages/products/enquire-now-button";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  let product: any = null;
  let displayPrice = "$425 USD";
  let tag = "Eyewear";
  let name = "";
  let description = "";
  const imageUrls: string[] = [];
  let points: string[] = [];
  let technicalDetails: any[] = [];

  // Attempt to fetch product from backend API
  const dbProduct = await getProduct(id);

  if (dbProduct) {
    product = dbProduct;
    tag = product.category?.name || product.product_label || "Eyewear";
    name = product.name;
    description =
      product.description ||
      `Crafted from high-density Japanese acetate, the ${product.name} features a timeless silhouette elevated by architectural chamfering. Equipped with custom hardware and high quality lenses for ultimate clarity.`;
    
    displayPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(product.sale_price_in_rupee);

    points = product.points || [];
    technicalDetails = product.technical_details || [];

    // Construct image URLs list
    if (product.primary_image?.url) {
      imageUrls.push(product.primary_image.url);
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((img: any) => {
        if (img.image?.url && img.image.url !== product.primary_image?.url) {
          imageUrls.push(img.image.url);
        }
      });
    }
    if (imageUrls.length === 0) {
      imageUrls.push("/images/models/model3.png");
    }
  } else {
    // Fall back to mock data
    const mockProduct =
      homeImages.collection.find((p) => p.name.toLowerCase() === id.toLowerCase()) ||
      homeImages.collection[0];
    product = mockProduct;
    imageUrls.push(mockProduct.image);
    tag = mockProduct.tag;
    name = mockProduct.name;
    description = `Crafted from high-density Japanese acetate, the ${mockProduct.name} features a timeless silhouette elevated by architectural chamfering. Equipped with 18k gold-plated hinges and CR-39 lenses for ultimate clarity.`;
    displayPrice = "$425 USD";
    // Mock technical details for mock products so page isn't totally empty
    technicalDetails = [
      { label: "Material", value: "Japanese Acetate" },
      { label: "Hinges", value: "5-barrel custom titanium hinges" },
      { label: "Lenses", value: "CR-39 polarized UV400" },
    ];
  }

  return (
    <main className="min-h-screen bg-[var(--nirvana-cream)] flex flex-col lg:flex-row">
        {/* Left Column - Product Imagery (Sticky) */}
        <section className="relative w-full lg:w-1/2 lg:h-screen lg:sticky top-0 bg-[var(--nirvana-sage)]/10 flex flex-col">
          <div className="p-8 pb-0 pt-28 lg:pt-32">
            <Link href="/products" className="inline-flex items-center gap-2 text-[var(--nirvana-deep)] hover:text-[var(--nirvana-leaf)] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-body-strong uppercase tracking-widest text-xs">Back</span>
            </Link>
          </div>
          <div className="flex-1 p-8 lg:p-16 flex items-center justify-center">
            <div className="w-full max-w-[500px]">
              <ProductImageGallery images={imageUrls} productName={name} />
            </div>
          </div>
        </section>

      {/* Right Column - Product Details */}
      <section className="w-full lg:w-1/2 px-6 py-12 lg:px-16 lg:py-32 flex flex-col">
        <div className="max-w-xl mx-auto lg:mx-0">
          {/* Breadcrumb & Tags */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-body-strong text-xs uppercase tracking-widest text-[var(--nirvana-leaf)]">
              {tag}
            </span>
            {product.product_label && (
              <>
                <span className="w-1 h-1 rounded-full bg-[var(--nirvana-sage)]" />
                <span className="font-body-strong text-[10px] uppercase tracking-widest text-[var(--nirvana-deep)] bg-white/75 px-3 py-0.5 rounded-full border border-white/60 backdrop-blur-md">
                  {product.product_label}
                </span>
              </>
            )}
          </div>

          {/* Title & Price */}
          <h1 className="font-display text-5xl lg:text-7xl text-[var(--nirvana-deep)] mb-4 capitalize">
            {name}
          </h1>
          <p className="font-display text-2xl text-[var(--nirvana-forest)] mb-8">
            {displayPrice}
          </p>

          {/* Description */}
          <p className="font-body text-lg text-[var(--nirvana-deep)]/80 leading-relaxed mb-12">
            {description}
          </p>

          {/* Highlights */}
          {points.length > 0 && (
            <div className="mb-12">
              <h3 className="font-body-strong text-sm uppercase tracking-widest text-[var(--nirvana-deep)] mb-4">
                Highlights
              </h3>
              <ul className="space-y-3 font-body text-base text-[var(--nirvana-deep)]/80">
                {points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nirvana-leaf)]" />
                    <span className="capitalize">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 mb-16">
            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton
                productId={dbProduct ? product.id : id}
                productName={name}
                className="flex-1 bg-[var(--nirvana-forest)] text-[var(--nirvana-cream)] py-5 px-8 rounded-full font-body-strong uppercase tracking-widest text-sm hover:bg-[var(--nirvana-deep)] transition-colors text-center shadow-[0_20px_40px_rgba(42,69,56,0.2)] flex items-center justify-center gap-2"
              />
              <EnquireNowButton
                productId={dbProduct ? product.id : id}
                productName={name}
                hasPendingInquiry={product.has_pending_inquiry}
                className="flex-1 bg-transparent border border-[var(--nirvana-forest)]/30 text-[var(--nirvana-forest)] py-5 px-8 rounded-full font-body-strong uppercase tracking-widest text-sm hover:bg-[var(--nirvana-forest)] hover:text-[var(--nirvana-cream)] transition-colors text-center flex items-center justify-center gap-2"
              />
            </div>
          </div>

          {/* Accordion Details */}
          {technicalDetails.length > 0 && (
            <div className="border-t border-[var(--nirvana-forest)]/10">
              {/* Specifications Accordion */}
              <details className="border-b border-[var(--nirvana-forest)]/10 py-6 group" open>
                <summary className="w-full flex justify-between items-center list-none cursor-pointer focus:outline-none select-none">
                  <h4 className="font-body-strong uppercase tracking-widest text-sm text-[var(--nirvana-deep)]">
                    Specifications
                  </h4>
                  <Plus className="w-4 h-4 text-[var(--nirvana-sage)] group-open:rotate-45 transition-transform duration-300" />
                </summary>
                <div className="mt-4 text-sm text-[var(--nirvana-deep)]/70 font-body leading-relaxed">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 max-w-md bg-white/20 p-4 rounded-2xl border border-white/40">
                    {technicalDetails.map((detail: any, idx: number) => (
                      <div key={idx} className="contents">
                        <span className="font-body-strong text-xs uppercase tracking-wider text-[var(--nirvana-sage)]">
                          {detail.label}
                        </span>
                        <span className="font-body text-sm text-[var(--nirvana-deep)] capitalize">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </section>
      </main>
  );
}
