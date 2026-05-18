import Link from "next/link";
import { listFeaturedProducts } from "@/services/api/product.api";
import { ProductCard } from "@/components/shared/product-card";

export const PopularProducts = async () => {
  const products = await listFeaturedProducts({ limit: 8 });

  if (!products?.length) {
    return (
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white px-5 py-8 text-center shadow-sm md:px-8">
          <h2 className="mb-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
            Special deals on best sellers
          </h2>
          <p className="text-sm text-slate-500">
            No products yet. Please check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8 bg-muted">
      <div className="mx-auto container">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
              <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
              Special deals on best sellers
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting
              Industry.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-medium text-[#0046B7] hover:underline md:inline-flex"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
