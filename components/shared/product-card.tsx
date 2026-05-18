import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/services/api/product.api";

interface ProductCardProps {
  product: Product;
}

function getPrimaryImageUrl(product: Product): string | null {
  return (
    product.primary_image?.url ??
    product.images?.find((i) => i.is_primary)?.image?.url ??
    product.images?.[0]?.image?.url ??
    null
  );
}

function formatPrice(rupee: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupee);
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getPrimaryImageUrl(product);
  const displayPrice = formatPrice(product.sale_price_in_rupee);
  const mrpPrice = formatPrice(Math.round(product.sale_price_in_rupee * 1.5));

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-md border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#0046B7] hover:shadow-md @container"
    >
      <div className="relative rounded-md">
        {product.product_label && (
          <div className="pointer-events-auto absolute left-2 top-2 inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white shadow-md @3xs:text-xs">
            {product.product_label}
          </div>
        )}

        {product.warranty_label && (
          <div className="warranty-flag absolute right-0 text-[10px] text-nowrap @3xs:text-xs">
            {product.warranty_label}
          </div>
        )}

        <div className="flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              width={320}
              height={320}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-full w-auto rounded-md object-contain"
              unoptimized={imageUrl.startsWith("http://")}
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <span>No image</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 p-3 @2xs:p-4">
        <p className="line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-[#0046B7] @2xs:text-base">
          {product.name}
        </p>

        {product.points?.length > 0 && (
          <ul className="mt-1 space-y-1">
            {product.points.slice(0, 3).map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-1.5 text-xs text-slate-600 @2xs:text-sm"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#0046B7]" />
                <span className="line-clamp-2">{point}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2 pt-1 @2xs:pt-1.5">
          <span className="text-base font-extrabold text-slate-900 @2xs:text-lg">
            {displayPrice}
          </span>
          <span className="text-xs text-slate-400 line-through @2xs:text-sm">
            {mrpPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
