import { listProductCategories } from "@/services/api/product-category.api";
import { CategoryCarousel } from "./category-carousel";

export const Categories = async () => {
  const categories = await listProductCategories();

  if (!categories?.length) {
    return (
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white px-5 py-8 shadow-sm md:px-8">
          <div className="mb-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
              <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
              Shop by usage
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              No categories yet. Please check back soon for products organized
              by their usage.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 md:px-6 lg:px-8 bg-white">
      <div className="rounded-2xl container mx-auto px-5 py-8 md:px-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-slate-800 md:text-xl">
              <span className="h-6 w-1 rounded-full bg-[#0046B7]" />
              Shop by usage
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting
              Industry.
            </p>
          </div>
        </div>

        <CategoryCarousel categories={categories} />
      </div>
    </section>
  );
};
